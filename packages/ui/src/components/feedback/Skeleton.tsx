import type { CSSProperties } from 'react'

export interface SkeletonProps {
  width?: number
  lines?: number
  className?: string
  style?: CSSProperties
}

export function Skeleton({ width = 30, lines = 1, className, style }: SkeletonProps) {
  const skeletonStyle: CSSProperties = {
    fontFamily: 'var(--boum-font)',
    fontSize: 'var(--boum-text-base)',
    color: 'var(--boum-text-tertiary)',
    lineHeight: 'var(--boum-line-height)',
    ...style,
  }

  return (
    <div className={className} style={skeletonStyle} aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i}>{'░'.repeat(i === lines - 1 ? Math.ceil(width * 0.6) : width)}</div>
      ))}
    </div>
  )
}

Skeleton.displayName = 'Skeleton'
