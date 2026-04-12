import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BoumProvider } from '../src'

describe('BoumProvider', () => {
  it('renders children', () => {
    render(
      <BoumProvider>
        <div>child</div>
      </BoumProvider>,
    )
    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('renders scanline when enabled', () => {
    const { container } = render(
      <BoumProvider scanlines>
        <div>child</div>
      </BoumProvider>,
    )
    const scanline = container.querySelector('[aria-hidden="true"]')
    expect(scanline).toBeTruthy()
  })

  it('does not render scanline by default', () => {
    const { container } = render(
      <BoumProvider>
        <div>child</div>
      </BoumProvider>,
    )
    // The only aria-hidden should not be a fixed-position scanline
    const fixedEls = Array.from(container.querySelectorAll('[aria-hidden="true"]')).filter(
      (el) => (el as HTMLElement).style.position === 'fixed',
    )
    expect(fixedEls).toHaveLength(0)
  })

  it('has displayName', () => {
    expect(BoumProvider.displayName).toBe('BoumProvider')
  })
})
