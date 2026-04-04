import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeSwitcher from './theme-switcher'

const STORAGE_KEY = 'n3rd-theme'

/** Button name patterns — handles the `[ LABEL ]` brackets on primary variant */
const buttonPatterns: Record<string, RegExp> = {
  UNICORN: /UNICORN/,
  CLASSIC: /CLASSIC/,
  RETRO: /RETRO/,
  PAPER: /PAPER/,
}

function getButton(label: string) {
  // eslint-disable-next-line security/detect-object-injection
  return screen.getByRole('button', { name: buttonPatterns[label] })
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.style.cssText = ''
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('ThemeSwitcher', () => {
  describe('rendering', () => {
    it('renders a button for each theme', () => {
      render(<ThemeSwitcher />)
      expect(getButton('UNICORN')).toBeInTheDocument()
      expect(getButton('CLASSIC')).toBeInTheDocument()
      expect(getButton('RETRO')).toBeInTheDocument()
      expect(getButton('PAPER')).toBeInTheDocument()
    })

    it('highlights unicorn as the default active theme', () => {
      render(<ThemeSwitcher />)
      expect(getButton('UNICORN')).toHaveClass('n3rd-btn-primary')
      expect(getButton('CLASSIC')).toHaveClass('n3rd-btn-ghost')
      expect(getButton('RETRO')).toHaveClass('n3rd-btn-ghost')
      expect(getButton('PAPER')).toHaveClass('n3rd-btn-ghost')
    })
  })

  describe('theme switching', () => {
    it('applies classic theme CSS variables when clicked', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(getButton('CLASSIC'))

      expect(document.documentElement.style.getPropertyValue('--n3rd-accent-primary')).toBe(
        '#22c55e',
      )
      expect(document.documentElement.style.getPropertyValue('--n3rd-gradient')).toBe(
        'linear-gradient(90deg, #16a34a, #22c55e, #4ade80)',
      )
    })

    it('applies retro theme CSS variables when clicked', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(getButton('RETRO'))

      expect(document.documentElement.style.getPropertyValue('--n3rd-accent-primary')).toBe(
        '#f59e0b',
      )
    })

    it('applies paper theme with light backgrounds', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(getButton('PAPER'))

      expect(document.documentElement.style.getPropertyValue('--n3rd-bg-primary')).toBe('#fafafa')
      expect(document.documentElement.style.getPropertyValue('--n3rd-text-primary')).toBe('#1a1a1a')
    })

    it('applies unicorn theme (dark backgrounds, violet accent)', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      // Switch away first, then back
      await user.click(getButton('PAPER'))
      await user.click(getButton('UNICORN'))

      expect(document.documentElement.style.getPropertyValue('--n3rd-bg-primary')).toBe('#0a0a0a')
      expect(document.documentElement.style.getPropertyValue('--n3rd-accent-primary')).toBe(
        '#a855f7',
      )
    })

    it('updates active button styling on switch', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(getButton('CLASSIC'))

      expect(getButton('CLASSIC')).toHaveClass('n3rd-btn-primary')
      expect(getButton('UNICORN')).toHaveClass('n3rd-btn-ghost')
    })

    it('switches between all themes in sequence', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      const expected: [string, string][] = [
        ['CLASSIC', '#22c55e'],
        ['RETRO', '#f59e0b'],
        ['PAPER', '#a855f7'],
        ['UNICORN', '#a855f7'],
      ]

      for (const [label, accent] of expected) {
        await user.click(getButton(label))
        expect(document.documentElement.style.getPropertyValue('--n3rd-accent-primary')).toBe(
          accent,
        )
      }
    })
  })

  describe('localStorage persistence', () => {
    it('saves the selected theme to localStorage', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(getButton('RETRO'))

      expect(localStorage.getItem(STORAGE_KEY)).toBe('retro')
    })

    it('restores the saved theme on mount', () => {
      localStorage.setItem(STORAGE_KEY, 'classic')
      render(<ThemeSwitcher />)

      expect(document.documentElement.style.getPropertyValue('--n3rd-accent-primary')).toBe(
        '#22c55e',
      )
    })

    it('restores paper theme (light mode) from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'paper')
      render(<ThemeSwitcher />)

      expect(document.documentElement.style.getPropertyValue('--n3rd-bg-primary')).toBe('#fafafa')
    })

    it('ignores invalid localStorage values', () => {
      localStorage.setItem(STORAGE_KEY, 'neon-garbage')
      render(<ThemeSwitcher />)

      // Should not crash, and should not apply any theme override
      expect(document.documentElement.style.getPropertyValue('--n3rd-accent-primary')).toBe('')
    })

    it('overwrites previous selection on re-pick', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(getButton('CLASSIC'))
      expect(localStorage.getItem(STORAGE_KEY)).toBe('classic')

      await user.click(getButton('PAPER'))
      expect(localStorage.getItem(STORAGE_KEY)).toBe('paper')
    })
  })

  describe('CSS variable completeness', () => {
    it('sets all expected CSS variables for each theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      const expectedVars = [
        '--n3rd-bg-primary',
        '--n3rd-bg-secondary',
        '--n3rd-bg-tertiary',
        '--n3rd-text-primary',
        '--n3rd-text-secondary',
        '--n3rd-text-tertiary',
        '--n3rd-border-default',
        '--n3rd-border-focus',
        '--n3rd-border-muted',
        '--n3rd-accent-violet',
        '--n3rd-accent-purple',
        '--n3rd-accent-lavender',
        '--n3rd-accent-pink',
        '--n3rd-accent-rose',
        '--n3rd-accent-cyan',
        '--n3rd-accent-aqua',
        '--n3rd-accent-primary',
        '--n3rd-accent-success',
        '--n3rd-accent-warning',
        '--n3rd-accent-danger',
        '--n3rd-accent-info',
        '--n3rd-gradient',
        '--n3rd-gradient-full',
      ]

      for (const themeName of ['CLASSIC', 'RETRO', 'PAPER', 'UNICORN']) {
        await user.click(getButton(themeName))

        for (const varName of expectedVars) {
          const value = document.documentElement.style.getPropertyValue(varName)
          expect(value, `${themeName} should set ${varName}`).not.toBe('')
        }
      }
    })
  })
})
