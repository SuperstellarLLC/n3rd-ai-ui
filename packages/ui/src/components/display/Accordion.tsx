'use client'

import { useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'

interface AccordionItem {
  title: string
  content: ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  multiple?: boolean
  className?: string
  style?: CSSProperties
}

export function Accordion({ items, multiple = false, className, style }: AccordionProps) {
  const [open, setOpen] = useState<Set<number>>(new Set())

  const toggle = (index: number) => {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : [])
      if (prev.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const containerStyle: CSSProperties = {
    fontFamily: 'var(--boum-font)',
    fontSize: 'var(--boum-text-base)',
    ...style,
  }

  return (
    <div className={className} style={containerStyle}>
      {items.map((item, i) => {
        const isOpen = open.has(i)
        return (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--boum-space-2)',
                width: '100%',
                padding: 'var(--boum-space-2) 0',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid var(--boum-border-muted)',
                fontFamily: 'var(--boum-font)',
                fontSize: 'var(--boum-text-base)',
                color: 'var(--boum-text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ color: 'var(--boum-accent-primary)', flexShrink: 0 }}>
                {isOpen ? '[-]' : '[+]'}
              </span>
              {item.title}
            </button>
            {isOpen && (
              <div
                style={{
                  padding: 'var(--boum-space-3) 0 var(--boum-space-3) var(--boum-space-6)',
                  color: 'var(--boum-text-secondary)',
                  borderBottom: '1px solid var(--boum-border-muted)',
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

Accordion.displayName = 'Accordion'
