import type { ReactNode, CSSProperties } from 'react'
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
  const accentColor = accent ? `var(--n3rd-accent-${accent})` : 'var(--n3rd-border-default)'

  const cardStyle: CSSProperties = {
    '--card-accent': accentColor,
    ...style,
  } as CSSProperties

  const content = (
    <>
      {(title || subtitle) && (
        <div className="n3rd-card-header">
          {title && <div className="n3rd-card-title">{title}</div>}
          {subtitle && <div className="n3rd-card-subtitle">{subtitle}</div>}
        </div>
      )}
      <div className="n3rd-card-body">{children}</div>
      {footer && <div className="n3rd-card-footer">{footer}</div>}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={`n3rd-card n3rd-card-link ${className ?? ''}`}
        style={cardStyle}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <div className={`n3rd-card ${className ?? ''}`} style={cardStyle}>
      {content}
    </div>
  )
}

Card.displayName = 'Card'
