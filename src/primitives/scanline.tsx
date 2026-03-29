'use client'

import type { CSSProperties } from 'react'

export interface ScanlineProps {
  opacity?: number
}

export function Scanline({ opacity = 0.03 }: ScanlineProps) {
  const style: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 9999,
    background: `repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(0, 0, 0, ${opacity}) 1px,
      rgba(0, 0, 0, ${opacity}) 2px
    )`,
  }

  return <div style={style} aria-hidden="true" />
}
