import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js'

export { ErrorCode, McpError }

export class ServerError extends Error {
  readonly code: string
  readonly statusCode: number
  readonly details?: unknown
  declare readonly cause?: Error

  constructor(
    message: string,
    options: { code: string; statusCode?: number; details?: unknown; cause?: Error },
  ) {
    super(message)
    this.name = 'ServerError'
    this.cause = options.cause
    this.code = options.code
    this.statusCode = options.statusCode ?? 500
    this.details = options.details
  }
}

export class AuthError extends ServerError {
  constructor(message: string, options?: { code?: string; details?: unknown; cause?: Error }) {
    super(message, {
      code: options?.code ?? 'AUTH_ERROR',
      statusCode: 401,
      details: options?.details,
      cause: options?.cause,
    })
    this.name = 'AuthError'
  }
}

export class ForbiddenError extends ServerError {
  readonly requiredScopes: string[]

  constructor(requiredScopes: string[], options?: { details?: unknown; cause?: Error }) {
    super('Insufficient scope', {
      code: 'INSUFFICIENT_SCOPE',
      statusCode: 403,
      details: options?.details,
      cause: options?.cause,
    })
    this.name = 'ForbiddenError'
    this.requiredScopes = requiredScopes
  }
}

export class RateLimitError extends ServerError {
  readonly retryAfter: number

  constructor(retryAfter: number, options?: { details?: unknown }) {
    super('Rate limit exceeded', {
      code: 'RATE_LIMITED',
      statusCode: 429,
      details: options?.details,
    })
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
  }
}

export class ValidationError extends ServerError {
  constructor(message: string, options?: { details?: unknown; cause?: Error }) {
    super(message, {
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details: options?.details,
      cause: options?.cause,
    })
    this.name = 'ValidationError'
  }
}

export function toMcpError(error: unknown): McpError {
  if (error instanceof McpError) return error
  if (error instanceof ValidationError) {
    return new McpError(ErrorCode.InvalidParams, error.message)
  }
  // Do not leak internal error details to the client
  return new McpError(ErrorCode.InternalError, 'Internal server error')
}

export function toolError(message: string): {
  content: [{ type: 'text'; text: string }]
  isError: true
} {
  return {
    content: [{ type: 'text' as const, text: message }],
    isError: true,
  }
}
