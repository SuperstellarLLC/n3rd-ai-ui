import type { Metadata, Viewport } from 'next'
import { N3rdProvider } from '@n3rd-ai/ui'
import './globals.css'

export const metadata: Metadata = {
  title: 'n3rd.ai — The reputation layer for AI agents',
  description:
    'Every MCP tool call, signed and scored. One number. Embeddable anywhere. Three lines. Zero config.',
  keywords: ['mcp', 'model-context-protocol', 'reputation', 'ai-agents', 'attestation', 'n3rd'],
  authors: [{ name: 'Superstellar LLC' }],
  openGraph: {
    title: 'n3rd.ai — The reputation layer for AI agents',
    description: 'Every MCP tool call, signed and scored. One number. Embeddable anywhere.',
    url: 'https://n3rd.ai',
    siteName: 'n3rd.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'n3rd.ai — The reputation layer for AI agents',
    description: 'Every MCP tool call, signed and scored. One number. Embeddable anywhere.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <N3rdProvider scanlines>{children}</N3rdProvider>
      </body>
    </html>
  )
}
