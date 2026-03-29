import type { CSSProperties } from 'react'

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
  const gradientValue = typeof gradient === 'string' ? gradient : 'var(--n3rd-gradient)'

  const logoStyle: CSSProperties = {
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-2xl)',
    fontWeight: 700,
    whiteSpace: 'pre',
    lineHeight: 1.1,
    color: gradient
      ? 'transparent'
      : accent
        ? `var(--n3rd-accent-${accent})`
        : 'var(--n3rd-text-primary)',
    ...(gradient && {
      background: gradientValue,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }),
    ...style,
  }

  return (
    <div className={className} style={logoStyle} aria-label={text} role="img">
      {text}
    </div>
  )
}
