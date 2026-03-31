import type { CSSProperties } from 'react'

export interface DividerProps {
  variant?: 'single' | 'double' | 'dashed'
  label?: string
  className?: string
  style?: CSSProperties
}

const CHARS = {
  single: '─',
  double: '═',
  dashed: '╌',
}

export function Divider({ variant = 'single', label, className, style }: DividerProps) {
  const char = CHARS[variant]
  const dividerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--n3rd-border-default)',
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-base)',
    margin: 'var(--n3rd-space-4) 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    ...style,
  }

  const lineStyle: CSSProperties = {
    flex: 1,
    overflow: 'hidden',
  }

  if (label) {
    return (
      <div className={className} style={dividerStyle} role="separator">
        <span style={lineStyle}>{char.repeat(200)}</span>
        <span
          style={{
            padding: '0 var(--n3rd-space-2)',
            color: 'var(--n3rd-text-secondary)',
            flexShrink: 0,
          }}
        >
          {label}
        </span>
        <span style={lineStyle}>{char.repeat(200)}</span>
      </div>
    )
  }

  return (
    <div className={className} style={dividerStyle} role="separator">
      <span style={lineStyle}>{char.repeat(200)}</span>
    </div>
  )
}

Divider.displayName = 'Divider'
