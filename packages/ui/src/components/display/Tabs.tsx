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
    fontFamily: 'var(--n3rd-font)',
    ...style,
  }

  const accentColor = `var(--n3rd-accent-${accent})`

  return (
    <div className={className} style={containerStyle}>
      <div
        role="tablist"
        style={{
          display: 'flex',
          gap: 'var(--n3rd-space-1)',
          borderBottom: '1px solid var(--n3rd-border-default)',
          fontSize: 'var(--n3rd-text-sm)',
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            style={{
              padding: 'var(--n3rd-space-2) var(--n3rd-space-3)',
              background: 'none',
              border: 'none',
              borderBottom: i === active ? `2px solid ${accentColor}` : '2px solid transparent',
              fontFamily: 'var(--n3rd-font)',
              fontSize: 'var(--n3rd-text-sm)',
              color: i === active ? accentColor : 'var(--n3rd-text-secondary)',
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
          padding: 'var(--n3rd-space-4) 0',
        }}
      >
        {tabs[active]?.content}
      </div>
    </div>
  )
}

Tabs.displayName = 'Tabs'
