'use client'

import { useCallback, useEffect, useState } from 'react'
import { Row, Button } from '@boum-ai/ui'

const THEMES = ['unicorn', 'classic', 'retro', 'paper'] as const
type Theme = (typeof THEMES)[number]

const STORAGE_KEY = 'boum-theme'

const themeTokens: Record<Theme, Record<string, string>> = {
  unicorn: {
    '--boum-bg-primary': '#0a0a0a',
    '--boum-bg-secondary': '#111111',
    '--boum-bg-tertiary': '#1a1a1a',
    '--boum-text-primary': '#e0e0e0',
    '--boum-text-secondary': '#888888',
    '--boum-text-tertiary': '#555555',
    '--boum-border-default': '#333333',
    '--boum-border-focus': '#a855f7',
    '--boum-border-muted': '#222222',
    '--boum-accent-violet': '#7c3aed',
    '--boum-accent-purple': '#a855f7',
    '--boum-accent-lavender': '#c084fc',
    '--boum-accent-pink': '#ec4899',
    '--boum-accent-rose': '#f472b6',
    '--boum-accent-cyan': '#06b6d4',
    '--boum-accent-aqua': '#22d3ee',
    '--boum-accent-primary': '#a855f7',
    '--boum-accent-success': '#22d3ee',
    '--boum-accent-warning': '#f472b6',
    '--boum-accent-danger': '#ec4899',
    '--boum-accent-info': '#06b6d4',
    '--boum-gradient': 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)',
    '--boum-gradient-full': 'linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)',
  },
  classic: {
    '--boum-bg-primary': '#0a0a0a',
    '--boum-bg-secondary': '#111111',
    '--boum-bg-tertiary': '#1a1a1a',
    '--boum-text-primary': '#e0e0e0',
    '--boum-text-secondary': '#888888',
    '--boum-text-tertiary': '#555555',
    '--boum-border-default': '#333333',
    '--boum-border-focus': '#22c55e',
    '--boum-border-muted': '#222222',
    '--boum-accent-violet': '#22c55e',
    '--boum-accent-purple': '#22c55e',
    '--boum-accent-lavender': '#4ade80',
    '--boum-accent-pink': '#ef4444',
    '--boum-accent-rose': '#f87171',
    '--boum-accent-cyan': '#22c55e',
    '--boum-accent-aqua': '#4ade80',
    '--boum-accent-primary': '#22c55e',
    '--boum-accent-success': '#4ade80',
    '--boum-accent-warning': '#eab308',
    '--boum-accent-danger': '#ef4444',
    '--boum-accent-info': '#22c55e',
    '--boum-gradient': 'linear-gradient(90deg, #16a34a, #22c55e, #4ade80)',
    '--boum-gradient-full': 'linear-gradient(90deg, #16a34a, #22c55e, #4ade80)',
  },
  retro: {
    '--boum-bg-primary': '#0a0a0a',
    '--boum-bg-secondary': '#111111',
    '--boum-bg-tertiary': '#1a1a1a',
    '--boum-text-primary': '#e0e0e0',
    '--boum-text-secondary': '#888888',
    '--boum-text-tertiary': '#555555',
    '--boum-border-default': '#333333',
    '--boum-border-focus': '#f59e0b',
    '--boum-border-muted': '#222222',
    '--boum-accent-violet': '#d97706',
    '--boum-accent-purple': '#f59e0b',
    '--boum-accent-lavender': '#fbbf24',
    '--boum-accent-pink': '#ef4444',
    '--boum-accent-rose': '#f87171',
    '--boum-accent-cyan': '#f59e0b',
    '--boum-accent-aqua': '#fbbf24',
    '--boum-accent-primary': '#f59e0b',
    '--boum-accent-success': '#fbbf24',
    '--boum-accent-warning': '#f97316',
    '--boum-accent-danger': '#ef4444',
    '--boum-accent-info': '#f59e0b',
    '--boum-gradient': 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)',
    '--boum-gradient-full': 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)',
  },
  paper: {
    '--boum-bg-primary': '#fafafa',
    '--boum-bg-secondary': '#f0f0f0',
    '--boum-bg-tertiary': '#e5e5e5',
    '--boum-text-primary': '#1a1a1a',
    '--boum-text-secondary': '#666666',
    '--boum-text-tertiary': '#999999',
    '--boum-border-default': '#cccccc',
    '--boum-border-focus': '#7c3aed',
    '--boum-border-muted': '#dddddd',
    '--boum-accent-violet': '#7c3aed',
    '--boum-accent-purple': '#a855f7',
    '--boum-accent-lavender': '#c084fc',
    '--boum-accent-pink': '#ec4899',
    '--boum-accent-rose': '#f472b6',
    '--boum-accent-cyan': '#06b6d4',
    '--boum-accent-aqua': '#22d3ee',
    '--boum-accent-primary': '#a855f7',
    '--boum-accent-success': '#22d3ee',
    '--boum-accent-warning': '#f472b6',
    '--boum-accent-danger': '#ec4899',
    '--boum-accent-info': '#06b6d4',
    '--boum-gradient': 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)',
    '--boum-gradient-full': 'linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)',
  },
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  // eslint-disable-next-line security/detect-object-injection
  for (const [key, value] of Object.entries(themeTokens[theme])) {
    root.style.setProperty(key, value)
  }
}

function getSavedTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && (THEMES as readonly string[]).includes(saved)) {
    return saved as Theme
  }
  return null
}

export default function ThemeSwitcher() {
  const [active, setActive] = useState<Theme>(() => getSavedTheme() ?? 'unicorn')

  useEffect(() => {
    const saved = getSavedTheme()
    if (saved) {
      applyTheme(saved)
    }
  }, [])

  const select = useCallback((theme: Theme) => {
    setActive(theme)
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [])

  return (
    <Row gap="sm" justify="center" wrap>
      {THEMES.map((theme) => (
        <Button
          key={theme}
          variant={active === theme ? 'primary' : 'ghost'}
          onClick={() => select(theme)}
        >
          {theme.toUpperCase()}
        </Button>
      ))}
    </Row>
  )
}
