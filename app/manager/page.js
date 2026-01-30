'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ManagerPage() {
  const { user, isLoading, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !hasRole('MANAGER')) {
      router.push('/unauthorized')
    }
  }, [isLoading, user, hasRole, router])

  if (isLoading) {
    return <div className="p-8">Loading manager panel...</div>
  }

  if (!hasRole('MANAGER')) {
    return null
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manager Panel</h1>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-yellow-800 mb-4">Manager Access</h2>
        <p className="text-yellow-700">Only users with MANAGER or ADMIN role can access this page.</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Team Management</h3>
          <p className="text-gray-600">Manage your team members and assignments</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Budget Overview</h3>
          <p className="text-gray-600">View and manage department budget</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Performance Reports</h3>
          <p className="text-gray-600">Generate team performance reports</p>
        </div>
      </div>
    </div>
  )
}
