export interface ProtectedResourceMetadata {
  resource: string
  authorization_servers: string[]
  scopes_supported?: string[]
  bearer_methods_supported: string[]
  resource_name?: string
  resource_documentation?: string
}

export function buildProtectedResourceMetadata(options: {
  resourceUrl: string
  authorizationServers: string[]
  scopesSupported?: string[]
  resourceName?: string
  resourceDocumentation?: string
}): ProtectedResourceMetadata {
  const meta: ProtectedResourceMetadata = {
    resource: options.resourceUrl,
    authorization_servers: options.authorizationServers,
    bearer_methods_supported: ['header'],
  }
  if (options.scopesSupported) meta.scopes_supported = options.scopesSupported
  if (options.resourceName) meta.resource_name = options.resourceName
  if (options.resourceDocumentation) meta.resource_documentation = options.resourceDocumentation
  return meta
}

function escapeHeaderValue(value: string): string {
  return value
    .replace(/[\r\n]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
}

export function buildWwwAuthenticate(options: {
  resourceMetadataUrl: string
  scopes?: string[]
  error?: string
  errorDescription?: string
}): string {
  const params: string[] = []

  params.push(`resource_metadata="${escapeHeaderValue(options.resourceMetadataUrl)}"`)

  if (options.scopes?.length) {
    params.push(`scope="${escapeHeaderValue(options.scopes.join(' '))}"`)
  }

  if (options.error) {
    params.push(`error="${escapeHeaderValue(options.error)}"`)
  }

  if (options.errorDescription) {
    params.push(`error_description="${escapeHeaderValue(options.errorDescription)}"`)
  }

  return `Bearer ${params.join(', ')}`
}
