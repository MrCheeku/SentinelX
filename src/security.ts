export type Credential = {
  id: string;
  title: string;
  website: string;
  username: string;
  password: string;
  updatedAt: string;
};

export type SecurityMetrics = {
  score: number;
  weak: Credential[];
  reused: Credential[];
  stale: Credential[];
};

const SENSITIVE_KEY_NAMES = new Set([
  'password', 'passwd', 'passcode', 'masterpassword', 'secret', 'secretkey',
  'encryptionkey', 'apikey', 'accesstoken', 'refreshtoken', 'privatekey',
  'authorization', 'clientsecret', 'bearertoken', 'idtoken', 'sessiontoken',
  'xapikey', 'xauthtoken', 'authtoken', 'xauthorization', 'proxyauthorization',
]);

const SENSITIVE_TEXT_PATTERNS = [
  /\b(?:password|passwd|passcode|master[_-]?password)\b["']?\s*[:=]\s*["']?\S+/i,
  /\b(?:x[_-]?api[_-]?key|x[_-]?auth[_-]?token|auth[_-]?token|api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|private[_-]?key|authorization|bearer[_-]?token)\b["']?\s*[:=]\s*["']?\S+/i,
  /\bbearer\s+[A-Za-z0-9._~+\/-]{8,}/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\bplaintext\b/i,
];

const CHARACTER_GROUPS = [
  'ABCDEFGHJKLMNPQRSTUVWXYZ',
  'abcdefghijkmnopqrstuvwxyz',
  '23456789',
  '!@#$%&*',
] as const;
const ALL_CHARACTERS = CHARACTER_GROUPS.join('');

function normalizeSensitiveKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function containsSensitiveInput(value: unknown): boolean {
  const inspect = (item: unknown): boolean => {
    if (item == null) return false;
    if (typeof item === 'string') {
      return SENSITIVE_TEXT_PATTERNS.some((pattern) => pattern.test(item));
    }
    if (Array.isArray(item)) return item.some(inspect);
    if (typeof item === 'object') {
      for (const [key, child] of Object.entries(item as Record<string, unknown>)) {
        if (SENSITIVE_KEY_NAMES.has(normalizeSensitiveKey(key))) return true;
        if (inspect(child)) return true;
      }
    }
    return false;
  };

  try {
    return inspect(value);
  } catch {
    return true;
  }
}

export function privacySafe(value: unknown): boolean {
  return value != null && !containsSensitiveInput(value);
}

export function scoreFor(items: Credential[], nowMs = Date.now()): SecurityMetrics {
  let score = 100;
  const weak = items.filter(
    (c) => c.password.length < 12 || !/[A-Z]/.test(c.password) || !/[a-z]/.test(c.password) || !/\d/.test(c.password),
  );
  const groups = new Map<string, number>();
  items.forEach((credential) => {
    // Empty values are weak, but they are not reuse of a credential.
    if (credential.password.length > 0) {
      groups.set(credential.password, (groups.get(credential.password) || 0) + 1);
    }
  });
  const reused = items.filter(
    (credential) => credential.password.length > 0 && (groups.get(credential.password) || 0) > 1,
  );
  const stale = items.filter((credential) => {
    const updatedAtMs = Date.parse(credential.updatedAt);
    return !Number.isFinite(updatedAtMs) || (nowMs - updatedAtMs) / 86400000 > 90;
  });
  score -= weak.length * 10;
  score -= new Set(reused.map((c) => c.password)).size * 12;
  score -= stale.length * 6;
  return { score: Math.max(0, Math.min(100, score)), weak, reused, stale };
}

function secureRandomIndex(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > 0x100000000) {
    throw new RangeError('Random selection bound must be an integer from 1 to 2^32.');
  }

  const range = 0x100000000;
  const limit = Math.floor(range / maxExclusive) * maxExclusive;
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % maxExclusive;
}

export function generateSecureCredential(length = 20): string {
  if (!Number.isInteger(length) || length < 16 || length > 128) {
    throw new Error('Credential length must be an integer between 16 and 128.');
  }

  // Seed every required group, then fill and cryptographically shuffle the result.
  // This guarantees complexity without relying on a probabilistic test of the pool.
  const characters = CHARACTER_GROUPS.map(
    (group) => group[secureRandomIndex(group.length)],
  );

  while (characters.length < length) {
    characters.push(ALL_CHARACTERS[secureRandomIndex(ALL_CHARACTERS.length)]);
  }

  for (let index = characters.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomIndex(index + 1);
    [characters[index], characters[swapIndex]] = [characters[swapIndex], characters[index]];
  }

  return characters.join('');
}

export function buildSanitizedMetadata(metrics: SecurityMetrics, totalCredentials: number) {
  return {
    securityScore: metrics.score,
    totalCredentials,
    weakCount: metrics.weak.length,
    reusedCount: new Set(metrics.reused.map((item) => item.password)).size,
    staleCredentialCount: metrics.stale.length,
    riskCategories: [...new Set([
      ...metrics.weak.map(() => 'weak_passwords'),
      ...metrics.reused.map(() => 'password_reuse'),
      ...metrics.stale.map(() => 'stale_credentials'),
    ])],
  };
}
