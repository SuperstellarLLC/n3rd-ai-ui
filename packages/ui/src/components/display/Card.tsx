import type { ReactNode, CSSProperties } from 'react'
import { legacyClassName } from '../../utils'
import './Card.css'

type Accent = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  footer?: ReactNode
  accent?: Accent
  href?: string
  external?: boolean
  className?: string
  style?: CSSProperties
}

export function Card({
  children,
  title,
  subtitle,
  footer,
  accent,
  href,
  external,
  className,
  style,
}: CardProps) {
  const accentColor = accent ? `var(--boum-accent-${accent})` : 'var(--boum-border-default)'

  const cardStyle: CSSProperties = {
    '--card-accent': accentColor,
    ...style,
  } as CSSProperties

  const content = (
    <>
      {(title || subtitle) && (
        <div className={legacyClassName('boum-card-header')}>
          {title && <div className={legacyClassName('boum-card-title')}>{title}</div>}
          {subtitle && <div className={legacyClassName('boum-card-subtitle')}>{subtitle}</div>}
        </div>
      )}
      <div className={legacyClassName('boum-card-body')}>{children}</div>
      {footer && <div className={legacyClassName('boum-card-footer')}>{footer}</div>}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={legacyClassName('boum-card', 'boum-card-link', className ?? '')}
        style={cardStyle}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <div className={legacyClassName('boum-card', className ?? '')} style={cardStyle}>
      {content}
    </div>
  )
}

Card.displayName = 'Card'
