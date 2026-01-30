import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import UserNav from '@/components/UserNav'

export const metadata = {
  title: 'Material Management System',
  description: 'Manage your materials efficiently',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center">
                    <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="ml-2 text-xl font-bold text-gray-900">Material Manager</span>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="/" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                      Home
                    </a>
                    <a href="/dashboard" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Dashboard
                    </a>
                    <a href="/materials" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                      Materials
                    </a>
                  </div>
                </div>
                <UserNav />
              </div>
            </div>
          </nav>
          {children}
          <footer className="bg-white mt-12 border-t">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                © 2024 Material Management System. Role-Based Access Control (RBAC) Enabled.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
