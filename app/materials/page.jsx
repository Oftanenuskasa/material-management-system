'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from 'next-auth/react'

export default function MaterialsPage() {
  const [session, setSession] = useState(null)
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  })
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await getSession()
        if (!sessionData) {
          router.push('/auth/login')
        } else {
          setSession(sessionData)
          fetchMaterials()
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

  useEffect(() => {
    if (session) {
      fetchMaterials()
    }
  }, [filters, session])

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams(filters).toString()
      const response = await fetch(`/api/materials?${queryParams}`)
      const result = await response.json()
      
      if (result.success) {
        setMaterials(result.data)
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const getStatusColor = (status, quantity, minStockLevel) => {
    if (status === 'DISCONTINUED') return 'bg-gray-100 text-gray-800'
    if (quantity === 0) return 'bg-red-100 text-red-800'
    if (quantity <= minStockLevel) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (status, quantity, minStockLevel) => {
    if (status === 'DISCONTINUED') return 'Discontinued'
    if (quantity === 0) return 'Out of Stock'
    if (quantity <= minStockLevel) return 'Low Stock'
    return 'In Stock'
  }

  if (loading && materials.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading materials...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userRole = session.user?.role || 'USER'

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Materials Catalog</h1>
            <p className="text-gray-600">Browse available materials</p>
          </div>
          {userRole === 'ADMIN' && (
            <button
              onClick={() => router.push('/admin/materials')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <span className="mr-2">⚙️</span> Admin Management
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by name, SKU, or description..."
                className="w-full px-3 py-2 border rounded-lg"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div>
              <select
                className="px-3 py-2 border rounded-lg"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="CONSTRUCTION">Construction</option>
                <option value="TOOLS">Tools</option>
                <option value="SAFETY">Safety</option>
                <option value="HARDWARE">Hardware</option>
                <option value="PAINT">Paint</option>
                <option value="LUMBER">Lumber</option>
                <option value="FIXTURES">Fixtures</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <select
                className="px-3 py-2 border rounded-lg"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="DISCONTINUED">Discontinued</option>
              </select>
            </div>
            <button
              onClick={() => setFilters({ search: '', category: '', status: '' })}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Materials Grid */}
        {materials.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Materials Found</h2>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.category || filters.status 
                ? 'Try adjusting your filters' 
                : 'No materials in the system yet'}
            </p>
            {userRole === 'ADMIN' && (
              <button
                onClick={() => router.push('/admin/materials')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Your First Material
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <div key={material.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{material.name}</h3>
                      <p className="text-sm text-gray-500">{material.sku}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(material.status, material.quantity, material.minStockLevel)}`}>
                      {getStatusText(material.status, material.quantity, material.minStockLevel)}
                    </span>
                  </div>
                  
                  {material.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium">{material.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Quantity:</span>
                      <span className="font-medium">{material.quantity} {material.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium">${parseFloat(material.unitPrice).toFixed(2)}</span>
                    </div>
                    {material.location && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium">{material.location}</span>
                      </div>
                    )}
                    {material.supplier && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Supplier:</span>
                        <span className="font-medium">{material.supplier}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Updated: {new Date(material.updatedAt).toLocaleDateString()}</span>
                      <span>Created by: {material.createdBy?.name || 'System'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 border-t">
                  <div className="flex justify-between">
                    {userRole === 'USER' && (
                      <button
                        onClick={() => alert('Request feature coming soon!')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Request Material
                      </button>
                    )}
                    {['STAFF', 'MANAGER', 'ADMIN'].includes(userRole) && (
                      <button
                        onClick={() => alert('Stock check coming soon!')}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Check Stock
                      </button>
                    )}
                    {userRole === 'ADMIN' && (
                      <button
                        onClick={() => router.push(`/admin/materials`)}
                        className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                      >
                        Edit in Admin
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Catalog Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-700">{materials.length}</p>
              <p className="text-sm text-gray-600">Total Materials</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">
                {materials.filter(m => m.status === 'ACTIVE' && m.quantity > m.minStockLevel).length}
              </p>
              <p className="text-sm text-gray-600">In Stock</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-700">
                {materials.filter(m => m.status === 'ACTIVE' && m.quantity > 0 && m.quantity <= m.minStockLevel).length}
              </p>
              <p className="text-sm text-gray-600">Low Stock</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-700">
                {materials.filter(m => m.status === 'ACTIVE' && m.quantity === 0).length}
              </p>
              <p className="text-sm text-gray-600">Out of Stock</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
