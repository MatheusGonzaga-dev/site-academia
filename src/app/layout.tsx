import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Academia Fitness - Treino e Dieta',
  description: 'Gerencie seus treinos e dieta de forma inteligente',
  keywords: ['fitness', 'treino', 'dieta', 'academia', 'saúde'],
  authors: [{ name: 'Academia Fitness' }],
  creator: 'Academia Fitness',
  publisher: 'Academia Fitness',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://academia-fitness.vercel.app'),
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Academia Fitness',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://academia-fitness.vercel.app',
    title: 'Academia Fitness - Treino e Dieta',
    description: 'Gerencie seus treinos e dieta de forma inteligente',
    siteName: 'Academia Fitness',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academia Fitness - Treino e Dieta',
    description: 'Gerencie seus treinos e dieta de forma inteligente',
  },
  alternates: {
    canonical: '/',
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
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Academia Fitness" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <style>{`
          .mobile-bottom-nav {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 9999 !important;
            background-color: white !important;
            border-top: 1px solid #e5e7eb !important;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1) !important;
            transform: translateZ(0) !important;
            -webkit-transform: translateZ(0) !important;
          }
          @media (min-width: 1024px) {
            .mobile-bottom-nav {
              display: none !important;
            }
          }
        `}</style>
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}

