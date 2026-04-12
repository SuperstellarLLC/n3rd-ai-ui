import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Landing page', () => {
  it('renders the positioning headline', () => {
    render(<Home />)
    expect(
      screen.getByRole('heading', { name: /AI should answer with interfaces, not documents/i }),
    ).toBeInTheDocument()
  })

  it('renders navigation for the core sections', () => {
    render(<Home />)
    expect(screen.getByRole('link', { name: /Use cases/i })).toHaveAttribute('href', '#use-cases')
    expect(screen.getAllByRole('link', { name: /Experience/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /Join waitlist/i }).length).toBeGreaterThan(0)
  })

  it('shows the hero proof points', () => {
    render(<Home />)
    expect(screen.getByText(/Compare boards/i)).toBeInTheDocument()
    expect(screen.getByText(/Source drawers/i)).toBeInTheDocument()
    expect(screen.getByText(/Live filters/i)).toBeInTheDocument()
  })

  it('includes the cinematic workspace copy', () => {
    render(<Home />)
    expect(screen.getByText(/Apartment shortlist/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Seestrasse Loft/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Decision math/i).length).toBeGreaterThan(0)
  })

  it('explains the transcript-to-workspace shift', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: /Text is a prototype/i })).toBeInTheDocument()
    expect(screen.getByText(/A scrolling answer/i)).toBeInTheDocument()
    expect(screen.getByText(/Apartment compare view/i)).toBeInTheDocument()
  })

  it('highlights real-world use cases', () => {
    render(<Home />)
    expect(
      screen.getByRole('heading', { name: /The strongest wedge is high-consideration decisions/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/Home search/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Summer shoes/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Travel planning/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Code review/i).length).toBeGreaterThan(0)
  })

  it('renders the waitlist section and form', () => {
    render(<Home />)
    expect(
      screen.getByRole('heading', {
        name: /Join the waitlist for the first serious frontier UI client/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/First workflow to transform/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Join the waitlist/i })).toBeInTheDocument()
  })

  it('removes the old reputation-layer homepage copy', () => {
    render(<Home />)
    expect(screen.queryByText(/THE REPUTATION LAYER FOR AI AGENTS/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/YOUR SERVER, SCORED/i)).not.toBeInTheDocument()
  })
})
