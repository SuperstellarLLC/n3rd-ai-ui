import type { ReactNode, CSSProperties } from 'react'

export interface PageProps {
  children: ReactNode
  maxWidth?: string
  className?: string
  style?: CSSProperties
}

export function Page({ children, maxWidth = '1200px', className, style }: PageProps) {
  const pageStyle: CSSProperties = {
    maxWidth,
    margin: '0 auto',
    padding: 'var(--n3rd-space-6) var(--n3rd-space-4)',
    minHeight: '100vh',
    overflowX: 'hidden',
    ...style,
  }

  return (
    <main className={className} style={pageStyle}>
      {children}
    </main>
  )
}
