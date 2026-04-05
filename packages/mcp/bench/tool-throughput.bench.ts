/**
 * Benchmark: in-process tool invocation throughput.
 * Compares @n3rd-ai/mcp instrumented server against raw @modelcontextprotocol/sdk.
 *
 * Run: pnpm --filter @n3rd-ai/mcp bench
 */
import { Bench } from 'tinybench'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { z } from 'zod'
import { createServerMetrics } from '../src/metrics/index.js'
import { noopTracer } from '../src/observability/index.js'

async function buildRawClient(): Promise<Client> {
  const server = new McpServer({ name: 'raw', version: '1.0.0' }, { capabilities: { logging: {} } })
  server.registerTool(
    'echo',
    { description: 'echo', inputSchema: { msg: z.string() } },
    (args) => ({ content: [{ type: 'text', text: args.msg }] }),
  )
  const [clientT, serverT] = InMemoryTransport.createLinkedPair()
  await server.connect(serverT)
  const client = new Client({ name: 'bench', version: '1.0.0' })
  await client.connect(clientT)
  return client
}

async function buildInstrumentedClient(): Promise<Client> {
  const server = new McpServer(
    { name: 'instrumented', version: '1.0.0' },
    { capabilities: { logging: {} } },
  )

  // Same instrumentation as createN3rdServer but in-process
  const metrics = createServerMetrics()
  const tracer = noopTracer

  const originalRegisterTool = server.registerTool.bind(server)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(server as any).registerTool = (name: string, config: unknown, cb: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapped = async (...args: any[]) => {
      const span = tracer.startSpan(`mcp.tool/${name}`, { 'mcp.tool.name': name })
      const start = process.hrtime.bigint()
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (cb as any)(...args)
        const duration = Number(process.hrtime.bigint() - start) / 1e9
        metrics.toolCalls.inc({ tool: name })
        metrics.toolDuration.observe(duration, { tool: name })
        span.setStatus({ code: 'OK' })
        return result
      } catch (err) {
        metrics.toolErrors.inc({ tool: name, kind: 'throw' })
        if (err instanceof Error) span.recordException(err)
        throw err
      } finally {
        span.end()
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (originalRegisterTool as any)(name, config, wrapped)
  }

  server.registerTool(
    'echo',
    { description: 'echo', inputSchema: { msg: z.string() } },
    (args) => ({ content: [{ type: 'text', text: args.msg }] }),
  )

  const [clientT, serverT] = InMemoryTransport.createLinkedPair()
  await server.connect(serverT)
  const client = new Client({ name: 'bench', version: '1.0.0' })
  await client.connect(clientT)
  return client
}

async function main(): Promise<void> {
  const rawClient = await buildRawClient()
  const instrClient = await buildInstrumentedClient()

  const bench = new Bench({ time: 2000 })

  bench.add('raw SDK tool call', async () => {
    await rawClient.callTool({ name: 'echo', arguments: { msg: 'hello' } })
  })

  bench.add('@n3rd-ai/mcp instrumented tool call', async () => {
    await instrClient.callTool({ name: 'echo', arguments: { msg: 'hello' } })
  })

  await bench.run()

  console.table(
    bench.tasks.map((t) => ({
      name: t.name,
      'ops/sec': t.result?.hz.toFixed(0),
      'avg (µs)': ((t.result?.mean ?? 0) * 1000).toFixed(2),
      'p99 (µs)': ((t.result?.p99 ?? 0) * 1000).toFixed(2),
      samples: t.result?.samples.length,
    })),
  )

  await rawClient.close()
  await instrClient.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
