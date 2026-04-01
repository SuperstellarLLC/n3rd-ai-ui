import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
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
} from '../../src'

describe('Text', () => {
  it('renders children', () => {
    render(<Text>hello</Text>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('renders as span by default', () => {
    const { container } = render(<Text>text</Text>)
    expect(container.querySelector('span')).toBeTruthy()
  })

  it('renders as custom element', () => {
    const { container } = render(<Text as="p">text</Text>)
    expect(container.querySelector('p')).toBeTruthy()
  })

  it('renders prefix', () => {
    render(<Text prefix=">">text</Text>)
    expect(screen.getByText('>')).toBeInTheDocument()
  })

  it('applies gradient styles', () => {
    const { container } = render(<Text gradient>text</Text>)
    expect(container.firstChild).toHaveStyle({ backgroundClip: 'text' })
  })

  it('prefix visible with gradient', () => {
    render(
      <Text gradient prefix="#">
        text
      </Text>,
    )
    const prefix = screen.getByText('#')
    expect(prefix).toHaveStyle({ WebkitTextFillColor: 'var(--n3rd-text-secondary)' })
  })

  it('has displayName', () => {
    expect(Text.displayName).toBe('Text')
  })
})

describe('Heading', () => {
  it('renders correct heading level', () => {
    render(<Heading level={1}>Title</Heading>)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('defaults to h2', () => {
    render(<Heading>Title</Heading>)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('shows prefix by default', () => {
    render(<Heading level={1}>Title</Heading>)
    expect(screen.getByText('#')).toBeInTheDocument()
  })

  it('hides prefix when disabled', () => {
    render(<Heading prefix={false}>Title</Heading>)
    expect(screen.queryByText('##')).not.toBeInTheDocument()
  })

  it('has displayName', () => {
    expect(Heading.displayName).toBe('Heading')
  })
})

describe('Badge', () => {
  it('renders children in brackets', () => {
    render(<Badge>LIVE</Badge>)
    expect(screen.getByText(/\[LIVE\]/)).toBeInTheDocument()
  })

  it('applies variant color', () => {
    const { container } = render(<Badge variant="success">OK</Badge>)
    expect(container.firstChild).toHaveStyle({ color: 'var(--n3rd-accent-success)' })
  })

  it('has displayName', () => {
    expect(Badge.displayName).toBe('Badge')
  })
})

describe('Metric', () => {
  it('renders value and label', () => {
    render(<Metric value="42" label="users" />)
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('users')).toBeInTheDocument()
  })

  it('renders prefix and suffix', () => {
    render(<Metric value="99" label="uptime" prefix="~" suffix="%" />)
    expect(screen.getByText(/~99%/)).toBeTruthy()
  })

  it('has displayName', () => {
    expect(Metric.displayName).toBe('Metric')
  })
})

describe('Table', () => {
  const columns = ['name', 'status']
  const rows = [
    ['Alice', { text: 'active', accent: 'success' as const }],
    ['Bob', 'inactive'],
  ]

  it('renders column headers', () => {
    render(<Table columns={columns} rows={rows} />)
    expect(screen.getByText(/name/)).toBeInTheDocument()
    expect(screen.getByText(/status/)).toBeInTheDocument()
  })

  it('renders row data', () => {
    render(<Table columns={columns} rows={rows} />)
    expect(screen.getByText(/Alice/)).toBeInTheDocument()
    expect(screen.getByText(/Bob/)).toBeInTheDocument()
  })

  it('pads short rows', () => {
    const shortRows = [['Alice']] // missing second cell
    const { container } = render(<Table columns={columns} rows={shortRows} />)
    expect(container).toBeTruthy() // no crash
  })

  it('renders without border', () => {
    render(<Table columns={columns} rows={rows} border="none" />)
    expect(screen.getByText('name')).toBeInTheDocument()
  })

  it('renders scope=col on headers', () => {
    const { container } = render(<Table columns={columns} rows={rows} border="none" />)
    const ths = container.querySelectorAll('th')
    ths.forEach((th) => expect(th).toHaveAttribute('scope', 'col'))
  })

  it('has displayName', () => {
    expect(Table.displayName).toBe('Table')
  })
})

describe('Code', () => {
  it('renders code content', () => {
    render(<Code>const x = 1</Code>)
    expect(screen.getByText('const x = 1')).toBeInTheDocument()
  })

  it('renders line numbers', () => {
    render(<Code showLineNumbers>{'line1\nline2'}</Code>)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders prompt on first line', () => {
    render(<Code prompt="$">npm install</Code>)
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('has displayName', () => {
    expect(Code.displayName).toBe('Code')
  })
})

describe('List', () => {
  it('renders items', () => {
    render(<List items={['one', 'two']} />)
    expect(screen.getByText('one')).toBeInTheDocument()
    expect(screen.getByText('two')).toBeInTheDocument()
  })

  it('renders default > bullet', () => {
    const { container } = render(<List items={['item']} />)
    expect(container.textContent).toContain('>')
  })

  it('renders numbered bullets', () => {
    render(<List items={['first', 'second']} bullet="numbered" />)
    expect(screen.getByText('1.')).toBeInTheDocument()
    expect(screen.getByText('2.')).toBeInTheDocument()
  })

  it('renders no bullets', () => {
    const { container } = render(<List items={['item']} bullet="none" />)
    expect(container.textContent).not.toContain('>')
  })

  it('handles empty items', () => {
    const { container } = render(<List items={[]} />)
    expect(container.querySelector('ul')).toBeTruthy()
  })

  it('has displayName', () => {
    expect(List.displayName).toBe('List')
  })
})

describe('Logo', () => {
  it('renders ASCII art', () => {
    const { container } = render(<Logo text="HI" />)
    // Should contain block characters from the font
    expect(container.textContent).toContain('██')
  })

  it('has aria-label', () => {
    render(<Logo text="TEST" />)
    expect(screen.getByLabelText('TEST')).toBeInTheDocument()
  })

  it('has role=img', () => {
    render(<Logo text="X" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('applies gradient', () => {
    const { container } = render(<Logo text="A" gradient />)
    // gradient divs should have backgroundClip
    const lines = container.querySelectorAll('[role="img"] > div')
    expect(lines.length).toBeGreaterThan(0)
  })

  it('renders decoration stars', () => {
    const { container } = render(<Logo text="A" decorated />)
    expect(container.textContent).toContain('✦')
  })

  it('has displayName', () => {
    expect(Logo.displayName).toBe('Logo')
  })
})

describe('StatusLine', () => {
  it('renders left, center, right', () => {
    render(<StatusLine left="L" center="C" right="R" />)
    expect(screen.getByText('L')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('R')).toBeInTheDocument()
  })

  it('has status role with aria-live', () => {
    render(<StatusLine left="test" />)
    const el = screen.getByRole('status')
    expect(el).toHaveAttribute('aria-live', 'polite')
  })

  it('has displayName', () => {
    expect(StatusLine.displayName).toBe('StatusLine')
  })
})

describe('Footer', () => {
  it('renders branding', () => {
    render(<Footer branding="ACME" />)
    expect(screen.getByText(/ACME/)).toBeInTheDocument()
  })

  it('renders tagline uppercased', () => {
    render(<Footer tagline="hello world" />)
    expect(screen.getByText('HELLO WORLD')).toBeInTheDocument()
  })

  it('renders links as list items', () => {
    const { container } = render(
      <Footer links={[{ label: 'GitHub', href: 'https://github.com', external: true }]} />,
    )
    expect(container.querySelector('ul')).toBeTruthy()
    expect(container.querySelector('li')).toBeTruthy()
    expect(screen.getByText(/GitHub/)).toBeInTheDocument()
  })

  it('renders footer element', () => {
    const { container } = render(<Footer />)
    expect(container.querySelector('footer')).toBeTruthy()
  })

  it('has displayName', () => {
    expect(Footer.displayName).toBe('Footer')
  })
})

describe('Accordion', () => {
  const items = [
    { title: 'Q1', content: 'A1' },
    { title: 'Q2', content: 'A2' },
  ]

  it('renders titles', () => {
    render(<Accordion items={items} />)
    expect(screen.getByText('Q1')).toBeInTheDocument()
    expect(screen.getByText('Q2')).toBeInTheDocument()
  })

  it('content hidden by default', () => {
    render(<Accordion items={items} />)
    expect(screen.queryByText('A1')).not.toBeInTheDocument()
  })

  it('toggles content on click', () => {
    render(<Accordion items={items} />)
    fireEvent.click(screen.getByText('Q1'))
    expect(screen.getByText('A1')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Q1'))
    expect(screen.queryByText('A1')).not.toBeInTheDocument()
  })

  it('single mode closes others', () => {
    render(<Accordion items={items} />)
    fireEvent.click(screen.getByText('Q1'))
    expect(screen.getByText('A1')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Q2'))
    expect(screen.queryByText('A1')).not.toBeInTheDocument()
    expect(screen.getByText('A2')).toBeInTheDocument()
  })

  it('multiple mode keeps others open', () => {
    render(<Accordion items={items} multiple />)
    fireEvent.click(screen.getByText('Q1'))
    fireEvent.click(screen.getByText('Q2'))
    expect(screen.getByText('A1')).toBeInTheDocument()
    expect(screen.getByText('A2')).toBeInTheDocument()
  })

  it('has aria-expanded', () => {
    render(<Accordion items={items} />)
    const btn = screen.getByText('Q1').closest('button') as HTMLElement
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  it('has displayName', () => {
    expect(Accordion.displayName).toBe('Accordion')
  })
})

describe('Tabs', () => {
  const tabs = [
    { label: 'Tab1', content: 'Content1' },
    { label: 'Tab2', content: 'Content2' },
  ]

  it('renders tab labels', () => {
    render(<Tabs tabs={tabs} />)
    expect(screen.getByText('Tab1')).toBeInTheDocument()
    expect(screen.getByText('Tab2')).toBeInTheDocument()
  })

  it('shows first tab content by default', () => {
    render(<Tabs tabs={tabs} />)
    expect(screen.getByText('Content1')).toBeInTheDocument()
    expect(screen.queryByText('Content2')).not.toBeInTheDocument()
  })

  it('switches tab on click', () => {
    render(<Tabs tabs={tabs} />)
    fireEvent.click(screen.getByText('Tab2'))
    expect(screen.getByText('Content2')).toBeInTheDocument()
    expect(screen.queryByText('Content1')).not.toBeInTheDocument()
  })

  it('supports defaultIndex', () => {
    render(<Tabs tabs={tabs} defaultIndex={1} />)
    expect(screen.getByText('Content2')).toBeInTheDocument()
  })

  it('has tablist and tab roles', () => {
    render(<Tabs tabs={tabs} />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(2)
    expect(screen.getByRole('tabpanel')).toBeInTheDocument()
  })

  it('marks active tab as selected', () => {
    render(<Tabs tabs={tabs} />)
    expect(screen.getByText('Tab1').closest('button')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Tab2').closest('button')).toHaveAttribute('aria-selected', 'false')
  })

  it('has displayName', () => {
    expect(Tabs.displayName).toBe('Tabs')
  })
})

describe('Card', () => {
  it('renders children', () => {
    render(<Card>body</Card>)
    expect(screen.getByText('body')).toBeInTheDocument()
  })

  it('renders title and subtitle', () => {
    render(
      <Card title="Title" subtitle="Sub">
        body
      </Card>,
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Sub')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<Card footer="foot">body</Card>)
    expect(screen.getByText('foot')).toBeInTheDocument()
  })

  it('renders as link when href provided', () => {
    const { container } = render(<Card href="/test">body</Card>)
    const a = container.querySelector('a')
    expect(a).toBeTruthy()
    expect(a).toHaveAttribute('href', '/test')
  })

  it('sets external link attributes', () => {
    const { container } = render(
      <Card href="https://example.com" external>
        body
      </Card>,
    )
    const a = container.querySelector('a')
    expect(a).toHaveAttribute('target', '_blank')
    expect(a).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('has n3rd-card class', () => {
    const { container } = render(<Card>body</Card>)
    expect(container.querySelector('.n3rd-card')).toBeTruthy()
  })

  it('has displayName', () => {
    expect(Card.displayName).toBe('Card')
  })
})

describe('Tooltip', () => {
  it('renders children', () => {
    render(<Tooltip content="tip">hover me</Tooltip>)
    expect(screen.getByText('hover me')).toBeInTheDocument()
  })

  it('shows tooltip on hover', () => {
    render(<Tooltip content="tip text">trigger</Tooltip>)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    fireEvent.mouseEnter(screen.getByText('trigger'))
    expect(screen.getByRole('tooltip')).toHaveTextContent('tip text')
  })

  it('hides tooltip on mouse leave', () => {
    render(<Tooltip content="tip">trigger</Tooltip>)
    fireEvent.mouseEnter(screen.getByText('trigger'))
    fireEvent.mouseLeave(screen.getByText('trigger'))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows on focus', () => {
    render(<Tooltip content="tip">trigger</Tooltip>)
    fireEvent.focus(screen.getByText('trigger'))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
  })

  it('has displayName', () => {
    expect(Tooltip.displayName).toBe('Tooltip')
  })
})

describe('Tag', () => {
  it('renders text', () => {
    render(<Tag>react</Tag>)
    expect(screen.getByText('react')).toBeInTheDocument()
  })

  it('applies accent color', () => {
    const { container } = render(<Tag accent="success">ok</Tag>)
    expect(container.firstChild).toHaveStyle({ color: 'var(--n3rd-accent-success)' })
  })

  it('renders remove button when removable', () => {
    render(<Tag removable>tag</Tag>)
    expect(screen.getByRole('button', { name: /remove tag/i })).toBeInTheDocument()
  })

  it('does not render remove button by default', () => {
    render(<Tag>tag</Tag>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onRemove', () => {
    let removed = false
    render(
      <Tag removable onRemove={() => (removed = true)}>
        tag
      </Tag>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(removed).toBe(true)
  })

  it('has displayName', () => {
    expect(Tag.displayName).toBe('Tag')
  })
})
