import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { N3rdProvider } from '../src'

describe('N3rdProvider', () => {
  it('renders children', () => {
    render(
      <N3rdProvider>
        <div>child</div>
      </N3rdProvider>,
    )
    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('renders scanline when enabled', () => {
    const { container } = render(
      <N3rdProvider scanlines>
        <div>child</div>
      </N3rdProvider>,
    )
    const scanline = container.querySelector('[aria-hidden="true"]')
    expect(scanline).toBeTruthy()
  })

  it('does not render scanline by default', () => {
    const { container } = render(
      <N3rdProvider>
        <div>child</div>
      </N3rdProvider>,
    )
    // The only aria-hidden should not be a fixed-position scanline
    const fixedEls = Array.from(container.querySelectorAll('[aria-hidden="true"]')).filter(
      (el) => (el as HTMLElement).style.position === 'fixed',
    )
    expect(fixedEls).toHaveLength(0)
  })

  it('has displayName', () => {
    expect(N3rdProvider.displayName).toBe('N3rdProvider')
  })
})
