'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, signOut } from 'next-auth/react'

export default function DashboardPage() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMaterials: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
    pendingRequests: 0
  })
  const router = useRouter()

  useEffect(() => {
    // Fetch session on client side
    const fetchSession = async () => {
      try {
        const sessionData = await getSession()
        if (!sessionData) {
          router.push('/auth/login')
        } else {
          setSession(sessionData)
          fetchDashboardData(sessionData.user.role)
        }
      } catch (error) {
        console.error('Failed to fetch session:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [router])

  const fetchDashboardData = async (userRole) => {
    try {
      // Fetch materials for stats
      const materialsResponse = await fetch('/api/materials?limit=1000')
      const materialsResult = await materialsResponse.json()

      if (materialsResult.success) {
        const materials = materialsResult.data
        
        // Calculate stats
        const totalMaterials = materials.length
        const inStock = materials.filter(m => 
          m.status === 'ACTIVE' && m.quantity > m.minStockLevel
        ).length
        const lowStock = materials.filter(m => 
          m.status === 'ACTIVE' && m.quantity > 0 && m.quantity <= m.minStockLevel
        ).length
        const outOfStock = materials.filter(m => 
          m.status === 'ACTIVE' && m.quantity === 0
        ).length
        
        // Calculate total inventory value
        const totalValue = materials.reduce((sum, material) => {
          return sum + (parseFloat(material.unitPrice) * material.quantity)
        }, 0)

        setStats({
          totalMaterials,
          inStock,
          lowStock,
          outOfStock,
          totalValue: totalValue.toFixed(2),
          pendingRequests: 0
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/auth/login')
    router.refresh()
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

  if (!session?.user) {
    return null
  }

  const user = session.user
  const role = user.role || 'USER'

  // Get role color and icon
  const getRoleInfo = () => {
    switch(role) {
      case 'ADMIN':
        return { 
          color: 'purple', 
          icon: '👑', 
          bgColor: 'bg-purple-100', 
          textColor: 'text-purple-800',
          gradient: 'from-purple-500 to-purple-600'
        }
      case 'MANAGER':
        return { 
          color: 'yellow', 
          icon: '📊', 
          bgColor: 'bg-yellow-100', 
          textColor: 'text-yellow-800',
          gradient: 'from-yellow-500 to-yellow-600'
        }
      case 'STAFF':
        return { 
          color: 'green', 
          icon: '📦', 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-800',
          gradient: 'from-green-500 to-green-600'
        }
      default:
        return { 
          color: 'blue', 
          icon: '👤', 
          bgColor: 'bg-blue-100', 
          textColor: 'text-blue-800',
          gradient: 'from-blue-500 to-blue-600'
        }
    }
  }

  const roleInfo = getRoleInfo()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Material Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className={`px-4 py-2 rounded-full font-medium ${roleInfo.bgColor} ${roleInfo.textColor} flex items-center`}>
                <span className="mr-2">{roleInfo.icon}</span>
                {role}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className={`bg-gradient-to-r ${roleInfo.gradient} rounded-xl shadow-lg p-8 mb-8 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
              <p className="opacity-90">
                You are logged in as <span className="font-bold">{role}</span>
              </p>
              <p className="opacity-90 mt-2">
                {role === 'ADMIN' ? 'You have full system access and administrative privileges.' :
                 role === 'MANAGER' ? 'You can manage inventory, approve requests, and view reports.' :
                 role === 'STAFF' ? 'You can manage inventory and process material requests.' :
                 'You can browse materials and create requests.'}
              </p>
            </div>
            <div className="text-6xl">
              {roleInfo.icon}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Materials</p>
                <p className="text-2xl font-bold">{stats.totalMaterials}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold">{stats.inStock}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <span className="text-2xl">❌</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold">{stats.outOfStock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
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
              Create Request
            </button>
            
            {(role === 'STAFF' || role === 'MANAGER' || role === 'ADMIN') && (
              <button 
                onClick={() => router.push('/inventory')}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Manage Inventory
              </button>
            )}
            
            {(role === 'MANAGER' || role === 'ADMIN') && (
              <button 
                onClick={() => router.push('/reports')}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                View Reports
              </button>
            )}
            
            {role === 'ADMIN' && (
              <button 
                onClick={() => router.push('/admin/materials')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Materials CRUD
              </button>
            )}
          </div>
        </div>

        {/* Role-specific message */}
        <div className={`bg-${roleInfo.color}-50 border border-${roleInfo.color}-200 rounded-lg p-6`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${roleInfo.bgColor} ${roleInfo.textColor} mr-4`}>
              <span className="text-2xl">{roleInfo.icon}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Your Role: {role}</h3>
              <p className="text-gray-700">
                {role === 'ADMIN' ? 'As an Administrator, you have access to all system features including user management, system settings, and audit logs.' :
                 role === 'MANAGER' ? 'As a Manager, you can approve material requests, view analytics reports, and monitor budget utilization.' :
                 role === 'STAFF' ? 'As Staff, you can manage inventory, add/edit materials, and process incoming requests.' :
                 'As a regular User, you can browse materials, check availability, and submit material requests for approval.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
