import { describe, it, expect } from 'vitest'
import {
  buildProtectedResourceMetadata,
  buildWwwAuthenticate,
  extractBearerToken,
  validateBearerToken,
} from '../src/auth/index.js'
import { AuthError } from '../src/errors/index.js'
import type { IncomingMessage } from 'node:http'
import type { AuthConfig } from '../src/server/types.js'

function mockReq(headers: Record<string, string> = {}): IncomingMessage {
  return { headers } as unknown as IncomingMessage
}

describe('buildProtectedResourceMetadata', () => {
  it('builds metadata with required fields', () => {
    const meta = buildProtectedResourceMetadata({
      resourceUrl: 'https://mcp.example.com',
      authorizationServers: ['https://auth.example.com'],
    })
    expect(meta.resource).toBe('https://mcp.example.com')
    expect(meta.authorization_servers).toEqual(['https://auth.example.com'])
    expect(meta.bearer_methods_supported).toEqual(['header'])
  })

  it('includes optional fields when provided', () => {
    const meta = buildProtectedResourceMetadata({
      resourceUrl: 'https://mcp.example.com',
      authorizationServers: ['https://auth.example.com'],
      scopesSupported: ['read', 'write'],
      resourceName: 'Test Server',
    })
    expect(meta.scopes_supported).toEqual(['read', 'write'])
    expect(meta.resource_name).toBe('Test Server')
  })

  it('omits optional fields when not provided', () => {
    const meta = buildProtectedResourceMetadata({
      resourceUrl: 'https://mcp.example.com',
      authorizationServers: ['https://auth.example.com'],
    })
    expect(meta).not.toHaveProperty('scopes_supported')
    expect(meta).not.toHaveProperty('resource_name')
    expect(meta).not.toHaveProperty('resource_documentation')
  })
})

describe('buildWwwAuthenticate', () => {
  it('builds basic header', () => {
    const header = buildWwwAuthenticate({
      resourceMetadataUrl: 'https://mcp.example.com/.well-known/oauth-protected-resource',
    })
    expect(header).toBe(
      'Bearer resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource"',
    )
  })

  it('includes scope', () => {
    const header = buildWwwAuthenticate({
      resourceMetadataUrl: 'https://x.com/.well-known/oauth-protected-resource',
      scopes: ['read', 'write'],
    })
    expect(header).toContain('scope="read write"')
  })

  it('includes error', () => {
    const header = buildWwwAuthenticate({
      resourceMetadataUrl: 'https://x.com/.well-known/oauth-protected-resource',
      error: 'insufficient_scope',
    })
    expect(header).toContain('error="insufficient_scope"')
  })

  it('includes error_description', () => {
    const header = buildWwwAuthenticate({
      resourceMetadataUrl: 'https://x.com/.well-known/oauth-protected-resource',
      errorDescription: 'Need admin scope',
    })
    expect(header).toContain('error_description="Need admin scope"')
  })

  it('escapes quotes in values', () => {
    const header = buildWwwAuthenticate({
      resourceMetadataUrl: 'https://x.com/.well-known/oauth-protected-resource',
      errorDescription: 'He said "hello"',
    })
    expect(header).toContain('error_description="He said \\"hello\\""')
  })

  it('strips CRLF from values', () => {
    const header = buildWwwAuthenticate({
      resourceMetadataUrl: 'https://x.com/.well-known/oauth-protected-resource',
      errorDescription: 'line1\r\nX-Injected: true',
    })
    expect(header).not.toContain('\r')
    expect(header).not.toContain('\n')
    expect(header).toContain('line1X-Injected: true')
  })
})

describe('extractBearerToken', () => {
  it('extracts token from Authorization header', () => {
    const token = extractBearerToken(mockReq({ authorization: 'Bearer abc123' }))
    expect(token).toBe('abc123')
  })

  it('returns undefined for missing header', () => {
    expect(extractBearerToken(mockReq())).toBeUndefined()
  })

  it('returns undefined for non-Bearer scheme', () => {
    expect(extractBearerToken(mockReq({ authorization: 'Basic abc123' }))).toBeUndefined()
  })

  it('returns undefined for malformed header', () => {
    expect(extractBearerToken(mockReq({ authorization: 'Bearer' }))).toBeUndefined()
  })

  it('is case-insensitive on scheme', () => {
    expect(extractBearerToken(mockReq({ authorization: 'bearer token123' }))).toBe('token123')
  })
})

describe('validateBearerToken', () => {
  const authConfig: AuthConfig = {
    enabled: true,
    resourceUrl: 'https://mcp.example.com',
    authorizationServers: ['https://auth.example.com'],
    validateToken: async (token) => {
      if (token === 'valid') return { sub: 'user1', scopes: ['read'] }
      throw new Error('invalid token')
    },
  }

  it('validates a good token', async () => {
    const req = mockReq({ authorization: 'Bearer valid' })
    const info = await validateBearerToken(req, authConfig)
    expect(info.sub).toBe('user1')
    expect(info.scopes).toEqual(['read'])
  })

  it('throws AuthError for missing token', async () => {
    const req = mockReq()
    await expect(validateBearerToken(req, authConfig)).rejects.toThrow(AuthError)
  })

  it('throws AuthError for invalid token', async () => {
    const req = mockReq({ authorization: 'Bearer invalid' })
    await expect(validateBearerToken(req, authConfig)).rejects.toThrow(AuthError)
  })

  it('passes through AuthError from validateToken', async () => {
    const config: AuthConfig = {
      ...authConfig,
      validateToken: async () => {
        throw new AuthError('custom error', { code: 'CUSTOM' })
      },
    }
    const req = mockReq({ authorization: 'Bearer any' })
    try {
      await validateBearerToken(req, config)
      expect.fail('should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(AuthError)
      expect((err as AuthError).code).toBe('CUSTOM')
    }
  })
})
