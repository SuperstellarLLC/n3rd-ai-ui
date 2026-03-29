import type { ReactNode, CSSProperties } from 'react'
import { getBorderChars } from '../../primitives/ascii-border'
import type { BorderStyle } from '../../primitives/ascii-border'
import styles from './Box.module.css'

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
    <div className={`${styles.box} ${className ?? ''}`} style={boxStyle}>
      <div className={styles.borderTop} aria-hidden="true">
        <span className={styles.borderChar}>{chars.topLeft}</span>
        {title && (
          <>
            <span className={styles.borderChar}>{chars.horizontal}</span>
            <span className={styles.title}>{` ${title} `}</span>
          </>
        )}
        <span className={styles.borderLine}>{chars.horizontal}</span>
        <span className={styles.borderChar}>{chars.topRight}</span>
      </div>
      <div className={styles.content}>
        <span className={styles.borderSide} aria-hidden="true">
          {chars.vertical}
        </span>
        <div className={styles.inner}>{children}</div>
        <span className={styles.borderSide} aria-hidden="true">
          {chars.vertical}
        </span>
      </div>
      <div className={styles.borderBottom} aria-hidden="true">
        <span className={styles.borderChar}>{chars.bottomLeft}</span>
        <span className={styles.borderLine}>{chars.horizontal}</span>
        <span className={styles.borderChar}>{chars.bottomRight}</span>
      </div>
    </div>
  )
}
