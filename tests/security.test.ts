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
  { id: '1', title: 'GitHub', website: 'github.com', username: 'demo', password: 'Password123', updatedAt: '2026-07-01' },
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


test('normalizes secret-bearing property names and detects common token formats', () => {
  assert.equal(containsSensitiveInput({ apiKey: 'abc' }), true);
  assert.equal(containsSensitiveInput({ 'private-key': 'abc' }), true);
  assert.equal(containsSensitiveInput({ Authorization: 'Bearer abcdefgh123456' }), true);
  assert.equal(containsSensitiveInput('client-secret=not-a-real-secret'), true);
  assert.equal(containsSensitiveInput('-----BEGIN PRIVATE KEY-----'), true);
  assert.equal(privacySafe('Authorization is an HTTP request header.'), true);
});

test('treats invalid timestamps as stale and ignores blank passwords for reuse', () => {
  const invalidTimestamp: Credential = {
    id: 'bad-date',
    title: 'Unknown date',
    website: 'example.test',
    username: 'demo',
    password: 'UniquePassword123!',
    updatedAt: 'not-a-date',
  };
  const blankOne: Credential = {
    id: 'blank-1',
    title: 'Empty one',
    website: 'one.test',
    username: 'demo',
    password: '',
    updatedAt: '2026-08-01',
  };
  const blankTwo: Credential = { ...blankOne, id: 'blank-2', title: 'Empty two' };
  const metrics = scoreFor([invalidTimestamp, blankOne, blankTwo], baseDate);

  assert.deepEqual(metrics.reused, []);
  assert.deepEqual(metrics.stale.map((item) => item.id), ['bad-date']);
  assert.equal(metrics.weak.length, 2);
});


test('rejects normalized secret-bearing keys and token text', () => {
  assert.equal(containsSensitiveInput({ apiKey: 'demo' }), true);
  assert.equal(containsSensitiveInput({ 'private-key': 'demo' }), true);
  assert.equal(containsSensitiveInput({ Authorization: 'Bearer abcdefgh123456' }), true);
  assert.equal(containsSensitiveInput('client-secret=demo'), true);
  assert.equal(containsSensitiveInput('-----BEGIN PRIVATE KEY-----'), true);
  assert.equal(privacySafe('Authorization is a standard HTTP header.'), true);
});

test('handles invalid dates and blank passwords without false reuse', () => {
  const records: Credential[] = [
    { id: '1', title: 'Unknown date', website: 'one.test', username: 'a', password: 'UniquePassword123!', updatedAt: 'not-a-date' },
    { id: '2', title: 'Blank one', website: 'two.test', username: 'b', password: '', updatedAt: '2026-08-01' },
    { id: '3', title: 'Blank two', website: 'three.test', username: 'c', password: '', updatedAt: '2026-08-01' },
  ];
  const metrics = scoreFor(records, baseDate);
  assert.deepEqual(metrics.reused, []);
  assert.deepEqual(metrics.stale.map((item) => item.id), ['1']);
  assert.equal(metrics.weak.length, 2);
});
