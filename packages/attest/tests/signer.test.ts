import { describe, it, expect } from 'vitest'
import { sign, verify } from '../src/signer.js'

describe('sign', () => {
  it('produces a hex HMAC-SHA256 of the payload', () => {
    const sig = sign('hello', 'my-secret-key')
    expect(sig).toMatch(/^[0-9a-f]{64}$/)
  })

  it('is deterministic for the same payload and key', () => {
    const a = sign('hello', 'key')
    const b = sign('hello', 'key')
    expect(a).toBe(b)
  })

  it('produces different signatures for different payloads', () => {
    expect(sign('a', 'key')).not.toBe(sign('b', 'key'))
  })

  it('produces different signatures for different keys', () => {
    expect(sign('hello', 'key1')).not.toBe(sign('hello', 'key2'))
  })
})

describe('verify', () => {
  it('returns true for a valid signature', () => {
    const sig = sign('payload', 'key')
    expect(verify('payload', sig, 'key')).toBe(true)
  })

  it('returns false for a tampered payload', () => {
    const sig = sign('original', 'key')
    expect(verify('tampered', sig, 'key')).toBe(false)
  })

  it('returns false for a wrong key', () => {
    const sig = sign('payload', 'key1')
    expect(verify('payload', sig, 'key2')).toBe(false)
  })

  it('returns false for malformed signature', () => {
    expect(verify('payload', 'not-hex', 'key')).toBe(false)
  })

  it('returns false for a signature of wrong length', () => {
    expect(verify('payload', 'abc', 'key')).toBe(false)
  })
})
