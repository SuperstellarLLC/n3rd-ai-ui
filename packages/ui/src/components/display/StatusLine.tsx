import type { ReactNode, CSSProperties } from 'react'

export interface StatusLineProps {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
  className?: string
  style?: CSSProperties
}

export function StatusLine({ left, center, right, className, style }: StatusLineProps) {
  const lineStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--boum-space-1) var(--boum-space-3)',
    backgroundColor: 'var(--boum-bg-secondary)',
    borderTop: '1px solid var(--boum-border-muted)',
    fontFamily: 'var(--boum-font)',
    fontSize: 'var(--boum-text-xs)',
    color: 'var(--boum-text-secondary)',
    ...style,
  }

  return (
    <div className={className} style={lineStyle} role="status" aria-live="polite">
      <div>{left}</div>
      <div>{center}</div>
      <div>{right}</div>
    </div>
  )
}

StatusLine.displayName = 'StatusLine'
