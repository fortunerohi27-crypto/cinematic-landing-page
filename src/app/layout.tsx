import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nex | The Future of Digital Architecture',
  description: 'A high-end cinematic experience redefining the boundaries of the modern web.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-premium-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}
