'use client'

import { useAuth } from './AuthProvider'

export default function RoleBasedUI() {
  const { user, hasRole } = useAuth()

  if (!user) return null

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div>
          <p className="text-sm text-gray-600">Logged in as:</p>
          <p className="font-semibold">{user.name} <span className="text-blue-600">({user.role})</span></p>
        </div>
        
        <div className="flex space-x-2">
          {/* User actions - everyone can see */}
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            View Materials
          </button>
          
          {/* Staff actions */}
          {hasRole('STAFF') && (
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200">
              Add Material
            </button>
          )}
          
          {/* Manager actions */}
          {hasRole('MANAGER') && (
            <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">
              Manage Staff
            </button>
          )}
          
          {/* Admin actions */}
          {hasRole('ADMIN') && (
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
              System Settings
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
