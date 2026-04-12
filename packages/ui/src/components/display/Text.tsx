import type { ReactNode, CSSProperties } from 'react'

type Size = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
type Color =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export interface TextProps {
  children: ReactNode
  size?: Size
  color?: Color
  bold?: boolean
  prefix?: string
  gradient?: boolean
  as?: 'span' | 'p' | 'div'
  className?: string
  style?: CSSProperties
}

const SIZE_MAP: Record<Size, string> = {
  xs: 'var(--boum-text-xs)',
  sm: 'var(--boum-text-sm)',
  base: 'var(--boum-text-base)',
  lg: 'var(--boum-text-lg)',
  xl: 'var(--boum-text-xl)',
  '2xl': 'var(--boum-text-2xl)',
}

const COLOR_MAP: Record<Color, string> = {
  primary: 'var(--boum-text-primary)',
  secondary: 'var(--boum-text-secondary)',
  tertiary: 'var(--boum-text-tertiary)',
  accent: 'var(--boum-accent-primary)',
  success: 'var(--boum-accent-success)',
  warning: 'var(--boum-accent-warning)',
  danger: 'var(--boum-accent-danger)',
  info: 'var(--boum-accent-info)',
}

export function Text({
  children,
  size = 'base',
  color = 'primary',
  bold = false,
  prefix,
  gradient = false,
  as: Tag = 'span',
  className,
  style,
}: TextProps) {
  const textStyle: CSSProperties = {
    fontFamily: 'var(--boum-font)',
    fontSize: SIZE_MAP[size],
    fontWeight: bold ? 700 : 400,
    lineHeight: 'var(--boum-line-height)',
    color: gradient ? 'transparent' : COLOR_MAP[color],
    ...(gradient && {
      background: 'var(--boum-gradient)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }),
    ...style,
  }

  return (
    <Tag className={className} style={textStyle}>
      {prefix && (
        <span
          style={{
            color: 'var(--boum-text-secondary)',
            marginRight: 'var(--boum-space-1)',
            ...(gradient && { WebkitTextFillColor: 'var(--boum-text-secondary)' }),
          }}
        >
          {prefix}
        </span>
      )}
      {gradient ? <span>{children}</span> : children}
    </Tag>
  )
}

Text.displayName = 'Text'
