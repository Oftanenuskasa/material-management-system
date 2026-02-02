'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/materials')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      if (result.success) {
        setMaterials(result.data || [])
      } else {
        setError(result.message || 'Failed to fetch materials')
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
      setError('Failed to load materials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading materials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Materials Inventory</h1>
              <p className="text-gray-600 mt-1">Manage your materials and inventory</p>
            </div>
            <button
              onClick={() => router.push('/materials/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            >
              <span className="mr-2">+</span> Add Material
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{materials.length}</div>
              <div className="text-sm text-gray-600">Total Materials</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {materials.filter(m => m.quantity > 0).length}
              </div>
              <div className="text-sm text-gray-600">In Stock</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {materials.filter(m => m.quantity > 0 && m.quantity <= (m.minStockLevel || 10)).length}
              </div>
              <div className="text-sm text-gray-600">Low Stock</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {materials.filter(m => m.quantity === 0).length}
              </div>
              <div className="text-sm text-gray-600">Out of Stock</div>
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">All Materials</h2>
            <button
              onClick={fetchMaterials}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 text-sm hover:bg-blue-50 rounded transition-colors"
            >
              Refresh
            </button>
          </div>

          {materials.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-600 mb-6">Add your first material to get started.</p>
              <button
                onClick={() => router.push('/materials/new')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Material
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {materials.map((material) => (
                    <tr 
                      key={material.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/materials/${material.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{material.name}</div>
                          <div className="text-sm text-gray-500">{material.sku}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{material.category || 'Uncategorized'}</div>
                        <div className="text-xs text-gray-500">{material.supplier || 'No supplier'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {material.quantity} {material.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {formatCurrency(material.unitPrice)}
                      </td>
                      <td className="px-6 py-4">
                        {material.quantity === 0 ? (
                          <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        ) : material.quantity <= (material.minStockLevel || 10) ? (
                          <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => router.push('/materials/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Material
          </button>
          <button
            onClick={() => router.push('/requests')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Requests
          </button>
          <button
            onClick={fetchMaterials}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Refresh List
          </button>
        </div>
      </div>
    </div>
  )
}
