import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Landing page', () => {
  describe('Navigation', () => {
    it('renders header nav with all links', () => {
      render(<Home />)
      expect(screen.getByRole('link', { name: /HOME/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /DOCS/ })).toBeInTheDocument()
      expect(screen.getAllByRole('link', { name: /NPM/i }).length).toBeGreaterThan(0)
      expect(screen.getAllByRole('link', { name: /GITHUB/i }).length).toBeGreaterThan(0)
    })
  })

  describe('Hero', () => {
    it('renders the positioning headline', () => {
      render(<Home />)
      // Heading + potential prefix span — at least one match expected
      const matches = screen.getAllByText(/THE REPUTATION LAYER FOR AI AGENTS/)
      expect(matches.length).toBeGreaterThan(0)
    })

    it('renders the one-sentence tagline', () => {
      render(<Home />)
      expect(
        screen.getByText(/Every MCP tool call, signed and scored\. One number/),
      ).toBeInTheDocument()
    })

    it('renders the primary CTA to npm', () => {
      render(<Home />)
      expect(screen.getByRole('link', { name: /GET STARTED/ })).toHaveAttribute(
        'href',
        'https://npmjs.com/package/@n3rd-ai/attest',
      )
    })

    it('renders the secondary CTA to GitHub', () => {
      render(<Home />)
      const github = screen.getByRole('link', { name: /VIEW ON GITHUB/ })
      expect(github).toHaveAttribute('href', 'https://github.com/SuperstellarLLC/n3rd-ai')
    })
  })

  describe('Terminal demo', () => {
    it('shows the npx n3rd init command in the demo block', () => {
      render(<Home />)
      expect(screen.getByText(/npx n3rd init weather/, { selector: 'pre' })).toBeInTheDocument()
    })

    it('mentions the attestation shipping step', () => {
      render(<Home />)
      expect(screen.getByText(/first attestation signed and shipped/)).toBeInTheDocument()
    })
  })

  describe('Reputation badge section', () => {
    it('renders the "your server scored" headline', () => {
      render(<Home />)
      expect(screen.getByText(/YOUR SERVER, SCORED/)).toBeInTheDocument()
    })

    it('renders three example badges', () => {
      render(<Home />)
      expect(screen.getByText('94')).toBeInTheDocument()
      expect(screen.getByText('78')).toBeInTheDocument()
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('shows the embeddable markdown snippet', () => {
      render(<Home />)
      expect(screen.getByText(/https:\/\/n3rd\.ai\/@you\/weather\/badge\.svg/)).toBeInTheDocument()
    })
  })

  describe('Install section', () => {
    it('renders the three-lines headline', () => {
      render(<Home />)
      expect(screen.getByText(/THREE LINES\. ZERO CONFIG\./)).toBeInTheDocument()
    })

    it('includes the attest import somewhere on the page', () => {
      const { container } = render(<Home />)
      expect(container.textContent).toContain('@n3rd-ai/attest')
    })
  })

  describe('Trust section', () => {
    it('renders "WHY TRUST IT" heading', () => {
      render(<Home />)
      expect(screen.getByText(/WHY TRUST IT/)).toBeInTheDocument()
    })

    it('mentions HMAC-SHA256 signing', () => {
      render(<Home />)
      expect(screen.getByText(/HMAC-SHA256/)).toBeInTheDocument()
    })

    it('mentions the 1.38 KB bundle size', () => {
      render(<Home />)
      expect(screen.getByText(/1\.38 KB/)).toBeInTheDocument()
    })

    it('mentions MIT license', () => {
      render(<Home />)
      expect(screen.getByText(/MIT licensed/)).toBeInTheDocument()
    })
  })

  describe('CTA section', () => {
    it('renders "ready in 90 seconds" headline', () => {
      render(<Home />)
      expect(screen.getByText(/READY IN 90 SECONDS/)).toBeInTheDocument()
    })

    it('renders the final npm install CTA', () => {
      render(<Home />)
      expect(screen.getByRole('link', { name: /NPM INSTALL @N3RD-AI\/ATTEST/ })).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('includes footer links', () => {
      render(<Home />)
      expect(screen.getAllByRole('link', { name: /github/i }).length).toBeGreaterThan(0)
      expect(screen.getAllByRole('link', { name: /security/i }).length).toBeGreaterThan(0)
    })
  })

  describe('Kills from the old landing page', () => {
    it('does NOT mention "Terminal-first UI framework"', () => {
      render(<Home />)
      expect(screen.queryByText(/Terminal-first UI framework/)).not.toBeInTheDocument()
    })

    it('does NOT render the theme switcher', () => {
      render(<Home />)
      // Old landing page had UNICORN/CLASSIC/RETRO/PAPER buttons
      expect(screen.queryByRole('button', { name: /^UNICORN$/ })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /^CLASSIC$/ })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /^PAPER$/ })).not.toBeInTheDocument()
    })
  })
})
