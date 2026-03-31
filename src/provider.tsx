'use client'

import type { ReactNode } from 'react'
import { ToastProvider } from './components/feedback/Toast'
import { Scanline } from './primitives/scanline'

export interface N3rdProviderProps {
  children: ReactNode
  scanlines?: boolean
  toastDuration?: number
}

export function N3rdProvider({
  children,
  scanlines = false,
  toastDuration = 4000,
}: N3rdProviderProps) {
  return (
    <ToastProvider duration={toastDuration}>
      {children}
      {scanlines && <Scanline />}
    </ToastProvider>
  )
}

N3rdProvider.displayName = 'N3rdProvider'
