import type { CSSProperties } from 'react'
import { legacyClassName } from '../../utils'
import './Nav.css'

interface NavItem {
  label: string
  href: string
  active?: boolean
  external?: boolean
}

export interface NavProps {
  items: NavItem[]
  className?: string
  style?: CSSProperties
}

export function Nav({ items, className, style }: NavProps) {
  return (
    <nav className={legacyClassName('boum-nav', className ?? '')} style={style}>
      <div className={legacyClassName('boum-nav-items')}>
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={legacyClassName('boum-nav-item', item.active ? 'boum-nav-active' : '')}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {item.active && <span className={legacyClassName('boum-nav-indicator')}>&gt; </span>}[{' '}
            {item.label}
            {item.external ? ' ↗' : ''} ]
          </a>
        ))}
      </div>
    </nav>
  )
}

Nav.displayName = 'Nav'
