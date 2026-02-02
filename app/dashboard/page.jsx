'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    materials: 0,
    lowStock: 0,
    requests: 0,
    pendingRequests: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!token || !userData) {
      router.push('/auth/login')
      return
    }
    
    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchDashboardData(token, parsedUser.role)
    } catch (error) {
      console.error('Failed to parse user data:', error)
      router.push('/auth/login')
    }
  }, [router])

  const fetchDashboardData = async (token, role) => {
    try {
      setLoading(true)
      
      // Fetch materials
      const materialsRes = await fetch('/api/materials', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const materialsData = await materialsRes.json()
      const materials = materialsData.data || []
      
      // Fetch requests if user can see them
      let requestsCount = 0
      let pendingRequests = 0
      
      if (role === 'ADMIN' || role === 'MANAGER' || role === 'WORKER') {
        const requestsRes = await fetch('/api/requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const requestsData = await requestsRes.json()
        const requests = requestsData.data || []
        requestsCount = requests.length
        pendingRequests = requests.filter(r => r.status === 'PENDING').length
      }
      
      const lowStock = materials.filter(m => 
        m.quantity > 0 && m.quantity <= (m.minStockLevel || 5)
      ).length
      
      setStats({
        materials: materials.length,
        lowStock,
        requests: requestsCount,
        pendingRequests
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Get role display name
  const getRoleName = (role) => {
    switch(role) {
      case 'ADMIN': return 'Administrator'
      case 'MANAGER': return 'Manager'
      case 'WORKER': return 'Worker'
      default: return role
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, {user.name || user.email}!
          </h1>
          <div className="flex items-center mt-2">
            <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
              {getRoleName(user.role)}
            </span>
            <p className="ml-3 text-gray-600">Material Management Dashboard</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Materials Card */}
          <div 
            className="bg-white rounded-lg border p-6 shadow-sm hover:shadow cursor-pointer"
            onClick={() => router.push('/materials')}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg mr-4">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Materials</p>
                <p className="text-2xl font-bold">{stats.materials}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">View all materials →</p>
          </div>

          {/* Low Stock Card */}
          <div 
            className="bg-white rounded-lg border p-6 shadow-sm hover:shadow cursor-pointer"
            onClick={() => router.push('/materials')}
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 rounded-lg mr-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Low Stock Items</p>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">Check inventory →</p>
          </div>

          {/* Total Requests Card */}
          <div 
            className="bg-white rounded-lg border p-6 shadow-sm hover:shadow cursor-pointer"
            onClick={() => router.push('/requests')}
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg mr-4">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Requests</p>
                <p className="text-2xl font-bold">{stats.requests}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">View all requests →</p>
          </div>

          {/* Pending Requests Card */}
          <div 
            className="bg-white rounded-lg border p-6 shadow-sm hover:shadow cursor-pointer"
            onClick={() => router.push('/requests?status=PENDING')}
          >
            <div className="flex items-center">
              <div className="p-3 bg-red-50 rounded-lg mr-4">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Pending Requests</p>
                <p className="text-2xl font-bold">{stats.pendingRequests}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">Review pending →</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/materials')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Browse Materials
            </button>
            
            <button
              onClick={() => router.push('/requests/new')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              New Request
            </button>
            
            {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
              <button
                onClick={() => router.push('/requests')}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Manage Requests
              </button>
            )}
            
            {user.role === 'ADMIN' && (
              <button
                onClick={() => router.push('/admin/materials')}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Materials */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Materials</h2>
              <button
                onClick={() => router.push('/materials')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View All →
              </button>
            </div>
            
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">Material {i}</p>
                    <p className="text-sm text-gray-500">SKU-00{i}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">100 pieces</p>
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                      In Stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Requests</h2>
              <button
                onClick={() => router.push('/requests')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View All →
              </button>
            </div>
            
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">Request #{i}</p>
                    <p className="text-sm text-gray-500">Material {i}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">10 pieces</p>
                    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Role-specific content */}
        {user.role === 'ADMIN' && (
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded mr-3">
                <span className="text-lg">👑</span>
              </div>
              <div>
                <p className="text-purple-800 font-medium">Admin Tools Available</p>
                <p className="text-purple-600 text-sm mt-1">
                  You have full access to system management, user management, and all materials.
                </p>
              </div>
            </div>
          </div>
        )}

        {user.role === 'MANAGER' && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded mr-3">
                <span className="text-lg">👔</span>
              </div>
              <div>
                <p className="text-yellow-800 font-medium">Manager Access</p>
                <p className="text-yellow-600 text-sm mt-1">
                  You can manage requests, approve/reject requests, and oversee materials.
                </p>
              </div>
            </div>
          </div>
        )}

        {user.role === 'WORKER' && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded mr-3">
                <span className="text-lg">👷</span>
              </div>
              <div>
                <p className="text-green-800 font-medium">Worker Access</p>
                <p className="text-green-600 text-sm mt-1">
                  You can browse materials and submit requests for approval.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}