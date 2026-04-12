import type { Metadata, Viewport } from 'next'
import { N3rdProvider } from '@n3rd-ai/ui'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://n3rd.ai'),
  title: 'n3rd.ai — Frontier UI for AI',
  description:
    'n3rd turns AI answers into interactive interfaces instead of walls of text. Compare products, homes, trips, and code in live views.',
  keywords: [
    'frontier ui',
    'ai interface',
    'interactive ai',
    'generative ui',
    'chat ui',
    'rich ai client',
    'n3rd',
  ],
  authors: [{ name: 'Superstellar LLC' }],
  openGraph: {
    title: 'n3rd.ai — Frontier UI for AI',
    description:
      'AI should answer with interfaces, not documents. n3rd turns long AI responses into live, usable views.',
    url: 'https://n3rd.ai',
    siteName: 'n3rd.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'n3rd.ai — Frontier UI for AI',
    description: 'n3rd turns AI answers into interactive interfaces instead of walls of text.',
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
        <N3rdProvider>{children}</N3rdProvider>
      </body>
    </html>
  )
}
