import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Landing page', () => {
  it('renders the new positioning headline', () => {
    render(<Home />)
    expect(
      screen.getByRole('heading', { name: /AI should answer with interfaces/i }),
    ).toBeInTheDocument()
  })

  it('renders navigation for the core sections', () => {
    render(<Home />)
    expect(screen.getByRole('link', { name: /Use cases/i })).toHaveAttribute('href', '#use-cases')
    expect(screen.getByRole('link', { name: /Experience/i })).toHaveAttribute('href', '#experience')
    expect(screen.getAllByRole('link', { name: /Join waitlist/i }).length).toBeGreaterThan(0)
  })

  it('shows the primary value proposition', () => {
    render(<Home />)
    expect(
      screen.getByText(/n3rd turns long AI responses into interactive views/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Interactive comparisons instead of walls of text/i),
    ).toBeInTheDocument()
  })

  it('highlights real-world use cases', () => {
    render(<Home />)
    expect(
      screen.getByRole('heading', { name: /Decision-heavy workflows become visual/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/Summer shoes/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Home search/i)).toBeInTheDocument()
    expect(screen.getByText(/Travel planning/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Code review/i).length).toBeGreaterThan(0)
  })

  it('explains the product thesis and steps', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: /Chat was the prototype/i })).toBeInTheDocument()
    expect(screen.getByText(/Ask normally/i)).toBeInTheDocument()
    expect(screen.getByText(/Render structured views/i)).toBeInTheDocument()
    expect(screen.getByText(/Refine in place/i)).toBeInTheDocument()
  })

  it('renders the waitlist form', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: /Join the waitlist/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/First workflow to transform/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Join the waitlist/i })).toBeInTheDocument()
  })

  it('removes the old reputation layer copy from the homepage', () => {
    render(<Home />)
    expect(screen.queryByText(/THE REPUTATION LAYER FOR AI AGENTS/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/YOUR SERVER, SCORED/i)).not.toBeInTheDocument()
  })
})
