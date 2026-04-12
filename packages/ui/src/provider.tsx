'use client'

import type { ReactNode } from 'react'
import { ToastProvider } from './components/feedback/Toast'
import { Scanline } from './primitives/scanline'

export interface BoumProviderProps {
  children: ReactNode
  scanlines?: boolean
  toastDuration?: number
}

export function BoumProvider({
  children,
  scanlines = false,
  toastDuration = 4000,
}: BoumProviderProps) {
  return (
    <ToastProvider duration={toastDuration}>
      {children}
      {scanlines && <Scanline />}
    </ToastProvider>
  )
}

BoumProvider.displayName = 'BoumProvider'

/** @deprecated Use BoumProviderProps instead. */
export type N3rdProviderProps = BoumProviderProps

/** @deprecated Use BoumProvider instead. */
export function N3rdProvider(props: N3rdProviderProps) {
  return <BoumProvider {...props} />
}

N3rdProvider.displayName = 'N3rdProvider'
