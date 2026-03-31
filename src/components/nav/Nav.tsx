import type { CSSProperties } from 'react'
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
    <nav className={`n3rd-nav ${className ?? ''}`} style={style}>
      <div className="n3rd-nav-items">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`n3rd-nav-item ${item.active ? 'n3rd-nav-active' : ''}`}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {item.active && <span className="n3rd-nav-indicator">&gt; </span>}[ {item.label}
            {item.external ? ' ↗' : ''} ]
          </a>
        ))}
      </div>
    </nav>
  )
}

Nav.displayName = 'Nav'
