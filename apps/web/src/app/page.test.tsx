import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Page from './page'

/** Render the page once per test */
function renderPage() {
  return render(<Page />)
}

/** Assert at least one element matches the text */
function expectText(text: string | RegExp) {
  const els = screen.queryAllByText(text)
  expect(els.length, `Expected at least one element matching "${text}"`).toBeGreaterThanOrEqual(1)
}

describe('Landing page', () => {
  describe('Navigation', () => {
    it('renders header nav with all links', () => {
      renderPage()
      const headerNav = screen
        .getAllByRole('navigation')
        .find((n) => n.classList.contains('n3rd-nav'))!
      expect(within(headerNav).queryAllByText(/HOME/).length).toBeGreaterThanOrEqual(1)
      expect(within(headerNav).queryAllByText(/DOCS/).length).toBeGreaterThanOrEqual(1)
      expect(within(headerNav).queryAllByText(/NPM/).length).toBeGreaterThanOrEqual(1)
      expect(within(headerNav).queryAllByText(/GITHUB/).length).toBeGreaterThanOrEqual(1)
    })

    it('marks HOME as the active link', () => {
      renderPage()
      const homeLinks = screen.getAllByRole('link', { name: /HOME/ })
      expect(homeLinks[0]).toHaveClass('n3rd-nav-active')
    })

    it('external links open in new tab', () => {
      renderPage()
      const docsLinks = screen.getAllByRole('link', { name: /DOCS/ })
      expect(docsLinks[0]).toHaveAttribute('target', '_blank')
      expect(docsLinks[0]).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Hero section', () => {
    it('renders the logo', () => {
      renderPage()
      const logos = screen.getAllByRole('img', { name: 'n3rd.ai' })
      expect(logos.length).toBeGreaterThanOrEqual(1)
    })

    it('renders the main heading', () => {
      renderPage()
      const headings = screen.getAllByRole('heading', { level: 1 })
      expect(headings.length).toBeGreaterThanOrEqual(1)
      expect(headings.some((h) => h.textContent?.includes('Terminal UI for the AI era'))).toBe(true)
    })

    it('renders the tagline', () => {
      renderPage()
      expectText('Your product is an API. This gives it a face.')
    })

    it('renders the zero-boast line', () => {
      renderPage()
      expectText('0 images. 0 icon fonts. 0 design decisions. Import. Wrap. Ship.')
    })

    it('renders technology tags', () => {
      renderPage()
      for (const tag of ['terminal', 'ascii', 'nextjs', 'react', 'mcp']) {
        expectText(tag)
      }
    })

    it('renders install link to npm', () => {
      renderPage()
      const installLinks = screen.getAllByRole('link', { name: /INSTALL/ })
      expect(installLinks[0]).toHaveAttribute('href', 'https://npmjs.com/package/@n3rd-ai/ui')
    })

    it('renders source link to github', () => {
      renderPage()
      const sourceLinks = screen.getAllByRole('link', { name: /SOURCE/ })
      expect(sourceLinks[0]).toHaveAttribute(
        'href',
        'https://github.com/SuperstellarLLC/n3rd-ai-ui',
      )
    })

    it('renders quickstart code block', () => {
      renderPage()
      expectText('npm install @n3rd-ai/ui')
    })
  })

  describe('AI prompt section', () => {
    it('renders the AI agent instruction label', () => {
      renderPage()
      expectText('PASTE THIS INTO CLAUDE CODE, CODEX, CURSOR, OR ANY AI AGENT:')
    })

    it('contains the prompt text with package reference', () => {
      renderPage()
      expectText(/Create a landing page for my project using the @n3rd-ai\/ui npm package/)
    })
  })

  describe('Stats section', () => {
    it('renders metric values', () => {
      renderPage()
      expectText('0kb')
      expectText('~3kb')
      expectText('30+')
    })

    it('renders metric labels', () => {
      renderPage()
      expectText('JS (server components)')
      expectText('client bundle (gzip)')
      expectText('theme presets')
      expectText('components')
    })
  })

  describe('Setup section', () => {
    it('renders the layout code example', () => {
      renderPage()
      expectText(/import \{ N3rdProvider \} from '@n3rd-ai\/ui'/)
    })
  })

  describe('Component demos', () => {
    it('renders component category labels', () => {
      renderPage()
      expectText('BOX')
      expectText('BADGE')
      expectText('PROGRESS')
      expectText('TYPEWRITER')
    })

    it('renders badge demo variants', () => {
      renderPage()
      expectText(/DEPLOYED/)
      expectText(/BUILDING/)
      expectText(/QUEUED/)
    })

    it('renders component cards', () => {
      renderPage()
      expectText('Accordion')
      expectText('Tabs')
      expectText('Tooltip')
    })

    it('renders progress bars with expected values', () => {
      renderPage()
      const bars = screen.getAllByRole('progressbar')
      // The page renders 3 demo progress bars (87%, 42%, 12%)
      // plus table rows may also use progressbar role
      expect(bars.length).toBeGreaterThanOrEqual(3)
      const bar87 = bars.find((b) => b.getAttribute('aria-valuenow') === '87')
      const bar42 = bars.find((b) => b.getAttribute('aria-valuenow') === '42')
      const bar12 = bars.find((b) => b.getAttribute('aria-valuenow') === '12')
      expect(bar87).toBeDefined()
      expect(bar42).toBeDefined()
      expect(bar12).toBeDefined()
    })
  })

  describe('Themes section', () => {
    it('renders theme switcher buttons', () => {
      renderPage()
      expect(screen.getAllByRole('button', { name: /UNICORN/ }).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByRole('button', { name: /CLASSIC/ }).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByRole('button', { name: /RETRO/ }).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByRole('button', { name: /PAPER/ }).length).toBeGreaterThanOrEqual(1)
    })

    it('renders theme tab list with 4 tabs', () => {
      renderPage()
      const tablists = screen.getAllByRole('tablist')
      expect(tablists.length).toBeGreaterThanOrEqual(1)
      const tabs = within(tablists[0]).getAllByRole('tab')
      expect(tabs).toHaveLength(4)
    })

    it('shows unicorn theme import by default', () => {
      renderPage()
      expectText("import '@n3rd-ai/ui/theme/unicorn.css'")
    })
  })

  describe('Component table', () => {
    it('renders table column headers', () => {
      renderPage()
      expectText(/component/i)
      expectText(/category/i)
      expectText(/js bundle/i)
      expectText(/status/i)
    })

    it('renders component rows', () => {
      renderPage()
      expectText('Box / Stack / Row / Grid')
      expectText('Text / Heading / Badge')
      expectText('Button / Input')
    })

    it('renders status badges', () => {
      renderPage()
      expect(screen.getAllByText('STABLE').length).toBeGreaterThanOrEqual(5)
      expect(screen.getAllByText('NEW').length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Features section', () => {
    it('renders feature highlights', () => {
      renderPage()
      expectText('Server Components first')
      expectText('ASCII borders')
      expectText('Token-based theming')
      expectText('Tiny bundle')
      expectText('Monospace native')
      expectText('Hooks included')
      expectText('MCP ready')
    })
  })

  describe('FAQ section', () => {
    it('renders FAQ accordion buttons', () => {
      renderPage()
      expect(
        screen.getAllByRole('button', { name: /How do I install/ }).length,
      ).toBeGreaterThanOrEqual(1)
      expect(
        screen.getAllByRole('button', { name: /Does it work with Next.js App Router/ }).length,
      ).toBeGreaterThanOrEqual(1)
      expect(
        screen.getAllByRole('button', { name: /Can I customize the theme/ }).length,
      ).toBeGreaterThanOrEqual(1)
      expect(
        screen.getAllByRole('button', { name: /What about bundle size/ }).length,
      ).toBeGreaterThanOrEqual(1)
    })

    it('FAQ items are collapsed by default', () => {
      renderPage()
      const faqQuestions = [
        /How do I install/,
        /Does it work with Next.js App Router/,
        /Can I customize the theme/,
        /What about bundle size/,
      ]
      for (const question of faqQuestions) {
        const btn = screen.getAllByRole('button', { name: question })[0]
        expect(btn).toHaveAttribute('aria-expanded', 'false')
      }
    })
  })

  describe('Border styles', () => {
    it('renders all border style labels', () => {
      renderPage()
      expectText('single')
      expectText('double')
      expectText('rounded')
      expectText('dashed')
    })
  })

  describe('CTA section', () => {
    it('renders the get started heading', () => {
      renderPage()
      const headings = screen.getAllByRole('heading', { level: 2 })
      expect(headings.some((h) => h.textContent?.includes('Get started'))).toBe(true)
    })

    it('renders doc and github CTA links', () => {
      renderPage()
      expect(screen.getAllByRole('link', { name: /READ THE DOCS/ }).length).toBeGreaterThanOrEqual(
        1,
      )
      expect(screen.getAllByRole('link', { name: /VIEW ON GITHUB/ }).length).toBeGreaterThanOrEqual(
        1,
      )
    })
  })

  describe('Footer', () => {
    it('renders status line content', () => {
      renderPage()
      expectText('n3rd.ai v0.4.1')
      expectText('MIT License')
    })

    it('renders footer branding', () => {
      renderPage()
      expectText(/Superstellar LLC/)
    })
  })

  describe('Section structure', () => {
    it('renders section dividers', () => {
      renderPage()
      const separators = screen.getAllByRole('separator')
      expect(separators.length).toBeGreaterThanOrEqual(7)
    })
  })
})
