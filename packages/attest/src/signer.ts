import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Compute an HMAC-SHA256 signature over the given payload using the API key.
 * Returns a lowercase hex string.
 */
export function sign(payload: string, apiKey: string): string {
  return createHmac('sha256', apiKey).update(payload).digest('hex')
}

/**
 * Verify a signature in constant time to prevent timing attacks.
 * Returns true if the signature matches.
 */
export function verify(payload: string, signature: string, apiKey: string): boolean {
  const expected = sign(payload, apiKey)
  if (expected.length !== signature.length) return false
  try {
    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'))
  } catch {
    return false
  }
}
