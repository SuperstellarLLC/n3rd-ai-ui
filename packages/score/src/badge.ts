/**
 * Badge SVG generator — the viral loop asset.
 *
 * Returns a shields.io-style SVG badge that renders in GitHub READMEs,
 * npm package pages, and anywhere else that accepts SVG images.
 */

export interface BadgeOptions {
  server: string
  score: number
  band: 'excellent' | 'good' | 'fair' | 'unverified'
  verified?: boolean
}

const COLORS: Record<string, string> = {
  excellent: '#22c55e',
  good: '#3b82f6',
  fair: '#eab308',
  unverified: '#6b7280',
}

export function renderBadgeSvg(opts: BadgeOptions): string {
  const color = COLORS[opts.band] ?? COLORS.unverified
  const label = 'n3rd'
  const value = opts.verified !== false ? `${opts.score}` : 'unverified'
  const labelWidth = label.length * 7 + 12
  const valueWidth = value.length * 7 + 12
  const totalWidth = labelWidth + valueWidth

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text aria-hidden="true" x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelWidth / 2}" y="14">${label}</text>
    <text aria-hidden="true" x="${labelWidth + valueWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${value}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14">${value}</text>
  </g>
</svg>`
}
