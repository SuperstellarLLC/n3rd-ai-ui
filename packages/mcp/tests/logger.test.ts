import { describe, it, expect, vi } from 'vitest'
import { createLogger, isValidLogLevel, LOG_LEVELS } from '../src/logging/index.js'
import type { LogEntry } from '../src/logging/index.js'

describe('createLogger', () => {
  it('logs at info level by default', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ output: (e) => entries.push(e) })

    logger.debug('hidden')
    logger.info('visible')

    expect(entries).toHaveLength(1)
    expect(entries[0].level).toBe('info')
    expect(entries[0].msg).toBe('visible')
  })

  it('includes timestamp', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ output: (e) => entries.push(e) })
    logger.info('test')
    expect(entries[0].time).toBeGreaterThan(0)
  })

  it('respects configured level', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ level: 'error', output: (e) => entries.push(e) })

    logger.info('hidden')
    logger.warning('hidden')
    logger.error('visible')

    expect(entries).toHaveLength(1)
    expect(entries[0].level).toBe('error')
  })

  it('supports all 8 syslog levels', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ level: 'debug', output: (e) => entries.push(e) })

    logger.debug('d')
    logger.info('i')
    logger.notice('n')
    logger.warning('w')
    logger.error('e')
    logger.critical('c')
    logger.alert('a')
    logger.emergency('em')

    expect(entries).toHaveLength(8)
    expect(entries.map((e) => e.level)).toEqual([
      'debug',
      'info',
      'notice',
      'warning',
      'error',
      'critical',
      'alert',
      'emergency',
    ])
  })

  it('merges context into entries', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ context: { server: 'test' }, output: (e) => entries.push(e) })
    logger.info('msg')
    expect(entries[0].server).toBe('test')
  })

  it('merges data into entries', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ output: (e) => entries.push(e) })
    logger.info('msg', { tool: 'search', duration_ms: 42 })
    expect(entries[0].tool).toBe('search')
    expect(entries[0].duration_ms).toBe(42)
  })

  it('redacts sensitive fields', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ output: (e) => entries.push(e) })
    logger.info('msg', { password: 'secret123', name: 'public' })
    expect(entries[0].password).toBe('[REDACTED]')
    expect(entries[0].name).toBe('public')
  })

  it('redacts nested sensitive fields', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ output: (e) => entries.push(e) })
    logger.info('msg', { config: { apiKey: 'key123', host: 'localhost' } })
    const config = entries[0].config as Record<string, unknown>
    expect(config.apiKey).toBe('[REDACTED]')
    expect(config.host).toBe('localhost')
  })

  it('redacts sensitive fields inside arrays', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ output: (e) => entries.push(e) })
    logger.info('msg', { items: [{ password: 'secret', name: 'ok' }] })
    const items = entries[0].items as Array<Record<string, unknown>>
    expect(items[0].password).toBe('[REDACTED]')
    expect(items[0].name).toBe('ok')
  })

  it('supports custom redact keys', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ redact: ['ssn'], output: (e) => entries.push(e) })
    logger.info('msg', { ssn: '123-45-6789' })
    expect(entries[0].ssn).toBe('[REDACTED]')
  })

  it('setLevel changes minimum log level', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ output: (e) => entries.push(e) })

    logger.setLevel('error')
    logger.info('hidden')
    logger.error('visible')

    expect(entries).toHaveLength(1)
    expect(entries[0].level).toBe('error')
  })

  it('child logger inherits context', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ context: { server: 'test' }, output: (e) => entries.push(e) })
    const child = logger.child({ reqId: 'abc' })

    child.info('msg')

    expect(entries[0].server).toBe('test')
    expect(entries[0].reqId).toBe('abc')
  })

  it('child logger inherits level', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ level: 'error', output: (e) => entries.push(e) })
    const child = logger.child({ reqId: 'abc' })

    child.info('hidden')
    child.error('visible')

    expect(entries).toHaveLength(1)
  })

  it('child logger sees parent setLevel changes', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({ level: 'error', output: (e) => entries.push(e) })
    const child = logger.child({ reqId: 'abc' })

    child.debug('hidden')
    expect(entries).toHaveLength(0)

    logger.setLevel('debug')
    child.debug('now visible')
    expect(entries).toHaveLength(1)
    expect(entries[0].msg).toBe('now visible')
  })

  it('redacts patterns from message strings', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({
      redactPatterns: [/Bearer\s+\S+/g, /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g],
      output: (e) => entries.push(e),
    })
    logger.info('Token is Bearer abc123xyz')
    expect(entries[0].msg).toBe('Token is [REDACTED]')
    expect(entries[0].msg).not.toContain('abc123xyz')
  })

  it('child logger inherits redactPatterns', () => {
    const entries: LogEntry[] = []
    const logger = createLogger({
      redactPatterns: [/secret-\w+/g],
      output: (e) => entries.push(e),
    })
    const child = logger.child({ reqId: '1' })
    child.info('Found secret-abc123 in logs')
    expect(entries[0].msg).toBe('Found [REDACTED] in logs')
  })

  it('writes to stdout for non-error levels by default', () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    const logger = createLogger()
    logger.info('test')
    expect(writeSpy).toHaveBeenCalledOnce()
    writeSpy.mockRestore()
  })

  it('writes to stderr for error levels by default', () => {
    const writeSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
    const logger = createLogger()
    logger.error('test')
    expect(writeSpy).toHaveBeenCalledOnce()
    writeSpy.mockRestore()
  })
})

describe('isValidLogLevel', () => {
  it('returns true for valid levels', () => {
    for (const level of LOG_LEVELS) {
      expect(isValidLogLevel(level)).toBe(true)
    }
  })

  it('returns false for invalid levels', () => {
    expect(isValidLogLevel('trace')).toBe(false)
    expect(isValidLogLevel('fatal')).toBe(false)
    expect(isValidLogLevel('')).toBe(false)
  })
})

describe('LOG_LEVELS', () => {
  it('contains all 8 syslog levels in order', () => {
    expect(LOG_LEVELS).toEqual([
      'debug',
      'info',
      'notice',
      'warning',
      'error',
      'critical',
      'alert',
      'emergency',
    ])
  })
})
