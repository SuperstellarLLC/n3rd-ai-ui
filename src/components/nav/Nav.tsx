'use client'

import type { CSSProperties } from 'react'
import styles from './Nav.module.css'

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
    <nav className={`${styles.nav} ${className ?? ''}`} style={style}>
      <div className={styles.items}>
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`${styles.item} ${item.active ? styles.active : ''}`}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {item.active && <span className={styles.indicator}>&gt; </span>}[ {item.label}
            {item.external ? ' ↗' : ''} ]
          </a>
        ))}
      </div>
    </nav>
  )
}
