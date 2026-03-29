import localFont from 'next/font/local'

export const jetbrainsMono = localFont({
  src: [
    {
      path: '../fonts/JetBrainsMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/JetBrainsMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--n3rd-font',
  display: 'swap',
  fallback: ['Fira Code', 'Cascadia Code', 'SF Mono', 'Consolas', 'Courier New', 'monospace'],
})

export const N3rdFonts = jetbrainsMono
