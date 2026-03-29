import type { CSSProperties } from 'react'
import { renderAsciiLines } from '../../primitives/ascii-font'

type Accent =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'violet'
  | 'purple'
  | 'lavender'
  | 'pink'
  | 'rose'
  | 'cyan'
  | 'aqua'

export interface LogoProps {
  text: string
  gradient?: boolean | string
  accent?: Accent
  className?: string
  style?: CSSProperties
}

export function Logo({ text, gradient = false, accent, className, style }: LogoProps) {
  const lines = renderAsciiLines(text)
  const gradientValue = typeof gradient === 'string' ? gradient : 'var(--n3rd-gradient)'

  const containerStyle: CSSProperties = {
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-sm)',
    fontWeight: 700,
    whiteSpace: 'pre',
    lineHeight: 1,
    letterSpacing: '-0.05em',
    color: accent ? `var(--n3rd-accent-${accent})` : 'var(--n3rd-text-primary)',
    ...style,
  }

  const gradientStyle: CSSProperties = gradient
    ? {
        background: gradientValue,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }
    : {}

  return (
    <div className={className} style={containerStyle} aria-label={text} role="img">
      {lines.map((line, i) => (
        <div key={i} style={gradientStyle}>
          {line}
        </div>
      ))}
    </div>
  )
}
