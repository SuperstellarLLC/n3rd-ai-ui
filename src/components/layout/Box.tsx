import type { ReactNode, CSSProperties } from 'react'
import { getBorderChars } from '../../primitives/ascii-border'
import type { BorderStyle } from '../../primitives/ascii-border'
import './Box.css'

type Accent = 'primary' | 'success' | 'warning' | 'danger' | 'info'
type Padding = 'none' | 'sm' | 'md' | 'lg'

export interface BoxProps {
  children: ReactNode
  border?: BorderStyle
  title?: string
  accent?: Accent
  padding?: Padding
  className?: string
  style?: CSSProperties
}

const PADDING_MAP: Record<Padding, string> = {
  none: '0',
  sm: 'var(--n3rd-space-2)',
  md: 'var(--n3rd-space-4)',
  lg: 'var(--n3rd-space-6)',
}

export function Box({
  children,
  border = 'single',
  title,
  accent,
  padding = 'md',
  className,
  style,
}: BoxProps) {
  const chars = getBorderChars(border)
  const accentColor = accent ? `var(--n3rd-accent-${accent})` : 'var(--n3rd-border-default)'

  if (!chars) {
    return (
      <div className={className} style={{ padding: PADDING_MAP[padding], ...style }}>
        {children}
      </div>
    )
  }

  const boxStyle: CSSProperties = {
    ...style,
    '--box-border-color': accentColor,
    '--box-padding': PADDING_MAP[padding],
  } as CSSProperties

  return (
    <div className={`n3rd-box ${className ?? ''}`} style={boxStyle}>
      <div className="n3rd-box-border-top" aria-hidden="true">
        <span className="n3rd-box-border-char">{chars.topLeft}</span>
        {title && (
          <>
            <span className="n3rd-box-border-char">{chars.horizontal}</span>
            <span className="n3rd-box-title">{` ${title} `}</span>
          </>
        )}
        <span className="n3rd-box-border-line">{chars.horizontal.repeat(200)}</span>
        <span className="n3rd-box-border-char">{chars.topRight}</span>
      </div>
      <div className="n3rd-box-content">
        <span className="n3rd-box-border-side" aria-hidden="true">
          {chars.vertical}
        </span>
        <div className="n3rd-box-inner">{children}</div>
        <span className="n3rd-box-border-side" aria-hidden="true">
          {chars.vertical}
        </span>
      </div>
      <div className="n3rd-box-border-bottom" aria-hidden="true">
        <span className="n3rd-box-border-char">{chars.bottomLeft}</span>
        <span className="n3rd-box-border-line">{chars.horizontal.repeat(200)}</span>
        <span className="n3rd-box-border-char">{chars.bottomRight}</span>
      </div>
    </div>
  )
}

Box.displayName = 'Box'
