import type { ReactNode, CSSProperties } from 'react'

type Level = 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingProps {
  children: ReactNode
  level?: Level
  prefix?: boolean
  gradient?: boolean
  className?: string
  style?: CSSProperties
}

const SIZE_MAP: Record<Level, string> = {
  1: 'var(--n3rd-text-2xl)',
  2: 'var(--n3rd-text-xl)',
  3: 'var(--n3rd-text-lg)',
  4: 'var(--n3rd-text-base)',
  5: 'var(--n3rd-text-sm)',
  6: 'var(--n3rd-text-xs)',
}

const PREFIX_MAP: Record<Level, string> = {
  1: '#',
  2: '##',
  3: '###',
  4: '####',
  5: '#####',
  6: '######',
}

export function Heading({
  children,
  level = 2,
  prefix = true,
  gradient = false,
  className,
  style,
}: HeadingProps) {
  const Tag = `h${level}` as const

  const headingStyle: CSSProperties = {
    fontFamily: 'var(--n3rd-font)',
    fontSize: SIZE_MAP[level],
    fontWeight: 700,
    lineHeight: 'var(--n3rd-line-height)',
    color: gradient ? 'transparent' : 'var(--n3rd-text-primary)',
    ...(gradient && {
      background: 'var(--n3rd-gradient)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }),
    margin: 0,
    ...style,
  }

  return (
    <Tag className={className} style={headingStyle}>
      {prefix && (
        <span
          style={{
            color: 'var(--n3rd-text-tertiary)',
            marginRight: 'var(--n3rd-space-2)',
            ...(gradient && { WebkitTextFillColor: 'var(--n3rd-text-tertiary)' }),
          }}
        >
          {PREFIX_MAP[level]}
        </span>
      )}
      {gradient ? <span>{children}</span> : children}
    </Tag>
  )
}

Heading.displayName = 'Heading'
