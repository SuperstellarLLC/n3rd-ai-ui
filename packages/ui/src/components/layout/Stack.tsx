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
  sm: 'var(--n3rd-space-2)',
  md: 'var(--n3rd-space-4)',
  lg: 'var(--n3rd-space-6)',
  xl: 'var(--n3rd-space-8)',
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
