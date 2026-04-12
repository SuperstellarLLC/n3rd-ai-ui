import type { CSSProperties } from 'react'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps {
  children: string
  variant?: Variant
  className?: string
  style?: CSSProperties
}

const VARIANT_MAP: Record<Variant, string> = {
  default: 'var(--boum-accent-primary)',
  success: 'var(--boum-accent-success)',
  warning: 'var(--boum-accent-warning)',
  danger: 'var(--boum-accent-danger)',
  info: 'var(--boum-accent-info)',
}

export function Badge({ children, variant = 'default', className, style }: BadgeProps) {
  const badgeStyle: CSSProperties = {
    display: 'inline-block',
    fontFamily: 'var(--boum-font)',
    fontSize: 'var(--boum-text-xs)',
    fontWeight: 700,
    color: VARIANT_MAP[variant],
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    ...style,
  }

  return (
    <span className={className} style={badgeStyle}>
      [{children}]
    </span>
  )
}

Badge.displayName = 'Badge'
