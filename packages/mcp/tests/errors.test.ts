import { describe, it, expect } from 'vitest'
import {
  ServerError,
  AuthError,
  ForbiddenError,
  RateLimitError,
  ValidationError,
  toMcpError,
  toolError,
  McpError,
  ErrorCode,
} from '../src/errors/index.js'

describe('ServerError', () => {
  it('creates error with required fields', () => {
    const err = new ServerError('something broke', { code: 'BROKEN' })
    expect(err.message).toBe('something broke')
    expect(err.code).toBe('BROKEN')
    expect(err.statusCode).toBe(500)
    expect(err.name).toBe('ServerError')
  })

  it('accepts optional statusCode and details', () => {
    const err = new ServerError('bad', { code: 'BAD', statusCode: 502, details: { foo: 1 } })
    expect(err.statusCode).toBe(502)
    expect(err.details).toEqual({ foo: 1 })
  })

  it('preserves cause chain', () => {
    const cause = new Error('root')
    const err = new ServerError('wrapped', { code: 'WRAP', cause })
    expect(err.cause).toBe(cause)
  })
})

describe('AuthError', () => {
  it('defaults to 401 status and AUTH_ERROR code', () => {
    const err = new AuthError('denied')
    expect(err.statusCode).toBe(401)
    expect(err.code).toBe('AUTH_ERROR')
    expect(err.name).toBe('AuthError')
  })

  it('accepts custom code', () => {
    const err = new AuthError('expired', { code: 'TOKEN_EXPIRED' })
    expect(err.code).toBe('TOKEN_EXPIRED')
  })
})

describe('ForbiddenError', () => {
  it('captures required scopes', () => {
    const err = new ForbiddenError(['read', 'write'])
    expect(err.statusCode).toBe(403)
    expect(err.code).toBe('INSUFFICIENT_SCOPE')
    expect(err.requiredScopes).toEqual(['read', 'write'])
    expect(err.name).toBe('ForbiddenError')
  })
})

describe('RateLimitError', () => {
  it('captures retry-after', () => {
    const err = new RateLimitError(30)
    expect(err.statusCode).toBe(429)
    expect(err.retryAfter).toBe(30)
    expect(err.name).toBe('RateLimitError')
  })
})

describe('ValidationError', () => {
  it('defaults to 400 status', () => {
    const err = new ValidationError('invalid input')
    expect(err.statusCode).toBe(400)
    expect(err.code).toBe('VALIDATION_ERROR')
    expect(err.name).toBe('ValidationError')
  })
})

describe('toMcpError', () => {
  it('passes through McpError unchanged', () => {
    const original = new McpError(ErrorCode.InvalidParams, 'bad params')
    expect(toMcpError(original)).toBe(original)
  })

  it('converts ValidationError to InvalidParams', () => {
    const err = toMcpError(new ValidationError('bad'))
    expect(err).toBeInstanceOf(McpError)
    expect(err.code).toBe(ErrorCode.InvalidParams)
  })

  it('converts generic Error to InternalError with safe message', () => {
    const err = toMcpError(new Error('ECONNREFUSED 10.0.1.42:5432'))
    expect(err.code).toBe(ErrorCode.InternalError)
    expect(err.message).not.toContain('ECONNREFUSED')
    expect(err.message).toContain('Internal server error')
  })

  it('converts non-Error to InternalError with safe message', () => {
    const err = toMcpError('string error')
    expect(err.code).toBe(ErrorCode.InternalError)
    expect(err.message).toContain('Internal server error')
  })
})

describe('toolError', () => {
  it('returns error content structure', () => {
    const result = toolError('something failed')
    expect(result.isError).toBe(true)
    expect(result.content).toHaveLength(1)
    expect(result.content[0].type).toBe('text')
    expect(result.content[0].text).toBe('something failed')
  })
})
