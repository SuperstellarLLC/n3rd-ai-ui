import { Page, Stack, Row, Box, Text, Heading, Logo, Button, Code, Nav, Footer } from '@n3rd-ai/ui'
import { ReputationBadge } from '@/components/ReputationBadge'

const INSTALL_SNIPPET = `import { createN3rdServer } from '@n3rd-ai/mcp'
import { attest } from '@n3rd-ai/attest'

createN3rdServer({
  server: { name: 'weather', version: '1.0.0' },
  transport: { type: 'http' },
  observability: { tracer: attest({ apiKey: process.env.N3RD_KEY! }) },
}, setup)`

const CLI_DEMO = `$ npx n3rd init weather
  ✓ scaffolded weather/ with @n3rd-ai/mcp + attest
$ cd weather && pnpm dev
  ✓ MCP server listening on http://127.0.0.1:3000/mcp
  ✓ first attestation signed and shipped
  → profile: https://n3rd.ai/@you/weather  claim it →`

const BADGE_MARKDOWN = `![n3rd](https://n3rd.ai/@you/weather/badge.svg)`

const CENTER_TEXT = { textAlign: 'center' as const }

export default function Home() {
  return (
    <Page>
      <Nav
        items={[
          { label: 'HOME', href: '/', active: true },
          { label: 'DOCS', href: 'https://github.com/SuperstellarLLC/n3rd-ai', external: true },
          { label: 'EXPLORE', href: '/explore' },
          { label: 'TRY', href: '/try' },
          { label: 'GITHUB', href: 'https://github.com/SuperstellarLLC/n3rd-ai', external: true },
        ]}
      />

      <Stack gap="xl">
        {/* HERO — reputation layer for AI agents */}
        <Stack gap="lg" align="center">
          <Logo text="n3rd.ai" gradient decorated />
          <Heading level={1} style={CENTER_TEXT}>
            THE REPUTATION LAYER FOR AI AGENTS
          </Heading>
          <Text size="lg" color="secondary" style={CENTER_TEXT}>
            Every MCP tool call, signed and scored. One number. Embeddable anywhere.
          </Text>
          <Row gap="md" justify="center">
            <Button href="https://npmjs.com/package/@n3rd-ai/attest" external variant="primary">
              GET STARTED
            </Button>
            <Button href="https://github.com/SuperstellarLLC/n3rd-ai" external variant="ghost">
              VIEW ON GITHUB
            </Button>
          </Row>
        </Stack>

        {/* THE DEMO — terminal showing the 90-second path */}
        <Box border="double" title="npx n3rd init weather" padding="lg">
          <pre
            style={{
              fontFamily: 'inherit',
              margin: 0,
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              color: 'var(--n3rd-text-secondary)',
            }}
          >
            {CLI_DEMO}
          </pre>
        </Box>

        {/* THE BADGE — the viral loop */}
        <Stack gap="lg" align="center">
          <Heading level={2} style={CENTER_TEXT}>
            YOUR SERVER, SCORED
          </Heading>
          <Text size="base" color="secondary" style={CENTER_TEXT}>
            One number. 0–100. Updated live. Embeddable in any README.
          </Text>
          <Row gap="lg" justify="center" wrap>
            <ReputationBadge server="weather" score={94} uptimePct={99.7} callsPerDay={12_500} />
            <ReputationBadge server="github" score={78} uptimePct={98.2} callsPerDay={2_300_000} />
            <ReputationBadge
              server="demo"
              score={42}
              uptimePct={91.4}
              callsPerDay={120}
              verified={false}
            />
          </Row>
          <Box border="single" padding="sm">
            <Stack gap="sm">
              <Text size="xs" color="tertiary">
                paste into your README:
              </Text>
              <Text size="sm" color="primary">
                {BADGE_MARKDOWN}
              </Text>
            </Stack>
          </Box>
        </Stack>

        {/* THE INSTALL — three lines */}
        <Stack gap="md" align="center">
          <Heading level={2} style={CENTER_TEXT}>
            THREE LINES. ZERO CONFIG.
          </Heading>
          <Text size="base" color="secondary" style={CENTER_TEXT}>
            Drop @n3rd-ai/attest into any MCP server. Your reputation starts on the next tool call.
          </Text>
          <Box style={{ width: '100%', maxWidth: 720 }}>
            <Code title="server.ts">{INSTALL_SNIPPET}</Code>
          </Box>
        </Stack>

        {/* WHY TRUST IT */}
        <Stack gap="md">
          <Heading level={2} style={CENTER_TEXT}>
            WHY TRUST IT
          </Heading>
          <Row gap="md" wrap justify="center">
            <Box border="single" title="signed" padding="md" style={{ flex: 1, minWidth: 240 }}>
              <Text color="secondary">
                Every event is HMAC-SHA256 signed with your private key. Tamper-evident. Verifiable.
              </Text>
            </Box>
            <Box border="single" title="tiny" padding="md" style={{ flex: 1, minWidth: 240 }}>
              <Text color="secondary">
                1.38 KB gzipped. Zero runtime deps beyond @n3rd-ai/mcp. Your bundle does not notice.
              </Text>
            </Box>
            <Box
              border="single"
              title="non-blocking"
              padding="md"
              style={{ flex: 1, minWidth: 240 }}
            >
              <Text color="secondary">
                Events batch in memory and ship async. Delivery failures are silent. Your server
                never waits.
              </Text>
            </Box>
            <Box border="single" title="open" padding="md" style={{ flex: 1, minWidth: 240 }}>
              <Text color="secondary">
                MIT licensed. Auditable code. Runs in your process, not ours. You own the keys.
              </Text>
            </Box>
          </Row>
        </Stack>

        {/* CTA */}
        <Stack gap="md" align="center">
          <Heading level={2} style={CENTER_TEXT}>
            READY IN 90 SECONDS
          </Heading>
          <Text size="base" color="secondary" style={CENTER_TEXT}>
            Waiting for your first tool call is the only onboarding step.
          </Text>
          <Row gap="md" justify="center">
            <Button href="https://npmjs.com/package/@n3rd-ai/attest" external variant="primary">
              NPM INSTALL @N3RD-AI/ATTEST
            </Button>
          </Row>
        </Stack>
      </Stack>

      <Footer
        tagline="the reputation layer for ai agents"
        branding="n3rd.ai · built by superstellar"
        links={[
          { label: 'github', href: 'https://github.com/SuperstellarLLC/n3rd-ai', external: true },
          { label: 'npm', href: 'https://npmjs.com/package/@n3rd-ai/attest', external: true },
          {
            label: 'security',
            href: 'https://github.com/SuperstellarLLC/n3rd-ai/security',
            external: true,
          },
        ]}
      />
    </Page>
  )
}
