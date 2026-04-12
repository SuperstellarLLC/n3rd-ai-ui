'use client'

import { useState, useEffect } from 'react'
import type { ReactNode, CSSProperties, MouseEvent } from 'react'
import { legacyClassName } from '../../utils'
import './Button.css'

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
  'aria-label'?: string
}

const SPINNER_FRAMES = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'boum-btn-primary',
  secondary: 'boum-btn-secondary',
  danger: 'boum-btn-danger',
  ghost: 'boum-btn-ghost',
}

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
  'aria-label': ariaLabel,
}: ButtonProps) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!loading) return
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % SPINNER_FRAMES.length)
    }, 80)
    return () => clearInterval(id)
  }, [loading])

  const classes = legacyClassName(
    'boum-btn',
    VARIANT_CLASS[variant],
    loading ? 'boum-btn-loading' : '',
    disabled ? 'boum-btn-disabled' : '',
    className ?? '',
  )

  const content = (
    <>
      {variant !== 'ghost' && '[ '}
      {loading && (
        <span className={legacyClassName('boum-btn-spinner')} aria-hidden="true">
          {SPINNER_FRAMES[frame]}
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
        aria-label={ariaLabel}
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
      aria-label={ariaLabel}
      onClick={onClick as (e: MouseEvent<HTMLButtonElement>) => void}
      disabled={disabled || loading}
    >
      {content}
    </button>
  )
}

Button.displayName = 'Button'
