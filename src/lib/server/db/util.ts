import { webcrypto } from 'node:crypto';

/**
 * Compute sha256 hex for a string (utf-8).
 */
export async function sha256HexFromText(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await webcrypto.subtle.digest('SHA-256', bytes);
  return Buffer.from(digest).toString('hex');
}
