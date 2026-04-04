import { describe, it, expect } from 'vitest'
import { generateServerJson, generateServerCard } from '../src/registry/index.js'

describe('generateServerJson', () => {
  it('generates minimal server.json', () => {
    const json = generateServerJson({
      name: 'io.github.test/my-server',
      description: 'Test MCP server',
      version: '1.0.0',
    })
    expect(json.$schema).toBe(
      'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json',
    )
    expect(json.name).toBe('io.github.test/my-server')
    expect(json.description).toBe('Test MCP server')
    expect(json.version).toBe('1.0.0')
  })

  it('includes title', () => {
    const json = generateServerJson({
      name: 'io.github.test/my-server',
      description: 'Test',
      version: '1.0.0',
      title: 'My Server',
    })
    expect(json.title).toBe('My Server')
  })

  it('includes repository', () => {
    const json = generateServerJson({
      name: 'io.github.test/my-server',
      description: 'Test',
      version: '1.0.0',
      repository: { url: 'https://github.com/test/repo', source: 'github' },
    })
    expect(json.repository?.url).toBe('https://github.com/test/repo')
    expect(json.repository?.source).toBe('github')
  })

  it('includes packages', () => {
    const json = generateServerJson({
      name: 'io.github.test/my-server',
      description: 'Test',
      version: '1.0.0',
      packages: [
        {
          registryType: 'npm',
          identifier: '@test/my-server',
          version: '1.0.0',
          transport: { type: 'stdio' },
          environmentVariables: [
            { name: 'API_KEY', description: 'API key', isRequired: true, isSecret: true },
          ],
        },
      ],
    })
    const pkgs = json.packages
    expect(pkgs).toHaveLength(1)
    expect(pkgs?.[0].registryType).toBe('npm')
    expect(pkgs?.[0].identifier).toBe('@test/my-server')
    expect(pkgs?.[0].environmentVariables).toHaveLength(1)
  })
})

describe('generateServerCard', () => {
  it('generates minimal server card', () => {
    const card = generateServerCard({ name: 'test-server', version: '1.0.0' })
    expect(card.$schema).toContain('mcp-server-card')
    expect(card.version).toBe('1.0')
    expect(card.protocolVersion).toBe('2025-06-18')
    expect(card.serverInfo.name).toBe('test-server')
    expect(card.serverInfo.version).toBe('1.0.0')
    expect(card.transport.type).toBe('streamable-http')
    expect(card.transport.endpoint).toBe('/mcp')
    expect(card.tools).toBe('dynamic')
    expect(card.resources).toBe('dynamic')
    expect(card.prompts).toBe('dynamic')
  })

  it('includes auth when required', () => {
    const card = generateServerCard({
      name: 'test',
      version: '1.0.0',
      authRequired: true,
    })
    expect(card.authentication?.required).toBe(true)
    expect(card.authentication?.schemes).toEqual(['bearer'])
  })

  it('omits auth when not required', () => {
    const card = generateServerCard({ name: 'test', version: '1.0.0' })
    expect(card.authentication).toBeUndefined()
  })

  it('accepts custom endpoint', () => {
    const card = generateServerCard({
      name: 'test',
      version: '1.0.0',
      endpoint: '/api/mcp',
    })
    expect(card.transport.endpoint).toBe('/api/mcp')
  })

  it('accepts custom capabilities', () => {
    const card = generateServerCard({
      name: 'test',
      version: '1.0.0',
      capabilities: {
        tools: { listChanged: true },
        resources: { subscribe: true, listChanged: true },
        prompts: { listChanged: true },
        logging: {},
      },
    })
    expect(card.capabilities.resources?.subscribe).toBe(true)
  })
})
