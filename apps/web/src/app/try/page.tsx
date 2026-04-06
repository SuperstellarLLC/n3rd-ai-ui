'use client'

import { useState } from 'react'
import { Page, Stack, Box, Text, Heading, Button, Code, Nav, Footer } from '@n3rd-ai/ui'
import type { KeyResponse } from '@/lib/api'

const API_BASE = process.env.NEXT_PUBLIC_N3RD_API_URL ?? 'http://127.0.0.1:4001'

export default function TryPage() {
  const [owner, setOwner] = useState('')
  const [name, setName] = useState('')
  const [result, setResult] = useState<KeyResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!owner.trim() || !name.trim()) {
      setError('Both fields are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/v1/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner: owner.trim(), name: name.trim() }),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(body.error ?? 'Request failed')
        return
      }
      setResult(await res.json())
    } catch {
      setError('Cannot reach the API. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const snippet = result
    ? `import { createN3rdServer } from '@n3rd-ai/mcp'
import { attest } from '@n3rd-ai/attest'

const server = createN3rdServer({
  server: { name: '${name}', version: '1.0.0' },
  transport: { type: 'http' },
  observability: {
    tracer: attest({ apiKey: '${result.apiKey}' }),
  },
}, (mcp) => {
  // register your tools
})

await server.start()`
    : ''

  return (
    <Page>
      <Nav
        items={[
          { label: 'HOME', href: '/' },
          { label: 'EXPLORE', href: '/explore' },
          { label: 'TRY', href: '/try', active: true },
        ]}
      />

      <Stack gap="xl">
        <Stack gap="md" align="center">
          <Heading level={1} style={{ textAlign: 'center' }}>
            TRY IT NOW
          </Heading>
          <Text color="secondary" style={{ textAlign: 'center' }}>
            No signup. No email. Get an API key in 10 seconds.
          </Text>
        </Stack>

        {!result ? (
          <Box
            border="double"
            title="enter your server details"
            padding="lg"
            style={{ maxWidth: 500, margin: '0 auto', width: '100%' }}
          >
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <Stack gap="sm">
                  <Text size="xs" color="tertiary">
                    OWNER (your npm scope or GitHub username)
                  </Text>
                  <input
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="alice"
                    style={{
                      fontFamily: 'inherit',
                      fontSize: 'var(--n3rd-text-base)',
                      background: 'var(--n3rd-bg-secondary)',
                      border: '1px solid var(--n3rd-border-default)',
                      color: 'var(--n3rd-text-primary)',
                      padding: 'var(--n3rd-space-2) var(--n3rd-space-4)',
                      width: '100%',
                    }}
                  />
                </Stack>
                <Stack gap="sm">
                  <Text size="xs" color="tertiary">
                    SERVER NAME
                  </Text>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="weather"
                    style={{
                      fontFamily: 'inherit',
                      fontSize: 'var(--n3rd-text-base)',
                      background: 'var(--n3rd-bg-secondary)',
                      border: '1px solid var(--n3rd-border-default)',
                      color: 'var(--n3rd-text-primary)',
                      padding: 'var(--n3rd-space-2) var(--n3rd-space-4)',
                      width: '100%',
                    }}
                  />
                </Stack>
                {error && (
                  <Text color="danger" size="sm">
                    {error}
                  </Text>
                )}
                <Button variant="primary" disabled={loading}>
                  {loading ? 'GENERATING...' : 'GET API KEY'}
                </Button>
              </Stack>
            </form>
          </Box>
        ) : (
          <Stack gap="lg" align="center">
            <Box
              border="double"
              title="your API key (save it — shown once)"
              padding="lg"
              style={{ maxWidth: 600, width: '100%' }}
            >
              <Text size="lg" bold color="accent" style={{ wordBreak: 'break-all' }}>
                {result.apiKey}
              </Text>
              <Text size="xs" color="tertiary">
                Expires in {result.expiresIn}. Create an account to get a permanent key.
              </Text>
            </Box>

            <Box style={{ maxWidth: 720, width: '100%' }}>
              <Code title="paste into your server">{snippet}</Code>
            </Box>

            <Stack gap="sm" align="center">
              <Text color="secondary" style={{ textAlign: 'center' }}>
                Run a tool call, then check your profile:
              </Text>
              <Button href={`/@${owner}/${name}`} variant="primary">
                VIEW PROFILE →
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>

      <Footer
        tagline="the reputation layer for ai agents"
        branding="n3rd.ai"
        links={[
          { label: 'github', href: 'https://github.com/SuperstellarLLC/n3rd-ai', external: true },
        ]}
      />
    </Page>
  )
}
