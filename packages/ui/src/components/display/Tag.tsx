import type { CSSProperties } from 'react'

type Accent = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface TagProps {
  children: string
  accent?: Accent
  removable?: boolean
  onRemove?: () => void
  className?: string
  style?: CSSProperties
}

export function Tag({
  children,
  accent = 'primary',
  removable = false,
  onRemove,
  className,
  style,
}: TagProps) {
  const accentColor = `var(--boum-accent-${accent})`

  const tagStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--boum-space-1)',
    fontFamily: 'var(--boum-font)',
    fontSize: 'var(--boum-text-xs)',
    color: accentColor,
    border: `1px solid ${accentColor}`,
    padding: '1px var(--boum-space-2)',
    ...style,
  }

  const removeStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    fontFamily: 'var(--boum-font)',
    fontSize: 'var(--boum-text-xs)',
    color: accentColor,
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
    opacity: 0.6,
  }

  return (
    <span className={className} style={tagStyle}>
      {children}
      {removable && (
        <button onClick={onRemove} style={removeStyle} aria-label={`Remove ${children}`}>
          ×
        </button>
      )}
    </span>
  )
}

Tag.displayName = 'Tag'
