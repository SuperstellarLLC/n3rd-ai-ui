import type { Metadata, Viewport } from 'next'
import { BoumProvider } from '@boum-ai/ui'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://boum.ai'),
  title: 'boum.ai — Frontier UI for AI',
  description:
    'boum turns AI answers into interactive interfaces instead of walls of text. Compare products, homes, trips, and code in live views.',
  keywords: [
    'frontier ui',
    'ai interface',
    'interactive ai',
    'generative ui',
    'chat ui',
    'rich ai client',
    'boum',
  ],
  authors: [{ name: 'Superstellar LLC' }],
  openGraph: {
    title: 'boum.ai — Frontier UI for AI',
    description:
      'AI should answer with interfaces, not documents. boum turns long AI responses into live, usable views.',
    url: 'https://boum.ai',
    siteName: 'boum.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'boum.ai — Frontier UI for AI',
    description: 'boum turns AI answers into interactive interfaces instead of walls of text.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#f4ede4',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BoumProvider>{children}</BoumProvider>
      </body>
    </html>
  )
}
