/**
 * Smoke test — renders every exported component in a realistic composition.
 * If this test passes, consumers can safely update.
 *
 * This catches:
 * - Import/export failures
 * - Components crashing when composed together
 * - Provider context issues
 * - Missing CSS class references
 * - Type mismatches between component interfaces
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  // Provider
  N3rdProvider,
  // Layout
  Page,
  Stack,
  Row,
  Grid,
  Box,
  Divider,
  // Display
  Text,
  Heading,
  Badge,
  Metric,
  Table,
  Code,
  List,
  Logo,
  StatusLine,
  Footer,
  Accordion,
  Tabs,
  Card,
  Tooltip,
  Tag,
  // Input
  Button,
  Input,
  // Feedback
  Alert,
  Progress,
  Skeleton,
  // Nav
  Nav,
  // Primitives
  Cursor,
  Typewriter,
  // Utilities (non-component)
  renderAsciiText,
  renderAsciiLines,
  getBorderChars,
  BORDER_CHARS,
  N3RD_FONT_FAMILY,
} from '../src'

describe('Smoke test — full page composition', () => {
  it('renders a complete landing page with all components without crashing', () => {
    const { container } = render(
      <N3rdProvider>
        <Page>
          <Nav
            items={[
              { label: 'HOME', href: '/', active: true },
              { label: 'DOCS', href: '/docs' },
              { label: 'GITHUB', href: 'https://github.com', external: true },
            ]}
          />

          <Stack gap="xl">
            <Stack gap="lg" align="center">
              <Logo text="TEST" gradient decorated />

              <Heading level={1} gradient>
                Terminal UI for testing
              </Heading>

              <Text size="lg" color="secondary">
                Smoke test tagline
              </Text>

              <Text prefix=">" gradient>
                Gradient with prefix
              </Text>

              <Row gap="md" justify="center">
                <Button variant="primary" href="https://example.com" external>
                  INSTALL
                </Button>
                <Button variant="secondary">SOURCE</Button>
                <Button variant="danger" disabled>
                  DELETE
                </Button>
                <Button variant="ghost">GHOST</Button>
                <Button loading>LOADING</Button>
              </Row>
            </Stack>

            <Divider variant="double" label="STATS" />

            <Row gap="lg" justify="center" wrap>
              <Metric value="0kb" label="JS" accent="success" prefix="~" />
              <Metric value={42} label="components" />
            </Row>

            <Divider variant="single" />
            <Divider variant="dashed" label="DASHED" />

            <Grid columns={2} gap="lg">
              <Box border="single" title="Single" accent="primary" padding="md">
                <Text>Single border box</Text>
              </Box>
              <Box border="double" title="Double" accent="success" padding="lg">
                <Text bold color="accent">
                  Double border box
                </Text>
              </Box>
              <Box border="rounded" padding="sm">
                <Text size="sm">Rounded border box</Text>
              </Box>
              <Box border="dashed" accent="danger">
                <Text color="danger">Dashed border box</Text>
              </Box>
              <Box border="none">
                <Text>No border box</Text>
              </Box>
            </Grid>

            <Card title="Card Title" subtitle="Subtitle" footer="Footer text" accent="info">
              <Text>Card body content</Text>
            </Card>

            <Card href="https://example.com" external>
              <Text>Clickable card</Text>
            </Card>

            <Grid columns={3} gap="md">
              <Badge variant="success">DEPLOYED</Badge>
              <Badge variant="warning">BUILDING</Badge>
              <Badge variant="danger">FAILED</Badge>
              <Badge variant="info">QUEUED</Badge>
              <Badge>DEFAULT</Badge>
            </Grid>

            <Row gap="sm" wrap>
              <Tag accent="primary">react</Tag>
              <Tag accent="success">nextjs</Tag>
              <Tag accent="info" removable onRemove={() => {}}>
                removable
              </Tag>
            </Row>

            <Code title="example.ts" prompt="$" showLineNumbers>
              {'npm install @n3rd-ai/ui\nimport { Box } from "@n3rd-ai/ui"'}
            </Code>

            <Table
              columns={['component', 'category', 'status']}
              rows={[
                ['Box', 'Layout', { text: 'STABLE', accent: 'success' }],
                ['Button', 'Input', { text: 'STABLE', accent: 'success' }],
                ['Toast', 'Feedback', { text: 'BETA', accent: 'warning' }],
                ['Short row'],
              ]}
              border="single"
            />

            <Table columns={['a', 'b']} rows={[['1', '2']]} border="none" />

            <List
              bullet=">"
              items={[
                <Text key="1">
                  <Text bold color="accent">
                    Feature 1
                  </Text>{' '}
                  — description
                </Text>,
                <Text key="2">
                  <Text bold color="accent">
                    Feature 2
                  </Text>{' '}
                  — description
                </Text>,
              ]}
            />
            <List bullet="numbered" items={['one', 'two', 'three']} />
            <List bullet="none" items={['plain item']} />

            <Stack gap="sm">
              <Progress value={87} accent="success" showLabel />
              <Progress value={42} accent="warning" width={30} />
              <Progress value={0} max={0} />
              <Progress value={-10} showLabel={false} />
              <Progress value={200} />
            </Stack>

            <Alert variant="success">All systems operational</Alert>
            <Alert variant="warning">Deprecation notice</Alert>
            <Alert variant="error">Build failed</Alert>
            <Alert variant="info">New version available</Alert>

            <Skeleton width={40} lines={3} />

            <Accordion
              items={[
                { title: 'Question 1', content: <Text>Answer 1</Text> },
                { title: 'Question 2', content: 'Answer 2' },
              ]}
            />

            <Accordion
              multiple
              items={[
                { title: 'Multi 1', content: 'Content 1' },
                { title: 'Multi 2', content: 'Content 2' },
              ]}
            />

            <Tabs
              tabs={[
                { label: 'React', content: <Code>{'import { Box } from "@n3rd-ai/ui"'}</Code> },
                { label: 'Usage', content: <Text>Use it in your app</Text> },
              ]}
              accent="info"
            />

            <Tooltip content="This is a tooltip">
              <Text color="accent">Hover me</Text>
            </Tooltip>

            <Input
              label="Email"
              id="email"
              placeholder="you@example.com"
              prefix=">"
              type="email"
              required
            />

            <Input
              label="Password"
              id="password"
              type="password"
              error
              errorMessage="Required field"
            />

            <Input disabled defaultValue="disabled input" />

            <Typewriter text="Deploying..." speed={50} cursor="block" />

            <Cursor style="line" />

            <StatusLine
              left={<Text size="sm">v0.4.1</Text>}
              center={<Text size="sm">MIT</Text>}
              right={<Text size="sm">OK</Text>}
            />
          </Stack>

          <Footer
            tagline="Your product is an API. This gives it a face."
            branding="Test Suite"
            links={[
              { label: 'GitHub', href: 'https://github.com', external: true },
              { label: 'npm', href: 'https://npmjs.com', external: true },
            ]}
          />
        </Page>
      </N3rdProvider>,
    )

    // Verify the page rendered without crashing
    expect(container).toBeTruthy()

    // Verify key landmarks exist
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getAllByRole('navigation').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('img')).toBeInTheDocument() // Logo
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()

    // Verify interactive components rendered
    expect(screen.getAllByRole('button').length).toBeGreaterThan(3)
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('tab').length).toBe(2)
    expect(screen.getByRole('tabpanel')).toBeInTheDocument()
    expect(screen.getAllByRole('progressbar').length).toBe(5)
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    expect(screen.getByRole('status')).toBeInTheDocument()

    // Verify content rendered
    expect(screen.getByText(/Smoke test tagline/)).toBeInTheDocument()
    expect(screen.getByText(/DEPLOYED/)).toBeInTheDocument()
    expect(screen.getByText(/All systems operational/)).toBeInTheDocument()
    expect(screen.getByText(/Test Suite/)).toBeInTheDocument()

    // Verify footer semantic structure
    expect(container.querySelector('footer')).toBeTruthy()
    expect(container.querySelector('footer ul')).toBeTruthy()
    expect(container.querySelector('footer li')).toBeTruthy()

    // Verify ASCII art rendered
    expect(container.textContent).toContain('██')
    expect(container.textContent).toContain('╗')

    // Verify CSS classes are applied (not empty module objects)
    expect(container.querySelector('.n3rd-box')).toBeTruthy()
    expect(container.querySelector('.n3rd-nav')).toBeTruthy()
    expect(container.querySelector('.n3rd-btn')).toBeTruthy()
    expect(container.querySelector('.n3rd-input')).toBeTruthy()
    expect(container.querySelector('.n3rd-card')).toBeTruthy()
    expect(container.querySelector('.n3rd-footer')).toBeTruthy()
    expect(container.querySelector('.n3rd-grid')).toBeTruthy()

    // Verify no empty class attributes (the CSS module bug)
    const allElements = container.querySelectorAll('[class]')
    allElements.forEach((el) => {
      const cls = el.getAttribute('class')
      expect(cls).not.toBe('')
      expect(cls).not.toContain('undefined')
    })
  })

  it('all non-component exports are functional', () => {
    // ASCII font
    const text = renderAsciiText('HI')
    expect(text).toContain('██')
    expect(text.split('\n')).toHaveLength(6)

    const lines = renderAsciiLines('AB')
    expect(lines).toHaveLength(6)
    expect(lines[0]).toContain('██')

    // Border chars
    expect(getBorderChars('single')).toBeTruthy()
    expect(getBorderChars('double')).toBeTruthy()
    expect(getBorderChars('rounded')).toBeTruthy()
    expect(getBorderChars('dashed')).toBeTruthy()
    expect(getBorderChars('none')).toBeNull()
    expect(BORDER_CHARS.single.topLeft).toBe('┌')

    // Font constant
    expect(N3RD_FONT_FAMILY).toContain('JetBrains Mono')
  })
})
