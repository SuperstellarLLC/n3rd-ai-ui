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
  1: 'var(--boum-text-2xl)',
  2: 'var(--boum-text-xl)',
  3: 'var(--boum-text-lg)',
  4: 'var(--boum-text-base)',
  5: 'var(--boum-text-sm)',
  6: 'var(--boum-text-xs)',
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
    fontFamily: 'var(--boum-font)',
    fontSize: SIZE_MAP[level],
    fontWeight: 700,
    lineHeight: 'var(--boum-line-height)',
    color: gradient ? 'transparent' : 'var(--boum-text-primary)',
    ...(gradient && {
      background: 'var(--boum-gradient)',
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
            color: 'var(--boum-text-tertiary)',
            marginRight: 'var(--boum-space-2)',
            ...(gradient && { WebkitTextFillColor: 'var(--boum-text-tertiary)' }),
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
