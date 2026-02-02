'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ManagerPage() {
  const { user, isLoading, hasRole } = useAuth()
  const router = useRouter()
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [filters, setFilters] = useState({ search: '', category: '' })

  useEffect(() => {
    if (!isLoading && !hasRole('MANAGER')) {
      router.push('/unauthorized')
    }
    
    if (hasRole('MANAGER')) {
      fetchMaterials()
    }
  }, [isLoading, user, hasRole, router])

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const queryParams = new URLSearchParams(filters).toString()
      const response = await fetch(`/api/materials?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const result = await response.json()
      if (result.success) {
        setMaterials(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (material) => {
    setSelectedMaterial(material)
    setShowEditModal(true)
  }

  const handleUpdate = async (materialData) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/materials/${selectedMaterial.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(materialData)
      })

      const result = await response.json()
      if (result.success) {
        setShowEditModal(false)
        setSelectedMaterial(null)
        fetchMaterials()
        alert('✅ Material updated successfully!')
      } else {
        alert(`❌ ${result.error}`)
      }
    } catch (error) {
      console.error('Error updating material:', error)
      alert('❌ Failed to update material')
    }
  }

  const getStatusBadge = (quantity, minStockLevel) => {
    if (quantity === 0) return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Out of Stock</span>
    if (quantity <= minStockLevel) return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Low Stock</span>
    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">In Stock</span>
  }

  if (isLoading || loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading manager panel...</p>
        </div>
      </div>
    )
  }

  if (!hasRole('MANAGER')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Panel</h1>
          <p className="text-gray-600">Manage materials and oversee operations</p>
        </div>

        {/* Role Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <span className="text-2xl">👔</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-yellow-800">Manager Access</h2>
              <p className="text-yellow-700 mt-1">You can manage materials, track inventory, and oversee requests</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{materials.length}</div>
            <div className="text-sm text-gray-600">Total Materials</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {materials.filter(m => m.quantity > (m.minStockLevel || 5)).length}
            </div>
            <div className="text-sm text-gray-600">In Stock</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {materials.filter(m => m.quantity > 0 && m.quantity <= (m.minStockLevel || 5)).length}
            </div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">
              {materials.filter(m => m.quantity === 0).length}
            </div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </div>
        </div>

        {/* Materials Management */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Materials Management</h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Add Material
                </button>
              </div>
            </div>
          </div>

          {materials.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No materials found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {materials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {material.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.category || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {material.quantity} {material.unit || 'pcs'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${parseFloat(material.unitPrice || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(material.quantity, material.minStockLevel)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(material)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => alert('View details - to be implemented')}
                          className="text-green-600 hover:text-green-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Manager Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Team Management</h3>
                <p className="text-gray-600 text-sm">Manage your team members and assignments</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/manager/team')}
              className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              View Team
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Budget Overview</h3>
                <p className="text-gray-600 text-sm">View and manage department budget</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/manager/budget')}
              className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              View Budget
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Performance Reports</h3>
                <p className="text-gray-600 text-sm">Generate team performance reports</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/manager/reports')}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Reports
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 hover:bg-gray-50 rounded">
              <div className="p-2 bg-blue-100 rounded mr-3">
                <span>📦</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">New material added</p>
                <p className="text-sm text-gray-500">Steel Rebar added to inventory</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center p-3 hover:bg-gray-50 rounded">
              <div className="p-2 bg-yellow-100 rounded mr-3">
                <span>⚠️</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Low stock alert</p>
                <p className="text-sm text-gray-500">PVC Pipe running low</p>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Material</h2>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const data = {
                  name: formData.get('name'),
                  sku: formData.get('sku'),
                  quantity: parseInt(formData.get('quantity')),
                  unitPrice: parseFloat(formData.get('unitPrice')),
                  category: formData.get('category'),
                  location: formData.get('location')
                }
                handleUpdate(data)
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedMaterial.name}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      defaultValue={selectedMaterial.sku}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      defaultValue={selectedMaterial.quantity}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}