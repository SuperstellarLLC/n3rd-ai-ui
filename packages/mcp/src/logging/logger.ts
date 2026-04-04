export type LogLevel =
  | 'debug'
  | 'info'
  | 'notice'
  | 'warning'
  | 'error'
  | 'critical'
  | 'alert'
  | 'emergency'

const LEVEL_SEVERITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  notice: 2,
  warning: 3,
  error: 4,
  critical: 5,
  alert: 6,
  emergency: 7,
}

export interface LogEntry {
  level: LogLevel
  msg: string
  time: number
  [key: string]: unknown
}

export interface Logger {
  debug(msg: string, data?: Record<string, unknown>): void
  info(msg: string, data?: Record<string, unknown>): void
  notice(msg: string, data?: Record<string, unknown>): void
  warning(msg: string, data?: Record<string, unknown>): void
  error(msg: string, data?: Record<string, unknown>): void
  critical(msg: string, data?: Record<string, unknown>): void
  alert(msg: string, data?: Record<string, unknown>): void
  emergency(msg: string, data?: Record<string, unknown>): void
  child(context: Record<string, unknown>): Logger
  setLevel(level: LogLevel): void
}

export interface LoggerOptions {
  level?: LogLevel
  context?: Record<string, unknown>
  redact?: string[]
  /** Patterns to redact from log message strings (e.g., tokens, keys). */
  redactPatterns?: RegExp[]
  output?: (entry: LogEntry) => void
}

const DEFAULT_REDACT = [
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'apiKey',
  'api_key',
]

function redactValue(obj: unknown, keys: string[]): unknown {
  if (Array.isArray(obj)) {
    return obj.map((item) => redactValue(item, keys))
  }
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (keys.some((k) => key.toLowerCase().includes(k.toLowerCase()))) {
        result[key] = '[REDACTED]'
      } else {
        result[key] = redactValue(value, keys)
      }
    }
    return result
  }
  return obj
}

export function createLogger(options: LoggerOptions = {}): Logger {
  const baseContext = options.context ?? {}
  const redactKeys = [...DEFAULT_REDACT, ...(options.redact ?? [])]
  const redactPatterns = options.redactPatterns ?? []
  const output =
    options.output ??
    ((entry: LogEntry) => {
      const str = JSON.stringify(entry)
      if (LEVEL_SEVERITY[entry.level] >= LEVEL_SEVERITY.error) {
        process.stderr.write(str + '\n')
      } else {
        process.stdout.write(str + '\n')
      }
    })

  // Shared mutable level so children inherit runtime changes
  const state = { currentLevel: options.level ?? 'info' }
  return buildLogger(state, baseContext, redactKeys, redactPatterns, output)
}

function buildLogger(
  state: { currentLevel: LogLevel },
  baseContext: Record<string, unknown>,
  redactKeys: string[],
  redactPatterns: RegExp[],
  output: (entry: LogEntry) => void,
): Logger {
  function shouldLog(level: LogLevel): boolean {
    return LEVEL_SEVERITY[level] >= LEVEL_SEVERITY[state.currentLevel]
  }

  function redactMsg(msg: string): string {
    let result = msg
    for (const pattern of redactPatterns) {
      result = result.replace(pattern, '[REDACTED]')
    }
    return result
  }

  function log(level: LogLevel, msg: string, data?: Record<string, unknown>): void {
    if (!shouldLog(level)) return
    const entry: LogEntry = {
      level,
      msg: redactPatterns.length > 0 ? redactMsg(msg) : msg,
      time: Date.now(),
      ...baseContext,
      ...(data ? (redactValue(data, redactKeys) as Record<string, unknown>) : {}),
    }
    output(entry)
  }

  return {
    debug: (msg, data) => log('debug', msg, data),
    info: (msg, data) => log('info', msg, data),
    notice: (msg, data) => log('notice', msg, data),
    warning: (msg, data) => log('warning', msg, data),
    error: (msg, data) => log('error', msg, data),
    critical: (msg, data) => log('critical', msg, data),
    alert: (msg, data) => log('alert', msg, data),
    emergency: (msg, data) => log('emergency', msg, data),
    setLevel(level: LogLevel) {
      state.currentLevel = level
    },
    child(context: Record<string, unknown>): Logger {
      // Children share the same state object, so setLevel propagates
      return buildLogger(state, { ...baseContext, ...context }, redactKeys, redactPatterns, output)
    },
  }
}

export const LOG_LEVELS: readonly LogLevel[] = [
  'debug',
  'info',
  'notice',
  'warning',
  'error',
  'critical',
  'alert',
  'emergency',
]

export function isValidLogLevel(level: string): level is LogLevel {
  return LOG_LEVELS.includes(level as LogLevel)
}
