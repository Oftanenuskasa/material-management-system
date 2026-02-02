'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const [userRole, setUserRole] = useState('WORKER')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('userRole') || 'WORKER'
    setUserRole(role)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    router.push('/')
  }

  const handleRoleSwitch = (role) => {
    // Set token based on role
    let token = 'worker-token'
    if (role === 'ADMIN') token = 'admin-token'
    else if (role === 'MANAGER') token = 'manager-token'
    
    localStorage.setItem('token', token)
    localStorage.setItem('userRole', role)
    setUserRole(role)
    window.location.reload()
  }

  // Don't show navbar on login page
  if (pathname === '/login') return null

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800">Material Management</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="/requests"
                className={`${
                  pathname === '/requests'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Requests
              </a>
              <a
                href="/materials"
                className={`${
                  pathname === '/materials'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Materials
              </a>
              {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                <a
                  href="/admin/materials"
                  className={`${
                    pathname.startsWith('/admin')
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Admin
                </a>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Role:</span>
              <select
                value={userRole}
                onChange={(e) => handleRoleSwitch(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="WORKER">Worker</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
