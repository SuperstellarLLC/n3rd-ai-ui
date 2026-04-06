import { Page, Stack, Row, Box, Text, Heading, Nav, Footer } from '@n3rd-ai/ui'
import { fetchLeaderboard } from '@/lib/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore MCP Servers — n3rd.ai',
  description: 'Browse and compare MCP servers ranked by reputation score.',
}

export default async function ExplorePage() {
  const { servers, total } = await fetchLeaderboard({ limit: 50 })

  return (
    <Page>
      <Nav
        items={[
          { label: 'HOME', href: '/' },
          { label: 'EXPLORE', href: '/explore', active: true },
        ]}
      />

      <Stack gap="lg">
        <Stack gap="sm">
          <Heading level={1}>MCP SERVER LEADERBOARD</Heading>
          <Text color="secondary">{total} servers tracked · ranked by reputation score</Text>
        </Stack>

        {servers.length === 0 ? (
          <Box border="single" padding="lg">
            <Text color="tertiary" style={{ textAlign: 'center' }}>
              No servers yet. Be the first — it takes 90 seconds.
            </Text>
          </Box>
        ) : (
          <Box border="single" padding="sm">
            <Stack gap="none">
              {/* Header */}
              <Row
                justify="between"
                style={{
                  padding: 'var(--n3rd-space-2) var(--n3rd-space-4)',
                  borderBottom: '1px solid var(--n3rd-border-default)',
                }}
              >
                <Text size="xs" color="tertiary" bold style={{ width: 40 }}>
                  #
                </Text>
                <Text size="xs" color="tertiary" bold style={{ flex: 1 }}>
                  SERVER
                </Text>
                <Text size="xs" color="tertiary" bold style={{ width: 60, textAlign: 'right' }}>
                  SCORE
                </Text>
                <Text size="xs" color="tertiary" bold style={{ width: 80, textAlign: 'right' }}>
                  CALLS
                </Text>
                <Text size="xs" color="tertiary" bold style={{ width: 70, textAlign: 'right' }}>
                  UPTIME
                </Text>
              </Row>

              {/* Rows */}
              {servers.map((srv, i) => (
                <a
                  key={srv.id}
                  href={`/@${srv.owner}/${srv.name}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <Row
                    justify="between"
                    style={{
                      padding: 'var(--n3rd-space-2) var(--n3rd-space-4)',
                      borderBottom:
                        i < servers.length - 1 ? '1px dotted var(--n3rd-border-muted)' : 'none',
                    }}
                  >
                    <Text size="sm" color="tertiary" style={{ width: 40 }}>
                      {i + 1}
                    </Text>
                    <Stack gap="none" style={{ flex: 1 }}>
                      <Text size="sm" bold>
                        @{srv.owner}/{srv.name}
                      </Text>
                      {srv.description && (
                        <Text size="xs" color="tertiary">
                          {srv.description.length > 60
                            ? `${srv.description.slice(0, 60)}...`
                            : srv.description}
                        </Text>
                      )}
                    </Stack>
                    <Text
                      size="sm"
                      bold
                      color={
                        srv.score >= 90
                          ? 'success'
                          : srv.score >= 70
                            ? 'accent'
                            : srv.score >= 50
                              ? 'warning'
                              : 'danger'
                      }
                      style={{ width: 60, textAlign: 'right' }}
                    >
                      {srv.score}
                    </Text>
                    <Text size="sm" color="secondary" style={{ width: 80, textAlign: 'right' }}>
                      {srv.calls_total > 0 ? formatCount(srv.calls_total) : '—'}
                    </Text>
                    <Text size="sm" color="secondary" style={{ width: 70, textAlign: 'right' }}>
                      {srv.uptime_pct > 0 ? `${srv.uptime_pct.toFixed(0)}%` : '—'}
                    </Text>
                  </Row>
                </a>
              ))}
            </Stack>
          </Box>
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
