'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentMaterials, setRecentMaterials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/materials')
      const data = await response.json()
      
      if (response.ok) {
        // Handle both response formats
        let materials = []
        if (Array.isArray(data)) {
          materials = data
        } else if (data.materials && Array.isArray(data.materials)) {
          materials = data.materials
        } else {
          materials = []
        }
        
        // Calculate stats
        const totalMaterials = materials.length
        const totalQuantity = materials.reduce((sum, m) => sum + m.quantity, 0)
        const totalValue = materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0)
        const categories = [...new Set(materials.map(m => m.category).filter(Boolean))]
        
        // Get low stock items (< 10)
        const lowStock = materials.filter(m => m.quantity < 10)
        
        // Get recent materials (last 5)
        const recent = materials.slice(0, 5)
        
        setStats({
          totalMaterials,
          totalQuantity,
          totalValue,
          categories: categories.length,
          lowStock: lowStock.length
        })
        
        setRecentMaterials(recent)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setStats({
        totalMaterials: 0,
        totalQuantity: 0,
        totalValue: 0,
        categories: 0,
        lowStock: 0
      })
      setRecentMaterials([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Overview of your material inventory</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              📦
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Materials</p>
              <p className="text-2xl font-bold">{stats?.totalMaterials || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              🔢
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Quantity</p>
              <p className="text-2xl font-bold">{stats?.totalQuantity || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              💰
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold">${stats?.totalValue?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              ⚠️
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-bold">{stats?.lowStock || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Materials and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Materials */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Recent Materials</h2>
            </div>
            {recentMaterials.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentMaterials.map((material) => (
                        <tr key={material.id}>
                          <td className="px-6 py-4">
                            <Link href={`/materials/${material.id}`} className="text-blue-600 hover:text-blue-800">
                              {material.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {material.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              material.quantity > 50 ? 'bg-green-100 text-green-800' :
                              material.quantity > 10 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {material.quantity} {material.unit}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Link
                                href={`/materials/edit/${material.id}`}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </Link>
                              <Link
                                href={`/materials/${material.id}`}
                                className="text-sm text-gray-600 hover:text-gray-800"
                              >
                                View
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t text-center">
                  <Link href="/materials" className="text-blue-600 hover:text-blue-800">
                    View All Materials →
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No materials found. <Link href="/materials/create" className="text-blue-600">Create your first material</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/materials/create"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-md"
              >
                + Add New Material
              </Link>
              <button
                onClick={() => {
                  // Export functionality
                  fetch('/api/export/materials')
                    .then(res => res.blob())
                    .then(blob => {
                      const url = window.URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'materials_export.csv'
                      document.body.appendChild(a)
                      a.click()
                      window.URL.revokeObjectURL(url)
                      document.body.removeChild(a)
                      alert('Export completed!')
                    })
                }}
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-md"
              >
                📥 Export to CSV
              </button>
              <Link
                href="/materials"
                className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-3 rounded-md"
              >
                ⚠️ View Low Stock
              </Link>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Total Categories</span>
                  <span className="text-sm font-semibold">{stats?.categories || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((stats?.categories || 0) * 20, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Inventory Health</p>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    stats?.lowStock === 0 ? 'bg-green-500' :
                    stats?.lowStock < 3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm">
                    {stats?.lowStock === 0 ? 'All items in stock' :
                     stats?.lowStock < 3 ? 'Few items low' : 'Multiple items low'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
