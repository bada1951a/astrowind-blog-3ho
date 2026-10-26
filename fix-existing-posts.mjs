import fs from 'fs';
import path from 'path';

const POSTS_BASE_DIR = path.resolve('src/data/post');

// 3호기 전용 12개국 표준 소제목 딕셔너리
const I18N_SECTIONS = {
  ko: {
    s1: "1. 직장인 멘붕 오는 업무 병목 돌발 상황",
    s2: "2. 수식 에러 및 자동화 실패의 진짜 핵심 원인",
    s3: "3. 1분 만에 끝내는 단계별 실무 해결법",
    s4: "4. 현직 자동화 전문가의 핵심 주의사항 및 팁",
    s5: "5. 자주 묻는 질문 (FAQ)"
  },
  en: {
    s1: "1. Critical Workplace Bottleneck Emergency",
    s2: "2. Root Cause Breakdown of Formula and Workflow Errors",
    s3: "3. Step-by-Step Practical Productivity Resolution",
    s4: "4. Professional Automation Expert Precautions & Tips",
    s5: "5. Frequently Asked Questions (FAQ)"
  },
  ja: {
    s1: "1. 職場で冷や汗をかいた業務停止トラブル",
    s2: "2. 数式エラーと自動化トラブルの根本原因",
    s3: "3. 1分で完了する実践的な業務効率化手順",
    s4: "4. 現役自動化専門家が教える注意点とコツ",
    s5: "5. よくある質問 (FAQ)"
  },
  de: {
    s1: "1. Kritische Fehlersituation im Büroalltag",
    s2: "2. Detaillierte Ursachenanalyse von Formel- und Prozessfehlern",
    s3: "3. Schritt-für-Schritt-Anleitung zur Effizienzsteigerung",
    s4: "4. Praxistipps und Warnungen vom Automatisierungs-Experten",
    s5: "5. Häufig gestellte Fragen (FAQ)"
  },
  fr: {
    s1: "1. Situation d'urgence critique au bureau",
    s2: "2. Analyse approfondie des erreurs de formule et de processus",
    s3: "3. Guide étape par étape pour automatiser et résoudre l'erreur",
    s4: "4. Conseils et précautions d'un expert en automatisation",
    s5: "5. Foire Aux Questions (FAQ)"
  },
  es: {
    s1: "1. Emergencia crítica en el trabajo y bloqueo de tareas",
    s2: "2. Análisis de causas raíz de errores de fórmulas y flujo",
    s3: "3. Solución práctica paso a paso para optimizar el flujo",
    s4: "4. Consejos y advertencias de un experto en productividad",
    s5: "5. Preguntas Frecuentes (FAQ)"
  },
  it: {
    s1: "1. Emergenza improvvisa e blocco delle attività in ufficio",
    s2: "2. Analisi approfondita degli errori di formula e di processo",
    s3: "3. Guida pratica di risoluzione e ottimizzazione passo dopo passo",
    s4: "4. Avvertenze e raccomandazioni dell'esperto di automazione",
    s5: "5. Domande Frequenti (FAQ)"
  },
  pt: {
    s1: "1. Situação de emergência e gargalo crítico no escritório",
    s2: "2. Análise da causa raiz de falhas de fórmula e processos",
    s3: "3. Guia prático passo a passo para automação e produtividade",
    s4: "4. Recomendações e alertas de especialistas em automação",
    s5: "5. Perguntas Frecuentes (FAQ)"
  },
  nl: {
    s1: "1. Noodsituatie en knelpunt op de werkvloer",
    s2: "2. Grondige analyse van formulefouten en werkstroomproblemen",
    s3: "3. Stapsgewijze praktische automatiseringsoplossing",
    s4: "4. Belangrijke adviezen van automatiseringsspecialisten",
    s5: "5. Veelgestelde Vragen (FAQ)"
  },
  pl: {
    s1: "1. Awaryjna sytuacja i paraliż pracy w biurze",
    s2: "2. Szczegółowa analiza przyczyn błędów formuł i procesów",
    s3: "3. Praktyczne rozwiązanie automatyzujące krok po kroku",
    s4: "4. Wskazówki i ostrzeżenia eksperta ds. automatyzacji",
    s5: "5. Najczęściej zadawane pytania (FAQ)"
  },
  id: {
    s1: "1. Situasi Kritis dan Hambatan Kerja Mendesak di Kantor",
    s2: "2. Analisis Mendalam Akar Masalah Formula dan Alur Kerja",
    s3: "3. Panduan Langkah demi Langkah Otomatisasi dan Solusi Cepat",
    s4: "4. Tips & Peringatan Penting Pakar Otomatisasi Kantor",
    s5: "5. Pertanyaan yang Sering Diajukan (FAQ)"
  },
  vi: {
    s1: "1. Tình huống sự cố khẩn cấp và tắc nghẽn công việc văn phòng",
    s2: "2. Phân tích nguyên nhân gốc rễ lỗi công thức và luồng xử lý",
    s3: "3. Các bước khắc phục và tối ưu hóa quy trình thực tế",
    s4: "4. Lời khuyên và cảnh báo quan trọng từ chuyên gia tối ưu",
    s5: "5. Các câu hỏi thường gặp (FAQ)"
  }
};

function getAllMarkdownFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (file.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function cleanPost(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const langMatch = filePath.match(/post[/\\]([a-z]{2})[/\\]/i);
  const langCode = langMatch ? langMatch[1].toLowerCase() : 'ko';
  const i18n = I18N_SECTIONS[langCode] || I18N_SECTIONS.ko;

  const fmMatch = content.match(/^---[\s\S]*?---\n*/);
  if (!fmMatch) return false;

  let frontmatter = fmMatch[0].trim();
  let body = content.slice(fmMatch[0].length).trim();

  // 1. 최상단 H1 삭제
  body = body.replace(/^#\s+[^\n]+\n+/, '');

  // 2. [3호기 핵심] 대괄호 태그 및 영문 고정 헤더 현지화 강제 치환
  body = body.replace(/^#{0,3}\s*1\.?\s*(\[Opening Story.*?\]|Opening Story.*?|개시 스토리.*?)/gmi, `## ${i18n.s1}`);
  body = body.replace(/^#{0,3}\s*2\.?\s*(\[Root Cause.*?\]|Root Cause Breakdown.*?|Root Cause.*?|근본 원인 분석.*?)/gmi, `## ${i18n.s2}`);
  body = body.replace(/^#{0,3}\s*3\.?\s*(\[Step-by-Step.*?\]|Step-by-Step Resolution.*?|Step-by-Step.*?|실전 해결.*?)/gmi, `## ${i18n.s3}`);
  body = body.replace(/^#{0,3}\s*4\.?\s*(\[Expert.*?\]|Expert Advice.*?|Expert.*?|전문가 조언.*?)/gmi, `## ${i18n.s4}`);
  body = body.replace(/^#{0,3}\s*5\.?\s*(\[Frequently Asked Questions.*?\]|Frequently Asked Questions.*?|FAQ)/gmi, `## ${i18n.s5}`);

  // 3. [캡처 확인 기반] 번호 없이 줄글로 튀어나온 국가별 변칙 헤더 자동 승격 치환
  // 2번 원인 분석 승격
  body = body.replace(/^#{0,3}\s*(Warum das Datenchaos.*?|Root Cause Breakdown:.*?|Por qu[eé] se rompen.*?|なぜ数式は壊れ.*?)/gmi, `## ${i18n.s2}`);
  
  // 3번 실무 해결법 승격
  body = body.replace(/^#{0,3}\s*(Schritt-f[uü]r-Schritt-L[oö]sung.*?|Step-by-Step Resolution:.*?|Gu[ií]a paso a paso.*?|ステップ・バイ・ステップ.*?)/gmi, `## ${i18n.s3}`);
  
  // 4번 주의사항 승격
  body = body.replace(/^#{0,3}\s*(Wichtige Hinweise f[uü]r den Ernstfall.*?|Expert Warning.*?|Consejos de un experto.*?|専門家からのアドバイス.*?)/gmi, `## ${i18n.s4}`);
  
  // 5번 FAQ 승격
  body = body.replace(/^#{0,3}\s*(H[aä]ufig gestellte Fragen.*?|Frequently Asked Questions.*?|Preguntas frecuentes.*?|よくあるご質問.*?)/gmi, `## ${i18n.s5}`);

  // 잔여 태그 도려내기
  body = body.replace(/\[(Opening Story\/Problem|Root Cause Breakdown|Step-by-Step Resolution|Expert Advice)\]/gi, '');

  // 4. 1번 헤더 누락 시 주입 및 직후 중복 1줄 정밀 제거
  if (!body.startsWith('## 1.')) {
    body = `## ${i18n.s1}\n\n` + body;
  }
  body = body.replace(/^(## 1\.[^\n]+)\n+(\s*1\.\s+[^\n]+)\n+/m, '$1\n\n');

  // 5. 단축키 주변 달러($) 기호 인라인 백틱화
  body = body.replace(/\$(?:Strg|Ctrl|Win|Shift|Alt|Esc)\s*[^$\n]*\$/gi, (match) => {
    return `\`${match.replace(/\$/g, '').trim()}\``;
  });

  // 6. 볼드 및 Q&A 정렬
  body = body.replace(/^(#{1,6}\s*)\*\*(.*?)\*\*/gm, '$1$2');
  body = body.replace(/([^\n])\s*(\*\*?[QA][0-9]*\s*[:.]\*\*?)/gi, '$1\n\n$2');
  body = body.replace(/([^\n])\s+([QA][0-9]*\s*[:.])/g, '$1\n\n$2');
  body = body.replace(/([.!?])\s*(\*\*?[QA][0-9]*\s*[:.]\*\*?)/gi, '$1\n\n$2');

  // 7. 물음표 뒤 띄어쓰기 및 과도한 개행 압축
  body = body.replace(/\?([A-Za-z\u00C0-\u024F\u1EA0-\u1EF9가-힣])/g, '? $1');
  body = body.replace(/\n{3,}/g, '\n\n');

  // 8. 상단 21줄 공백 원천 차단 (프론트매터와 본문 사이 정확히 2줄 개행)
  const finalContent = `${frontmatter}\n\n${body.trim()}\n`;

  if (content !== finalContent) {
    fs.writeFileSync(filePath, finalContent, 'utf-8');
    return true;
  }
  return false;
}

function run() {
  console.log("==================================================");
  console.log("🛠️ 3호기 마크다운 기존 글 일괄 정밀 복구 스크립트 가동");
  console.log("==================================================");

  const files = getAllMarkdownFiles(POSTS_BASE_DIR);
  console.log(`총 ${files.length}개의 포스트를 검사합니다...\n`);

  let modifiedCount = 0;
  for (const file of files) {
    const isModified = cleanPost(file);
    const relPath = path.relative(process.cwd(), file);
    if (isModified) {
      console.log(`✨ [정밀 복구 완료] ${relPath}`);
      modifiedCount++;
    } else {
      console.log(`✔️ [이상 없음] ${relPath}`);
    }
  }

  console.log(`\n🎉 3호기 작업 완료: 총 ${files.length}개 중 ${modifiedCount}개 파일 복구 완료.`);
}

run();
