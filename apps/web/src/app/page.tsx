import {
  Page,
  Stack,
  Row,
  Grid,
  Box,
  Text,
  Heading,
  Logo,
  Badge,
  Metric,
  Button,
  Code,
  Table,
  List,
  Divider,
  Footer,
  Nav,
  Typewriter,
  StatusLine,
  Progress,
  Tabs,
  Card,
  Tag,
  Accordion,
  Tooltip,
} from '@n3rd-ai/ui'
import ThemeSwitcher from './theme-switcher'

export default function Home() {
  return (
    <Page>
      <Nav
        items={[
          { label: 'HOME', href: '/', active: true },
          {
            label: 'DOCS',
            href: 'https://github.com/SuperstellarLLC/n3rd-ai-ui',
            external: true,
          },
          { label: 'NPM', href: 'https://npmjs.com/package/@n3rd-ai/ui', external: true },
          {
            label: 'GITHUB',
            href: 'https://github.com/SuperstellarLLC/n3rd-ai-ui',
            external: true,
          },
        ]}
      />

      <Stack gap="xl">
        {/* Hero */}
        <Stack gap="lg" align="center">
          <Logo text="n3rd.ai" gradient decorated />

          <Heading level={1} gradient>
            Terminal UI for the AI era
          </Heading>

          <Text size="lg" color="secondary">
            Your product is an API. This gives it a face.
          </Text>

          <Text color="tertiary">
            0 images. 0 icon fonts. 0 design decisions. Import. Wrap. Ship.
          </Text>

          <Row gap="sm" justify="center" wrap>
            <Tag accent="primary">terminal</Tag>
            <Tag accent="info">ascii</Tag>
            <Tag accent="danger">nextjs</Tag>
            <Tag accent="success">react</Tag>
            <Tag accent="warning">mcp</Tag>
          </Row>

          <Row gap="md" justify="center">
            <Button variant="primary" href="https://npmjs.com/package/@n3rd-ai/ui" external>
              INSTALL
            </Button>
            <Button
              variant="secondary"
              href="https://github.com/SuperstellarLLC/n3rd-ai-ui"
              external
            >
              SOURCE
            </Button>
          </Row>

          <Code title="quickstart" prompt="$">
            npm install @n3rd-ai/ui
          </Code>
        </Stack>

        {/* AI prompt */}
        <Box border="dashed" padding="md" accent="info">
          <Stack gap="sm">
            <Text size="sm" color="info" bold>
              PASTE THIS INTO CLAUDE CODE, CODEX, CURSOR, OR ANY AI AGENT:
            </Text>
            <Code prompt=">">{`Create a landing page for my project using the @n3rd-ai/ui npm package (latest version). It's a terminal-first UI framework for Next.js — ASCII everything, zero images, pure text. Use the unicorn theme. Import components from '@n3rd-ai/ui' (Box, Stack, Row, Grid, Text, Heading, Logo, Badge, Metric, Button, Code, Table, List, Divider, Footer, Nav, Tabs, Card, Tag, Accordion, Tooltip, Typewriter, StatusLine, Progress). Import '@n3rd-ai/ui/theme/unicorn.css' and '@n3rd-ai/ui/theme/fonts.css' in your layout. Wrap the app in <N3rdProvider>. Check the npm package README for API details.`}</Code>
          </Stack>
        </Box>

        <Divider variant="double" label="STATS" />

        <Row gap="lg" justify="center" wrap>
          <Metric value="0kb" label="JS (server components)" accent="success" />
          <Metric value="~3kb" label="client bundle (gzip)" accent="info" />
          <Metric value="4" label="theme presets" accent="primary" />
          <Metric value="30+" label="components" />
        </Row>

        <Divider variant="double" label="SETUP" />

        <Code title="app/layout.tsx" showLineNumbers>
          {[
            "import { N3rdProvider } from '@n3rd-ai/ui'",
            "import '@n3rd-ai/ui/theme/unicorn.css'",
            "import '@n3rd-ai/ui/theme/fonts.css'",
            '',
            'export default function RootLayout({ children }) {',
            '  return (',
            '    <html lang="en">',
            '      <body>',
            '        <N3rdProvider>{children}</N3rdProvider>',
            '      </body>',
            '    </html>',
            '  )',
            '}',
          ].join('\n')}
        </Code>

        <Divider variant="double" label="COMPONENTS" />

        {/* Component demos */}
        <Grid columns={2} gap="lg">
          <Stack gap="sm">
            <Text size="sm" color="tertiary" bold>
              BOX
            </Text>
            <Box border="rounded" padding="md" accent="success">
              <Text>All systems operational.</Text>
            </Box>
          </Stack>

          <Stack gap="sm">
            <Text size="sm" color="tertiary" bold>
              BADGE
            </Text>
            <Row gap="sm" wrap>
              <Badge variant="success">DEPLOYED</Badge>
              <Badge variant="warning">BUILDING</Badge>
              <Badge variant="danger">FAILED</Badge>
              <Badge variant="info">QUEUED</Badge>
            </Row>
          </Stack>

          <Stack gap="sm">
            <Text size="sm" color="tertiary" bold>
              PROGRESS
            </Text>
            <Progress value={87} accent="success" showLabel />
            <Progress value={42} accent="warning" showLabel />
            <Progress value={12} accent="danger" showLabel />
          </Stack>

          <Stack gap="sm">
            <Text size="sm" color="tertiary" bold>
              TYPEWRITER
            </Text>
            <Typewriter text="Deploying to production..." speed={50} cursor="block" />
          </Stack>
        </Grid>

        {/* New components showcase */}
        <Grid columns={3} gap="lg">
          <Card title="Accordion" subtitle="Collapsible sections" accent="primary">
            <Text size="sm" color="secondary">
              Expand/collapse content with keyboard support and multi-open mode.
            </Text>
          </Card>
          <Card title="Tabs" subtitle="Content switcher" accent="info">
            <Text size="sm" color="secondary">
              Switch between views. Accent colors, keyboard navigation built in.
            </Text>
          </Card>
          <Card title="Tooltip" subtitle="Hover context" accent="success">
            <Tooltip content="See? No JS required.">
              <Text size="sm" color="secondary">
                Pure CSS tooltips. Top or bottom positioning. Hover me.
              </Text>
            </Tooltip>
          </Card>
        </Grid>

        {/* Tabs for theme showcase */}
        <Divider variant="double" label="THEMES" />

        <ThemeSwitcher />

        <Tabs
          accent="primary"
          tabs={[
            {
              label: 'unicorn',
              content: (
                <Stack gap="sm">
                  <Text color="accent" bold>
                    violet &rarr; pink &rarr; cyan
                  </Text>
                  <Text size="sm" color="secondary">
                    The default theme. Gradient accents across the violet-pink-cyan spectrum.
                  </Text>
                  <Code prompt="$">{"import '@n3rd-ai/ui/theme/unicorn.css'"}</Code>
                </Stack>
              ),
            },
            {
              label: 'classic',
              content: (
                <Stack gap="sm">
                  <Text color="success" bold>
                    green on black
                  </Text>
                  <Text size="sm" color="secondary">
                    The terminal classic. Green phosphor on black CRT.
                  </Text>
                  <Code prompt="$">{"import '@n3rd-ai/ui/theme/classic.css'"}</Code>
                </Stack>
              ),
            },
            {
              label: 'retro',
              content: (
                <Stack gap="sm">
                  <Text color="warning" bold>
                    amber on black
                  </Text>
                  <Text size="sm" color="secondary">
                    Warm amber tones. The feel of vintage computing.
                  </Text>
                  <Code prompt="$">{"import '@n3rd-ai/ui/theme/retro.css'"}</Code>
                </Stack>
              ),
            },
            {
              label: 'paper',
              content: (
                <Stack gap="sm">
                  <Text bold>black on white</Text>
                  <Text size="sm" color="secondary">
                    Light mode. High contrast, easy on the eyes in bright environments.
                  </Text>
                  <Code prompt="$">{"import '@n3rd-ai/ui/theme/paper.css'"}</Code>
                </Stack>
              ),
            },
          ]}
        />

        {/* Component table */}
        <Table
          columns={['component', 'category', 'js bundle', 'status']}
          rows={[
            [
              'Box / Stack / Row / Grid',
              'Layout',
              { text: '0kb (RSC)', accent: 'success' },
              { text: 'STABLE', accent: 'success' },
            ],
            [
              'Text / Heading / Badge',
              'Display',
              { text: '0kb (RSC)', accent: 'success' },
              { text: 'STABLE', accent: 'success' },
            ],
            [
              'Metric / Table / Code',
              'Display',
              { text: '0kb (RSC)', accent: 'success' },
              { text: 'STABLE', accent: 'success' },
            ],
            [
              'Card / Tag / List',
              'Display',
              { text: '0kb (RSC)', accent: 'success' },
              { text: 'NEW', accent: 'info' },
            ],
            [
              'Button / Input',
              'Interactive',
              { text: '~2kb', accent: 'info' },
              { text: 'STABLE', accent: 'success' },
            ],
            [
              'Tabs / Accordion / Tooltip',
              'Interactive',
              { text: '~2kb', accent: 'info' },
              { text: 'NEW', accent: 'info' },
            ],
            [
              'Toast / Alert / Progress',
              'Feedback',
              { text: '~1kb', accent: 'info' },
              { text: 'STABLE', accent: 'success' },
            ],
            [
              'Nav / Logo / Footer',
              'Chrome',
              { text: '~1kb', accent: 'info' },
              { text: 'STABLE', accent: 'success' },
            ],
            [
              'Typewriter / Scanline',
              'Effects',
              { text: '~1kb', accent: 'info' },
              { text: 'STABLE', accent: 'success' },
            ],
          ]}
        />

        <Divider variant="double" label="FEATURES" />

        <Grid columns={2} gap="lg">
          <List
            bullet=">"
            items={[
              <Text key="1">
                <Text bold color="accent">
                  Server Components first
                </Text>{' '}
                &mdash; layout components ship 0kb JS
              </Text>,
              <Text key="2">
                <Text bold color="accent">
                  ASCII borders
                </Text>{' '}
                &mdash; single, double, rounded, dashed
              </Text>,
              <Text key="3">
                <Text bold color="accent">
                  Token-based theming
                </Text>{' '}
                &mdash; CSS custom properties, override anything
              </Text>,
              <Text key="4">
                <Text bold color="accent">
                  4 presets
                </Text>{' '}
                &mdash; unicorn, classic, retro, paper
              </Text>,
            ]}
          />
          <List
            bullet=">"
            items={[
              <Text key="5">
                <Text bold color="accent">
                  Tiny bundle
                </Text>{' '}
                &mdash; client components ~3-5kb gzipped total
              </Text>,
              <Text key="6">
                <Text bold color="accent">
                  Monospace native
                </Text>{' '}
                &mdash; JetBrains Mono, pixel-perfect alignment
              </Text>,
              <Text key="7">
                <Text bold color="accent">
                  Hooks included
                </Text>{' '}
                &mdash; useTypewriter, useKeyboard, useToast
              </Text>,
              <Text key="8">
                <Text bold color="accent">
                  MCP ready
                </Text>{' '}
                &mdash; built for AI-native applications
              </Text>,
            ]}
          />
        </Grid>

        {/* FAQ */}
        <Divider variant="double" label="FAQ" />

        <Accordion
          items={[
            {
              title: 'How do I install?',
              content: <Code prompt="$">npm install @n3rd-ai/ui</Code>,
            },
            {
              title: 'Does it work with Next.js App Router?',
              content: (
                <Text color="secondary">
                  Yes. Layout components are Server Components (0kb JS). Interactive components
                  include &apos;use client&apos; directives automatically.
                </Text>
              ),
            },
            {
              title: 'Can I customize the theme?',
              content: (
                <Text color="secondary">
                  Everything is CSS custom properties. Override any --n3rd-* token in your own CSS,
                  or use one of the 4 built-in presets.
                </Text>
              ),
            },
            {
              title: 'What about bundle size?',
              content: (
                <Text color="secondary">
                  Server components ship 0kb JS. Client components total ~3-5kb gzipped. Theme CSS
                  is ~2kb gzipped.
                </Text>
              ),
            },
          ]}
        />

        <Divider variant="double" label="BORDER STYLES" />

        <Grid columns={4} gap="md">
          <Box border="single" padding="sm">
            <Text size="sm" color="secondary">
              single
            </Text>
          </Box>
          <Box border="double" padding="sm">
            <Text size="sm" color="secondary">
              double
            </Text>
          </Box>
          <Box border="rounded" padding="sm">
            <Text size="sm" color="secondary">
              rounded
            </Text>
          </Box>
          <Box border="dashed" padding="sm">
            <Text size="sm" color="secondary">
              dashed
            </Text>
          </Box>
        </Grid>

        {/* CTA */}
        <Box border="double" padding="lg" accent="success">
          <Stack gap="md" align="center">
            <Heading level={2} prefix>
              Get started in 30 seconds
            </Heading>
            <Code prompt="$">npm install @n3rd-ai/ui</Code>
            <Row gap="md" justify="center">
              <Button
                variant="primary"
                href="https://github.com/SuperstellarLLC/n3rd-ai-ui"
                external
              >
                READ THE DOCS
              </Button>
              <Button
                variant="secondary"
                href="https://github.com/SuperstellarLLC/n3rd-ai-ui"
                external
              >
                VIEW ON GITHUB
              </Button>
            </Row>
          </Stack>
        </Box>

        <StatusLine
          left={
            <Text size="sm" color="tertiary">
              n3rd.ai v0.4.1
            </Text>
          }
          center={
            <Text size="sm" color="tertiary">
              MIT License
            </Text>
          }
          right={
            <Text size="sm" color="tertiary">
              Superstellar LLC
            </Text>
          }
        />

        <Footer
          tagline="Your product is an API. This gives it a face."
          links={[
            {
              label: 'GitHub',
              href: 'https://github.com/SuperstellarLLC/n3rd-ai-ui',
              external: true,
            },
            {
              label: 'npm',
              href: 'https://npmjs.com/package/@n3rd-ai/ui',
              external: true,
            },
          ]}
          branding="Superstellar LLC"
        />
      </Stack>
    </Page>
  )
}
