import crypto from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'n4n0_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function getAdminConfig() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';
  const adminSessionSecret = process.env.ADMIN_SESSION_SECRET ?? '';

  if (!adminEmail || !adminPassword || !adminSessionSecret) {
    throw new Error('Missing admin auth environment variables');
  }

  return {
    adminEmail,
    adminPassword,
    adminSessionSecret,
  };
}

export function verifyAdminCredentials(email: string, password: string) {
  const { adminEmail, adminPassword } = getAdminConfig();
  return email.trim().toLowerCase() === adminEmail && password === adminPassword;
}

export function createAdminSessionToken(email: string) {
  const { adminSessionSecret } = getAdminConfig();
  const payload = JSON.stringify({
    email: email.trim().toLowerCase(),
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  const signature = crypto
    .createHmac('sha256', adminSessionSecret)
    .update(payload)
    .digest('hex');

  return `${Buffer.from(payload, 'utf8').toString('base64url')}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token) {
    return false;
  }

  const { adminEmail, adminSessionSecret } = getAdminConfig();
  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    return false;
  }

  let payloadText = '';
  try {
    payloadText = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  } catch {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', adminSessionSecret)
    .update(payloadText)
    .digest('hex');

  const signatureMatches =
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!signatureMatches) {
    return false;
  }

  try {
    const payload = JSON.parse(payloadText) as {
      email?: string;
      expiresAt?: number;
    };

    if (!payload.email || !payload.expiresAt) {
      return false;
    }

    return payload.email === adminEmail && payload.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function getAdminSessionTokenFromCookies() {
  return (await cookies()).get(ADMIN_SESSION_COOKIE)?.value ?? null;
}

export async function isAdminAuthenticated() {
  return verifyAdminSessionToken(await getAdminSessionTokenFromCookies());
}
