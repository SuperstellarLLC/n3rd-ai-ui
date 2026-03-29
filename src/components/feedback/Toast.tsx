'use client'

import {
  useState,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
  type CSSProperties,
} from 'react'

type ToastType = 'success' | 'warning' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

const ICONS: Record<ToastType, string> = {
  success: '[✓]',
  warning: '[!]',
  error: '[✗]',
  info: '[i]',
}

const COLORS: Record<ToastType, string> = {
  success: 'var(--n3rd-accent-success)',
  warning: 'var(--n3rd-accent-warning)',
  error: 'var(--n3rd-accent-danger)',
  info: 'var(--n3rd-accent-info)',
}

interface ToastContextValue {
  success: (message: string) => void
  warning: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let idCounter = 0

export function ToastProvider({
  children,
  duration = 4000,
}: {
  children: ReactNode
  duration?: number
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback(
    (message: string, type: ToastType) => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    },
    [duration],
  )

  const toast: ToastContextValue = {
    success: (msg) => addToast(msg, 'success'),
    warning: (msg) => addToast(msg, 'warning'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  }

  const containerStyle: CSSProperties = {
    position: 'fixed',
    bottom: 'var(--n3rd-space-6)',
    right: 'var(--n3rd-space-6)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--n3rd-space-2)',
    zIndex: 'var(--n3rd-z-toast, 9998)' as unknown as number,
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-sm)',
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {toasts.length > 0 && (
        <div style={containerStyle}>
          {toasts.map((t) => (
            <div
              key={t.id}
              style={{
                padding: 'var(--n3rd-space-2) var(--n3rd-space-3)',
                backgroundColor: 'var(--n3rd-bg-secondary)',
                border: `1px solid ${COLORS[t.type]}`,
                color: 'var(--n3rd-text-primary)',
                animation: 'n3rd-fade-in var(--n3rd-fade-duration) ease-out',
              }}
            >
              <span style={{ color: COLORS[t.type], marginRight: 'var(--n3rd-space-2)' }}>
                {ICONS[t.type]}
              </span>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider> or <N3rdProvider>')
  return ctx
}
