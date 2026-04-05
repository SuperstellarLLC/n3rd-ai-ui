import { describe, expect, it } from 'vitest'
import { metadata, viewport } from './layout'
import RootLayout from './layout'
import { render, screen } from '@testing-library/react'

describe('RootLayout', () => {
  describe('metadata export', () => {
    it('has the correct title', () => {
      expect(metadata.title).toBe('n3rd.ai — The reputation layer for AI agents')
    })

    it('has a description', () => {
      expect(metadata.description).toContain('signed and scored')
    })

    it('has keywords', () => {
      expect(metadata.keywords).toEqual(
        expect.arrayContaining(['mcp', 'reputation', 'ai-agents', 'attestation']),
      )
    })

    it('has author', () => {
      expect(metadata.authors).toEqual([{ name: 'Superstellar LLC' }])
    })

    it('has Open Graph metadata', () => {
      const og = metadata.openGraph as Record<string, unknown>
      expect(og).toBeDefined()
      expect(og.title).toBe('n3rd.ai — The reputation layer for AI agents')
      expect(og.url).toBe('https://n3rd.ai')
      expect(og.siteName).toBe('n3rd.ai')
      expect(og.type).toBe('website')
    })

    it('has Twitter card metadata', () => {
      const twitter = metadata.twitter as Record<string, unknown>
      expect(twitter).toBeDefined()
      expect(twitter.card).toBe('summary_large_image')
    })

    it('enables search indexing', () => {
      expect(metadata.robots).toEqual({ index: true, follow: true })
    })
  })

  describe('viewport export', () => {
    it('has the correct theme color', () => {
      expect(viewport.themeColor).toBe('#0a0a0a')
    })

    it('sets device width and initial scale', () => {
      expect(viewport.width).toBe('device-width')
      expect(viewport.initialScale).toBe(1)
    })
  })

  describe('component rendering', () => {
    it('renders children within the provider', () => {
      render(<RootLayout>Test content</RootLayout>)
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })
  })
})
