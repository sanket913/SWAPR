import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Swapr - Complete Skill Exchange Platform',
  description: 'Connect with passionate learners worldwide to exchange skills, unlock new abilities, and grow together.',
  keywords: 'skill exchange, learning, teaching, community, skills, swap',
  authors: [{ name: 'Swapr Team' }],
  openGraph: {
    title: 'Swapr - Complete Skill Exchange Platform',
    description: 'Connect with passionate learners worldwide to exchange skills, unlock new abilities, and grow together.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}