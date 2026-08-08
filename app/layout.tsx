import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

const SITE_DESCRIPTION =
  'A charter-tier automated execution algo suite for funded prop traders. 50 founding seats. Application required.'

// Resolves relative OG/Twitter image URLs to absolute ones. Uses the explicit
// site URL when provided, otherwise Vercel's production URL, else localhost.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'TradeXLabs | Founder Pro',
  description: SITE_DESCRIPTION,
  generator: 'v0.app',
  openGraph: {
    title: 'TradeXLabs | Founder Pro',
    description: SITE_DESCRIPTION,
    siteName: 'TradeXLabs',
    type: 'website',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 675,
        alt: 'TradeXLabs — Signal through the noise',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeXLabs | Founder Pro',
    description: SITE_DESCRIPTION,
    images: ['/og-image.webp'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark bg-black ${geistSans.variable} ${geistMono.variable}`}>
      {/* no bg on body: in-flow body background would paint over the fixed -z-10 GridBackdrop; html carries bg-black */}
      <body className="font-sans text-white antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
