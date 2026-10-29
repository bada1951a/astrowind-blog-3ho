// =========================================================================
// 📌 [고정 식별자] 이 파일은 '3호기' 전용 스크립트입니다.
// ⚠️ [혼동 방지 경고]
// 1. 이 파일은 '3호기 (AI & 업무자동화)'입니다. 향후 나올 '2-3호기'나 다른 호기와 절대 혼동하지 말 것!
// 2. 카테고리는 대표님의 지시 전까지 'automation'으로 영구 고정한다. (임의 변경 절대 금지)
// 3. 이미지 생성 방식은 Picsum work- 시드 URL 방식을 영구 유지한다.
// 4. 대표님과의 모든 설명, 질문, 대화 및 주석은 반드시 100% 한국어로만 진행한다.
// =========================================================================

import fs from 'fs';
import path from 'path';


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}
const POSTS_BASE_DIR = path.resolve('src/data/post');
const TOPICS_FILE = path.resolve('topics.txt');

// =========================================================================
// [3ho호기] Pexels 검색과 Picsum 안전 대체
// =========================================================================
// =========================================================================
// Pexels topic-matched photos with a non-breaking Picsum fallback.
// Pexels API results expose alt text, not a tags array; search relevance is the primary match.
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_IMAGE_CACHE = new Map();
let pexelsFallbackWarningShown = false;
const PEXELS_LOCALE_BY_LANG = {
  ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', de: 'de-DE', fr: 'fr-FR',
  es: 'es-ES', it: 'it-IT', pt: 'pt-BR', nl: 'nl-NL', pl: 'pl-PL',
  id: 'id-ID', vi: 'vi-VN'
};

function getPicsumFallback(topic, index) {
  const seedBase = Date.now().toString(36);
  const coverSeed = 'work-' + seedBase + '-' + index + '-c';
  const bodySeed = 'work-' + seedBase + '-' + index + '-b';
  return {
    coverUrl: 'https://picsum.photos/seed/' + coverSeed + '/1200/675.jpg',
    bodyUrl: 'https://picsum.photos/seed/' + bodySeed + '/1000/550.jpg',
    bodyAlt: topic + ' guide'
  };
}

function imageTopicTerms(topic) {
  const stopWords = new Set(['the', 'and', 'for', 'with', 'from', 'about', 'what', 'when', 'how', 'guide', 'problem']);
  return String(topic || '').toLowerCase().split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 1 && !stopWords.has(term));
}

async function getPostImages(topic, index, langCode = 'en') {
  const fallback = () => getPicsumFallback(topic, index);
  if (!PEXELS_API_KEY) {
    if (!pexelsFallbackWarningShown) {
      console.warn('⚠️ PEXELS_API_KEY가 없어 기존 Picsum 이미지로 안전하게 대체합니다. Pexels를 사용하려면 GitHub Actions Secret에 키를 설정해야 합니다.');
      pexelsFallbackWarningShown = true;
    }
    return fallback();
  }

  const query = String(topic || '').trim().slice(0, 100);
  if (!query) {
    if (!pexelsFallbackWarningShown) {
      console.warn('⚠️ 주제가 비어 있어 기존 Picsum 이미지로 대체합니다.');
      pexelsFallbackWarningShown = true;
    }
    return fallback();
  }

  const locale = PEXELS_LOCALE_BY_LANG[langCode] || 'en-US';
  const cacheKey = locale + '|' + query.toLowerCase();
  try {
    let photos = PEXELS_IMAGE_CACHE.get(cacheKey);
    if (!photos) {
      const url = 'https://api.pexels.com/v1/search?query=' + encodeURIComponent(query)
        + '&per_page=40&orientation=landscape&locale=' + encodeURIComponent(locale);
      const response = await fetch(url, {
        headers: { Authorization: PEXELS_API_KEY },
        signal: AbortSignal.timeout(12000)
      });
      if (!response.ok) throw new Error('Pexels HTTP ' + response.status);
      const payload = await response.json();
      photos = Array.isArray(payload.photos) ? payload.photos : [];
      PEXELS_IMAGE_CACHE.set(cacheKey, photos);
    }

    const terms = imageTopicTerms(query);
    const candidates = photos
      .filter((photo) => photo && photo.id && photo.src && (photo.src.landscape || photo.src.large))
      .map((photo, order) => {
        const alt = String(photo.alt || '').trim();
        const altLower = alt.toLowerCase();
        const score = terms.reduce((sum, term) => sum + (altLower.includes(term) ? 1 : 0), 0);
        return { photo, order, score, alt };
      })
      .sort((a, b) => b.score - a.score || a.order - b.order);

    const unique = [];
    const seenIds = new Set();
    for (const candidate of candidates) {
      const id = String(candidate.photo.id);
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      unique.push(candidate);
      if (unique.length === 2) break;
    }
    if (unique.length < 2) throw new Error('Pexels 검색에서 서로 다른 사진 2장을 찾지 못했습니다.');

    return {
      coverUrl: unique[0].photo.src.landscape || unique[0].photo.src.large,
      bodyUrl: unique[1].photo.src.landscape || unique[1].photo.src.large,
      coverAlt: unique[0].alt || query,
      bodyAlt: unique[1].alt || query
    };
  } catch (error) {
    if (!pexelsFallbackWarningShown) {
      console.warn('⚠️ Pexels 사진 검색에 실패해 기존 Picsum 이미지로 대체합니다: ' + error.message);
      pexelsFallbackWarningShown = true;
    }
    return fallback();
  }
}
// =========================================================================
// 한국 시간(KST) 기준 안전한 당일 발행 날짜 생성 함수
// =========================================================================
function getKstPublishDateIso() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = kst.getUTCFullYear();
  const month = kst.getUTCMonth() + 1;
  const day = kst.getUTCDate();
  return new Date(Date.UTC(year, month - 1, day, 10, 20, 0)).toISOString();
}

// =========================================================================
// [3호기 전용] 12개국 100% 현지어 섹션 제목 및 치환 딕셔너리 (영구 고정)
// =========================================================================
const I18N_SECTIONS = {
  ko: {
    s1: "1. 직장인 멘붕 오는 업무 병목 돌발 상황",
    s2: "2. 수식 에러 및 자동화 실패의 진짜 핵심 원인",
    s3: "3. 1분 만에 끝내는 단계별 실무 해결법",
    s4: "4. 현직 자동화 전문가의 핵심 주의사항 및 팁",
    s5: "5. 자주 묻는 질문 (FAQ)",
    tags: ["업무자동화", "엑셀팁", "생산성도구", "오피스꿀팁"]
  },
  en: {
    s1: "1. Critical Workplace Bottleneck Emergency",
    s2: "2. Root Cause Breakdown of Formula and Workflow Errors",
    s3: "3. Step-by-Step Practical Productivity Resolution",
    s4: "4. Professional Automation Expert Precautions & Tips",
    s5: "5. Frequently Asked Questions (FAQ)",
    tags: ["Workflow", "Automation", "Excel Tips", "Office Productivity"]
  },
  ja: {
    s1: "1. 職場で冷や汗をかいた業務停止トラブル",
    s2: "2. 数式エラーと自動化トラブルの根本原因",
    s3: "3. 1分で完了する実践的な業務効率化手順",
    s4: "4. 現役自動化専門家が教える注意点とコツ",
    s5: "5. よくある質問 (FAQ)",
    tags: ["業務効率化", "エクセル時短", "自動化ツール", "オフィスハック"]
  },
  de: {
    s1: "1. Kritische Fehlersituation im Büroalltag",
    s2: "2. Detaillierte Ursachenanalyse von Formel- und Prozessfehlern",
    s3: "3. Schritt-für-Schritt-Anleitung zur Effizienzsteigerung",
    s4: "4. Praxistipps und Warnungen vom Automatisierungs-Experten",
    s5: "5. Häufig gestellte Fragen (FAQ)",
    tags: ["Automatisierung", "Excel-Tipps", "Produktivität", "Büro-Tools"]
  },
  fr: {
    s1: "1. Situation d'urgence critique au bureau",
    s2: "2. Analyse approfondie des erreurs de formule et de processus",
    s3: "3. Guide étape par étape pour automatiser et résoudre l'erreur",
    s4: "4. Conseils et précautions d'un expert en automatisation",
    s5: "5. Foire Aux Questions (FAQ)",
    tags: ["Automatisation", "Astuces Excel", "Productivité", "Outils Bureautiques"]
  },
  es: {
    s1: "1. Emergencia crítica en el trabajo y bloqueo de tareas",
    s2: "2. Análisis de causas raíz de errores de fórmulas y flujo",
    s3: "3. Solución práctica paso a paso para optimizar el flujo",
    s4: "4. Consejos y advertencias de un experto en productividad",
    s5: "5. Preguntas Frecuentes (FAQ)",
    tags: ["Automatización", "Consejos Excel", "Productividad", "Herramientas Oficina"]
  },
  it: {
    s1: "1. Emergenza improvvisa e blocco delle attività in ufficio",
    s2: "2. Analisi approfondita degli errori di formula e di processo",
    s3: "3. Guida pratica di risoluzione e ottimizzazione passo dopo passo",
    s4: "4. Avvertenze e raccomandazioni dell'esperto di automazione",
    s5: "5. Domande Frequenti (FAQ)",
    tags: ["Automazione", "Trucchi Excel", "Produttività", "Strumenti Ufficio"]
  },
  pt: {
    s1: "1. Situação de emergência e gargalo crítico no escritório",
    s2: "2. Análise da causa raiz de falhas de fórmula e processos",
    s3: "3. Guia prático passo a passo para automação e produtividade",
    s4: "4. Recomendações e alertas de especialistas em automação",
    s5: "5. Perguntas Frequentes (FAQ)",
    tags: ["Automação", "Dicas Excel", "Produtividade", "Rotina de Escritório"]
  },
  nl: {
    s1: "1. Noodsituatie en knelpunt op de werkvloer",
    s2: "2. Grondige analyse van formulefouten en werkstroomproblemen",
    s3: "3. Stapsgewijze praktische automatiseringsoplossing",
    s4: "4. Belangrijke adviezen van automatiseringsspecialisten",
    s5: "5. Veelgestelde Vragen (FAQ)",
    tags: ["Automatisering", "Excel Tips", "Productiviteit", "Kantoortools"]
  },
  pl: {
    s1: "1. Awaryjna sytuacja i paraliż pracy w biurze",
    s2: "2. Szczegółowa analiza przyczyn błędów formuł i procesów",
    s3: "3. Praktyczne rozwiązanie automatyzujące krok po kroku",
    s4: "4. Wskazówki i ostrzeżenia eksperta ds. automatyzacji",
    s5: "5. Najczęściej zadawane pytania (FAQ)",
    tags: ["Automatyzacja", "Triki Excel", "Produktywność", "Narzędzia Biurowe"]
  },
  id: {
    s1: "1. Situasi Kritis dan Hambatan Kerja Mendesak di Kantor",
    s2: "2. Analisis Mendalam Akar Masalah Formula dan Alur Kerja",
    s3: "3. Panduan Langkah demi Langkah Otomatisasi dan Solusi Cepat",
    s4: "4. Tips & Peringatan Penting Pakar Otomatisasi Kantor",
    s5: "5. Pertanyaan yang Sering Diajukan (FAQ)",
    tags: ["Otomatisasi", "Tips Excel", "Produktivitas", "Solusi Kerja"]
  },
  vi: {
    s1: "1. Tình huống sự cố khẩn cấp và tắc nghẽn công việc văn phòng",
    s2: "2. Phân tích nguyên nhân gốc rễ lỗi công thức và luồng xử lý",
    s3: "3. Các bước khắc phục và tối ưu hóa quy trình thực tế",
    s4: "4. Lời khuyên và cảnh báo quan trọng từ chuyên gia tối ưu",
    s5: "5. Các câu hỏi thường gặp (FAQ)",
    tags: ["Tự Động Hóa", "Mẹo Excel", "Năng Suất", "Tin Học Văn Phòng"]
  }
};

// =========================================================================
// 🛡️ [3호기 자가 검수 및 치유 엔진: Self-Healing Inspector]
// =========================================================================
function inspectAndHealMarkdown(body, langCode) {
  let healed = body.trim();
  const i18n = I18N_SECTIONS[langCode] || I18N_SECTIONS.ko;
  const auditLogs = [];

  // 1) 헤딩 내부 볼드 제거 및 3호기 표준 소제목 강제 안착
  healed = healed.replace(/^(#{1,6}\s+)\*\*(.*?)\*\*/gm, '$1$2');
  healed = healed.replace(/^#{1,6}\s*1[.\s]+([^\n]+)/m, `## ${i18n.s1}`);
  healed = healed.replace(/^#{1,6}\s*2[.\s]+([^\n]+)/m, `## ${i18n.s2}`);
  healed = healed.replace(/^#{1,6}\s*3[.\s]+([^\n]+)/m, `## ${i18n.s3}`);
  healed = healed.replace(/^#{1,6}\s*4[.\s]+([^\n]+)/m, `## ${i18n.s4}`);
  healed = healed.replace(/^#{1,6}\s*5[.\s]+([^\n]+)/m, `## ${i18n.s5}`);

  if (!healed.startsWith('## 1.')) {
    healed = `## ${i18n.s1}\n\n` + healed;
    auditLogs.push("1번 헤딩 주입");
  }

  // 2) 🛡️ Q&A 줄바꿈 뭉개짐 자동 분리 치유 (질문과 답변 사이 빈 줄 2개 보장)
  const rawQnACount = (healed.match(/Q[1-3]\./gi) || []).length;
  if (rawQnACount > 0) {
    healed = healed.replace(/\s*(\*\*Q[1-3]\.\*\*|Q[1-3]\.)\s*/gi, '\n\n**$1** ');
    healed = healed.replace(/\s*(\*\*A[1-3]\.\*\*|A[1-3]\.)\s*/gi, '\n\n**$1** ');
    healed = healed.replace(/\*\*\s*\*\*(Q[1-3]\.|A[1-3]\.)\*\*\s*\*\*/gi, '**$1**');
    healed = healed.replace(/\*\*(Q[1-3]\.|A[1-3]\.)\*\*/gi, '**$1**');
    auditLogs.push("Q&A 줄바꿈 2열 분리 치유");
  }

  // 3) 볼드 기호 안쪽 공백 정돈 (** 단어 ** -> **단어**)
  if (/\*\*\s+[^*]+?\s+\*\*/.test(healed)) {
    healed = healed.replace(/\*\*\s+([^*]+?)\s+\*\*/g, '**$1**')
                   .replace(/\*\*\s+([^*]+?)\*\*/g, '**$1**')
                   .replace(/\*\*([^*]+?)\s+\*\*/g, '**$1**');
    auditLogs.push("볼드 공백 정돈");
  }

  // 4) 엑셀 셀 참조, 수식, 변수 및 LaTeX 기호 인라인 백틱화
  healed = healed.replace(/\$(?:Strg|Ctrl|Win|Shift|Alt|Esc)\s*[^$\n]*\$/gi, (match) => {
    return `\`${match.replace(/\$/g, '').trim()}\``;
  });
  healed = healed.replace(/\$([A-Za-z0-9_-]+)\$/g, '`$1`');
  healed = healed.replace(/\\times/g, 'x')
                 .replace(/\\circ/g, '°')
                 .replace(/\\approx/g, '≈')
                 .replace(/~/g, '-');

  // 5) 연속 빈 줄 압축
  healed = healed.replace(/\n{3,}/g, '\n\n').trim();

  if (auditLogs.length > 0) {
    console.log(`   🩺 [자가 치유 완료]: ${auditLogs.join(' | ')}`);
  }

  return healed;
}

if (!fs.existsSync(TOPICS_FILE)) {
  console.error("❌ topics.txt 파일이 존재하지 않습니다.");
  process.exit(1);
}

const fileContent = fs.readFileSync(TOPICS_FILE, 'utf-8');
const lines = fileContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);

if (lines.length === 0) {
  console.log("⚠️ topics.txt에 남은 주제가 없습니다. 생성을 건너뜁니다.");
  process.exit(0);
}

const currentTopic = lines[0];
console.log(`📌 오늘 처리할 주제 [3호기 AI & 업무자동화]: "${currentTopic}"`);

const AUTOMATION_CRISIS_SCENARIOS_30 = [
  "금요일 오후 5시 45분, 마지막 주간 실적 엑셀을 저장하려는데 #REF!와 #VALUE! 에러가 수십 개 셀에 동시다발로 터진 순간",
  "월말 결산일 당일, 수만 행짜리 로우데이터(Raw Data) VLOOKUP 수식을 걸자마자 '응답 없음'으로 엑셀이 하얗게 굳어버렸을 때",
  "임원진에게 공유된 실시간 구글 스프레드시트에서 누군가 필터를 잘못 건드려 전사 매출 지표 합계가 뒤틀린 아찔한 상황",
  "점심시간 10분 전, 수기로 복사 붙여넣기 하던 작업 시트의 행 번호가 한 칸씩 밀려 이전 작업 2시간 치가 백지로 돌아갈 위기",
  "퇴근 알람이 울리기 직전, 팀장님이 '이 파일 다른 부서 형식에 맞춰서 10분 안에 양식 바꿔와'라고 불시에 시트를 던졌을 때",
  "월요일 출근하자마자 본사에서 내려온 100MB가 넘는 CSV 파일이 열리지 않아 메모장과 씨름하던 긴박한 오전",
  "해외 지사에서 제각각 다른 포맷으로 보내온 12개 엑셀 파일을 하나로 합쳐야 하는데 폰트와 날짜 형식이 제각각 깨져 있을 때",
  "야간 잔업 중, 2시간 동안 작성한 피벗 테이블과 매크로가 저장 버튼을 누르기 직전 비정상 종료로 날아갔을 때",
  "기존 담당자가 인수인계 없이 남겨둔 정체불명의 복잡한 VBA 매크로 버튼을 눌렀다가 디버그(Debug) 런타임 오류가 떴을 때",
  "ERP 전산 시스템에서 내려받은 원장 데이터를 파워 쿼리로 불러오는 중 알 수 없는 데이터 형식 충돌로 새로고침이 멈춘 순간",
  "사내 업무 툴 간 웹훅(Webhook) 및 Zapier 자동화 트리거가 중간에 끊겨 고객 주문 건 300개가 누락될 뻔한 상황",
  "매달 반복되는 수작업 서식 변환 작업 때문에 신입 사원 셋이 달라붙어 반나절을 허비하고 있는 비효율을 목격했을 때",
  "구글 앱스 스크립트(GAS)로 자동 메일 발송 트리거를 걸어두었는데 발송 할당량(Quota) 초과로 정지 경고가 뜬 아침",
  "거래처 50곳에 각각 다른 첨부파일과 맞춤형 견적서를 메일로 일괄 발송해야 하는 촉박한 마감 30분 전",
  "데이터베이스(DB)에서 쿼리로 추출한 텍스트 데이터의 앞뒤 공백과 유령 줄바꿈 때문에 함수 인식이 전혀 안 될 때",
  "엑셀 버전이 다른 부서 간 파일 공유 과정에서 최신 동적 배열 함수(XLOOKUP, FILTER)가 구버전에서 인식 불가가 되었을 때",
  "챗GPT나 Claude에게 방대한 회의록 정리를 맡겼는데 핵심 내용은 다 빠뜨리고 엉뚱한 요약본만 내놓아 답답했던 순간",
  "기획안 초안을 30분 만에 작성해야 하는데 AI 프롬프트 답변이 겉도는 교과서적 말투만 반복해 당황스러웠을 때",
  "복잡한 다중 조건 IF 수식을 짜기 위해 AI에게 질문했으나 괄호 개수도 안 맞는 엉터리 수식을 알려줘 머리가 지끈거릴 때",
  "사내 보안 규정상 민감한 고객 개인정보를 직접 AI에 넣을 수 없어 가명 처리와 자동화 사이에서 딜레마에 빠진 상황",
  "AI로 대량의 마케팅 카피 50개를 뽑아냈지만 브랜드 톤앤매너와 완전히 어긋나 처음부터 다시 프롬프트를 빌드해야 할 때",
  "노코드 웹 크롤러를 돌려 경쟁사 가격 모니터링을 자동화하려다 사이트 구조 변경으로 스크래핑 에러가 쏟아진 날",
  "팀 회의에서 '업무 자동화 도입 방안'을 갑작스럽게 발표하게 되어 당장 보여줄 수 있는 실질적인 데모가 필요할 때",
  "PDF 전자문서 100장에 흩어진 계약 조건 표를 엑셀 데이터 테이블로 빠르게 변환해야 하는 긴급 업무가 떨어졌을 때",
  "중요한 사내 감사 직전, 자동화 스크립트가 실수로 폴더 내 원본 마스터 파일을 덮어써서 백업본을 찾아 헤매던 순간",
  "동료가 보호된 워크시트 암호를 잊어버려 당장 수정해야 하는 기안서 파일의 수식 잠금을 해제하지 못하던 상황",
  "클라우드 공유 드라이브 버전 충돌로 인해 같은 파일이 '사본(1)', '사본(2)'로 끝없이 분열되어 작업이 꼬였을 때",
  "텍스트로 저장된 숫자가 일반 숫자로 변환되지 않아 SUM 함수 결과값이 계속 '0'으로 찍히는 어처구니없는 상황",
  "타 부서에서 링크로 걸어둔 외부 참조 엑셀 파일의 경로가 바뀌어 통합 문서 전체에 보안 경고창이 도배되었을 때",
  "보고서 그래프와 차트 데이터 범위가 고정되어 있어 신규 데이터가 들어와도 시각화가 자동 반영되지 않던 난감한 시점"
];

const THEME_PRESETS = [
  { id: 1, name: "Cyberpunk Terminal", primaryColor: "#00ffcc", bgColor: "#111827", layout: "CLI/터미널 스타일, 자동화 단축 경로 최상단 배치" },
  { id: 2, name: "Modern Minimalist Slate", primaryColor: "#3b82f6", bgColor: "#f8fafc", layout: "미니멀 가이드 스타일, 여백 중심의 깔끔한 단계별 넘버링, 직관적 핵심 요약" },
  { id: 3, name: "Industrial Blueprint", primaryColor: "#f59e0b", bgColor: "#1e293b", layout: "엔지니어링 청사진 스타일, 워크플로우 병목 원인 시각화, 쉬운 3단 비교표 포함" },
  { id: 4, name: "Retro Monokai", primaryColor: "#a6e22e", bgColor: "#272822", layout: "개발자 에디터 스타일, 실전 프롬프트 코드 박스 중심 전개, 디버깅 팁" },
  { id: 5, name: "Nordic Clean Ice", primaryColor: "#0284c7", bgColor: "#f0f9ff", layout: "북유럽 감성 클린 레이아웃, 인용구 중심 도입부, 실무 체크리스트" }
];

const TARGET_LANGS = [
  { code: 'ko', name: 'Korean', persona: '친절하고 경험 많은 엑셀/AI 자동화 실무 전문가 (사내 칼퇴 치트키 장인)', osUi: '파일 > 옵션, 데이터 > 파워 쿼리, 수식 탭, 확장 프로그램', localeContext: '서울/판교 IT 기업 및 대기업 오피스' },
  { code: 'en', name: 'English', persona: 'Friendly Silicon Valley productivity specialist sharing no-code and AI shortcuts', osUi: 'File > Options, Data > Power Query, Formula Tab, Add-ons', localeContext: 'Silicon Valley tech firm / NYC corporate finance office' },
  { code: 'ja', name: 'Japanese', persona: '業務効率化とAIツール活用を分かりやすく教える日本の現役ITワーカー', osUi: 'ファイル > オプション, データ > パワークエリ, 数式タブ, 拡張機能', localeContext: '丸の内・品川のビジネスオフィス' },
  { code: 'de', name: 'German', persona: 'Praxisnaher deutscher Automatisierungs-Experte für Office- und KI-Tools', osUi: 'Datei > Optionen, Daten > Power Query, Formeln, Add-Ins', localeContext: 'Frankfurter Finanzdistrikt und Industrieunternehmen' },
  { code: 'fr', name: 'French', persona: 'Spécialiste support bureautique et IA expliquant les astuces de productivité', osUi: 'Fichier > Options, Données > Power Query, Formules, Extensions', localeContext: 'Siège d\'entreprise à Paris La Défense' },
  { code: 'es', name: 'Spanish', persona: 'Especialista en productividad y automatización que explica trucos prácticos sin rodeos', osUi: 'Archivo > Opciones, Datos > Power Query, Fórmulas, Complementos', localeContext: 'Oficina corporativa en Madrid y centros de negocio' },
  { code: 'it', name: 'Italian', persona: 'Esperto di automazione e AI che semplifica il lavoro d\'ufficio quotidiano', osUi: 'File > Opzioni, Dati > Power Query, Formule, Componenti aggiuntivi', localeContext: 'Uffici direzionali e aziende a Milano' },
  { code: 'pt', name: 'Portuguese', persona: 'Especialista em automação de escritório que ensina truques práticos de produtividade', osUi: 'Arquivo > Opções, Dados > Power Query, Fórmulas, Suplementos', localeContext: 'Escritório corporativo na Avenida Paulista em São Paulo' },
  { code: 'nl', name: 'Dutch', persona: 'Nederlandse productiviteits- en AI-specialist die slimme werkmethoden uitlegt', osUi: 'Bestand > Opties, Gegevens > Power Query, Formules, Invoegtoepassingen', localeContext: 'Zuidas zakendistrict in Amsterdam' },
  { code: 'pl', name: 'Polish', persona: 'Polski ekspert od automatyzacji biurowej i narzędzi AI tłumaczący triki krok po kroku', osUi: 'Plik > Opcje, Dane > Power Query, Formuły, Dodatki', localeContext: 'Warszawskie centrum biznesowe' },
  { code: 'id', name: 'Indonesian', persona: 'Praktisi produktivitas dan otomatisasi kantor yang berbagi solusi praktis sehari-hari', osUi: 'File > Opsi, Data > Power Query, Rumus, Add-in', localeContext: 'Kawasan bisnis SCBD Jakarta' },
  { code: 'vi', name: 'Vietnamese', persona: 'Chuyên viên tối ưu hóa quy trình làm việc và công cụ AI thực chiến', osUi: 'Tệp > Tùy chọn, Dữ liệu > Power Query, Công thức, Tiện ích bổ sung', localeContext: 'Tòa nhà văn phòng trung tâm tại TP.HCM / Hà Nội' }
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const fileSlug = `post-${Date.now().toString(36)}`;

const generatedPostFiles = [];

// =========================================================================
// [호출 함수] maxOutputTokens: 8192 (2,500자 정량 생성 최적화)
// =========================================================================
async function fetchWithRetry(prompt, maxRetries = 3, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-6-luna',
          reasoning: { effort: 'none' },
          max_output_tokens: 8192,
          input: prompt,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        const message = payload?.error?.message || `HTTP ${response.status}`;
        throw new Error(`OpenAI API 오류: ${message}`);
      }

      const generatedText = (payload.output || [])
        .flatMap((item) => item.content || [])
        .filter((item) => item.type === 'output_text')
        .map((item) => item.text || '')
        .join('\n')
        .trim();

      if (!generatedText) throw new Error('OpenAI 응답에 글 본문이 없습니다.');
      return generatedText;
    } catch (error) {
      console.warn(`⚠️ [호출 재시도 ${attempt}/${maxRetries}]: ${error.message}`);
      if (attempt === maxRetries) throw error;
      await delay(delayMs * attempt);
    }
  }
  throw new Error('OpenAI API 호출이 최대 재시도 횟수를 초과했습니다.');
}

function validateGeneratedPost(text, langCode) {
  const fm = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  if (!fm) return ['frontmatter 구분자 누락'];
  const body = text.slice(fm[0].length).trim();
  const errors = [];
  for (const field of ['title', 'description', 'publishDate', 'image']) {
    if (!new RegExp('^' + field + ':\\s*\\S', 'm').test(fm[1])) errors.push(field + ' 누락');
  }
  if (body.length < (langCode === 'ko' ? 1000 : 1800)) errors.push('본문 길이 부족 또는 잘림');
  if ((body.match(/^##\s+/gm) || []).length < 5) errors.push('H2 섹션 5개 미만');
  if ((body.match(/\*\*Q[1-3]\.\*\*/gi) || []).length < 3) errors.push('FAQ 질문 3개 미만');
  if ((body.match(/\*\*A[1-3]\.\*\*/gi) || []).length < 3) errors.push('FAQ 답변 3개 미만');
  if (langCode !== 'ko' && /[가-힣]/.test(body)) errors.push('비한국어 본문에 한글 포함');
  return errors;
}

async function generateSinglePost(lang, index) {
  const selectedTheme = THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)];
  const selectedScenario = AUTOMATION_CRISIS_SCENARIOS_30[Math.floor(Math.random() * AUTOMATION_CRISIS_SCENARIOS_30.length)];
  const i18n = I18N_SECTIONS[lang.code] || I18N_SECTIONS.ko;

  console.log(`\n🚀 [${index + 1}/12] ${lang.name} (${lang.code}) 3호기 애드센스 표준 생성 중... (테마: ${selectedTheme.name})`);

  const { coverUrl, bodyUrl, bodyAlt } = await getPostImages(currentTopic, index, lang.code);
  const pubDateIso = getKstPublishDateIso();

  // 🎯 [애드센스 승인 최적화 프롬프트: 2,400~2,600자 정량화]
  const prompt = `
You are a ${lang.persona}.
Write a high-quality, practical workflow & AI troubleshooting guide natively in ${lang.name}.
Target Culture: "${lang.localeContext}"
Assigned Situation: "${selectedScenario}"
Topic: "${currentTopic}"

[ADSENSE QUALITY & LENGTH REQUIREMENT]
- For Korean (ko): Write exactly around 2,400 - 2,600 characters (do NOT exceed 3,000 characters).
- For other languages: Write exactly 900 - 1,100 words.
- Tone: Highly informative, professional, practical productivity advice.
- Narrative voice: Write in a first-person storytelling voice ("I"/the natural first-person form in ${lang.name}) from the assigned expert persona's perspective.
- Open with a vivid but clearly illustrative scene based on the assigned situation; use roughly 30% of the article for first-person story and transitions and 70% for verified explanations, step-by-step guidance, and safety information. Build a story arc from the urgent problem through diagnosis, safe action, and outcome.
- Do not falsely claim that an illustrative scenario is a real customer case or the author's personal experience. Do not invent verified outcomes, quotations, or facts. Clearly frame hypothetical/composite events as illustrative.
- Keep first-person narration throughout the opening and transitions, while making technical instructions, safety warnings, and sources precise and factual.

[STRUCTURE - STRICT 5 H2 HEADINGS]
Use these exact H2 headings:

## ${i18n.s1}
Write 2 detailed paragraphs describing the sudden workplace bottleneck, formula crash, and urgent deadline panic based on: "${selectedScenario}".

## ${i18n.s2}
Write 2 analytical paragraphs explaining the technical root causes (syntax errors, data type mismatches, circular calculation locks, or API sync drops).

## ${i18n.s3}
Provide 3 concrete resolution steps matching "${lang.osUi}". Use clean numbered lists with practical action items, formulas, and exact settings.

## ${i18n.s4}
Write 2 paragraphs of practical precautions and operational tips to prevent recurrence.

## ${i18n.s5}
Provide exactly 3 practical Q&A items. You MUST put an empty line between Question and Answer:

**Q1.** Question text

**A1.** Detailed answer (3-4 sentences).

**Q2.** Question text

**A2.** Detailed answer (3-4 sentences).

**Q3.** Question text

**A3.** Detailed answer (3-4 sentences).

[FORMATTING RULES]
1. Never put asterisks (**) inside H2 headings.
2. Bold keywords with strict syntax: **keyword** (no space inside asterisks).
3. Put formulas, cell coordinates, or menu commands in inline backticks (e.g. \`XLOOKUP\`, \`A1\`, \`Power Query\`).
${lang.code !== 'ko' ? `- Absolutely NO Korean characters in non-Korean posts.` : ''}

[Strict Output Format]
Return ONLY raw Markdown starting directly with frontmatter:
---
title: "Native Clear Title in ${lang.name}"
description: "Native concise description in ${lang.name} under 160 characters"
publishDate: ${pubDateIso}
image: "${coverUrl}"
category: "automation"
tags: ${JSON.stringify(i18n.tags)}
theme: "${selectedTheme.name}"
---
`;

  try {
    let rawText = await fetchWithRetry(prompt);
    let text = rawText.trim();
    if (text.startsWith('```markdown')) text = text.replace(/^```markdown\n/, '').replace(/\n```$/, '');
    if (text.startsWith('```')) text = text.replace(/^```\n/, '').replace(/\n```$/, '');

    const fmMatch = text.match(/^---[\s\S]*?---\n*/);
    if (fmMatch) {
      let frontmatter = fmMatch[0].trim();
      let body = text.slice(fmMatch[0].length).trim();
      body = body.replace(/^#\s+[^\n]+\n+/, '');

      // ⚠️ 3호기 카테고리 'automation' 영구 보존 강제 검증
      frontmatter = frontmatter.replace(/category:\s*["'][^"']*["']/i, "category: 'automation'")
                               .replace(/category:\s*[^\n\r]+/i, "category: 'automation'");

      // 🩺 [자가 검수 및 치유 엔진 가동]
      body = inspectAndHealMarkdown(body, lang.code);

      if (lang.code === 'ko') {
        console.log(`   📏 [3호기 본문 최종 글자 수] ${body.length}자 (애드센스 표준: 2,400~2,600자)`);
      }

      // 본문 중간 이미지 배치 (2번 섹션 직전)
      const safeAlt = currentTopic.replace(/[\[\]\(\)"']/g, '').trim();
      const middleImageMarkdown = `\n\n![${bodyAlt || safeAlt}](${bodyUrl})\n\n`;

      if (body.includes('## 2.')) {
        body = body.replace(/(##\s*2\.[^\n]+)/, `${middleImageMarkdown}$1`);
      } else {
        body = `${middleImageMarkdown}${body}`;
      }

      text = `${frontmatter}\n\n${body}\n`;
    }

    const targetDir = path.join(POSTS_BASE_DIR, lang.code);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const validationErrors = validateGeneratedPost(text, lang.code);
    if (validationErrors.length) throw new Error('발행 전 검수 실패: ' + validationErrors.join(', '));

    const filePath = path.join(targetDir, `${fileSlug}.md`);
    fs.writeFileSync(filePath, text, 'utf-8');
    generatedPostFiles.push(filePath);
    console.log(`   ✅ [성공] 3호기 저장 완료: src/data/post/${lang.code}/${fileSlug}.md`);
    return true;
  } catch (error) {
    console.error(`❌ [최종 실패] ${lang.name} 생성 실패:`, error.message);
    return false;
  }
}

async function run() {
  console.log("==================================================");
  console.log("⚡ [3호기 AI & 업무자동화] (카테고리: automation) 12개국 고속 자동 포스팅 시작");
  console.log("==================================================");

  const batchStart = generatedPostFiles.length;
  let successCount = 0;

  for (let i = 0; i < TARGET_LANGS.length; i++) {
    const isSuccess = await generateSinglePost(TARGET_LANGS[i], i);
    if (isSuccess) successCount++;
    if (i < TARGET_LANGS.length - 1) {
      await delay(2000);
    }
  }

  if (successCount === TARGET_LANGS.length) {
    lines.shift();
    fs.writeFileSync(TOPICS_FILE, lines.join('\n'), 'utf-8');
    console.log(`\n🧹 총 ${successCount}개국 포스팅 완료. topics.txt에서 주제를 제거했습니다.`);
    console.log(`📊 남은 주제 수: ${lines.length}개`);
  } else {
    for (const filePath of generatedPostFiles.slice(batchStart)) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    console.error(`12개 언어 세트 검수 실패 (${successCount}/${TARGET_LANGS.length}). 생성된 이번 세트 파일을 되돌리고 topics.txt의 주제를 보존합니다.`);
    process.exit(1);
  }
}

run();
