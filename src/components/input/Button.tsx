'use client'

import type { ReactNode, CSSProperties, MouseEvent } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

export interface ButtonProps {
  children: ReactNode
  variant?: Variant
  href?: string
  external?: boolean
  loading?: boolean
  disabled?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  className?: string
  style?: CSSProperties
  type?: 'button' | 'submit' | 'reset'
}

const SPINNER_FRAMES = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'

export function Button({
  children,
  variant = 'primary',
  href,
  external,
  loading = false,
  disabled = false,
  onClick,
  className,
  style,
  type = 'button',
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    loading ? styles.loading : '',
    disabled ? styles.disabled : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {variant !== 'ghost' && '[ '}
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          {SPINNER_FRAMES[0]}
        </span>
      )}
      {loading ? <>{children}...</> : children}
      {external && ' ↗'}
      {variant !== 'ghost' && ' ]'}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        style={style}
        onClick={onClick as (e: MouseEvent<HTMLAnchorElement>) => void}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      style={style}
      onClick={onClick as (e: MouseEvent<HTMLButtonElement>) => void}
      disabled={disabled || loading}
    >
      {content}
    </button>
  )
}
