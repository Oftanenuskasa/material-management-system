'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from 'next-auth/react'
import MaterialTable from '@/components/admin/MaterialTable'
import CreateMaterialModal from '@/components/admin/CreateMaterialModal'
import EditMaterialModal from '@/components/admin/EditMaterialModal'

export default function AdminMaterialsPage() {
  const [session, setSession] = useState(null)
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 })
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
          return
        }
        
        if (sessionData.user.role !== 'ADMIN') {
          router.push('/dashboard')
          return
        }
        
        setSession(sessionData)
        fetchMaterials(1, filters)
      } catch (error) {
        console.error('Failed to fetch session:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [router])

  // Fetch materials
  const fetchMaterials = async (page = 1, filters = {}) => {
    try {
      setLoading(true)
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      }).toString()

      const response = await fetch(`/api/materials?${queryParams}`)
      const result = await response.json()

      if (result.success) {
        setMaterials(result.data)
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchMaterials(pagination.page, filters)
    }
  }, [pagination.page, filters, session])

  // Handle create
  const handleCreate = async (materialData) => {
    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData)
      })

      const result = await response.json()

      if (result.success) {
        setShowCreateModal(false)
        fetchMaterials(pagination.page, filters) // Refresh list
      } else {
        alert(result.error || 'Failed to create material')
      }
    } catch (error) {
      console.error('Error creating material:', error)
      alert('Failed to create material')
    }
  }

  // Handle update
  const handleUpdate = async (id, materialData) => {
    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData)
      })

      const result = await response.json()

      if (result.success) {
        setShowEditModal(false)
        setSelectedMaterial(null)
        fetchMaterials(pagination.page, filters) // Refresh list
      } else {
        alert(result.error || 'Failed to update material')
      }
    } catch (error) {
      console.error('Error updating material:', error)
      alert('Failed to update material')
    }
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this material?')) {
      return
    }

    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        fetchMaterials(pagination.page, filters) // Refresh list
      } else {
        alert(result.error || 'Failed to delete material')
      }
    } catch (error) {
      console.error('Error deleting material:', error)
      alert('Failed to delete material')
    }
  }

  // Handle edit click
  const handleEditClick = (material) => {
    setSelectedMaterial(material)
    setShowEditModal(true)
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to page 1
  }

  if (loading && materials.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading materials...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Admin access required</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Materials Management</h1>
            <p className="text-gray-600">Admin - Manage all materials in the system</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/materials')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
            >
              <span className="mr-2">📦</span> View Catalog
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <span className="mr-2">+</span> Add New Material
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Materials</p>
                <p className="text-2xl font-bold">{pagination.total}</p>
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
                <p className="text-2xl font-bold">
                  {materials.filter(m => m.status === 'ACTIVE' && m.quantity > 0).length}
                </p>
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
                <p className="text-2xl font-bold">
                  {materials.filter(m => m.quantity > 0 && m.quantity <= m.minStockLevel).length}
                </p>
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
                <p className="text-2xl font-bold">
                  {materials.filter(m => m.quantity === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-lg shadow">
          <MaterialTable
            materials={materials}
            loading={loading}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            filters={filters}
            onFilterChange={handleFilterChange}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Modals */}
        {showCreateModal && (
          <CreateMaterialModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreate}
          />
        )}

        {showEditModal && selectedMaterial && (
          <EditMaterialModal
            material={selectedMaterial}
            onClose={() => {
              setShowEditModal(false)
              setSelectedMaterial(null)
            }}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  )
}
