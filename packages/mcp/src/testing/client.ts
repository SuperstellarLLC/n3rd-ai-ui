import type { N3rdServerOptions } from '../server/types.js'
import type { Logger } from '../logging/index.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'

export interface TestClient {
  callTool(name: string, args?: Record<string, unknown>): Promise<TestToolResult>
  readResource(uri: string): Promise<TestResourceResult>
  getPrompt(name: string, args?: Record<string, string>): Promise<TestPromptResult>
  listTools(): Promise<Array<{ name: string; description?: string }>>
  listResources(): Promise<Array<{ uri: string; name: string }>>
  listPrompts(): Promise<Array<{ name: string; description?: string }>>
  close(): Promise<void>
}

export interface TestToolResult {
  content: Array<{ type: string; text?: string; [key: string]: unknown }>
  isError?: boolean
  structuredContent?: Record<string, unknown>
}

export interface TestResourceResult {
  contents: Array<{ uri: string; text?: string; blob?: string; mimeType?: string }>
}

export interface TestPromptResult {
  description?: string
  messages: Array<{
    role: string
    content: { type: string; text?: string; [key: string]: unknown }
  }>
}

export async function createTestClient(
  setup: (mcp: McpServer, logger: Logger) => void | Promise<void>,
  options?: Partial<N3rdServerOptions>,
): Promise<TestClient> {
  const serverInfo = options?.server ?? { name: 'test-server', version: '0.0.0' }

  const mcp = new McpServer(
    { name: serverInfo.name, version: serverInfo.version },
    { capabilities: { logging: {} } },
  )

  const noopLogger: Logger = {
    debug: () => {},
    info: () => {},
    notice: () => {},
    warning: () => {},
    error: () => {},
    critical: () => {},
    alert: () => {},
    emergency: () => {},
    child: () => noopLogger,
    setLevel: () => {},
  }

  await setup(mcp, noopLogger)

  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()

  const client = new Client({ name: 'test-client', version: '0.0.0' })

  await mcp.connect(serverTransport)
  await client.connect(clientTransport)

  return {
    async callTool(name: string, args?: Record<string, unknown>): Promise<TestToolResult> {
      const result = await client.callTool({ name, arguments: args })
      return result as TestToolResult
    },

    async readResource(uri: string): Promise<TestResourceResult> {
      const result = await client.readResource({ uri })
      return result as TestResourceResult
    },

    async getPrompt(name: string, args?: Record<string, string>): Promise<TestPromptResult> {
      const result = await client.getPrompt({ name, arguments: args })
      return result as TestPromptResult
    },

    async listTools(): Promise<Array<{ name: string; description?: string }>> {
      const result = await client.listTools()
      return result.tools
    },

    async listResources(): Promise<Array<{ uri: string; name: string }>> {
      const result = await client.listResources()
      return result.resources
    },

    async listPrompts(): Promise<Array<{ name: string; description?: string }>> {
      const result = await client.listPrompts()
      return result.prompts
    },

    async close(): Promise<void> {
      await client.close()
      await mcp.close()
    },
  }
}
