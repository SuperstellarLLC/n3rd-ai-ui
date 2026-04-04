import type { RegistryConfig } from '../server/types.js'

const SCHEMA_URL = 'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json'

export interface ServerJson {
  $schema: string
  name: string
  title?: string
  description: string
  version: string
  websiteUrl?: string
  repository?: {
    url: string
    source?: string
    subfolder?: string
  }
  packages?: Array<{
    registryType: string
    identifier: string
    version?: string
    transport: { type: string }
    runtimeHint?: string
    environmentVariables?: Array<{
      name: string
      description?: string
      isRequired?: boolean
      isSecret?: boolean
    }>
  }>
}

export function generateServerJson(config: RegistryConfig): ServerJson {
  const serverJson: ServerJson = {
    $schema: SCHEMA_URL,
    name: config.name,
    description: config.description,
    version: config.version,
  }

  if (config.title) serverJson.title = config.title
  if (config.repository) {
    serverJson.repository = {
      url: config.repository.url,
      source: config.repository.source,
      subfolder: config.repository.subfolder,
    }
  }

  if (config.packages) {
    serverJson.packages = config.packages.map((pkg) => ({
      registryType: pkg.registryType,
      identifier: pkg.identifier,
      version: pkg.version,
      transport: { type: pkg.transport.type },
      environmentVariables: pkg.environmentVariables,
    }))
  }

  return serverJson
}

export interface ServerCard {
  $schema: string
  version: string
  protocolVersion: string
  serverInfo: {
    name: string
    version: string
    title?: string
  }
  description?: string
  transport: {
    type: string
    endpoint: string
  }
  capabilities: {
    tools?: { listChanged?: boolean }
    resources?: { subscribe?: boolean; listChanged?: boolean }
    prompts?: { listChanged?: boolean }
    logging?: Record<string, never>
  }
  authentication?: {
    required: boolean
    schemes: string[]
  }
  instructions?: string
  tools?:
    | 'dynamic'
    | Array<{
        name: string
        title?: string
        description?: string
        inputSchema?: Record<string, unknown>
      }>
  resources?: 'dynamic'
  prompts?: 'dynamic'
}

export function generateServerCard(options: {
  name: string
  version: string
  title?: string
  description?: string
  endpoint?: string
  instructions?: string
  capabilities?: ServerCard['capabilities']
  authRequired?: boolean
}): ServerCard {
  return {
    $schema: 'https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json',
    version: '1.0',
    protocolVersion: '2025-06-18',
    serverInfo: {
      name: options.name,
      version: options.version,
      title: options.title,
    },
    description: options.description,
    transport: {
      type: 'streamable-http',
      endpoint: options.endpoint ?? '/mcp',
    },
    capabilities: options.capabilities ?? {
      tools: { listChanged: true },
      logging: {},
    },
    authentication: options.authRequired ? { required: true, schemes: ['bearer'] } : undefined,
    instructions: options.instructions,
    tools: 'dynamic',
    resources: 'dynamic',
    prompts: 'dynamic',
  }
}
