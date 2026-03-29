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
    animation: 'n3rd-cursor-blink var(--n3rd-cursor-blink) step-end infinite',
    color: 'var(--n3rd-text-primary)',
  }

  return (
    <span className={className} style={cursorStyle} aria-hidden="true">
      {CURSOR_CHARS[style]}
    </span>
  )
}
