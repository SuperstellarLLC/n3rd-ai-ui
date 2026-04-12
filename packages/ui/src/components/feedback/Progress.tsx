import type { CSSProperties } from 'react'

export interface ProgressProps {
  value: number
  max?: number
  width?: number
  showLabel?: boolean
  accent?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
  style?: CSSProperties
}

export function Progress({
  value,
  max = 100,
  width = 20,
  showLabel = true,
  accent,
  className,
  style,
}: ProgressProps) {
  const percent = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100))
  const filled = Math.round((percent / 100) * width)
  const empty = width - filled

  const bar = '█'.repeat(filled) + '░'.repeat(empty)

  const progressStyle: CSSProperties = {
    fontFamily: 'var(--boum-font)',
    fontSize: 'var(--boum-text-sm)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--boum-space-2)',
    color: accent ? `var(--boum-accent-${accent})` : 'var(--boum-accent-primary)',
    ...style,
  }

  return (
    <div
      className={className}
      style={progressStyle}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <span>[{bar}]</span>
      {showLabel && (
        <span style={{ color: 'var(--boum-text-secondary)' }}>{Math.round(percent)}%</span>
      )}
    </div>
  )
}

Progress.displayName = 'Progress'
