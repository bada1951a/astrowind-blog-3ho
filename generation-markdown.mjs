export function normalizeFaqArtifacts(markdown) {
  const text = String(markdown);
  const newline = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  const firstQuestion = lines.findIndex((line) => /^\s*\*\*Q1\.\*\*/.test(line));
  if (firstQuestion === -1) return text;

  let faqStart = firstQuestion;
  while (faqStart > 0 && ['', '**'].includes(lines[faqStart - 1].trim())) {
    faqStart -= 1;
  }

  let inCodeFence = false;
  for (let index = faqStart; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    if (line.trim() === '**') {
      lines[index] = '';
      continue;
    }

    const markerLine = line.match(/^([ \t]*\*\*[QA][1-3]\.\*\*[ \t]+)(.*)$/);
    if (!markerLine) continue;

    let answerOrQuestion = markerLine[2];
    while (answerOrQuestion.endsWith('**')) {
      const boldMarkers = answerOrQuestion.match(/\*\*/g) || [];
      if (boldMarkers.length % 2 === 0) break;
      answerOrQuestion = answerOrQuestion.slice(0, -2).replace(/[ \t]+$/, '');
    }
    lines[index] = markerLine[1] + answerOrQuestion;
  }

  return lines.join(newline);
}
