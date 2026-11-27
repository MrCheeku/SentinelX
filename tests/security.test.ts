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
  assert.equal(containsSensitiveInput({ 'X-API-Key': 'abc' }), true);
  assert.equal(containsSensitiveInput('x-api-key=not-a-real-key'), true);
  assert.equal(containsSensitiveInput('x-auth-token: sample-token-value'), true);
  assert.equal(containsSensitiveInput('{"apiKey":"demo-secret"}'), true);
  assert.equal(containsSensitiveInput('{"Authorization":"Bearer demo-token-value"}'), true);
  assert.equal(containsSensitiveInput('{"password": "hunter2"}'), true);
  assert.equal(containsSensitiveInput('x-auth-token: sample-token-value'), true);
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




test('safe values include primitives, arrays and nested records', () => {
  assert.equal(containsSensitiveInput(null), false);
  assert.equal(containsSensitiveInput(undefined), false);
  assert.equal(containsSensitiveInput(42), false);
  assert.equal(containsSensitiveInput(['ordinary text', { count: 2 }]), false);
  assert.equal(containsSensitiveInput(['safe', { nested: [{ apiKey: 'demo' }] }]), true);
  assert.equal(privacySafe(null), false);
  assert.equal(privacySafe(undefined), false);
});

test('scores empty vaults as healthy and clamps severe findings to zero', () => {
  assert.deepEqual(scoreFor([], baseDate), { score: 100, weak: [], reused: [], stale: [] });
  const risky = Array.from({ length: 12 }, (_, index) => ({
    id: String(index),
    title: 'Risky',
    website: 'example.test',
    username: 'demo',
    password: 'same',
    updatedAt: '2020-01-01',
  }));
  const metrics = scoreFor(risky, baseDate);
  assert.equal(metrics.score, 0);
  assert.equal(metrics.weak.length, 12);
  assert.equal(metrics.reused.length, 12);
  assert.equal(new Set(metrics.reused.map((item) => item.password)).size, 1);
  assert.equal(metrics.stale.length, 12);
});

test('counts multiple reused password groups once each', () => {
  const items: Credential[] = [
    { ...credentials[0], id: 'a', password: 'SharedOnePassword123!' },
    { ...credentials[1], id: 'b', password: 'SharedOnePassword123!' },
    { ...credentials[0], id: 'c', password: 'SharedTwoPassword123!' },
    { ...credentials[1], id: 'd', password: 'SharedTwoPassword123!' },
  ];
  const metrics = scoreFor(items, baseDate);
  assert.equal(metrics.reused.length, 4);
  assert.equal(buildSanitizedMetadata(metrics, items.length).reusedCount, 2);
});

test('generates every required character class at supported boundary lengths', () => {
  for (const length of [16, 20, 32, 64, 128]) {
    for (let iteration = 0; iteration < 10; iteration += 1) {
      const generated = generateSecureCredential(length);
      assert.equal(generated.length, length);
      assert.match(generated, /[A-Z]/);
      assert.match(generated, /[a-z]/);
      assert.match(generated, /[2-9]/);
      assert.match(generated, /[!@#$%&*]/);
    }
  }
});

test('rejects non-integer and out-of-range credential lengths', () => {
  for (const length of [0, 15, 129, 1.5, Number.NaN]) {
    assert.throws(() => generateSecureCredential(length));
  }
});

test('sanitized metadata only returns aggregate counts and unique risk categories', () => {
  const metrics = scoreFor(credentials, baseDate);
  const metadata = buildSanitizedMetadata(metrics, credentials.length);
  assert.deepEqual(metadata.riskCategories.sort(), ['password_reuse', 'stale_credentials', 'weak_passwords']);
  assert.equal(metadata.totalCredentials, 3);
  assert.equal(JSON.stringify(metadata).includes(credentials[0].password), false);
});
