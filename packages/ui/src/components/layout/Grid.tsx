import type { ReactNode, CSSProperties } from 'react'
import { legacyClassName } from '../../utils'
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
  sm: 'var(--boum-space-2)',
  md: 'var(--boum-space-4)',
  lg: 'var(--boum-space-6)',
  xl: 'var(--boum-space-8)',
}

export function Grid({ children, columns = 3, gap = 'md', className, style }: GridProps) {
  const cols = typeof columns === 'number' ? Math.max(1, Math.round(columns)) : columns
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: typeof cols === 'number' ? `repeat(${cols}, 1fr)` : cols,
    gap: GAP_MAP[gap],
    ...style,
  }

  return (
    <div className={legacyClassName('boum-grid', className ?? '')} style={gridStyle}>
      {children}
    </div>
  )
}

Grid.displayName = 'Grid'
