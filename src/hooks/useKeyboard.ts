'use client'

import { useEffect, useCallback } from 'react'

type KeyHandler = (e: KeyboardEvent) => void

interface Shortcut {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
  handler: KeyHandler
}

export function useKeyboard(shortcuts: Shortcut[]) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = (shortcut.ctrl ?? false) === e.ctrlKey
        const metaMatch = (shortcut.meta ?? false) === e.metaKey
        const shiftMatch = (shortcut.shift ?? false) === e.shiftKey
        const altMatch = (shortcut.alt ?? false) === e.altKey

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          e.preventDefault()
          shortcut.handler(e)
          return
        }
      }
    },
    [shortcuts],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
