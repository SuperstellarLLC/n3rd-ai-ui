'use client'

import { type CSSProperties } from 'react'

export type CursorStyle = 'block' | 'line' | 'underscore'

const CURSOR_CHARS: Record<CursorStyle, string> = {
  block: '█',
  line: '▎',
  underscore: '▁',
}

export interface CursorProps {
  style?: CursorStyle
  className?: string
}

export function Cursor({ style = 'block', className }: CursorProps) {
  const cursorStyle: CSSProperties = {
    display: 'inline-block',
    animation: 'boum-cursor-blink var(--boum-cursor-blink) step-end infinite',
    color: 'var(--boum-text-primary)',
  }

  return (
    <span className={className} style={cursorStyle} aria-hidden="true">
      {CURSOR_CHARS[style]}
    </span>
  )
}

Cursor.displayName = 'Cursor'
