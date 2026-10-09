import type { Metadata } from 'next'
import './globals.css'
import { en as t } from '@/i18n/en'
import { productName } from '@/product'

export const metadata: Metadata = { title: productName, description: t.description }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">{children}</body>
    </html>
  )
}
