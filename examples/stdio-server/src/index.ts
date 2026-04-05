/**
 * Example: minimal MCP server over stdio using @n3rd-ai/mcp.
 *
 * Run: pnpm --filter @n3rd-ai/example-stdio-server start
 * Connect with MCP Inspector: npx @modelcontextprotocol/inspector tsx src/index.ts
 */
import { createN3rdServer } from '@n3rd-ai/mcp'
import { z } from 'zod'

const server = createN3rdServer(
  {
    server: {
      name: 'example-stdio',
      version: '1.0.0',
      description: 'Minimal stdio MCP server example',
    },
    transport: { type: 'stdio' },
    logger: { level: 'info' },
  },
  (mcp, logger) => {
    logger.info('Registering tools')

    mcp.registerTool(
      'greet',
      {
        description: 'Return a greeting for a name',
        inputSchema: { name: z.string() },
      },
      (args) => ({
        content: [{ type: 'text', text: `Hello, ${args.name}!` }],
      }),
    )

    mcp.registerTool(
      'add',
      {
        description: 'Add two numbers',
        inputSchema: { a: z.number(), b: z.number() },
      },
      (args) => ({
        content: [{ type: 'text', text: String(args.a + args.b) }],
      }),
    )
  },
)

await server.start()
