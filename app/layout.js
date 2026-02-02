'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  useEffect(() => {
    // Set demo tokens for different roles for development
    if (typeof window !== 'undefined') {
      // Check if we have a token
      if (!localStorage.getItem('token')) {
        // Set a default token for development
        localStorage.setItem('token', 'demo-token')
        localStorage.setItem('userRole', 'WORKER')
      }
    }
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
