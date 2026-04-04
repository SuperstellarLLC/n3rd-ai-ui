import { describe, it, expect, afterEach } from 'vitest'
import { z } from 'zod'
import {
  createTestClient,
  assertToolSuccess,
  assertToolError,
  assertToolText,
  assertToolErrorText,
  assertResourceText,
  assertPromptMessages,
  assertPromptContains,
} from '../src/testing/index.js'
import type { TestClient } from '../src/testing/index.js'
import { toolError } from '../src/errors/index.js'

let client: TestClient | undefined

afterEach(async () => {
  if (client) {
    await client.close()
    client = undefined
  }
})

describe('createTestClient', () => {
  it('registers and calls a tool', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerTool(
        'greet',
        {
          description: 'Greet someone',
          inputSchema: { name: z.string() },
        },
        (args) => ({
          content: [{ type: 'text', text: `Hello, ${args.name}!` }],
        }),
      )
    })

    const result = await client.callTool('greet', { name: 'World' })
    expect(result.content[0].text).toBe('Hello, World!')
  })

  it('lists tools', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerTool('tool_a', { description: 'First tool' }, () => ({
        content: [{ type: 'text', text: 'a' }],
      }))
      mcp.registerTool('tool_b', { description: 'Second tool' }, () => ({
        content: [{ type: 'text', text: 'b' }],
      }))
    })

    const tools = await client.listTools()
    expect(tools).toHaveLength(2)
    expect(tools.map((t) => t.name).sort()).toEqual(['tool_a', 'tool_b'])
  })

  it('registers and reads a resource', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerResource('config', 'config://app', { description: 'App config' }, () => ({
        contents: [{ uri: 'config://app', text: '{"debug": true}' }],
      }))
    })

    const result = await client.readResource('config://app')
    expect(result.contents[0].text).toBe('{"debug": true}')
  })

  it('lists resources', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerResource('r1', 'res://one', { description: 'One' }, () => ({
        contents: [{ uri: 'res://one', text: 'one' }],
      }))
    })

    const resources = await client.listResources()
    expect(resources).toHaveLength(1)
    expect(resources[0].name).toBe('r1')
  })

  it('registers and calls a prompt', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerPrompt(
        'summarize',
        {
          description: 'Summarize text',
          argsSchema: { text: z.string() },
        },
        (args) => ({
          messages: [{ role: 'user', content: { type: 'text', text: `Summarize: ${args.text}` } }],
        }),
      )
    })

    const result = await client.getPrompt('summarize', { text: 'Hello world' })
    expect(result.messages).toHaveLength(1)
  })

  it('lists prompts', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerPrompt('p1', { description: 'Prompt one' }, () => ({
        messages: [{ role: 'user', content: { type: 'text', text: 'hi' } }],
      }))
    })

    const prompts = await client.listPrompts()
    expect(prompts).toHaveLength(1)
    expect(prompts[0].name).toBe('p1')
  })
})

describe('assertions', () => {
  it('assertToolSuccess passes for success', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerTool('ok', { description: 'ok' }, () => ({
        content: [{ type: 'text', text: 'fine' }],
      }))
    })
    const result = await client.callTool('ok')
    assertToolSuccess(result)
  })

  it('assertToolSuccess throws for error', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerTool('fail', { description: 'fail' }, () => toolError('bad'))
    })
    const result = await client.callTool('fail')
    expect(() => assertToolSuccess(result)).toThrow('Expected tool success')
  })

  it('assertToolError passes for error', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerTool('fail', { description: 'fail' }, () => toolError('bad'))
    })
    const result = await client.callTool('fail')
    assertToolError(result)
  })

  it('assertToolError throws for success', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerTool('ok', { description: 'ok' }, () => ({
        content: [{ type: 'text', text: 'fine' }],
      }))
    })
    const result = await client.callTool('ok')
    expect(() => assertToolError(result)).toThrow('Expected tool error')
  })

  it('assertToolText matches exact string', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerTool('echo', { description: 'echo' }, () => ({
        content: [{ type: 'text', text: 'hello' }],
      }))
    })
    const result = await client.callTool('echo')
    assertToolText(result, 'hello')
  })

  it('assertToolText matches regex', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerTool('echo', { description: 'echo' }, () => ({
        content: [{ type: 'text', text: 'hello world 42' }],
      }))
    })
    const result = await client.callTool('echo')
    assertToolText(result, /world \d+/)
  })

  it('assertToolErrorText matches error text', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerTool('fail', { description: 'fail' }, () => toolError('specific error'))
    })
    const result = await client.callTool('fail')
    assertToolErrorText(result, 'specific error')
  })

  it('assertResourceText matches text', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerResource('r', 'res://test', { description: 'test' }, () => ({
        contents: [{ uri: 'res://test', text: 'data here' }],
      }))
    })
    const result = await client.readResource('res://test')
    assertResourceText(result, 'data here')
  })

  it('assertPromptMessages checks count', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerPrompt('p', { description: 'test' }, () => ({
        messages: [
          { role: 'user', content: { type: 'text', text: 'a' } },
          { role: 'assistant', content: { type: 'text', text: 'b' } },
        ],
      }))
    })
    const result = await client.getPrompt('p')
    assertPromptMessages(result, 2)
  })

  it('assertPromptContains checks text inclusion', async () => {
    client = await createTestClient((mcp) => {
      mcp.registerPrompt('p', { description: 'test' }, () => ({
        messages: [{ role: 'user', content: { type: 'text', text: 'Hello Claude' } }],
      }))
    })
    const result = await client.getPrompt('p')
    assertPromptContains(result, 'Claude')
  })
})
