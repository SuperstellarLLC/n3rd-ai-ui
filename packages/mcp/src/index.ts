// Server
export { createN3rdServer } from './server/index.js'
export type {
  N3rdServer,
  N3rdServerOptions,
  ServerInfo,
  TransportConfig,
  HttpTransportOptions,
  StdioTransportOptions,
  CorsOptions,
  HealthCheckConfig,
  HealthCheckResult,
  RateLimitConfig,
  AuthConfig,
  TokenInfo,
  RegistryConfig,
  RegistryPackage,
} from './server/index.js'

// Errors
export {
  ErrorCode,
  McpError,
  ServerError,
  AuthError,
  ForbiddenError,
  RateLimitError,
  ValidationError,
  toMcpError,
  toolError,
} from './errors/index.js'

// Logging
export { createLogger, isValidLogLevel, LOG_LEVELS } from './logging/index.js'
export type { Logger, LoggerOptions, LogEntry, LogLevel } from './logging/index.js'

// Auth
export {
  buildProtectedResourceMetadata,
  buildWwwAuthenticate,
  extractBearerToken,
  validateBearerToken,
  createJwtValidator,
} from './auth/index.js'
export type { ProtectedResourceMetadata, JwtValidator, JwtValidatorOptions } from './auth/index.js'

// Health
export { buildHealthHandler, buildReadyHandler } from './health/index.js'
export type { HealthResponse, ReadyResponse } from './health/index.js'

// Rate Limiting
export { createRateLimiter } from './rate-limit/index.js'
export type { RateLimiter, RateLimiterOptions, RateLimitResult } from './rate-limit/index.js'

// Registry
export { generateServerJson, generateServerCard } from './registry/index.js'
export type { ServerJson, ServerCard } from './registry/index.js'

// Re-export key SDK types for convenience
export { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
