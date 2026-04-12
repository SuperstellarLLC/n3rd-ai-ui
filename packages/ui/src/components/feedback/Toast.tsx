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
  success: 'var(--boum-accent-success)',
  warning: 'var(--boum-accent-warning)',
  error: 'var(--boum-accent-danger)',
  info: 'var(--boum-accent-info)',
}

interface ToastContextValue {
  success: (message: string) => number
  warning: (message: string) => number
  error: (message: string) => number
  info: (message: string) => number
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const MAX_TOASTS = 5
let idCounter = 0

export function ToastProvider({
  children,
  duration = 4000,
}: {
  children: ReactNode
  duration?: number
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType): number => {
      const id = ++idCounter
      setToasts((prev) => {
        const next = [...prev, { id, message, type }]
        return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next
      })
      setTimeout(() => dismiss(id), duration)
      return id
    },
    [duration, dismiss],
  )

  const toast: ToastContextValue = {
    success: (msg) => addToast(msg, 'success'),
    warning: (msg) => addToast(msg, 'warning'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    dismiss,
  }

  const containerStyle: CSSProperties = {
    position: 'fixed',
    bottom: 'var(--boum-space-6)',
    right: 'var(--boum-space-6)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--boum-space-2)',
    zIndex: 'var(--boum-z-toast, 9998)' as unknown as number,
    fontFamily: 'var(--boum-font)',
    fontSize: 'var(--boum-text-sm)',
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
                padding: 'var(--boum-space-2) var(--boum-space-3)',
                backgroundColor: 'var(--boum-bg-secondary)',
                border: `1px solid ${COLORS[t.type]}`,
                color: 'var(--boum-text-primary)',
                animation: 'boum-fade-in var(--boum-fade-duration) ease-out',
              }}
            >
              <span style={{ color: COLORS[t.type], marginRight: 'var(--boum-space-2)' }}>
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
  if (!ctx) {
    throw new Error(
      'useToast must be used within <ToastProvider>, <BoumProvider>, or <N3rdProvider>',
    )
  }
  return ctx
}

ToastProvider.displayName = 'ToastProvider'
