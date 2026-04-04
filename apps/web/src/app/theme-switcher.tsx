'use client'

import { useCallback, useEffect, useState } from 'react'
import { Row, Button } from '@n3rd-ai/ui'

const THEMES = ['unicorn', 'classic', 'retro', 'paper'] as const
type Theme = (typeof THEMES)[number]

const STORAGE_KEY = 'n3rd-theme'

const themeTokens: Record<Theme, Record<string, string>> = {
  unicorn: {
    '--n3rd-bg-primary': '#0a0a0a',
    '--n3rd-bg-secondary': '#111111',
    '--n3rd-bg-tertiary': '#1a1a1a',
    '--n3rd-text-primary': '#e0e0e0',
    '--n3rd-text-secondary': '#888888',
    '--n3rd-text-tertiary': '#555555',
    '--n3rd-border-default': '#333333',
    '--n3rd-border-focus': '#a855f7',
    '--n3rd-border-muted': '#222222',
    '--n3rd-accent-violet': '#7c3aed',
    '--n3rd-accent-purple': '#a855f7',
    '--n3rd-accent-lavender': '#c084fc',
    '--n3rd-accent-pink': '#ec4899',
    '--n3rd-accent-rose': '#f472b6',
    '--n3rd-accent-cyan': '#06b6d4',
    '--n3rd-accent-aqua': '#22d3ee',
    '--n3rd-accent-primary': '#a855f7',
    '--n3rd-accent-success': '#22d3ee',
    '--n3rd-accent-warning': '#f472b6',
    '--n3rd-accent-danger': '#ec4899',
    '--n3rd-accent-info': '#06b6d4',
    '--n3rd-gradient': 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)',
    '--n3rd-gradient-full': 'linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)',
  },
  classic: {
    '--n3rd-bg-primary': '#0a0a0a',
    '--n3rd-bg-secondary': '#111111',
    '--n3rd-bg-tertiary': '#1a1a1a',
    '--n3rd-text-primary': '#e0e0e0',
    '--n3rd-text-secondary': '#888888',
    '--n3rd-text-tertiary': '#555555',
    '--n3rd-border-default': '#333333',
    '--n3rd-border-focus': '#22c55e',
    '--n3rd-border-muted': '#222222',
    '--n3rd-accent-violet': '#22c55e',
    '--n3rd-accent-purple': '#22c55e',
    '--n3rd-accent-lavender': '#4ade80',
    '--n3rd-accent-pink': '#ef4444',
    '--n3rd-accent-rose': '#f87171',
    '--n3rd-accent-cyan': '#22c55e',
    '--n3rd-accent-aqua': '#4ade80',
    '--n3rd-accent-primary': '#22c55e',
    '--n3rd-accent-success': '#4ade80',
    '--n3rd-accent-warning': '#eab308',
    '--n3rd-accent-danger': '#ef4444',
    '--n3rd-accent-info': '#22c55e',
    '--n3rd-gradient': 'linear-gradient(90deg, #16a34a, #22c55e, #4ade80)',
    '--n3rd-gradient-full': 'linear-gradient(90deg, #16a34a, #22c55e, #4ade80)',
  },
  retro: {
    '--n3rd-bg-primary': '#0a0a0a',
    '--n3rd-bg-secondary': '#111111',
    '--n3rd-bg-tertiary': '#1a1a1a',
    '--n3rd-text-primary': '#e0e0e0',
    '--n3rd-text-secondary': '#888888',
    '--n3rd-text-tertiary': '#555555',
    '--n3rd-border-default': '#333333',
    '--n3rd-border-focus': '#f59e0b',
    '--n3rd-border-muted': '#222222',
    '--n3rd-accent-violet': '#d97706',
    '--n3rd-accent-purple': '#f59e0b',
    '--n3rd-accent-lavender': '#fbbf24',
    '--n3rd-accent-pink': '#ef4444',
    '--n3rd-accent-rose': '#f87171',
    '--n3rd-accent-cyan': '#f59e0b',
    '--n3rd-accent-aqua': '#fbbf24',
    '--n3rd-accent-primary': '#f59e0b',
    '--n3rd-accent-success': '#fbbf24',
    '--n3rd-accent-warning': '#f97316',
    '--n3rd-accent-danger': '#ef4444',
    '--n3rd-accent-info': '#f59e0b',
    '--n3rd-gradient': 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)',
    '--n3rd-gradient-full': 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)',
  },
  paper: {
    '--n3rd-bg-primary': '#fafafa',
    '--n3rd-bg-secondary': '#f0f0f0',
    '--n3rd-bg-tertiary': '#e5e5e5',
    '--n3rd-text-primary': '#1a1a1a',
    '--n3rd-text-secondary': '#666666',
    '--n3rd-text-tertiary': '#999999',
    '--n3rd-border-default': '#cccccc',
    '--n3rd-border-focus': '#7c3aed',
    '--n3rd-border-muted': '#dddddd',
    '--n3rd-accent-violet': '#7c3aed',
    '--n3rd-accent-purple': '#a855f7',
    '--n3rd-accent-lavender': '#c084fc',
    '--n3rd-accent-pink': '#ec4899',
    '--n3rd-accent-rose': '#f472b6',
    '--n3rd-accent-cyan': '#06b6d4',
    '--n3rd-accent-aqua': '#22d3ee',
    '--n3rd-accent-primary': '#a855f7',
    '--n3rd-accent-success': '#22d3ee',
    '--n3rd-accent-warning': '#f472b6',
    '--n3rd-accent-danger': '#ec4899',
    '--n3rd-accent-info': '#06b6d4',
    '--n3rd-gradient': 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)',
    '--n3rd-gradient-full': 'linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)',
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
