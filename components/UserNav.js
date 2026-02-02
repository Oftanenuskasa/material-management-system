'use client'

import { useAuth } from './AuthProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UserNav() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Helper function to check user role
  const hasRole = (role) => {
    return user?.role === role
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/auth/login"
          className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Register
        </Link>
      </div>
    )
  }

  // Get role color
  const getRoleColor = () => {
    switch(user.role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      case 'MANAGER': return 'bg-yellow-100 text-yellow-800'
      case 'WORKER': return 'bg-green-100 text-green-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="hidden md:flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor()}`}>
            {user.role}
          </span>
        </div>
        
        {/* All Users can see Materials and Requests */}
        <Link
          href="/materials"
          className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
        >
          Materials
        </Link>
        
        <Link
          href="/requests"
          className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
        >
          Requests
        </Link>
        
        {/* Only Managers and Admins can see Users */}
        {(user.role === 'MANAGER' || user.role === 'ADMIN') && (
          <Link
            href="/users"
            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
          >
            Users
          </Link>
        )}
        
        {/* Only Managers and Admins can see Reports */}
        {(user.role === 'MANAGER' || user.role === 'ADMIN') && (
          <Link
            href="/reports"
            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
          >
            Reports
          </Link>
        )}
        
        {/* Only Admins can see Settings and Admin Materials */}
        {user.role === 'ADMIN' && (
          <>
            <Link
              href="/admin/materials"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Admin Materials
            </Link>
            <Link
              href="/settings"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Settings
            </Link>
          </>
        )}
        
        {/* Managers can see Manager Materials */}
        {user.role === 'MANAGER' && (
          <Link
            href="/manager/materials"
            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
          >
            Manage Materials
          </Link>
        )}
      </div>
      
      <div className="relative group">
        <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </button>
        
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor()}`}>
              {user.role}
            </span>
          </div>
          
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Your Profile
          </Link>
          
          <Link
            href="/requests/new"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            New Request
          </Link>
          
          <div className="border-t mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}