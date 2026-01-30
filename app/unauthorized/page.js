'use client'

import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'

export default function UnauthorizedPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
            {user && (
              <span className="block mt-2">
                Your role: <span className="font-semibold">{user.role}</span>
              </span>
            )}
          </p>
          <div className="space-y-3">
            <Link 
              href="/dashboard" 
              className="block w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Go to Dashboard
            </Link>
            {user && (
              <Link 
                href="/auth/login" 
                className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium"
                onClick={() => {
                  localStorage.removeItem('user')
                  localStorage.removeItem('token')
                }}
              >
                Sign in with different account
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
