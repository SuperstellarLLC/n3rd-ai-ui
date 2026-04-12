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
    color: 'var(--boum-border-default)',
    fontFamily: 'var(--boum-font)',
    fontSize: 'var(--boum-text-base)',
    margin: 'var(--boum-space-4) 0',
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
            padding: '0 var(--boum-space-2)',
            color: 'var(--boum-text-secondary)',
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
