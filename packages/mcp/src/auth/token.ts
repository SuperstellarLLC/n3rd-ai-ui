import type { IncomingMessage } from 'node:http'
import { AuthError } from '../errors/index.js'
import type { AuthConfig, TokenInfo } from '../server/types.js'

export function extractBearerToken(req: IncomingMessage): string | undefined {
  const header = req.headers.authorization
  if (!header) return undefined
  const parts = header.split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return undefined
  return parts[1]
}

/**
 * Validates a bearer token from the request.
 *
 * Delegates to `config.validateToken` which is responsible for all token
 * verification (signature, expiry, audience, etc.). This function only
 * extracts the bearer token and wraps errors as `AuthError`.
 */
export async function validateBearerToken(
  req: IncomingMessage,
  config: AuthConfig,
): Promise<TokenInfo> {
  const token = extractBearerToken(req)
  if (!token) {
    throw new AuthError('Missing bearer token', { code: 'MISSING_TOKEN' })
  }

  try {
    return await config.validateToken(token)
  } catch (err) {
    if (err instanceof AuthError) throw err
    throw new AuthError('Invalid token', {
      code: 'INVALID_TOKEN',
      cause: err instanceof Error ? err : undefined,
    })
  }
}
