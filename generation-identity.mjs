import { createHash } from 'node:crypto';

export function createCheckpointKey(topicLines, promptVersion) {
  const identity = JSON.stringify({ topicLines, promptVersion });
  return createHash('sha256').update(identity, 'utf8').digest('hex');
}

export function createTopicFileSlug(topic) {
  const normalizedTopic = topic.normalize('NFKC').trim();
  const digest = createHash('sha256').update(normalizedTopic, 'utf8').digest('hex');
  return `post-${digest.slice(0, 12)}`;
}


export function decidePublishLocales(targetLanguages, successfulLocaleCodes, minimum = 10) {
  if (!Array.isArray(targetLanguages) || targetLanguages.length === 0) {
    throw new TypeError('targetLanguages must be a non-empty array.');
  }
  if (!Array.isArray(successfulLocaleCodes) && !(successfulLocaleCodes instanceof Set)) {
    throw new TypeError('successfulLocaleCodes must be an array or Set.');
  }

  const localeCode = (locale) => (typeof locale === 'string' ? locale : locale?.code);
  const targetCodes = targetLanguages.map(localeCode);
  if (targetCodes.some((code) => typeof code !== 'string' || !code.trim())) {
    throw new TypeError('Every target locale must have a non-empty code.');
  }
  if (new Set(targetCodes).size !== targetCodes.length) {
    throw new TypeError('Target locale codes must be unique.');
  }
  if (!Number.isInteger(minimum) || minimum < 1 || minimum > targetCodes.length) {
    throw new RangeError('minimum must be an integer within the target locale count.');
  }

  const successfulCodes = new Set(successfulLocaleCodes);
  const targetCodeSet = new Set(targetCodes);
  const unknownCodes = [...successfulCodes].filter((code) => !targetCodeSet.has(code));
  if (unknownCodes.length > 0) {
    throw new RangeError('Unknown successful locale codes: ' + unknownCodes.join(', '));
  }

  const passingLocales = targetLanguages.filter((locale) => successfulCodes.has(localeCode(locale)));
  const passingCodes = passingLocales.map(localeCode);
  const failedCodes = targetCodes.filter((code) => !successfulCodes.has(code));
  return {
    total: targetCodes.length,
    minimum,
    passingLocales,
    passingCodes,
    failedCodes,
    canPublish: passingCodes.length >= minimum,
  };
}