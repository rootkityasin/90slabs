import type { Metadata } from 'next'
import { Fira_Sans } from 'next/font/google'
// @ts-ignore: CSS import without type declarations
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import ChatWidget from '@/components/ChatWidget'

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: '90sX | Software Agency',
  description: 'Premium software development agency.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={firaSans.className} suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
        <ChatWidget />
      </body>
    </html>
  )
}

