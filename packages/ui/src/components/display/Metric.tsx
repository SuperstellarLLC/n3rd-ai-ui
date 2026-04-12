import type { CSSProperties } from 'react'

type Accent = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface MetricProps {
  value: string | number
  label: string
  suffix?: string
  prefix?: string
  accent?: Accent
  className?: string
  style?: CSSProperties
}

export function Metric({ value, label, suffix, prefix, accent, className, style }: MetricProps) {
  const containerStyle: CSSProperties = {
    fontFamily: 'var(--boum-font)',
    textAlign: 'center',
    ...style,
  }

  const valueStyle: CSSProperties = {
    fontSize: 'var(--boum-text-2xl)',
    fontWeight: 700,
    color: accent ? `var(--boum-accent-${accent})` : 'var(--boum-text-primary)',
    lineHeight: 1.2,
  }

  const labelStyle: CSSProperties = {
    fontSize: 'var(--boum-text-sm)',
    color: 'var(--boum-text-secondary)',
    marginTop: 'var(--boum-space-1)',
  }

  return (
    <div className={className} style={containerStyle}>
      <div style={valueStyle}>
        {prefix}
        {value}
        {suffix}
      </div>
      <div style={labelStyle}>{label}</div>
    </div>
  )
}

Metric.displayName = 'Metric'
