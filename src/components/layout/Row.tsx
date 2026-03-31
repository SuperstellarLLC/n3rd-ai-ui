import type { ReactNode, CSSProperties } from 'react'

type Gap = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export interface RowProps {
  children: ReactNode
  gap?: Gap
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  wrap?: boolean
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

const JUSTIFY_MAP = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
}

export function Row({
  children,
  gap = 'md',
  align = 'center',
  justify = 'start',
  wrap = false,
  className,
  style,
}: RowProps) {
  const rowStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: GAP_MAP[gap],
    alignItems: align,
    justifyContent: JUSTIFY_MAP[justify],
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...style,
  }

  return (
    <div className={className} style={rowStyle}>
      {children}
    </div>
  )
}

Row.displayName = 'Row'
