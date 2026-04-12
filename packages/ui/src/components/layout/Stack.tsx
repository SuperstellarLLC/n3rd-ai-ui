import type { ReactNode, CSSProperties } from 'react'

type Gap = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export interface StackProps {
  children: ReactNode
  gap?: Gap
  align?: 'start' | 'center' | 'end' | 'stretch'
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

export function Stack({ children, gap = 'md', align = 'stretch', className, style }: StackProps) {
  const stackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: GAP_MAP[gap],
    alignItems: align,
    ...style,
  }

  return (
    <div className={className} style={stackStyle}>
      {children}
    </div>
  )
}

Stack.displayName = 'Stack'
