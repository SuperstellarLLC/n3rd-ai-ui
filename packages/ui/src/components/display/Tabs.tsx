'use client'

import { useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'

interface TabItem {
  label: string
  content: ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  defaultIndex?: number
  accent?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
  style?: CSSProperties
}

export function Tabs({ tabs, defaultIndex = 0, accent = 'primary', className, style }: TabsProps) {
  const [active, setActive] = useState(defaultIndex)

  const containerStyle: CSSProperties = {
    fontFamily: 'var(--boum-font)',
    ...style,
  }

  const accentColor = `var(--boum-accent-${accent})`

  return (
    <div className={className} style={containerStyle}>
      <div
        role="tablist"
        style={{
          display: 'flex',
          gap: 'var(--boum-space-1)',
          borderBottom: '1px solid var(--boum-border-default)',
          fontSize: 'var(--boum-text-sm)',
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            style={{
              padding: 'var(--boum-space-2) var(--boum-space-3)',
              background: 'none',
              border: 'none',
              borderBottom: i === active ? `2px solid ${accentColor}` : '2px solid transparent',
              fontFamily: 'var(--boum-font)',
              fontSize: 'var(--boum-text-sm)',
              color: i === active ? accentColor : 'var(--boum-text-secondary)',
              cursor: 'pointer',
              fontWeight: i === active ? 700 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        style={{
          padding: 'var(--boum-space-4) 0',
        }}
      >
        {tabs[active]?.content}
      </div>
    </div>
  )
}

Tabs.displayName = 'Tabs'
