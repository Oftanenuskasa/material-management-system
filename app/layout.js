import './globals.css'
import { ToastProvider } from '@/context/ToastContext'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import MobileNav from '@/components/MobileNav'

export const metadata = {
  title: 'Material Management System',
  description: 'Manage materials with CRUD operations',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'MaterialMS',
    statusBarStyle: 'default',
  },
}

// Separate viewport export for Next.js 14
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <ToastProvider>
          <ServiceWorkerRegistration />
          <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center">
                <div className="mr-3 text-2xl">📦</div>
                <h1 className="text-2xl font-bold">Material Management</h1>
              </div>
              <div className="space-x-4 hidden md:flex">
                <a href="/" className="hover:text-blue-200 px-3 py-2 rounded hover:bg-blue-700 transition-colors">Home</a>
                <a href="/dashboard" className="hover:text-blue-200 px-3 py-2 rounded hover:bg-blue-700 transition-colors">Dashboard</a>
                <a href="/materials" className="hover:text-blue-200 px-3 py-2 rounded hover:bg-blue-700 transition-colors">Materials</a>
                <a href="/materials/create" className="hover:text-blue-200 px-3 py-2 rounded hover:bg-blue-700 transition-colors">Add New</a>
              </div>
              <MobileNav />
            </div>
          </nav>
          <main className="container mx-auto p-4">
            {children}
          </main>
          <PWAInstallPrompt />
          <footer className="bg-gray-800 text-white py-6 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p>© 2024 Material Management System. All rights reserved.</p>
              <p className="text-sm text-gray-400 mt-2">
                Install as app for offline access | v1.0.0
              </p>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  )
}
