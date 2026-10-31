// =========================================================================
// 📌 [고정 식별자] 이 파일은 '3호기' 전용 스크립트입니다.
// ⚠️ [혼동 방지 경고]
// 1. 이 파일은 '3호기 (AI & 업무자동화)'입니다. 향후 나올 '2-3호기'나 다른 호기와 절대 혼동하지 말 것!
// 2. 카테고리는 대표님의 지시 전까지 'automation'으로 영구 고정한다. (임의 변경 절대 금지)
// 3. 이미지 선택 경로는 이번 수정에서 변경하지 않는다.
// 4. 대표님과의 모든 설명, 질문, 대화 및 주석은 반드시 100% 한국어로만 진행한다.
// =========================================================================

import fs from 'fs';
import path from 'path';
import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import {
  createCheckpointKey,
  createLegacyCheckpointKey,
  createTopicFileSlug,
  decidePublishLocales,
} from './generation-identity.mjs';
import { normalizeFaqArtifacts } from './generation-markdown.mjs';

const GENERATION_PROMPT_VERSION = '2026-10-30-truthful-first-person-v3';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}
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
    bodyUrl: `https://picsum.photos/seed/${bodySeed}/1000/550.jpg`,
  };
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

function refreshPublishDate(text, publishDate) {
  const frontmatterMatch = text.match(/^---\r?\n[\s\S]*?\r?\n---(?=\r?\n)/);
  if (!frontmatterMatch) throw new Error('Checkpoint has no frontmatter.');
  const dateLines = frontmatterMatch[0].match(/^publishDate:\s*.*$/gm) || [];
  if (dateLines.length !== 1) throw new Error('Checkpoint must have exactly one publishDate field.');
  const updatedFrontmatter = frontmatterMatch[0].replace(/^publishDate:\s*.*$/m, 'publishDate: ' + publishDate);
  return updatedFrontmatter + text.slice(frontmatterMatch[0].length);
}

const CURRENT_PUBLISH_DATE = getKstPublishDateIso();

// =========================================================================
// [3호기 전용] 12개국 100% 현지어 섹션 제목 및 치환 딕셔너리 (영구 고정)
// =========================================================================
const I18N_SECTIONS = {
  ko: {
    s1: '1. 직장인 멘붕 오는 업무 병목 돌발 상황',
    s2: '2. 수식 에러 및 자동화 실패의 진짜 핵심 원인',
    s3: '3. 1분 만에 끝내는 단계별 실무 해결법',
    s4: '4. 현직 자동화 전문가의 핵심 주의사항 및 팁',
    s5: '5. 자주 묻는 질문 (FAQ)',
    tags: ['업무자동화', '엑셀팁', '생산성도구', '오피스꿀팁'],
  },
  en: {
    s1: '1. Critical Workplace Bottleneck Emergency',
    s2: '2. Root Cause Breakdown of Formula and Workflow Errors',
    s3: '3. Step-by-Step Practical Productivity Resolution',
    s4: '4. Professional Automation Expert Precautions & Tips',
    s5: '5. Frequently Asked Questions (FAQ)',
    tags: ['Workflow', 'Automation', 'Excel Tips', 'Office Productivity'],
  },
  ja: {
    s1: '1. 職場で冷や汗をかいた業務停止トラブル',
    s2: '2. 数式エラーと自動化トラブルの根本原因',
    s3: '3. 1分で完了する実践的な業務効率化手順',
    s4: '4. 現役自動化専門家が教える注意点とコツ',
    s5: '5. よくある質問 (FAQ)',
    tags: ['業務効率化', 'エクセル時短', '自動化ツール', 'オフィスハック'],
  },
  de: {
    s1: '1. Kritische Fehlersituation im Büroalltag',
    s2: '2. Detaillierte Ursachenanalyse von Formel- und Prozessfehlern',
    s3: '3. Schritt-für-Schritt-Anleitung zur Effizienzsteigerung',
    s4: '4. Praxistipps und Warnungen vom Automatisierungs-Experten',
    s5: '5. Häufig gestellte Fragen (FAQ)',
    tags: ['Automatisierung', 'Excel-Tipps', 'Produktivität', 'Büro-Tools'],
  },
  fr: {
    s1: "1. Situation d'urgence critique au bureau",
    s2: '2. Analyse approfondie des erreurs de formule et de processus',
    s3: "3. Guide étape par étape pour automatiser et résoudre l'erreur",
    s4: "4. Conseils et précautions d'un expert en automatisation",
    s5: '5. Foire Aux Questions (FAQ)',
    tags: ['Automatisation', 'Astuces Excel', 'Productivité', 'Outils Bureautiques'],
  },
  es: {
    s1: '1. Emergencia crítica en el trabajo y bloqueo de tareas',
    s2: '2. Análisis de causas raíz de errores de fórmulas y flujo',
    s3: '3. Solución práctica paso a paso para optimizar el flujo',
    s4: '4. Consejos y advertencias de un experto en productividad',
    s5: '5. Preguntas Frecuentes (FAQ)',
    tags: ['Automatización', 'Consejos Excel', 'Productividad', 'Herramientas Oficina'],
  },
  it: {
    s1: '1. Emergenza improvvisa e blocco delle attività in ufficio',
    s2: '2. Analisi approfondita degli errori di formula e di processo',
    s3: '3. Guida pratica di risoluzione e ottimizzazione passo dopo passo',
    s4: "4. Avvertenze e raccomandazioni dell'esperto di automazione",
    s5: '5. Domande Frequenti (FAQ)',
    tags: ['Automazione', 'Trucchi Excel', 'Produttività', 'Strumenti Ufficio'],
  },
  pt: {
    s1: '1. Situação de emergência e gargalo crítico no escritório',
    s2: '2. Análise da causa raiz de falhas de fórmula e processos',
    s3: '3. Guia prático passo a passo para automação e produtividade',
    s4: '4. Recomendações e alertas de especialistas em automação',
    s5: '5. Perguntas Frequentes (FAQ)',
    tags: ['Automação', 'Dicas Excel', 'Produtividade', 'Rotina de Escritório'],
  },
  nl: {
    s1: '1. Noodsituatie en knelpunt op de werkvloer',
    s2: '2. Grondige analyse van formulefouten en werkstroomproblemen',
    s3: '3. Stapsgewijze praktische automatiseringsoplossing',
    s4: '4. Belangrijke adviezen van automatiseringsspecialisten',
    s5: '5. Veelgestelde Vragen (FAQ)',
    tags: ['Automatisering', 'Excel Tips', 'Productiviteit', 'Kantoortools'],
  },
  pl: {
    s1: '1. Awaryjna sytuacja i paraliż pracy w biurze',
    s2: '2. Szczegółowa analiza przyczyn błędów formuł i procesów',
    s3: '3. Praktyczne rozwiązanie automatyzujące krok po kroku',
    s4: '4. Wskazówki i ostrzeżenia eksperta ds. automatyzacji',
    s5: '5. Najczęściej zadawane pytania (FAQ)',
    tags: ['Automatyzacja', 'Triki Excel', 'Produktywność', 'Narzędzia Biurowe'],
  },
  id: {
    s1: '1. Situasi Kritis dan Hambatan Kerja Mendesak di Kantor',
    s2: '2. Analisis Mendalam Akar Masalah Formula dan Alur Kerja',
    s3: '3. Panduan Langkah demi Langkah Otomatisasi dan Solusi Cepat',
    s4: '4. Tips & Peringatan Penting Pakar Otomatisasi Kantor',
    s5: '5. Pertanyaan yang Sering Diajukan (FAQ)',
    tags: ['Otomatisasi', 'Tips Excel', 'Produktivitas', 'Solusi Kerja'],
  },
  vi: {
    s1: '1. Tình huống sự cố khẩn cấp và tắc nghẽn công việc văn phòng',
    s2: '2. Phân tích nguyên nhân gốc rễ lỗi công thức và luồng xử lý',
    s3: '3. Các bước khắc phục và tối ưu hóa quy trình thực tế',
    s4: '4. Lời khuyên và cảnh báo quan trọng từ chuyên gia tối ưu',
    s5: '5. Các câu hỏi thường gặp (FAQ)',
    tags: ['Tự Động Hóa', 'Mẹo Excel', 'Năng Suất', 'Tin Học Văn Phòng'],
  },
};

// =========================================================================
// 🛡️ [3호기 자가 검수 및 치유 엔진: Self-Healing Inspector]
// =========================================================================
function inspectAndHealMarkdown(body, langCode) {
  let healed = body.trim();
  void langCode;
  const auditLogs = [];

  // 1) 헤딩 볼드를 정리하고 번호만 표준화해 원고별 제목을 보존
  healed = healed.replace(/^(#{1,6}\s+)\*\*(.*?)\*\*/gm, '$1$2');
  healed = healed.replace(/^#{1,6}\s*1[.\s]+([^\n]+)/m, (_match, title) => `## 1. ${title.trim()}`);
  healed = healed.replace(/^#{1,6}\s*2[.\s]+([^\n]+)/m, (_match, title) => `## 2. ${title.trim()}`);
  healed = healed.replace(/^#{1,6}\s*3[.\s]+([^\n]+)/m, (_match, title) => `## 3. ${title.trim()}`);
  healed = healed.replace(/^#{1,6}\s*4[.\s]+([^\n]+)/m, (_match, title) => `## 4. ${title.trim()}`);
  healed = healed.replace(/^#{1,6}\s*5[.\s]+([^\n]+)/m, (_match, title) => `## 5. ${title.trim()}`);

  // 2) 🛡️ Q&A 줄바꿈 뭉개짐 자동 분리 치유 (질문과 답변 사이 빈 줄 2개 보장)
  const rawQnACount = (healed.match(/Q[1-3]\./gi) || []).length;
  if (rawQnACount > 0) {
    healed = healed.replace(/\s*(\*\*Q[1-3]\.\*\*|Q[1-3]\.)\s*/gi, '\n\n**$1** ');
    healed = healed.replace(/\s*(\*\*A[1-3]\.\*\*|A[1-3]\.)\s*/gi, '\n\n**$1** ');
    healed = healed.replace(/\*\*\s*\*\*(Q[1-3]\.|A[1-3]\.)\*\*\s*\*\*/gi, '**$1**');
    healed = healed.replace(/\*\*(Q[1-3]\.|A[1-3]\.)\*\*/gi, '**$1**');
    auditLogs.push('Q&A 줄바꿈 2열 분리 치유');
  }

  const faqNormalized = normalizeFaqArtifacts(healed);
  if (faqNormalized !== healed) auditLogs.push('FAQ의 독립 볼드 표식 및 여분 종료 표식 정돈');
  healed = faqNormalized;

  // 3) 볼드 기호 안쪽 공백 정돈 (** 단어 ** -> **단어**)
  if (/\*\*[ \t]+[^*\r\n]+?[ \t]+\*\*/.test(healed)) {
    healed = healed
      .replace(/\*\*[ \t]+([^*\r\n]+?)[ \t]+\*\*/g, '**$1**')
      .replace(/\*\*[ \t]+([^*\r\n]+?)\*\*/g, '**$1**')
      .replace(/\*\*([^*\r\n]+?)[ \t]+\*\*/g, '**$1**');
    auditLogs.push('볼드 공백 정돈');
  }

  // 4) 엑셀 셀 참조, 수식, 변수 및 LaTeX 기호 인라인 백틱화
  healed = healed.replace(/\$(?:Strg|Ctrl|Win|Shift|Alt|Esc)\s*[^$\n]*\$/gi, (match) => {
    return `\`${match.replace(/\$/g, '').trim()}\``;
  });
  healed = healed.replace(/\$([A-Za-z0-9_-]+)\$/g, '`$1`');
  healed = healed
    .replace(/\\times/g, 'x')
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
  console.error('❌ topics.txt 파일이 존재하지 않습니다.');
  process.exit(1);
}

const fileContent = fs.readFileSync(TOPICS_FILE, 'utf-8');
const lines = fileContent
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l.length > 0);

if (lines.length === 0) {
  console.log('⚠️ topics.txt에 남은 주제가 없습니다. 생성을 건너뜁니다.');
  process.exit(0);
}

const currentTopic = lines[0];
const topicKey = createCheckpointKey(lines, GENERATION_PROMPT_VERSION);
const checkpointRoot = path.resolve('.generation-checkpoints');
const checkpointDir = path.join(checkpointRoot, topicKey);
const legacyCheckpointKey = createLegacyCheckpointKey(lines, GENERATION_PROMPT_VERSION);
const legacyCheckpointDir = path.join(checkpointRoot, legacyCheckpointKey);

// Migrate a pre-fix cache only when the full topic queue still matches exactly.
if (legacyCheckpointKey !== topicKey && fs.existsSync(legacyCheckpointDir) && !fs.existsSync(checkpointDir)) {
  fs.renameSync(legacyCheckpointDir, checkpointDir);
  console.log('♻️ 기존 전체 topic 목록 기준 locale 체크포인트를 현재 주제 키로 이전합니다.');
}
const checkpointEncryptionKey = createHash('sha256')
  .update('blog-locale-checkpoint-v1\0', 'utf8')
  .update(OPENAI_API_KEY, 'utf8')
  .digest();

function readEncryptedCheckpoint(filePath) {
  const envelope = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (envelope.version !== 1) throw new Error('체크포인트 형식 버전이 다릅니다.');
  const decipher = createDecipheriv('aes-256-gcm', checkpointEncryptionKey, Buffer.from(envelope.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(envelope.authTag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(envelope.ciphertext, 'base64')), decipher.final()]).toString(
    'utf8'
  );
}

function writeEncryptedCheckpoint(filePath, text) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', checkpointEncryptionKey, iv);
  const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const envelope = {
    version: 1,
    iv: iv.toString('base64'),
    authTag: cipher.getAuthTag().toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  };
  fs.writeFileSync(filePath, JSON.stringify(envelope), 'utf8');
}
console.log(`📌 오늘 처리할 주제 [3호기 AI & 업무자동화]: "${currentTopic}"`);

const THEME_PRESETS = [
  {
    id: 1,
    name: 'Cyberpunk Terminal',
    primaryColor: '#00ffcc',
    bgColor: '#111827',
    layout: 'CLI/터미널 스타일, 자동화 단축 경로 최상단 배치',
  },
  {
    id: 2,
    name: 'Modern Minimalist Slate',
    primaryColor: '#3b82f6',
    bgColor: '#f8fafc',
    layout: '미니멀 가이드 스타일, 여백 중심의 깔끔한 단계별 넘버링, 직관적 핵심 요약',
  },
  {
    id: 3,
    name: 'Industrial Blueprint',
    primaryColor: '#f59e0b',
    bgColor: '#1e293b',
    layout: '엔지니어링 청사진 스타일, 워크플로우 병목 원인 시각화, 쉬운 3단 비교표 포함',
  },
  {
    id: 4,
    name: 'Retro Monokai',
    primaryColor: '#a6e22e',
    bgColor: '#272822',
    layout: '개발자 에디터 스타일, 실전 프롬프트 코드 박스 중심 전개, 디버깅 팁',
  },
  {
    id: 5,
    name: 'Nordic Clean Ice',
    primaryColor: '#0284c7',
    bgColor: '#f0f9ff',
    layout: '북유럽 감성 클린 레이아웃, 인용구 중심 도입부, 실무 체크리스트',
  },
];

const TARGET_LANGS = [
  {
    code: 'ko',
    name: 'Korean',
    persona: '실용적인 업무 자동화와 AI 활용 안내를 쉽게 풀어 쓰는 글쓴이',
    osUi: '파일 > 옵션, 데이터 > 파워 쿼리, 수식 탭, 확장 프로그램',
    localeContext: 'Korean-language readers in South Korea',
  },
  {
    code: 'en',
    name: 'English',
    persona: 'Practical guide writer explaining office automation and AI clearly',
    osUi: 'File > Options, Data > Power Query, Formula Tab, Add-ons',
    localeContext: 'English-language readers in the United States',
  },
  {
    code: 'ja',
    name: 'Japanese',
    persona: '業務自動化とAI活用を分かりやすく案内する実用ガイドの書き手',
    osUi: 'ファイル > オプション, データ > パワークエリ, 数式タブ, 拡張機能',
    localeContext: 'Japanese-language readers in Japan',
  },
  {
    code: 'de',
    name: 'German',
    persona: 'Praktischer Ratgeberautor für verständliche Büroautomatisierung und KI',
    osUi: 'Datei > Optionen, Daten > Power Query, Formeln, Add-Ins',
    localeContext: 'German-language readers in Germany',
  },
  {
    code: 'fr',
    name: 'French',
    persona: 'Rédacteur de guides pratiques sur automatisation du travail et IA',
    osUi: 'Fichier > Options, Données > Power Query, Formules, Extensions',
    localeContext: 'French-language readers in France',
  },
  {
    code: 'es',
    name: 'Spanish',
    persona: 'Redactor de guías prácticas sobre automatización del trabajo e IA',
    osUi: 'Archivo > Opciones, Datos > Power Query, Fórmulas, Complementos',
    localeContext: 'Spanish-language readers in Spain',
  },
  {
    code: 'it',
    name: 'Italian',
    persona: 'Autore di guide pratiche su automazione del lavoro e IA',
    osUi: 'File > Opzioni, Dati > Power Query, Formule, Componenti aggiuntivi',
    localeContext: 'Italian-language readers in Italy',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    persona: 'Redator de guias práticos sobre automação do trabalho e IA',
    osUi: 'Arquivo > Opções, Dados > Power Query, Fórmulas, Suplementos',
    localeContext: 'Portuguese-language readers in Brazil',
  },
  {
    code: 'nl',
    name: 'Dutch',
    persona: 'Praktische gidsenschrijver over werkautomatisering en AI',
    osUi: 'Bestand > Opties, Gegevens > Power Query, Formules, Invoegtoepassingen',
    localeContext: 'Dutch-language readers in the Netherlands',
  },
  {
    code: 'pl',
    name: 'Polish',
    persona: 'Autor praktycznych poradników o automatyzacji pracy i AI',
    osUi: 'Plik > Opcje, Dane > Power Query, Formuły, Dodatki',
    localeContext: 'Polish-language readers in Poland',
  },
  {
    code: 'id',
    name: 'Indonesian',
    persona: 'Penulis panduan praktis tentang otomatisasi kerja dan AI',
    osUi: 'File > Opsi, Data > Power Query, Rumus, Add-in',
    localeContext: 'Indonesian-language readers in Indonesia',
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    persona: 'Người viết hướng dẫn thực tế về tự động hóa công việc và AI',
    osUi: 'Tệp > Tùy chọn, Dữ liệu > Power Query, Công thức, Tiện ích bổ sung',
    localeContext: 'Vietnamese-language readers in Vietnam',
  },
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const fileSlug = createTopicFileSlug(currentTopic);
const generatedPostContents = new Map();

// 이전 주제의 체크포인트는 현재 주제가 바뀌면 제거해 캐시 크기가 계속 늘지 않게 합니다.
// 현재 주제의 체크포인트는 실패 후 다음 실행에서 재사용합니다.
if (fs.existsSync(checkpointRoot)) {
  for (const entry of fs.readdirSync(checkpointRoot, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== topicKey) {
      fs.rmSync(path.join(checkpointRoot, entry.name), { recursive: true, force: true });
    }
  }
}

if (fs.existsSync(checkpointDir)) {
  for (const fileName of fs.readdirSync(checkpointDir)) {
    if (fileName.endsWith('.md')) {
      fs.unlinkSync(path.join(checkpointDir, fileName));
    }
  }
}

// =========================================================================
// [호출 함수] maxOutputTokens: 8192 (2,500자 정량 생성 최적화)
// =========================================================================
async function fetchWithRetry(prompt, maxRetries = 2, delayMs = 3000) {
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
  const description = fm[1].match(/^description:\s*["']?([^\r\n"']*)/m)?.[1]?.trim() || '';
  if (description.length > 160) errors.push('description 160자 초과');
  if (!/^image:\s*["']?https?:\/\//m.test(fm[1])) errors.push('image URL 형식 오류');

  const bodyWithoutCode = body.replace(/```[\s\S]*?```/g, ' ');
  const plainBody = bodyWithoutCode
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/^#+\s*/gm, '')
    .replace(/[>*_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const nonSpaceLength = [...plainBody].filter((char) => !/\s/u.test(char)).length;
  const words = [...plainBody.matchAll(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu)].length;
  if ((bodyWithoutCode.match(/^##\s+/gm) || []).length !== 5) errors.push('H2 섹션은 정확히 5개여야 함');
  for (const n of [1, 2, 3]) {
    const questionMarker = '**Q' + n + '.**';
    const answerMarker = '**A' + n + '.**';
    if (bodyWithoutCode.split(questionMarker).length - 1 !== 1)
      errors.push('FAQ 질문 Q' + n + ' 표식이 정확히 1개 필요');
    if (bodyWithoutCode.split(answerMarker).length - 1 !== 1) errors.push('FAQ 답변 A' + n + ' 표식이 정확히 1개 필요');
    const pairPattern = new RegExp(
      '^[ \\t]*\\*\\*Q' + n + '\\.\\*\\*[^\\r\\n]*\\r?\\n\\r?\\n[ \\t]*\\*\\*A' + n + '\\.\\*\\*',
      'm'
    );
    if (!pairPattern.test(bodyWithoutCode)) errors.push('FAQ Q' + n + '/A' + n + '는 별도 줄과 빈 줄로 분리되어야 함');
  }
  if (langCode === 'ko' && nonSpaceLength < 1800) errors.push('한국어 본문 공백 제외 1,800자 미만');
  if (langCode === 'ko' && nonSpaceLength > 3600) errors.push('한국어 본문 공백 제외 3,600자 초과');
  if (langCode === 'ja' && nonSpaceLength < 900) errors.push('일본어 본문 공백 제외 900자 미만');
  if (!['ko', 'ja'].includes(langCode) && words < 650) errors.push('본문 650단어 미만');
  if (!['ko', 'ja'].includes(langCode) && words > 1500) errors.push('본문 1,500단어 초과');

  const hangulCount = (plainBody.match(/[가-힣]/g) || []).length;
  const kanaCount = (plainBody.match(/[\u3040-\u30ff]/g) || []).length;
  const latinCount = (plainBody.match(/\p{Script=Latin}/gu) || []).length;
  if (langCode === 'ko' && hangulCount < 300) errors.push('한국어 본문 한글 문자 부족');
  if (langCode === 'ja' && kanaCount < 80) errors.push('일본어 본문 가나 문자 부족');
  if (langCode !== 'ko' && hangulCount > 0) errors.push('비한국어 본문에 한글 포함');
  if (langCode !== 'ja' && kanaCount > 40) errors.push('일본어 외 본문에 가나 문자 과다 포함');
  if (!['ko', 'ja'].includes(langCode) && latinCount < words * 0.6)
    errors.push('본문 문자 체계가 라틴 문자 locale과 맞지 않음');
  return errors;
}
async function generateSinglePost(lang, index) {
  const checkpointPath = path.join(checkpointDir, `${lang.code}.enc`);
  if (fs.existsSync(checkpointPath)) {
    try {
      const cachedText = readEncryptedCheckpoint(checkpointPath);
      const refreshedCachedText = refreshPublishDate(cachedText, CURRENT_PUBLISH_DATE);
      const cachedErrors = validateGeneratedPost(refreshedCachedText, lang.code);
      if (cachedErrors.length === 0) {
        if (refreshedCachedText !== cachedText) {
          writeEncryptedCheckpoint(checkpointPath, refreshedCachedText);
        }
        generatedPostContents.set(lang.code, refreshedCachedText);
        console.log(`\n♻️ [${index + 1}/12] ${lang.name} (${lang.code}) 암호화된 검증 원고 재사용`);
        return true;
      }
      fs.unlinkSync(checkpointPath);
      console.warn(`⚠️ ${lang.code} 체크포인트 검수 실패로 다시 생성합니다: ${cachedErrors.join(', ')}`);
    } catch {
      fs.unlinkSync(checkpointPath);
      console.warn(`⚠️ ${lang.code} 암호화 체크포인트를 읽을 수 없어 다시 생성합니다.`);
    }
  }

  const selectedTheme = THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)];
  const i18n = I18N_SECTIONS[lang.code] || I18N_SECTIONS.ko;

  console.log(
    `\n🚀 [${index + 1}/12] ${lang.name} (${lang.code}) 3호기 애드센스 표준 생성 중... (테마: ${selectedTheme.name})`
  );

  const { coverUrl, bodyUrl } = getPostImages(currentTopic, index);
  const pubDateIso = CURRENT_PUBLISH_DATE;

  // 🎯 [애드센스 승인 최적화 프롬프트: 2,400~2,600자 정량화]
  const prompt = `
Write an original practical guide natively in ${lang.name}, with independent wording and examples for this locale. This is a separate locale-specific article generation call, not a translation.
Topic: "${currentTopic}"
Audience and cultural context: "${lang.localeContext}"
Do not introduce unrelated Excel, spreadsheet, API, or workplace emergencies unless the topic itself requires them. Do not claim to have personally handled the situation or to have credentials. Do not invent facts, quotations, customer cases, or outcomes.
- Use first person only for the guide narrator's present reasoning and recommendations, such as what I would check next; do not claim past events.
- Open with the assigned topic's symptom, reader question, or decision point, then explain what I would check and why. Do not stage a personal scene.
- Unless the user supplied it as verified fact, do not invent or imply a narrator's past event, commute, customer interaction, meeting, named person, specific city, date, time, or case.
- Do not add a disclaimer that a scene is hypothetical, fictional, illustrative, or not a real customer case.

Length and style:
- Korean: about 2,400–2,600 characters, maximum 3,000 characters.
- Other locales: about 900–1,100 words (Japanese: at least 900 non-space characters).
- Aim for an engaging opening and transitions (about 30%) and useful, accurate explanation and actionable steps (about 70%).
- Carry a natural first-person storytelling voice through the article. Aim for roughly 30% narrator reasoning, decisions, and transitions and 70% practical explanations, verifiable steps, and safety information. Use first person to explain what the guide would check and why; do not claim real personal events, credentials, customer cases, or results.
- Open on the assigned topic's concrete symptom, reader question, or decision point. Use the narrator's present-tense first-person reasoning and useful transitions to explain what I would check next and why. Keep it natural and engaging without staging a personal scene, inventing a past event, or adding filler.
- Write idiomatic ${lang.name}, not translated wording. Localize examples and UI labels only when relevant.

Write exactly five numbered H2 headings in ${lang.name}, numbered 1 through 5. Write concise headings in the target language that fit ${currentTopic} and each section's content. Do not use generic boilerplate, promise guaranteed resolution times or outcomes, or imply unverified professional credentials. The bracketed descriptions below are instructions; never copy their brackets or placeholder text into the article.
## 1. [topic-specific opening heading]
Frame the assigned topic's observable symptom, reader question, or decision point. Do not create an event or personal scene.
## 2. [topic-specific heading in ${lang.name}]
Explain the topic-specific causes, limits, and observable clues. Do not force unrelated technical failure types.
## 3. [topic-specific heading in ${lang.name}]
Give clear, safe, numbered steps that solve or investigate the assigned topic.
## 4. [topic-specific heading in ${lang.name}]
Explain relevant precautions, common mistakes, prevention, and when to seek expert help.
## 5. [topic-specific heading in ${lang.name}]
Provide exactly three useful Q&A pairs with a blank line between each question and answer:
**Q1.** Localized question

**A1.** Clear, useful answer.

**Q2.** Localized question

**A2.** Clear, useful answer.

**Q3.** Localized question

**A3.** Clear, useful answer.

Use reliable sources for factual claims and include links only when you can identify a relevant source accurately. Do not fill sections with repetition. Use Markdown, keep headings free of bold markers, and put commands or formulas in inline code. ${lang.code !== 'ko' ? '- Do not use Korean characters.' : ''}

Return only raw Markdown with this frontmatter:
---
title: "Native clear title in ${lang.name}"
description: "Native concise description in ${lang.name}, maximum 160 characters"
publishDate: ${pubDateIso}
image: "${coverUrl}"
category: "automation"
tags: ${JSON.stringify(i18n.tags)}
theme: "${selectedTheme.name}"
---`;

  try {
    const normalizeGeneratedResponse = (rawText) => {
      let text = rawText.trim();
      if (text.startsWith('```markdown')) text = text.replace(/^```markdown\n/, '').replace(/\n```$/, '');
      if (text.startsWith('```')) text = text.replace(/^```\n/, '').replace(/\n```$/, '');

      const fmMatch = text.match(/^---[\s\S]*?---\n*/);
      if (!fmMatch) return text;
      let frontmatter = fmMatch[0].trim();
      let body = text.slice(fmMatch[0].length).trim();
      body = body.replace(/^#\s+[^\n]+\n+/, '');

      // 3호기 고정 카테고리를 보존합니다.
      frontmatter = frontmatter
        .replace(/category:\s*["'][^"']*["']/i, "category: 'automation'")
        .replace(/category:\s*[^\n\r]+/i, "category: 'automation'");

      body = inspectAndHealMarkdown(body, lang.code);
      const safeAlt = currentTopic
        .replaceAll('[', '')
        .replaceAll(']', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('"', '')
        .replaceAll("'", '')
        .trim();
      const middleImageMarkdown = `\n\n![${safeAlt} AI Automation Guide](${bodyUrl})\n\n`;
      if (!body.includes(bodyUrl)) {
        if (body.includes('## 2.')) body = body.replace(/(##\s*2\.[^\n]+)/, `${middleImageMarkdown}$1`);
        else body = `${middleImageMarkdown}${body}`;
      }
      return `${frontmatter}\n\n${body}\n`;
    };

    let text = normalizeGeneratedResponse(await fetchWithRetry(prompt));
    let validationErrors = validateGeneratedPost(text, lang.code);
    for (let correctionAttempt = 1; validationErrors.length > 0 && correctionAttempt <= 2; correctionAttempt++) {
      console.warn(
        `⚠️ ${lang.code} 검수 실패(${validationErrors.join(', ')}). 해당 언어 보정 ${correctionAttempt}/2 요청합니다.`
      );
      const repairPrompt = `You are repairing one previously generated ${lang.name} article for the same topic: "${currentTopic}".\n\nThe article failed these exact checks: ${validationErrors.join(', ')}. Return the complete corrected Markdown article, including its original frontmatter. Preserve its topic, useful explanations, factual meaning, and existing wording wherever possible. Correct only the listed validation failures. If H2 sections are missing or malformed, add five concise numbered headings in ${lang.name} that fit this topic and the existing content. Avoid generic boilerplate, unsupported credentials, and guaranteed time or outcome claims. Reorganize only existing relevant material; do not add filler, unsupported facts, fake first-person experiences, or customer anecdotes. Use first person only for the guide's present reasoning. Do not invent or imply a past event, commute, customer interaction, meeting, named person, specific city, date, time, or case. Do not add a hypothetical-scene disclaimer. Keep the article in ${lang.name}, preserve the required FAQ markers, and return raw Markdown only.\n\nOriginal article:\n${text}`;
      text = normalizeGeneratedResponse(await fetchWithRetry(repairPrompt));
      validationErrors = validateGeneratedPost(text, lang.code);
    }

    if (validationErrors.length > 0) {
      throw new Error('발행 전 검수 실패(보정 2회 후): ' + validationErrors.join(', '));
    }

    fs.mkdirSync(checkpointDir, { recursive: true });
    writeEncryptedCheckpoint(checkpointPath, text);
    generatedPostContents.set(lang.code, text);
    console.log(`   ✅ [검증 완료] ${lang.code} 결과를 재실행 복구용 체크포인트로 보존했습니다.`);
    return true;
  } catch (error) {
    console.error(`❌ [최종 실패] ${lang.name} 생성 실패:`, error.message);
    return false;
  }
}

async function run() {
  console.log('==================================================');
  console.log('⚡ [3호기 AI & 업무자동화] 12개 언어 원고 검증 및 게시 시작 (최소 10개 통과)');
  console.log('==================================================');

  for (let i = 0; i < TARGET_LANGS.length; i++) {
    await generateSinglePost(TARGET_LANGS[i], i);
    if (i < TARGET_LANGS.length - 1) await delay(2000);
  }

  const publication = decidePublishLocales(TARGET_LANGS, [...generatedPostContents.keys()], 10);
  const successCount = publication.passingCodes.length;
  const failedCodes = publication.failedCodes;
  if (!publication.canPublish) {
    console.error(
      `세트 중단: 검증 통과 ${successCount}/12개로 최소 기준 10개 미만입니다. 실패 언어: ${failedCodes.join(', ')}. 공개 글과 topics.txt는 그대로 두고 암호화 체크포인트를 보존합니다.`
    );
    process.exit(1);
  }

  // 유효한 locale만 게시 직전 재검증하고 기록합니다.
  for (const lang of publication.passingLocales) {
    const text = generatedPostContents.get(lang.code);
    if (typeof text !== 'string') throw new Error(`Missing validated locale checkpoint: ${lang.code}`);
    const errors = validateGeneratedPost(text, lang.code);
    if (errors.length) throw new Error(`${lang.code} 게시 직전 검증 실패: ${errors.join(', ')}`);
  }
  for (const lang of publication.passingLocales) {
    const text = generatedPostContents.get(lang.code);
    if (typeof text !== 'string') throw new Error(`Missing validated locale checkpoint: ${lang.code}`);
    const targetDir = path.join(POSTS_BASE_DIR, lang.code);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, `${fileSlug}.md`), text, 'utf-8');
  }

  lines.shift();
  fs.writeFileSync(TOPICS_FILE, lines.join('\n'), 'utf-8');
  console.log(`\n🧹 ${successCount}/12개 언어를 게시하고 topics.txt에서 주제를 소비했습니다.`);
  if (failedCodes.length > 0) console.warn(`⚠️ 이번 세트에서 제외된 언어: ${failedCodes.join(', ')}`);
  console.log(`📊 남은 주제 수: ${lines.length}개`);
}

run();
