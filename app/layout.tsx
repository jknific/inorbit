import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://inorbit.johnknific.com'),
  title: 'In Orbit - John Knific | Blending Acoustic and Electronic Music',
  description: 'Experience the unique sound of In Orbit by John Knific - a 4-track EP blending jazz piano, electronic production, and indie rock influences. Featuring collaborations with Joel Negus, Christine Knific, Cass Jewell, and Jamey Haddad.',
  keywords: 'John Knific, In Orbit, jazz piano, electronic music, indie rock, EP, music producer, acoustic electronic fusion, Logic Pro, synthesizer music',
  authors: [{ name: 'John Knific' }],
  creator: 'John Knific',
  publisher: 'Knerd Creative LLC',
  openGraph: {
    title: 'In Orbit - John Knific | Acoustic-Electronic Music Fusion',
    description: 'A 4-track EP blending jazz piano with electronic production. Stream on Spotify, Apple Music, and more.',
    type: 'music.album',
    siteName: 'In Orbit - John Knific',
    images: [
      {
        url: '/images/In Orbit - Final EP Album Cover.png',
        width: 1200,
        height: 1200,
        alt: 'In Orbit EP Album Cover by John Knific',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'In Orbit - John Knific | Acoustic-Electronic Music Fusion',
    description: 'A 4-track EP blending jazz piano with electronic production. Stream now.',
    images: ['/images/In Orbit - Final EP Album Cover.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}