import type { ReactNode, CSSProperties } from 'react'

type Variant = 'success' | 'warning' | 'error' | 'info'

export interface AlertProps {
  children: ReactNode
  variant?: Variant
  className?: string
  style?: CSSProperties
}

const ICONS: Record<Variant, string> = {
  success: '[✓]',
  warning: '[!]',
  error: '[✗]',
  info: '[i]',
}

const COLORS: Record<Variant, string> = {
  success: 'var(--boum-accent-success)',
  warning: 'var(--boum-accent-warning)',
  error: 'var(--boum-accent-danger)',
  info: 'var(--boum-accent-info)',
}

export function Alert({ children, variant = 'info', className, style }: AlertProps) {
  const alertStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--boum-space-2)',
    padding: 'var(--boum-space-3)',
    fontFamily: 'var(--boum-font)',
    fontSize: 'var(--boum-text-sm)',
    backgroundColor: 'var(--boum-bg-secondary)',
    borderLeft: `2px solid ${COLORS[variant]}`,
    color: 'var(--boum-text-primary)',
    ...style,
  }

  return (
    <div className={className} style={alertStyle} role="alert">
      <span style={{ color: COLORS[variant], flexShrink: 0 }}>{ICONS[variant]}</span>
      <div>{children}</div>
    </div>
  )
}

Alert.displayName = 'Alert'
