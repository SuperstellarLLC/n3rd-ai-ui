import type { Logger, LoggerOptions, LogLevel } from '../logging/index.js'
import type { AddressInfo } from 'node:net'

export interface ServerInfo {
  name: string
  version: string
  title?: string
  description?: string
  websiteUrl?: string
  instructions?: string
}

export interface CorsOptions {
  origin?: string | string[]
  methods?: string
  allowedHeaders?: string
  exposedHeaders?: string
}

export interface HttpTransportOptions {
  port?: number
  host?: string
  endpoint?: string
  stateful?: boolean
  maxSessions?: number
  sessionTtlMs?: number
  cors?: CorsOptions
}

export interface StdioTransportOptions {
  stdin?: import('node:stream').Readable
  stdout?: import('node:stream').Writable
}

export type TransportConfig =
  | { type: 'stdio'; options?: StdioTransportOptions }
  | { type: 'http'; options?: HttpTransportOptions }

export interface HealthCheckConfig {
  enabled?: boolean
  path?: string
  readyPath?: string
  verbose?: boolean
  checks?: Record<string, () => Promise<HealthCheckResult>>
}

export interface HealthCheckResult {
  status: 'ok' | 'error'
  latency_ms?: number
  details?: string
}

export interface RateLimitConfig {
  enabled?: boolean
  windowMs?: number
  max?: number
  /** Only enable behind a trusted reverse proxy that overwrites X-Forwarded-For. */
  trustProxy?: boolean
  keyGenerator?: (req: {
    headers: Record<string, string | string[] | undefined>
    socket?: { remoteAddress?: string }
  }) => string
}

export interface AuthConfig {
  enabled?: boolean
  resourceUrl: string
  authorizationServers: string[]
  scopesSupported?: string[]
  validateToken: (token: string) => Promise<TokenInfo>
}

/**
 * Token information returned by the `validateToken` callback.
 * `exp` is expected in Unix epoch **seconds** (standard JWT `exp` claim).
 */
export interface TokenInfo {
  sub: string
  scopes: string[]
  /** Expiration time in Unix epoch seconds (not milliseconds). */
  exp?: number
  [key: string]: unknown
}

export interface RegistryConfig {
  name: string
  description: string
  version: string
  title?: string
  repository?: { url: string; source?: string; subfolder?: string }
  packages?: RegistryPackage[]
}

export interface RegistryPackage {
  registryType: 'npm' | 'pypi' | 'oci' | 'nuget' | 'mcpb'
  identifier: string
  version?: string
  transport: { type: 'stdio' | 'streamable-http' | 'sse' }
  environmentVariables?: Array<{
    name: string
    description?: string
    isRequired?: boolean
    isSecret?: boolean
  }>
}

export interface N3rdServerOptions {
  server: ServerInfo
  transport: TransportConfig
  logger?: LoggerOptions
  health?: HealthCheckConfig
  rateLimit?: RateLimitConfig
  auth?: AuthConfig
  registry?: RegistryConfig
}

export interface N3rdServer {
  readonly logger: Logger
  readonly info: ServerInfo
  address(): AddressInfo | null
  start(): Promise<void>
  stop(): Promise<void>
  setLogLevel(level: LogLevel): void
}
