import type { ReactNode, CSSProperties } from 'react'
import { getBorderChars } from '../../primitives/ascii-border'
import type { BorderStyle } from '../../primitives/ascii-border'
import { legacyClassName } from '../../utils'
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
  sm: 'var(--boum-space-2)',
  md: 'var(--boum-space-4)',
  lg: 'var(--boum-space-6)',
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
  const accentColor = accent ? `var(--boum-accent-${accent})` : 'var(--boum-border-default)'

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
    <div className={legacyClassName('boum-box', className ?? '')} style={boxStyle}>
      <div className={legacyClassName('boum-box-border-top')} aria-hidden="true">
        <span className={legacyClassName('boum-box-border-char')}>{chars.topLeft}</span>
        {title && (
          <>
            <span className={legacyClassName('boum-box-border-char')}>{chars.horizontal}</span>
            <span className={legacyClassName('boum-box-title')}>{` ${title} `}</span>
          </>
        )}
        <span className={legacyClassName('boum-box-border-line')}>
          {chars.horizontal.repeat(200)}
        </span>
        <span className={legacyClassName('boum-box-border-char')}>{chars.topRight}</span>
      </div>
      <div className={legacyClassName('boum-box-content')}>
        <span className={legacyClassName('boum-box-border-side')} aria-hidden="true">
          {chars.vertical}
        </span>
        <div className={legacyClassName('boum-box-inner')}>{children}</div>
        <span className={legacyClassName('boum-box-border-side')} aria-hidden="true">
          {chars.vertical}
        </span>
      </div>
      <div className={legacyClassName('boum-box-border-bottom')} aria-hidden="true">
        <span className={legacyClassName('boum-box-border-char')}>{chars.bottomLeft}</span>
        <span className={legacyClassName('boum-box-border-line')}>
          {chars.horizontal.repeat(200)}
        </span>
        <span className={legacyClassName('boum-box-border-char')}>{chars.bottomRight}</span>
      </div>
    </div>
  )
}

Box.displayName = 'Box'
