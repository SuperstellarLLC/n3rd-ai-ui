import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReputationBadge } from './ReputationBadge'

describe('ReputationBadge', () => {
  it('renders the server name and score', () => {
    render(<ReputationBadge server="weather" score={94} />)
    expect(screen.getByText(/weather/)).toBeInTheDocument()
    expect(screen.getByText('94')).toBeInTheDocument()
    expect(screen.getByText('/ 100')).toBeInTheDocument()
  })

  it('shows "excellent" for scores 90+', () => {
    render(<ReputationBadge server="s" score={95} />)
    expect(screen.getByText(/excellent/)).toBeInTheDocument()
  })

  it('shows "good" for scores 70-89', () => {
    render(<ReputationBadge server="s" score={80} />)
    expect(screen.getByText(/good/)).toBeInTheDocument()
  })

  it('shows "fair" for scores 50-69', () => {
    render(<ReputationBadge server="s" score={55} />)
    expect(screen.getByText(/fair/)).toBeInTheDocument()
  })

  it('shows "unverified" for scores below 50', () => {
    render(<ReputationBadge server="s" score={20} />)
    expect(screen.getByText(/unverified/)).toBeInTheDocument()
  })

  it('shows verified check by default', () => {
    render(<ReputationBadge server="s" score={94} />)
    expect(screen.getByText(/✓ verified/)).toBeInTheDocument()
  })

  it('shows unverified marker when verified=false', () => {
    render(<ReputationBadge server="s" score={94} verified={false} />)
    expect(screen.getByText(/· unverified/)).toBeInTheDocument()
  })

  it('formats uptime percentage', () => {
    render(<ReputationBadge server="s" score={94} uptimePct={99.7} />)
    expect(screen.getByText(/↑ 99.7%/)).toBeInTheDocument()
  })

  it('formats callsPerDay with K suffix', () => {
    render(<ReputationBadge server="s" score={94} callsPerDay={12_500} />)
    expect(screen.getByText(/12.5K\/day/)).toBeInTheDocument()
  })

  it('formats callsPerDay with M suffix', () => {
    render(<ReputationBadge server="s" score={94} callsPerDay={2_300_000} />)
    expect(screen.getByText(/2.3M\/day/)).toBeInTheDocument()
  })

  it('shows raw number for small counts', () => {
    render(<ReputationBadge server="s" score={94} callsPerDay={42} />)
    expect(screen.getByText(/42\/day/)).toBeInTheDocument()
  })

  it('shows both uptime and calls when both provided', () => {
    render(<ReputationBadge server="s" score={94} uptimePct={99} callsPerDay={1000} />)
    expect(screen.getByText(/↑ 99.0%/)).toBeInTheDocument()
    expect(screen.getByText(/1.0K\/day/)).toBeInTheDocument()
  })
})
