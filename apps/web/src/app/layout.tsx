import type { Metadata, Viewport } from 'next'
import { N3rdProvider } from '@n3rd-ai/ui'
import './globals.css'

export const metadata: Metadata = {
  title: 'n3rd.ai — Terminal UI for the AI era',
  description:
    'Terminal-first UI framework for Next.js. ASCII everything. Zero images. Pure text. Import. Wrap. Ship.',
  keywords: ['terminal', 'ascii', 'ui', 'nextjs', 'react', 'monospace', 'ai', 'mcp'],
  authors: [{ name: 'Superstellar LLC' }],
  openGraph: {
    title: 'n3rd.ai — Terminal UI for the AI era',
    description:
      'Terminal-first UI framework for Next.js. ASCII everything. Zero images. Pure text.',
    url: 'https://n3rd.ai',
    siteName: 'n3rd.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'n3rd.ai — Terminal UI for the AI era',
    description:
      'Terminal-first UI framework for Next.js. ASCII everything. Zero images. Pure text.',
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
