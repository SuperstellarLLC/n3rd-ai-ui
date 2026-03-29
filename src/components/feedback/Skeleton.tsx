import type { CSSProperties } from 'react'

export interface SkeletonProps {
  width?: number
  lines?: number
  className?: string
  style?: CSSProperties
}

export function Skeleton({ width = 30, lines = 1, className, style }: SkeletonProps) {
  const skeletonStyle: CSSProperties = {
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-base)',
    color: 'var(--n3rd-text-tertiary)',
    lineHeight: 'var(--n3rd-line-height)',
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
