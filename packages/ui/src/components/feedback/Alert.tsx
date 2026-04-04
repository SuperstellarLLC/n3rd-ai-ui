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
  success: 'var(--n3rd-accent-success)',
  warning: 'var(--n3rd-accent-warning)',
  error: 'var(--n3rd-accent-danger)',
  info: 'var(--n3rd-accent-info)',
}

export function Alert({ children, variant = 'info', className, style }: AlertProps) {
  const alertStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--n3rd-space-2)',
    padding: 'var(--n3rd-space-3)',
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-sm)',
    backgroundColor: 'var(--n3rd-bg-secondary)',
    borderLeft: `2px solid ${COLORS[variant]}`,
    color: 'var(--n3rd-text-primary)',
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
