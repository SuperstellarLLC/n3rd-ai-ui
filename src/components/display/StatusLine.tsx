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
    padding: 'var(--n3rd-space-1) var(--n3rd-space-3)',
    backgroundColor: 'var(--n3rd-bg-secondary)',
    borderTop: '1px solid var(--n3rd-border-muted)',
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-xs)',
    color: 'var(--n3rd-text-secondary)',
    ...style,
  }

  return (
    <div className={className} style={lineStyle} role="status">
      <div>{left}</div>
      <div>{center}</div>
      <div>{right}</div>
    </div>
  )
}

StatusLine.displayName = 'StatusLine'
