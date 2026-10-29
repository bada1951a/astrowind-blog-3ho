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
