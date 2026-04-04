'use client'

import { useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'

export interface TooltipProps {
  children: ReactNode
  content: string
  position?: 'top' | 'bottom'
  className?: string
}

export function Tooltip({ children, content, position = 'top', className }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  }

  const tipStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    ...(position === 'top'
      ? { bottom: '100%', marginBottom: '6px' }
      : { top: '100%', marginTop: '6px' }),
    padding: 'var(--n3rd-space-1) var(--n3rd-space-2)',
    background: 'var(--n3rd-bg-tertiary)',
    border: '1px solid var(--n3rd-border-default)',
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-xs)',
    color: 'var(--n3rd-text-primary)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 'var(--n3rd-z-tooltip, 9997)' as unknown as number,
    animation: 'n3rd-fade-in var(--n3rd-fade-duration) ease-out',
  }

  return (
    <span
      className={className}
      style={wrapperStyle}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span style={tipStyle} role="tooltip">
          {content}
        </span>
      )}
    </span>
  )
}

Tooltip.displayName = 'Tooltip'
