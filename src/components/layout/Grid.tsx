import type { ReactNode, CSSProperties } from 'react'
import './Grid.css'

type Gap = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export interface GridProps {
  children: ReactNode
  columns?: number | string
  gap?: Gap
  className?: string
  style?: CSSProperties
}

const GAP_MAP: Record<Gap, string> = {
  none: '0',
  sm: 'var(--n3rd-space-2)',
  md: 'var(--n3rd-space-4)',
  lg: 'var(--n3rd-space-6)',
  xl: 'var(--n3rd-space-8)',
}

export function Grid({ children, columns = 3, gap = 'md', className, style }: GridProps) {
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns,
    gap: GAP_MAP[gap],
    ...style,
  }

  return (
    <div className={`n3rd-grid ${className ?? ''}`} style={gridStyle}>
      {children}
    </div>
  )
}

Grid.displayName = 'Grid'
