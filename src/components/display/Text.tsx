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
  xs: 'var(--n3rd-text-xs)',
  sm: 'var(--n3rd-text-sm)',
  base: 'var(--n3rd-text-base)',
  lg: 'var(--n3rd-text-lg)',
  xl: 'var(--n3rd-text-xl)',
  '2xl': 'var(--n3rd-text-2xl)',
}

const COLOR_MAP: Record<Color, string> = {
  primary: 'var(--n3rd-text-primary)',
  secondary: 'var(--n3rd-text-secondary)',
  tertiary: 'var(--n3rd-text-tertiary)',
  accent: 'var(--n3rd-accent-primary)',
  success: 'var(--n3rd-accent-success)',
  warning: 'var(--n3rd-accent-warning)',
  danger: 'var(--n3rd-accent-danger)',
  info: 'var(--n3rd-accent-info)',
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
    fontFamily: 'var(--n3rd-font)',
    fontSize: SIZE_MAP[size],
    fontWeight: bold ? 700 : 400,
    lineHeight: 'var(--n3rd-line-height)',
    color: gradient ? 'transparent' : COLOR_MAP[color],
    ...(gradient && {
      background: 'var(--n3rd-gradient)',
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
            color: 'var(--n3rd-text-secondary)',
            marginRight: 'var(--n3rd-space-1)',
            ...(gradient && { WebkitTextFillColor: 'var(--n3rd-text-secondary)' }),
          }}
        >
          {prefix}
        </span>
      )}
      {gradient ? <span>{children}</span> : children}
    </Tag>
  )
}
