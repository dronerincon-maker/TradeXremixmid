import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://tradexlabs-remix.vercel.app'),
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  title: 'TradeXLabs — Automated Algorithmic Execution for Funded Traders',
  description:
    'TAAS: an automated algorithmic suite for funded futures traders. Rules-based execution from a dedicated server, with NinjaTrader backtests published gross and net. Founding cohort — application required.',
  openGraph: {
    title: 'TradeXLabs — Automated Algorithmic Execution for Funded Traders',
    description:
      'Rules-based execution for prop-firm accounts. Verified backtest data, dedicated server infrastructure, operator control. Founding cohort — application required.',
    type: 'website',
    siteName: 'TradeXLabs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeXLabs — Automated Algorithmic Execution for Funded Traders',
    description:
      'Rules-based execution for prop-firm accounts. Verified backtest data, dedicated server infrastructure, operator control.',
  },
  generator: 'v0.app',
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
