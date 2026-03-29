import type { ReactNode, CSSProperties } from 'react'

type Bullet = '>' | '-' | '*' | 'numbered' | 'none'

export interface ListProps {
  items: ReactNode[]
  bullet?: Bullet
  className?: string
  style?: CSSProperties
}

export function List({ items, bullet = '>', className, style }: ListProps) {
  const listStyle: CSSProperties = {
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-base)',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    ...style,
  }

  return (
    <ul className={className} style={listStyle}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            gap: 'var(--n3rd-space-2)',
            marginBottom: 'var(--n3rd-space-1)',
          }}
        >
          {bullet !== 'none' && (
            <span style={{ color: 'var(--n3rd-accent-primary)', flexShrink: 0 }}>
              {bullet === 'numbered' ? `${i + 1}.` : bullet}
            </span>
          )}
          <span style={{ color: 'var(--n3rd-text-primary)' }}>{item}</span>
        </li>
      ))}
    </ul>
  )
}
