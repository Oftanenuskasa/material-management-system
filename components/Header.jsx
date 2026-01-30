'use client'

import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">Material Management</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <div className="relative">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => logout()}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
