import * as jose from 'jose'
import { AuthError } from '../errors/index.js'
import type { TokenInfo } from '../server/types.js'

export interface JwtValidatorOptions {
  issuer: string
  audience: string
  jwksUri?: string
  algorithms?: string[]
}

export interface JwtValidator {
  validate(token: string): Promise<TokenInfo>
}

export function createJwtValidator(options: JwtValidatorOptions): JwtValidator {
  const jwksUri = options.jwksUri ?? `${options.issuer}/.well-known/jwks.json`
  const JWKS = jose.createRemoteJWKSet(new URL(jwksUri))
  const algorithms = options.algorithms ?? ['RS256', 'ES256']

  return {
    async validate(token: string): Promise<TokenInfo> {
      try {
        const { payload } = await jose.jwtVerify(token, JWKS, {
          issuer: options.issuer,
          audience: options.audience,
          algorithms,
        })

        const sub = payload.sub
        if (!sub) {
          throw new AuthError('Token missing sub claim', { code: 'INVALID_TOKEN' })
        }

        const scopes =
          typeof payload.scope === 'string' ? payload.scope.split(' ').filter(Boolean) : []

        return {
          sub,
          scopes,
          exp: payload.exp,
          iat: payload.iat,
          iss: payload.iss,
          aud: payload.aud,
        }
      } catch (err) {
        if (err instanceof AuthError) throw err
        if (err instanceof jose.errors.JWTExpired) {
          throw new AuthError('Token expired', { code: 'TOKEN_EXPIRED' })
        }
        if (err instanceof jose.errors.JWTClaimValidationFailed) {
          throw new AuthError(`Token claim validation failed: ${err.message}`, {
            code: 'INVALID_TOKEN',
          })
        }
        throw new AuthError('Token verification failed', {
          code: 'INVALID_TOKEN',
          cause: err instanceof Error ? err : undefined,
        })
      }
    },
  }
}
