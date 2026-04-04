import type { CSSProperties } from 'react'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps {
  children: string
  variant?: Variant
  className?: string
  style?: CSSProperties
}

const VARIANT_MAP: Record<Variant, string> = {
  default: 'var(--n3rd-accent-primary)',
  success: 'var(--n3rd-accent-success)',
  warning: 'var(--n3rd-accent-warning)',
  danger: 'var(--n3rd-accent-danger)',
  info: 'var(--n3rd-accent-info)',
}

export function Badge({ children, variant = 'default', className, style }: BadgeProps) {
  const badgeStyle: CSSProperties = {
    display: 'inline-block',
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-xs)',
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
