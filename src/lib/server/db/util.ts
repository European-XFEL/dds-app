import { crypto } from '@std/crypto';
import { encodeHex } from '@std/encoding/hex';

/**
 * Compute sha256 hex for a string (utf-8).
 */
async function sha256HexFromText(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return encodeHex(new Uint8Array(digest));
}
