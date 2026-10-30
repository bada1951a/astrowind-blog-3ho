import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

import { createCheckpointKey, createTopicFileSlug, decidePublishLocales } from '../generation-identity.mjs';

test('a prompt update invalidates cached drafts but the same version can resume', () => {
  const topics = ['Assigned topic', 'Next topic'];
  const v1 = createCheckpointKey(topics, 'prompt-v1');
  const resumed = createCheckpointKey(topics, 'prompt-v1');
  const v2 = createCheckpointKey(topics, 'prompt-v2');

  assert.equal(resumed, v1);
  assert.notEqual(v2, v1);
});

test('the topic slug is stable when later queue rows change', () => {
  const slug = createTopicFileSlug('Assigned topic');

  assert.equal(createTopicFileSlug('Assigned topic'), slug);
  assert.equal(createTopicFileSlug('Assigned topic').startsWith('post-'), true);
  assert.notEqual(createTopicFileSlug('Different topic'), slug);
});

const publicationTargets = ['ko', 'en', 'ja', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'id', 'vi'].map((code) => ({
  code,
}));

test('publication gate allows exactly passing locales at 9/12, 10/12, and 12/12', () => {
  const nine = decidePublishLocales(
    publicationTargets,
    publicationTargets.slice(0, 9).map(({ code }) => code)
  );
  assert.equal(nine.canPublish, false);
  assert.deepEqual(
    nine.passingCodes,
    publicationTargets.slice(0, 9).map(({ code }) => code)
  );
  assert.deepEqual(
    nine.failedCodes,
    publicationTargets.slice(9).map(({ code }) => code)
  );

  const ten = decidePublishLocales(
    publicationTargets,
    publicationTargets.slice(0, 10).map(({ code }) => code)
  );
  assert.equal(ten.canPublish, true);
  assert.deepEqual(ten.passingLocales, publicationTargets.slice(0, 10));
  assert.deepEqual(
    ten.failedCodes,
    publicationTargets.slice(10).map(({ code }) => code)
  );

  const twelve = decidePublishLocales(
    publicationTargets,
    publicationTargets.map(({ code }) => code)
  );
  assert.equal(twelve.canPublish, true);
  assert.deepEqual(twelve.passingLocales, publicationTargets);
  assert.deepEqual(twelve.failedCodes, []);
});

test('generator uses the tested publication plan to gate and select written locales', () => {
  const source = readFileSync(new URL('../generate-all.mjs', import.meta.url), 'utf8');
  assert.match(source, /decidePublishLocales\(TARGET_LANGS, \[\.\.\.generatedPostContents\.keys\(\)\], 10\)/);
  assert.match(source, /if \(!publication\.canPublish\)/);
  assert.match(source, /for \(const lang of publication\.passingLocales\)/);
});

test('generator prompt specifies a topic-fit first-person narrative and practical balance', () => {
  const source = readFileSync(new URL('../generate-all.mjs', import.meta.url), 'utf8');
  assert.ok(source.includes('Write concise headings in the target language that fit ${currentTopic}'));
  assert.ok(source.includes('Do not use generic boilerplate, promise guaranteed resolution times or outcomes'));
  assert.ok(source.includes('The bracketed descriptions below are instructions; never copy their brackets or placeholder text into the article.'));
  assert.ok(source.includes('roughly 30% narrator reasoning'));
  assert.ok(source.includes('70% practical explanations'));
});

const generatorSource = readFileSync(new URL('../generate-all.mjs', import.meta.url), 'utf8');
const newline = String.fromCharCode(10);

function extractFunction(source, signature, nextDeclaration) {
  const start = source.indexOf(signature);
  const end = source.indexOf(nextDeclaration, start);
  assert.notEqual(start, -1, `missing production function: ${signature}`);
  assert.notEqual(end, -1, `missing function boundary after: ${signature}`);
  return source.slice(start, end).trim();
}

const inspectDeclaration = extractFunction(
  generatorSource,
  'function inspectAndHealMarkdown(body, langCode) {',
  newline + 'if (!fs.existsSync(TOPICS_FILE))'
);
const validateDeclaration = extractFunction(
  generatorSource,
  'function validateGeneratedPost(text, langCode) {',
  newline + 'async function generateSinglePost(lang, index)'
);
const productionMarkdown = new Function(
  'I18N_SECTIONS',
  'console',
  [inspectDeclaration, validateDeclaration, 'return { inspectAndHealMarkdown, validateGeneratedPost };'].join(newline)
)(
  {
    en: { s1: '1. First', s2: '2. Second', s3: '3. Third', s4: '4. Fourth', s5: '5. FAQ' },
    ko: { s1: '1. First', s2: '2. Second', s3: '3. Third', s4: '4. Fourth', s5: '5. FAQ' },
  },
  { log() {} }
);

test('bold normalization never crosses lines and preserves separate FAQ markers and blank lines', () => {
  const raw = [
    '## 1. Restore an unsaved workbook before changing the macro',
    '** spaced phrase',
    'continued phrase **',
    '',
    '## 2. Second',
    'A normal explanation.',
    '',
    '## 3. Third',
    'A normal explanation.',
    '',
    '## 4. Fourth',
    'A normal explanation.',
    '',
    '## 5. FAQ',
    '**Q1.** Question one?',
    '',
    '**A1.** Answer one.',
    '',
    '**Q2.** Question two?',
    '',
    '**A2.** Answer two.',
    '',
    '**Q3.** Question three?',
    '',
    '**A3.** Answer three.',
  ].join(newline);

  const healed = productionMarkdown.inspectAndHealMarkdown(raw, 'en');
  assert.ok(
    healed.includes(['** spaced phrase', 'continued phrase **'].join(newline)),
    'multiline bold-like text must retain its line break and spacing'
  );
  assert.ok(healed.includes('## 1. Restore an unsaved workbook before changing the macro'));
  const lines = healed.split(newline);
  for (let n = 1; n <= 3; n++) {
    const questionLine = lines.findIndex((line) => line.startsWith('**Q' + n + '.**'));
    assert.notEqual(questionLine, -1, `Q${n} marker should remain at line start`);
    assert.equal(lines[questionLine + 1], '', `Q${n}/A${n} must retain a blank line`);
    assert.ok(
      lines[questionLine + 2]?.startsWith('**A' + n + '.**'),
      `A${n} marker should remain on the following line`
    );
  }
});

test('validator rejects a collapsed FAQ question and answer marker pair', () => {
  const filler = Array(700).fill('useful').join(' ');
  const article = [
    '---',
    'title: "A practical guide"',
    'description: "A concise practical guide."',
    'publishDate: 2026-10-30T00:00:00.000Z',
    'image: "https://example.com/cover.jpg"',
    'category: "guide"',
    'tags: []',
    '---',
    '',
    '## 1. First',
    filler,
    '## 2. Second',
    'A careful explanation.',
    '## 3. Third',
    'A useful step.',
    '## 4. Fourth',
    'A safety note.',
    '## 5. FAQ',
    '**Q1.** Question one? **A1.** Answer one.',
    '',
    '**Q2.** Question two?',
    '',
    '**A2.** Answer two.',
    '',
    '**Q3.** Question three?',
    '',
    '**A3.** Answer three.',
  ].join(newline);

  const errors = productionMarkdown.validateGeneratedPost(article, 'en');
  assert.ok(errors.includes('FAQ Q1/A1는 별도 줄과 빈 줄로 분리되어야 함'));
});
