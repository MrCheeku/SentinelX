import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSanitizedMetadata,
  containsSensitiveInput,
  generateSecureCredential,
  privacySafe,
  scoreFor,
  type Credential,
} from '../src/security.ts';

const baseDate = Date.parse('2026-09-06T00:00:00Z');

const credentials: Credential[] = [
  { id: '1', title: 'GitHub', website: 'github.com', username: 'demo', password: 'Password123', updatedAt: '2026-08-01' },
  { id: '2', title: 'Google', website: 'google.com', username: 'demo@example.com', password: 'Password123', updatedAt: '2026-08-01' },
  { id: '3', title: 'Old Service', website: 'old.example', username: 'demo', password: 'VeryStrongPassword123!', updatedAt: '2025-01-01' },
];

test('detects weak, reused, and stale credentials deterministically', () => {
  const metrics = scoreFor(credentials, baseDate);
  assert.equal(metrics.weak.length, 2);
  assert.equal(new Set(metrics.reused.map((item) => item.password)).size, 1);
  assert.equal(metrics.stale.length, 1);
  assert.ok(metrics.score < 100);
});

test('builds metadata without credential contents', () => {
  const metadata = buildSanitizedMetadata(scoreFor(credentials, baseDate), credentials.length);
  const serialized = JSON.stringify(metadata);
  assert.equal(metadata.totalCredentials, 3);
  assert.equal(metadata.weakCount, 2);
  assert.equal(metadata.reusedCount, 1);
  assert.equal(metadata.staleCredentialCount, 1);
  assert.ok(!serialized.includes('Password123'));
  assert.ok(!serialized.includes('VeryStrongPassword123!'));
});

test('blocks common secret-bearing payloads', () => {
  assert.equal(containsSensitiveInput('password: hunter2'), true);
  assert.equal(containsSensitiveInput({ api_key: 'abc' }), true);
  assert.equal(containsSensitiveInput('api_key=abc'), true);
  assert.equal(privacySafe({ securityScore: 80, weakCount: 1 }), true);
  assert.equal(privacySafe({ password: 'demo' }), false);
});

test('generates high-entropy credentials of the requested length', () => {
  const generated = generateSecureCredential(32);
  assert.equal(generated.length, 32);
  assert.match(generated, /[A-Z]/);
  assert.match(generated, /[a-z]/);
  assert.match(generated, /\d/);
  assert.match(generated, /[!@#$%&*]/);
  assert.throws(() => generateSecureCredential(8));
});
