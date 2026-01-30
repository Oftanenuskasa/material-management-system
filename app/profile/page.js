'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Get role description
  const getRoleDescription = () => {
    switch(user.role) {
      case 'ADMIN': return 'Full system access including user management and system settings.'
      case 'MANAGER': return 'Can manage staff, approve requests, and generate reports.'
      case 'STAFF': return 'Can add/edit materials and view reports.'
      case 'USER': return 'Can view materials and create requests.'
      default: return 'Basic user permissions.'
    }
  }

  // Get role color
  const getRoleColor = () => {
    switch(user.role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      case 'MANAGER': return 'bg-yellow-100 text-yellow-800'
      case 'STAFF': return 'bg-green-100 text-green-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* User Info Card */}
          <div className="flex items-start space-x-6 mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRoleColor()}`}>
                  {user.role}
                </span>
              </div>
              
              <p className="text-gray-700 mb-4">{getRoleDescription()}</p>
              
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Profile
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-sm text-blue-600 font-medium mb-2">Member Since</p>
              <p className="text-2xl font-bold">Jan 2024</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-sm text-green-600 font-medium mb-2">Materials Viewed</p>
              <p className="text-2xl font-bold">142</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="text-sm text-purple-600 font-medium mb-2">Requests Made</p>
              <p className="text-2xl font-bold">23</p>
            </div>
          </div>

          {/* Permissions List */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>View Materials</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Create Material Requests</span>
              </div>
              
              {user.role !== 'USER' && (
                <>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Add New Materials</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Edit Existing Materials</span>
                  </div>
                </>
              )}
              
              {(user.role === 'MANAGER' || user.role === 'ADMIN') && (
                <>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Approve Material Requests</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Generate Reports</span>
                  </div>
                </>
              )}
              
              {user.role === 'ADMIN' && (
                <>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Manage User Accounts</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>System Configuration</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
