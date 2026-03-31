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
  decorated?: boolean
  className?: string
  style?: CSSProperties
}

const STAR_ROWS = [
  '  ·    ✦        ·            ·        ✦    ·  ',
  '       ·    ·        ✦            ·           ',
]

export function Logo({
  text,
  gradient = false,
  accent,
  decorated = false,
  className,
  style,
}: LogoProps) {
  const lines = renderAsciiLines(text)
  const gradientValue = typeof gradient === 'string' ? gradient : 'var(--n3rd-gradient)'

  const containerStyle: CSSProperties = {
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-base)',
    fontWeight: 700,
    whiteSpace: 'pre',
    lineHeight: 1,
    letterSpacing: '-0.05em',
    textAlign: 'center',
    padding: 'var(--n3rd-space-6) 0',
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

  const starStyle: CSSProperties = {
    color: 'var(--n3rd-accent-lavender, #c084fc)',
    opacity: 0.35,
    letterSpacing: 'normal',
    fontSize: 'var(--n3rd-text-sm)',
    lineHeight: 1.8,
  }

  return (
    <div className={className} style={containerStyle} aria-label={text} role="img">
      {decorated &&
        STAR_ROWS.map((row, i) => (
          <div key={`star-top-${i}`} style={starStyle} aria-hidden="true">
            {row}
          </div>
        ))}
      {lines.map((line, i) => (
        <div key={i} style={gradientStyle}>
          {line}
        </div>
      ))}
      {decorated &&
        STAR_ROWS.slice()
          .reverse()
          .map((row, i) => (
            <div key={`star-bottom-${i}`} style={starStyle} aria-hidden="true">
              {row}
            </div>
          ))}
    </div>
  )
}

Logo.displayName = 'Logo'
