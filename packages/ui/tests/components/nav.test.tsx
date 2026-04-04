import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Nav } from '../../src'

describe('Nav', () => {
  const items = [
    { label: 'HOME', href: '/', active: true },
    { label: 'DOCS', href: '/docs' },
    { label: 'GITHUB', href: 'https://github.com', external: true },
  ]

  it('renders nav element', () => {
    render(<Nav items={items} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders all items', () => {
    render(<Nav items={items} />)
    expect(screen.getByText(/HOME/)).toBeInTheDocument()
    expect(screen.getByText(/DOCS/)).toBeInTheDocument()
    expect(screen.getByText(/GITHUB/)).toBeInTheDocument()
  })

  it('shows active indicator', () => {
    const { container } = render(<Nav items={items} />)
    expect(container.querySelector('.n3rd-nav-active')).toBeTruthy()
  })

  it('sets external link attributes', () => {
    render(<Nav items={items} />)
    const githubLink = screen.getByText(/GITHUB/).closest('a') as HTMLAnchorElement
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows external arrow', () => {
    render(<Nav items={items} />)
    expect(screen.getByText(/GITHUB/).textContent).toContain('↗')
  })

  it('has n3rd-nav class', () => {
    const { container } = render(<Nav items={items} />)
    expect(container.querySelector('.n3rd-nav')).toBeTruthy()
  })

  it('has displayName', () => {
    expect(Nav.displayName).toBe('Nav')
  })
})
