export function normalizeFaqArtifacts(markdown) {
  const text = String(markdown);
  const newline = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  let faqStart = -1;
  let faqEnd = lines.length;
  let fenceCharacter = null;
  let fenceLength = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fence = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fence) {
      const marker = fence[1];
      if (fenceCharacter === null) {
        fenceCharacter = marker[0];
        fenceLength = marker.length;
      } else if (marker[0] === fenceCharacter && marker.length >= fenceLength) {
        fenceCharacter = null;
        fenceLength = 0;
      }
      continue;
    }
    if (fenceCharacter !== null) continue;

    const heading = line.match(/^(#{1,6})[ \t]+/);
    if (faqStart === -1) {
      if (/^##[ \t]+5(?:[.\s)]|$)/.test(line)) faqStart = index;
      continue;
    }
    if (heading && heading[1].length <= 2) {
      faqEnd = index;
      break;
    }
  }

  if (faqStart === -1) return text;

  fenceCharacter = null;
  fenceLength = 0;
  for (let index = faqStart + 1; index < faqEnd; index += 1) {
    const line = lines[index];
    const fence = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fence) {
      const marker = fence[1];
      if (fenceCharacter === null) {
        fenceCharacter = marker[0];
        fenceLength = marker.length;
      } else if (marker[0] === fenceCharacter && marker.length >= fenceLength) {
        fenceCharacter = null;
        fenceLength = 0;
      }
      continue;
    }
    if (fenceCharacter !== null) continue;

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
