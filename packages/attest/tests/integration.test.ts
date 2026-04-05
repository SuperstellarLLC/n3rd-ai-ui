/**
 * Integration test: @n3rd-ai/attest plugged into a real @n3rd-ai/mcp server
 * via the observability.tracer hook. Proves the 3-line developer experience.
 */
import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { createN3rdServer } from '@n3rd-ai/mcp'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { attest } from '../src/attest.js'
import type { AttestEvent } from '../src/types.js'

describe('attest + @n3rd-ai/mcp integration', () => {
  it('captures tool invocations as attestation events', async () => {
    const sent: AttestEvent[] = []
    const fetchImpl = vi.fn(async (_url: string, init: RequestInit) => {
      sent.push(...JSON.parse(init.body as string).events)
      return new Response(null, { status: 200 })
    })

    const tracer = attest({
      apiKey: 'test-key',
      batchSize: 1,
      fetch: fetchImpl as unknown as typeof fetch,
      registerExitHandler: false,
    })

    const server = createN3rdServer(
      {
        server: { name: 'integration-test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
        observability: { tracer },
      },
      (mcp) => {
        mcp.registerTool(
          'echo',
          {
            description: 'Echo the input',
            inputSchema: { msg: z.string() },
          },
          (args) => ({
            content: [{ type: 'text', text: args.msg }],
          }),
        )
      },
    )

    await server.start()
    try {
      const addr = server.address()
      expect(addr).not.toBeNull()

      const { StreamableHTTPClientTransport } =
        await import('@modelcontextprotocol/sdk/client/streamableHttp.js')
      if (!addr) throw new Error('server not listening')
      const client = new Client({ name: 'test-client', version: '1.0.0' })
      await client.connect(
        new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${addr.port}/mcp`)),
      )

      await client.callTool({ name: 'echo', arguments: { msg: 'hi' } })
      await client.callTool({ name: 'echo', arguments: { msg: 'there' } })
      await client.close()

      // Flush any pending events
      await tracer.flush()

      expect(sent.length).toBeGreaterThanOrEqual(2)
      const echoEvents = sent.filter((e) => e.tool === 'echo')
      expect(echoEvents.length).toBe(2)
      expect(echoEvents[0].server).toBe('integration-test')
      expect(echoEvents[0].status).toBe('ok')
      expect(echoEvents[0].duration_ms).toBeGreaterThanOrEqual(0)
    } finally {
      await tracer.close()
      await server.stop()
    }
  })

  it('captures tool errors as error-status events', async () => {
    const sent: AttestEvent[] = []
    const tracer = attest({
      apiKey: 'k',
      batchSize: 10,
      flushIntervalMs: 100,
      fetch: (async (_url: string, init: RequestInit) => {
        sent.push(...JSON.parse(init.body as string).events)
        return new Response(null, { status: 200 })
      }) as unknown as typeof fetch,
      registerExitHandler: false,
    })

    const server = createN3rdServer(
      {
        server: { name: 'err-server', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
        observability: { tracer },
      },
      (mcp) => {
        mcp.registerTool('fail', { description: 'fails' }, () => ({
          content: [{ type: 'text', text: 'nope' }],
          isError: true,
        }))
      },
    )

    await server.start()
    try {
      const addr = server.address()
      if (!addr) throw new Error('server not listening')
      const { StreamableHTTPClientTransport } =
        await import('@modelcontextprotocol/sdk/client/streamableHttp.js')
      const client = new Client({ name: 'c', version: '1.0.0' })
      await client.connect(
        new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${addr.port}/mcp`)),
      )
      await client.callTool({ name: 'fail' })
      await client.close()
      await tracer.flush()

      const failEvent = sent.find((e) => e.tool === 'fail')
      expect(failEvent).toBeDefined()
      expect(failEvent?.status).toBe('error')
    } finally {
      await tracer.close()
      await server.stop()
    }
  })
})
