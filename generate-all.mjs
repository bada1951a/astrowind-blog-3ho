import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const POSTS_BASE_DIR = path.resolve('src/data/post');
const TOPICS_FILE = path.resolve('topics.txt');

// =========================================================================
// [3호기 전용] 100% 무에러 영구 고정 Picsum 실사 CDN 매핑
// =========================================================================
function getPostImages(topic, index) {
  const seedBase = Date.now().toString(36);
  const coverSeed = `work-${seedBase}-${index}-c`;
  const bodySeed = `work-${seedBase}-${index}-b`;

  return {
    coverUrl: `https://picsum.photos/seed/${coverSeed}/1200/675.jpg`,
    bodyUrl: `https://picsum.photos/seed/${bodySeed}/1000/550.jpg`
  };
}

// =========================================================================
// 한국 시간(KST) 기준 안전한 당일 발행 날짜 생성 함수
// =========================================================================
function getKstPublishDateIso(index) {
  const now = new Date();
  const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = kstTime.getUTCFullYear();
  const month = String(kstTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstTime.getUTCDate()).padStart(2, '0');

  const minute = String((index * 5) % 60).padStart(2, '0');
  return `${year}-${month}-${day}T03:${minute}:00.000Z`;
}

// =========================================================================
// 본문 마크다운 별표(**) 및 서식 깨짐 원천 정제 함수
// =========================================================================
function sanitizeMarkdownFormatting(content) {
  let cleaned = content;

  cleaned = cleaned.replace(/\*{3,}/g, '**');
  cleaned = cleaned.replace(/\*\*\[([^\]]+)\]\*\*/g, '[**$1**]');
  cleaned = cleaned.replace(/\*\*"([^"]+)"\*\*/g, '"**$1**"');
  cleaned = cleaned.replace(/\*\*'([^']+)'\*\*/g, '\'**$1**\'');
  cleaned = cleaned.replace(/\*\*\s+([^\*\n]+?)\s+\*\*/g, '**$1**');
  cleaned = cleaned.replace(/\*\*\s+([^\*\n]+?)\*\*/g, '**$1**');
  cleaned = cleaned.replace(/\*\*([^\*\n]+?)\s+\*\*/g, '**$1**');

  const lines = cleaned.split('\n');
  const fixedLines = lines.map(line => {
    if (line.trim().startsWith('```') || line.trim().startsWith('`')) return line;
    const matches = line.match(/\*\*/g);
    if (matches && matches.length % 2 !== 0) {
      const lastIdx = line.lastIndexOf('**');
      return line.slice(0, lastIdx) + line.slice(lastIdx + 2);
    }
    return line;
  });

  return fixedLines.join('\n');
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
console.log(`📌 오늘 처리할 주제 (3호기 AI/업무자동화): "${currentTopic}"`);

// =========================================================================
// [도입부 다양화] 3호기 엑셀/업무자동화/AI 실무 위기 시나리오 30개 풀
// =========================================================================
const AUTOMATION_CRISIS_SCENARIOS_30 = [
  // [1~8: 마감 및 퇴근 직전 수식/데이터 에러]
  "금요일 오후 5시 45분, 마지막 주간 실적 엑셀을 저장하려는데 #REF!와 #VALUE! 에러가 수십 개 셀에 동시다발로 터진 순간",
  "월말 결산일 당일, 수만 행짜리 로우데이터(Raw Data) VLOOKUP 수식을 걸자마자 '응답 없음'으로 엑셀이 하얗게 굳어버렸을 때",
  "임원진에게 공유된 실시간 구글 스프레드시트에서 누군가 필터를 잘못 건드려 전사 매출 지표 합계가 뒤틀린 아찔한 상황",
  "점심시간 10분 전, 수기로 복사 붙여넣기 하던 작업 시트의 행 번호가 한 칸씩 밀려 이전 작업 2시간 치가 백지로 돌아갈 위기",
  "퇴근 알람이 울리기 직전, 팀장님이 '이 파일 다른 부서 형식에 맞춰서 10분 안에 양식 바꿔와'라고 불시에 시트를 던졌을 때",
  "월요일 출근하자마자 본사에서 내려온 100MB가 넘는 CSV 파일이 열리지 않아 메모장과 씨름하던 긴박한 오전",
  "해외 지사에서 제각각 다른 포맷으로 보내온 12개 엑셀 파일을 하나로 합쳐야 하는데 폰트와 날짜 형식이 제각각 깨져 있을 때",
  "야간 잔업 중, 2시간 동안 작성한 피벗 테이블과 매크로가 저장 버튼을 누르기 직전 비정상 종료로 날아갔을 때",

  // [9~16: 파워쿼리, 매크로 및 외부 연동 병목]
  "기존 담당자가 인수인계 없이 남겨둔 정체불명의 복잡한 VBA 매크로 버튼을 눌렀다가 디버그(Debug) 런타임 오류가 떴을 때",
  "ERP 전산 시스템에서 내려받은 원장 데이터를 파워 쿼리로 불러오는 중 알 수 없는 데이터 형식 충돌로 새로고침이 멈춘 순간",
  "사내 업무 툴 간 웹훅(Webhook) 및 Zapier 자동화 트리거가 중간에 끊겨 고객 주문 건 300개가 누락될 뻔한 상황",
  "매달 반복되는 수작업 서식 변환 작업 때문에 신입 사원 셋이 달라붙어 반나절을 허비하고 있는 비효율을 목격했을 때",
  "구글 앱스 스크립트(GAS)로 자동 메일 발송 트리거를 걸어두었는데 발송 할당량(Quota) 초과로 정지 경고가 뜬 아침",
  "거래처 50곳에 각각 다른 첨부파일과 맞춤형 견적서를 메일로 일괄 발송해야 하는 촉박한 마감 30분 전",
  "데이터베이스(DB)에서 쿼리로 추출한 텍스트 데이터의 앞뒤 공백과 유령 줄바꿈 때문에 함수 인식이 전혀 안 될 때",
  "엑셀 버전이 다른 부서 간 파일 공유 과정에서 최신 동적 배열 함수(XLOOKUP, FILTER)가 구버전에서 인식 불가가 되었을 때",

  // [17~24: AI 툴 및 프롬프트 실무 활용 난관]
  "챗GPT나 Claude에게 방대한 회의록 정리를 맡겼는데 핵심 내용은 다 빠뜨리고 엉뚱한 요약본만 내놓아 답답했던 순간",
  "기획안 초안을 30분 만에 작성해야 하는데 AI 프롬프트 답변이 겉도는 교과서적 말투만 반복해 당황스러웠을 때",
  "복잡한 다중 조건 IF 수식을 짜기 위해 AI에게 질문했으나 괄호 개수도 안 맞는 엉터리 수식을 알려줘 머리가 지끈거릴 때",
  "사내 보안 규정상 민감한 고객 개인정보를 직접 AI에 넣을 수 없어 가명 처리와 자동화 사이에서 딜레마에 빠진 상황",
  "AI로 대량의 마케팅 카피 50개를 뽑아냈지만 브랜드 톤앤매너와 완전히 어긋나 처음부터 다시 프롬프트를 빌드해야 할 때",
  "노코드 웹 크롤러를 돌려 경쟁사 가격 모니터링을 자동화하려다 사이트 구조 변경으로 스크래핑 에러가 쏟아진 날",
  "팀 회의에서 '업무 자동화 도입 방안'을 갑작스럽게 발표하게 되어 당장 보여줄 수 있는 실질적인 데모가 필요할 때",
  "PDF 전자문서 100장에 흩어진 계약 조건 표를 엑셀 데이터 테이블로 빠르게 변환해야 하는 긴급 업무가 떨어졌을 때",

  // [25~30: 시스템 규격, 보안 감사 및 휴먼 에러]
  "중요한 사내 감사 직전, 자동화 스크립트가 실수로 폴더 내 원본 마스터 파일을 덮어써서 백업본을 찾아 헤매던 순간",
  "동료가 보호된 워크시트 암호를 잊어버려 당장 수정해야 하는 기안서 파일의 수식 잠금을 해제하지 못하던 상황",
  "클라우드 공유 드라이브 버전 충돌로 인해 같은 파일이 '사본(1)', '사본(2)'로 끝없이 분열되어 작업이 꼬였을 때",
  "텍스트로 저장된 숫자가 일반 숫자로 변환되지 않아 SUM 함수 결과값이 계속 '0'으로 찍히는 어처구니없는 상황",
  "타 부서에서 링크로 걸어둔 외부 참조 엑셀 파일의 경로가 바뀌어 통합 문서 전체에 보안 경고창이 도배되었을 때",
  "보고서 그래프와 차트 데이터 범위가 고정되어 있어 신규 데이터가 들어와도 시각화가 자동 반영되지 않던 난감한 시점"
];

// 30가지 고유 시각 스타일 및 글 구조 테마 프리셋
const THEME_PRESETS = [
  { id: 1, name: "Cyberpunk Terminal", primaryColor: "#00ffcc", bgColor: "#111827", layout: "CLI/터미널 스타일, 자동화 단축 경로 최상단 배치" },
  { id: 2, name: "Modern Minimalist Slate", primaryColor: "#3b82f6", bgColor: "#f8fafc", layout: "미니멀 가이드 스타일, 여백 중심의 깔끔한 단계별 넘버링, 직관적 핵심 요약" },
  { id: 3, name: "Industrial Blueprint", primaryColor: "#f59e0b", bgColor: "#1e293b", layout: "엔지니어링 청사진 스타일, 워크플로우 병목 원인 시각화, 쉬운 3단 비교표 포함" },
  { id: 4, name: "Retro Monokai", primaryColor: "#a6e22e", bgColor: "#272822", layout: "개발자 에디터 스타일, 실전 프롬프트 코드 박스 중심 전개, 디버깅 팁" },
  { id: 5, name: "Nordic Clean Ice", primaryColor: "#0284c7", bgColor: "#f0f9ff", layout: "북유럽 감성 클린 레이아웃, 인용구 중심 도입부, 실무 체크리스트" },
  { id: 6, name: "Dark Velvet Obsidian", primaryColor: "#a855f7", bgColor: "#0f172a", layout: "고급 다크 모드, 전문가 독점 자동화 팁 배너, 단계별 문제 해결 타임라인" },
  { id: 7, name: "Crimson Emergency Field", primaryColor: "#ef4444", bgColor: "#fff1f2", layout: "긴급 오류 복구 매뉴얼 스타일, 위험 경고 박스 최우선 강조, FAQ 아코디언형" },
  { id: 8, name: "Forest Emerald Bio", primaryColor: "#10b981", bgColor: "#f0fdf4", layout: "칼퇴 효율 가이드 스타일, 시간 절약 지표 박스, 친절하고 명쾌한 어조" },
  { id: 9, name: "Solarized Amber Warm", primaryColor: "#d97706", bgColor: "#fef3c7", layout: "실무 공방 노트 스타일, 실측 작업시간 단축 분석표, 초보자 세팅 팁" },
  { id: 10, name: "Deep Ocean Cobalt", primaryColor: "#2563eb", bgColor: "#eff6ff", layout: "표준 소프트웨어 매뉴얼 지침서, 원인 분석 심층 다이어그램 텍스트, 권장 설정 안내" },
  { id: 11, name: "Tokyo Neon Violet", primaryColor: "#8b5cf6", bgColor: "#2e1065", layout: "파워유저 최적화 스타일, 실행 속도 및 단축키 비교, 커스텀 세팅 팁" },
  { id: 12, name: "Graphite Technical Paper", primaryColor: "#475569", bgColor: "#f1f5f9", layout: "깔끔한 기술 백서 스타일, 수식/코드 원인 가설 및 검증 절차, 표준화된 결론" },
  { id: 13, name: "High-Contrast Charcoal", primaryColor: "#e11d48", bgColor: "#18181b", layout: "고대비 경보 스타일, 데이터 손실 방지 수칙, 긴급 롤백 팁 박스" },
  { id: 14, name: "Warm Coffee Latte", primaryColor: "#78350f", bgColor: "#fefae0", layout: "초보자를 위한 친절한 오피스 수필 가이드, 쉬운 비유법, 차근차근 따라하기" },
  { id: 15, name: "Steel Silver Metallic", primaryColor: "#64748b", bgColor: "#e2e8f0", layout: "공식 기술지원 티켓 스타일, 증상 체크리스트, 사전 자가진단표" },
  { id: 16, name: "Sunset Horizon Coral", primaryColor: "#f97316", bgColor: "#fff7ed", layout: "생산성 꿀팁 세팅 스타일, 전후 비교 표, 추천 프롬프트 모음 배너" },
  { id: 17, name: "Mint Fresh Engineering", primaryColor: "#059669", bgColor: "#ecfdf5", layout: "가벼운 워크플로우 최적화 매뉴얼, 불필요한 단계 정리 팁, 명쾌한 솔루션" },
  { id: 18, name: "Midnight Navy Royal", primaryColor: "#1d4ed8", bgColor: "#172554", layout: "야간 배포 로그 스타일, 치명적 수식 에러 극복 타임스탬프, 재발 방지책" },
  { id: 19, name: "Matte Black stealth", primaryColor: "#ffffff", bgColor: "#09090b", layout: "전문 실무 가이드 스타일, 불필요한 서술 배제, 직관적인 단계별 설명" },
  { id: 20, name: "Teal Matrix Digital", primaryColor: "#14b8a6", bgColor: "#042f2e", layout: "API 및 데이터 연동 분석 스타일, 웹훅 신호 및 트리거 점검 체크리스트" },
  { id: 21, name: "Pastel Lavender Tech", primaryColor: "#7c3aed", bgColor: "#faf5ff", layout: "사용자 경험 중심 가이드, 실무자가 가장 자주 묻는 질문 5선 최상단 요약 배치" },
  { id: 22, name: "Bronze Artisan Workshop", primaryColor: "#b45309", bgColor: "#fffbeb", layout: "스프레드시트 튜닝 가이드, 대량 데이터 처리 시 주의 박스, 준비물 목록" },
  { id: 23, name: "Cobalt Enterprise Lab", primaryColor: "#1e40af", bgColor: "#dbeafe", layout: "엔터프라이즈 실사용 생산성 리포트 형식, 비용 및 시간 절감 수치 인용" },
  { id: 24, name: "Rosewood Hardware Guide", primaryColor: "#be123c", bgColor: "#ffe4e6", layout: "생산성 툴 매니아 분석기, 버전별/플랫폼별 기능 차이점 설명, 설정 기준표" },
  { id: 25, name: "Deep Indigo System", primaryColor: "#4338ca", bgColor: "#e0e7ff", layout: "시스템 자동화 파이프라인 분석 형식, 불필요한 수작업 병목 식별법" },
  { id: 26, name: "Acid Lime Hacker Space", primaryColor: "#84cc16", bgColor: "#14532d", layout: "유용한 무료 노코드 툴 가이드, 안전한 데이터 연동 안내" },
  { id: 27, name: "Sandstone Desert Minimal", primaryColor: "#a16207", bgColor: "#fefce8", layout: "깔끔한 실무 매뉴얼 스타일, 소제목 하단 1줄 핵심 팁 강조 배너" },
  { id: 28, name: "Dracula Purple Dev", primaryColor: "#bd93f9", bgColor: "#282a36", layout: "전통 드라큘라 테마 스타일, 필수 단축키 및 복구 함수 하이라이트" },
  { id: 29, name: "Electric Cyan Speed", primaryColor: "#06b6d4", bgColor: "#ecfeff", layout: "초고속 1분 해결 가이드 형식, 빠른 조치법 -> 심층 세팅 2단계 분리" },
  { id: 30, name: "Pure Titanium Clean", primaryColor: "#334155", bgColor: "#ffffff", layout: "초고화질 매뉴얼 스타일, 볼드 타이포그래피 강조, 깔끔한 구분선" }
];

// 글로벌 12개국 페르소나 및 실무 환경
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

async function fetchWithRetry(prompt, maxRetries = 15, delayMs = 20000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.warn(`⚠️ [호출 지연/에러] 시도 ${attempt}/${maxRetries}:${error.message}`);
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`⏳ ${delayMs / 1000}초 동안 대기 후 다시 시도합니다...`);
      await delay(delayMs);
    }
  }
}

async function generateSinglePost(lang, index) {
  const selectedTheme = THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)];
  const selectedScenario = AUTOMATION_CRISIS_SCENARIOS_30[Math.floor(Math.random() * AUTOMATION_CRISIS_SCENARIOS_30.length)];

  console.log(`\n🚀 [${index + 1}/12]${lang.name} (${lang.code}) 3호기 자동화 포스팅 생성 중... (적용 테마: ${selectedTheme.name})`);
  console.log(`   🎭 선택된 자동화 위기 시나리오: "${selectedScenario.slice(0, 30)}..."`);

  const { coverUrl, bodyUrl } = getPostImages(currentTopic, index);
  const pubDateIso = getKstPublishDateIso(index);

  const prompt = `
You are a ${lang.persona}.
Write a highly practical, conversational, 1st-person workflow troubleshooting guide natively in ${lang.name}.
CRITICAL: DO NOT translate literally from Korean. Write completely from scratch as an authentic native professional working in THAT specific country/culture.

[Topic]
${currentTopic}

[Workplace Incident Context]
- Target City/Culture: "${lang.localeContext}"
- Assigned Emergency Scenario: "${selectedScenario}"

[CRITICAL LOCALIZATION & REAL WORLD WORKPLACE CONTEXT (MANDATORY)]
- ABSOLUTELY FORBIDDEN for non-Korean languages:
  * NEVER mention Korean infrastructure, companies, or services (NO Seoul, NO Kakao, NO Naver) in non-Korean languages.
  * Your opening story MUST naturally incorporate the authentic local environment:
    - English (en): Silicon Valley / NYC corporate offices, executive syncs, Slack threads.
    - Japanese (ja): Marunouchi / Shinagawa offices, urgent sales aggregation deadlines.
    - German (de): Frankfurt financial district, quarterly board reports.
    - And corresponding native business context for other languages.
  * The protagonist must be 100% perceived as a local professional of that country.

[CRITICAL OUTPUT LANGUAGE INTEGRITY - ZERO HANGUL IN GLOBAL POSTS]
- If target language is NOT Korean (ko):
  * Absolutely NEVER include any Korean Hangul characters (가-힣) anywhere in the title, description, tags, or body.
  * Every single character in the title and description MUST strictly be in native ${lang.name}.

[WRITING STYLE: PLAIN & PRACTICAL FOR EVERYDAY PROFESSIONALS]
1. Plain & Easy Explanations:
    - Avoid overly abstract academic math theory.
    - Write in warm, friendly, everyday language that any busy desk worker or manager can immediately follow.
    - Give concrete formulas, prompts, or step-by-step clicks.
2. Laser-Focused Narrative:
    - The opening emergency story MUST be 100% strictly about the assigned [Topic] (${currentTopic}) and reflect the given [Assigned Emergency Scenario].

[MANDATORY OPENING VARIATION RULE - ZERO CLICHE REPETITION]
- You MUST start the opening story based strictly on the assigned scenario: "${selectedScenario}".
- ABSOLUTELY FORBIDDEN: Do NOT default to a generic "meeting in 15 minutes" trope. Adapt the specific incident (e.g., raw data corruption, broken formula before clocking out, massive CSV loading failure, missing webhooks) naturally into the local daily office culture of ${lang.name}.

[STRICT MARKDOWN & FORMATTING RULES - NO RENDERING GLITCHES]
1. BOLD FORMATTING RULE:
    - Standard markdown bold is strictly: **Word**
    - NEVER put brackets or quotes inside asterisks (FORBIDDEN: **[Word]**, **"Word"**). Instead write: [**Word**] or "**Word**".
    - NEVER leave space inside asterisks (FORBIDDEN: ** Word **).
2. COMMANDS & FORMULAS / CODE BLOCKS:
    - Always wrap long formulas, scripts, or terminal commands in standard 3-backtick code blocks (\`\`\`excel, \`\`\`python, or \`\`\`bash) so they never overflow horizontally on mobile screens.
3. NO LATEX & NO TILDE:
    - ABSOLUTELY FORBIDDEN: NEVER use LaTeX math delimiters ($ or $$). Write plain text formulas (e.g., "A1 * B1").
    - ABSOLUTELY FORBIDDEN: NEVER use tilde (~) for ranges (e.g., NEVER write "10~20%"). Always use a hyphen (e.g., "10-20%").

[Design Theme & Layout Dynamic Rules (MANDATORY)]
- Assigned Theme: "${selectedTheme.name}"
- Primary Accent Color: ${selectedTheme.primaryColor}
- Layout Characteristic: ${selectedTheme.layout}
- You MUST incorporate native Markdown and inline styled HTML callouts tailored to this theme.
- Use custom styled tip/warning boxes (e.g., <div style="border-left: 4px solid ${selectedTheme.primaryColor}; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">...</div>).
  * CRITICAL: All text inside callout/tip/warning boxes MUST be crisp dark charcoal/black (color: #111827) so it is 100% legible against any background.

[Tone & Writing Style Rules (STRICT - NO AI VIBE)]
1. Mandatory Opening:
    - Absolutely FORBIDDEN: Boring textbook intros like "Hello", "In this post", "Today we will explore".
    - Start immediately with an intense, relatable workplace emergency scenario strictly about [Topic] based on the assigned scenario.
2. Tone & Voice:
    - Write like a real colleague sharing an honest, battle-tested productivity solution on a professional community.
3. Fast-Paced 3-Step Narrative:
    - Step 1: Sudden workflow panic regarding [Topic] set in the assigned incident.
    - Step 2: Wasted manual effort and trial-and-error.
    - Step 3: The breakthrough actionable tip & clear step-by-step setup.

[Content & Structure (AdSense E-E-A-T Compliant)]
1. Opening Story: Intense real workplace incident strictly regarding this topic.
2. Root Cause Breakdown: Clearly explain 3 realistic root causes behind the bottleneck or error.
3. Step-by-Step Resolution:
    - Use official local software UI terminology matching: "${lang.osUi}".
    - Provide exact clicks, copy-pasteable formulas, prompts, or setting steps.
4. Expert Warning / Advice: Practical precautions regarding data privacy, backup, or error prevention.
5. Frequently Asked Questions (FAQ): Exactly 3 realistic, high-value Q&As that everyday users would ask.

[Length & Richness Rules]
- Korean (ko): Minimum 2,500 characters of rich, deep, non-repetitive text.
- Other languages: 1,200 to 1,500 words of thorough practical explanation.

[Strict Output Format]
Return ONLY raw Markdown. DO NOT wrap the output in markdown code fences. DO NOT include the post title as an H1 (# Title) in the body. Begin immediately with the frontmatter:

---
title: "Native Catchy Title in ${lang.name}"
description: "Native concise description in ${lang.name} under 160 characters"
publishDate: ${pubDateIso}
image: "${coverUrl}"
category: "automation"
tags: ["AI Tools", "Workflow", "Automation", "Office Tips"]
theme: "${selectedTheme.name}"
---

(Body starts directly here without H1 header)
`;

  try {
    let rawText = await fetchWithRetry(prompt);
    let text = rawText.trim();
    if (text.startsWith('```markdown')) text = text.replace(/^```markdown\n/, '').replace(/\n```$/, '');
    if (text.startsWith('```')) text = text.replace(/^```\n/, '').replace(/\n```$/, '');

    text = text.replace(/\$([^$]+)\$/g, '$1')
               .replace(/\\times/g, 'x')
               .replace(/\\circ/g, '°')
               .replace(/\\approx/g, '≈');

    text = text.replace(/(\S)\s*~\s*(\S)/g, '$1 - $2');
    text = text.replace(/~/g, '-');

    if (lang.code !== 'ko') {
      text = text.replace(/(title:\s*")([^"]*)(")/g, (match, p1, p2, p3) => {
        return `${p1}${p2.replace(/[가-힣]+/g, '').trim()}${p3}`;
      });
      text = text.replace(/(description:\s*")([^"]*)(")/g, (match, p1, p2, p3) => {
        return `${p1}${p2.replace(/[가-힣]+/g, '').trim()}${p3}`;
      });
    }

    const fmMatch = text.match(/^---[\s\S]*?---\n*/);
    if (fmMatch) {
      let frontmatter = fmMatch[0];
      let body = text.slice(frontmatter.length).trim();
      body = body.replace(/^#\s+[^\n]+\n+/, '');

      // 3호기 영구 고정 규칙: category: 'automation'
      frontmatter = frontmatter.replace(/category:\s*["'][^"']*["']/i, "category: 'automation'")
                               .replace(/category:\s*[^\n\r]+/i, "category: 'automation'");

      // Cloudflare 빌드 실패 및 날짜 밀림 방지: 정확한 KST 기반 ISO 날짜 강제 주입
      frontmatter = frontmatter.replace(/publishDate:\s*[^\n\r]+/i, `publishDate: ${pubDateIso}`);

      // 대표 이미지 경로 강제 동기화
      frontmatter = frontmatter.replace(/image:\s*["'][^"']*["']/i, `image: '${coverUrl}'`);

      // 본문 별표(**) 서식 오류 정제
      body = sanitizeMarkdownFormatting(body);

      // 이미지 alt 텍스트 특수문자 제거 방어 로직
      const safeAlt = currentTopic.replace(/[\[\]\(\)"']/g, '').trim();
      const middleImageMarkdown = `\n\n![${safeAlt} AI Automation Guide](${bodyUrl})\n\n`;

      if (body.includes('## 2.') || body.includes('### 2.')) {
        body = body.replace(/(#{2,3}\s*2\.[^\n]+)/, `${middleImageMarkdown}$1`);
      } else {
        const paragraphs = body.split('\n\n');
        if (paragraphs.length >= 3) {
          paragraphs.splice(2, 0, middleImageMarkdown.trim());
          body = paragraphs.join('\n\n');
        } else {
          body = `${middleImageMarkdown}${body}`;
        }
      }

      text = `${frontmatter}\n${body}\n`;
    }

    const targetDir = path.join(POSTS_BASE_DIR, lang.code);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, `${fileSlug}.md`);
    fs.writeFileSync(filePath, text, 'utf-8');
    console.log(`✅ [성공] 3호기 저장 완료: src/data/post/${lang.code}/${fileSlug}.md (automation / 테마: ${selectedTheme.name})`);
    return true;
  } catch (error) {
    console.error(`❌ [최종 실패] ${lang.name} 생성 실패:`, error.message);
    return false;
  }
}

async function run() {
  console.log("==================================================");
  console.log("⚡ 3호기 AI & 업무자동화 12개국 30개 위기 시나리오 자동 포스팅 파이프라인 시작");
  console.log("==================================================");

  let successCount = 0;

  for (let i = 0; i < TARGET_LANGS.length; i++) {
    const isSuccess = await generateSinglePost(TARGET_LANGS[i], i);
    if (isSuccess) successCount++;
    if (i < TARGET_LANGS.length - 1) {
      await delay(5000);
    }
  }

  if (successCount > 0) {
    lines.shift();
    fs.writeFileSync(TOPICS_FILE, lines.join('\n'), 'utf-8');
    console.log(`\n🧹 총 ${successCount}개국 포스팅 완료. topics.txt에서 주제를 삭제했습니다.`);
    console.log(`📊 남은 주제 수: ${lines.length}개`);
  } else {
    console.error("\n❌ 모든 언어 생성이 실패하여 topics.txt를 유지합니다.");
    process.exit(1);
  }
}

run();
