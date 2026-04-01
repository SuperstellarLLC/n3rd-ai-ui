import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Box, Stack, Row, Grid, Divider, Page } from '../../src'

describe('Box', () => {
  it('renders children', () => {
    render(<Box>hello</Box>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('renders border characters for single style', () => {
    const { container } = render(<Box border="single">content</Box>)
    expect(container.textContent).toContain('┌')
    expect(container.textContent).toContain('┐')
    expect(container.textContent).toContain('└')
    expect(container.textContent).toContain('┘')
  })

  it('renders double border characters', () => {
    const { container } = render(<Box border="double">content</Box>)
    expect(container.textContent).toContain('╔')
    expect(container.textContent).toContain('╗')
  })

  it('renders rounded border characters', () => {
    const { container } = render(<Box border="rounded">content</Box>)
    expect(container.textContent).toContain('╭')
    expect(container.textContent).toContain('╯')
  })

  it('renders dashed border characters', () => {
    const { container } = render(<Box border="dashed">content</Box>)
    expect(container.textContent).toContain('╌')
  })

  it('renders no border for none', () => {
    const { container } = render(<Box border="none">content</Box>)
    expect(container.textContent).not.toContain('┌')
  })

  it('renders title in border', () => {
    render(<Box title="Status">content</Box>)
    expect(screen.getByText(/Status/)).toBeInTheDocument()
  })

  it('applies accent color', () => {
    const { container } = render(<Box accent="success">ok</Box>)
    const box = container.querySelector('.n3rd-box')
    expect(box).toBeTruthy()
  })

  it('applies className', () => {
    const { container } = render(<Box className="custom">ok</Box>)
    expect(container.querySelector('.custom')).toBeTruthy()
  })

  it('has displayName', () => {
    expect(Box.displayName).toBe('Box')
  })
})

describe('Stack', () => {
  it('renders children vertically', () => {
    const { container } = render(
      <Stack>
        <div>a</div>
        <div>b</div>
      </Stack>,
    )
    expect(container.firstChild).toHaveStyle({ flexDirection: 'column' })
  })

  it('applies gap', () => {
    const { container } = render(<Stack gap="lg">child</Stack>)
    expect(container.firstChild).toHaveStyle({ gap: 'var(--n3rd-space-6)' })
  })

  it('applies align', () => {
    const { container } = render(<Stack align="center">child</Stack>)
    expect(container.firstChild).toHaveStyle({ alignItems: 'center' })
  })

  it('has displayName', () => {
    expect(Stack.displayName).toBe('Stack')
  })
})

describe('Row', () => {
  it('renders children horizontally', () => {
    const { container } = render(
      <Row>
        <div>a</div>
        <div>b</div>
      </Row>,
    )
    expect(container.firstChild).toHaveStyle({ flexDirection: 'row' })
  })

  it('applies justify', () => {
    const { container } = render(<Row justify="between">child</Row>)
    expect(container.firstChild).toHaveStyle({ justifyContent: 'space-between' })
  })

  it('applies wrap', () => {
    const { container } = render(<Row wrap>child</Row>)
    expect(container.firstChild).toHaveStyle({ flexWrap: 'wrap' })
  })

  it('has displayName', () => {
    expect(Row.displayName).toBe('Row')
  })
})

describe('Grid', () => {
  it('renders with default 3 columns', () => {
    const { container } = render(<Grid>child</Grid>)
    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: 'repeat(3, 1fr)' })
  })

  it('accepts custom column count', () => {
    const { container } = render(<Grid columns={2}>child</Grid>)
    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: 'repeat(2, 1fr)' })
  })

  it('accepts string columns', () => {
    const { container } = render(<Grid columns="1fr 2fr">child</Grid>)
    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: '1fr 2fr' })
  })

  it('clamps columns to minimum 1', () => {
    const { container } = render(<Grid columns={0}>child</Grid>)
    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: 'repeat(1, 1fr)' })
  })

  it('clamps negative columns', () => {
    const { container } = render(<Grid columns={-5}>child</Grid>)
    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: 'repeat(1, 1fr)' })
  })

  it('has n3rd-grid class', () => {
    const { container } = render(<Grid>child</Grid>)
    expect(container.querySelector('.n3rd-grid')).toBeTruthy()
  })

  it('has displayName', () => {
    expect(Grid.displayName).toBe('Grid')
  })
})

describe('Divider', () => {
  it('renders single line by default', () => {
    const { container } = render(<Divider />)
    expect(container.textContent).toContain('─')
  })

  it('renders double line', () => {
    const { container } = render(<Divider variant="double" />)
    expect(container.textContent).toContain('═')
  })

  it('renders dashed line', () => {
    const { container } = render(<Divider variant="dashed" />)
    expect(container.textContent).toContain('╌')
  })

  it('renders label', () => {
    render(<Divider label="SECTION" />)
    expect(screen.getByText('SECTION')).toBeInTheDocument()
  })

  it('has separator role', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('has displayName', () => {
    expect(Divider.displayName).toBe('Divider')
  })
})

describe('Page', () => {
  it('renders as main element', () => {
    render(<Page>content</Page>)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('applies maxWidth', () => {
    const { container } = render(<Page maxWidth="800px">content</Page>)
    expect(container.firstChild).toHaveStyle({ maxWidth: '800px' })
  })

  it('has overflow-x hidden', () => {
    const { container } = render(<Page>content</Page>)
    expect(container.firstChild).toHaveStyle({ overflowX: 'hidden' })
  })

  it('has displayName', () => {
    expect(Page.displayName).toBe('Page')
  })
})
