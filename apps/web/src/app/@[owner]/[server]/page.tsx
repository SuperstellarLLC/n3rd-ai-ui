import { Page, Stack, Row, Box, Text, Heading, Button, Code, Nav, Footer } from '@n3rd-ai/ui'
import { ReputationBadge } from '@/components/ReputationBadge'
import { fetchServer } from '@/lib/api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ owner: string; server: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, server: name } = await params
  return {
    title: `${owner}/${name} — n3rd.ai`,
    description: `Reputation profile for the ${name} MCP server by ${owner}`,
  }
}

export default async function ProfilePage({ params }: Props) {
  const { owner, server: name } = await params
  const profile = await fetchServer(owner, name)
  if (!profile) notFound()

  const badgeMarkdown = `![n3rd](https://n3rd.ai/@${owner}/${name}/badge.svg)`
  const claimSnippet = `import { attest } from '@n3rd-ai/attest'

// Add to your createN3rdServer config:
observability: { tracer: attest({ apiKey: 'YOUR_KEY' }) }`

  return (
    <Page>
      <Nav
        items={[
          { label: 'HOME', href: '/' },
          { label: 'EXPLORE', href: '/explore' },
        ]}
      />

      <Stack gap="xl">
        {/* HEADER */}
        <Row gap="lg" align="start" wrap>
          <Stack gap="md" style={{ flex: 1 }}>
            <Heading level={1}>
              @{owner}/{name}
            </Heading>
            {profile.description && <Text color="secondary">{profile.description}</Text>}
            {profile.repository_url && (
              <Text size="xs" color="tertiary">
                <a
                  href={profile.repository_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  {profile.repository_url}
                </a>
              </Text>
            )}
          </Stack>
          <ReputationBadge
            server={name}
            score={profile.score}
            uptimePct={profile.uptime_pct || undefined}
            callsPerDay={profile.calls_24h || undefined}
            verified={profile.claimed === 1 || profile.calls_total >= 10}
            size="lg"
          />
        </Row>

        {/* METRICS */}
        <Row gap="md" wrap>
          <Box border="single" title="uptime" padding="md" style={{ flex: 1, minWidth: 120 }}>
            <Text size="xl" bold color="primary">
              {profile.uptime_pct > 0 ? `${profile.uptime_pct.toFixed(1)}%` : '—'}
            </Text>
          </Box>
          <Box border="single" title="error rate" padding="md" style={{ flex: 1, minWidth: 120 }}>
            <Text size="xl" bold color={profile.error_rate > 0.1 ? 'danger' : 'primary'}>
              {profile.calls_total > 0 ? `${(profile.error_rate * 100).toFixed(1)}%` : '—'}
            </Text>
          </Box>
          <Box border="single" title="p95 latency" padding="md" style={{ flex: 1, minWidth: 120 }}>
            <Text size="xl" bold color="primary">
              {profile.p95_ms > 0 ? `${Math.round(profile.p95_ms)}ms` : '—'}
            </Text>
          </Box>
          <Box border="single" title="total calls" padding="md" style={{ flex: 1, minWidth: 120 }}>
            <Text size="xl" bold color="primary">
              {profile.calls_total > 0 ? formatCount(profile.calls_total) : '—'}
            </Text>
          </Box>
        </Row>

        {/* TOOLS */}
        {profile.tools.length > 0 && (
          <Stack gap="md">
            <Heading level={2}>TOOLS ({profile.tools.length})</Heading>
            {profile.tools.map((tool) => (
              <Box key={tool.tool} border="single" padding="sm">
                <Row justify="between" align="center">
                  <Text bold>{tool.tool}</Text>
                  <Row gap="md">
                    <Text size="xs" color="secondary">
                      {tool.calls} calls
                    </Text>
                    <Text
                      size="xs"
                      color={tool.errors / Math.max(tool.calls, 1) > 0.1 ? 'danger' : 'success'}
                    >
                      {((1 - tool.errors / Math.max(tool.calls, 1)) * 100).toFixed(0)}% success
                    </Text>
                    <Text size="xs" color="secondary">
                      avg {tool.avg_ms.toFixed(0)}ms
                    </Text>
                  </Row>
                </Row>
              </Box>
            ))}
          </Stack>
        )}

        {/* BADGE EMBED */}
        <Stack gap="md">
          <Heading level={2}>EMBED THIS BADGE</Heading>
          <Box border="single" padding="md">
            <Code title="README.md">{badgeMarkdown}</Code>
          </Box>
        </Stack>

        {/* CLAIM / CONNECT */}
        {profile.claimed === 0 && (
          <Stack gap="md">
            <Heading level={2}>CLAIM THIS SERVER</Heading>
            <Text color="secondary">
              This profile was generated from public registry data. Connect attestation to enable
              live scoring.
            </Text>
            <Box style={{ maxWidth: 720 }}>
              <Code title="Add to your MCP server">{claimSnippet}</Code>
            </Box>
            <Button href="/try" variant="primary">
              GET API KEY
            </Button>
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

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}
