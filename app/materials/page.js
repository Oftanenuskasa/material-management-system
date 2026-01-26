'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([])
  const [filteredMaterials, setFilteredMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // PWA offline status
  const [isOnline, setIsOnline] = useState(true)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Refresh data when coming back online
      if (materials.length === 0) {
        fetchMaterials()
      }
    }
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [materials.length])

  // Fetch materials
  const fetchMaterials = async () => {
    if (!isOnline) {
      // Try to use cached data when offline
      const cachedMaterials = localStorage.getItem('cachedMaterials')
      if (cachedMaterials) {
        try {
          const parsedMaterials = JSON.parse(cachedMaterials)
          setMaterials(parsedMaterials)
          setFilteredMaterials(parsedMaterials)
          setIsLoading(false)
          return
        } catch (error) {
          console.error('Error parsing cached materials:', error)
        }
      }
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/materials')
      if (!response.ok) throw new Error('Failed to fetch materials')
      
      const data = await response.json()
      
      // Handle both response formats
      let materialsData = []
      if (Array.isArray(data)) {
        materialsData = data
      } else if (data.materials && Array.isArray(data.materials)) {
        materialsData = data.materials
      } else {
        throw new Error('Invalid data format received')
      }
      
      // Cache materials for offline use
      localStorage.setItem('cachedMaterials', JSON.stringify(materialsData))
      
      setMaterials(materialsData)
      setFilteredMaterials(materialsData)
    } catch (err) {
      setError(err.message)
      setMaterials([])
      setFilteredMaterials([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  // Extract unique categories - handle empty array
  const categories = materials.length > 0 
    ? ['all', ...new Set(materials.map(m => m.category).filter(Boolean))]
    : ['all']

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = materials

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(material =>
        material.name.toLowerCase().includes(term) ||
        material.description?.toLowerCase().includes(term) ||
        material.supplier?.toLowerCase().includes(term)
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(material => material.category === selectedCategory)
    }

    // Price filters
    if (minPrice) {
      filtered = filtered.filter(material => material.unitPrice >= parseFloat(minPrice))
    }
    if (maxPrice) {
      filtered = filtered.filter(material => material.unitPrice <= parseFloat(maxPrice))
    }

    setFilteredMaterials(filtered)
  }, [materials, searchTerm, selectedCategory, minPrice, maxPrice])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Delete material
  const handleDelete = async (id, name) => {
    if (!isOnline) {
      alert('⚠️ You are offline. Please connect to the internet to delete materials.')
      return
    }

    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Material deleted successfully!')
        fetchMaterials() // Refresh the list
      } else {
        const result = await response.json()
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error deleting material:', error)
      alert('Failed to delete material')
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setMinPrice('')
    setMaxPrice('')
  }

  // Calculate statistics
  const totalValue = filteredMaterials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0)
  const totalQuantity = filteredMaterials.reduce((sum, m) => sum + m.quantity, 0)

  // Export to CSV
  const handleExport = async () => {
    if (!isOnline) {
      alert('⚠️ You are offline. Please connect to the internet to export data.')
      return
    }

    try {
      const response = await fetch('/api/export/materials')
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'materials_export.csv'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        alert('✅ Export completed successfully!')
      } else {
        alert('❌ Failed to export materials')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('❌ Error exporting materials')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading materials...</p>
          {!isOnline && (
            <p className="text-sm text-yellow-600 mt-2">Using cached data (offline mode)</p>
          )}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <button
            onClick={fetchMaterials}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            disabled={!isOnline}
          >
            Try Again
          </button>
          {!isOnline && (
            <p className="mt-2 text-sm text-red-600">
              You are offline. Please check your internet connection.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg flex items-center">
          <span className="mr-2 text-xl">📶</span>
          <div>
            <p className="font-semibold">You are offline</p>
            <p className="text-sm">Showing cached data. Some features may be limited.</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="ml-auto bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
          >
            Refresh
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Materials Inventory</h1>
          <p className="text-gray-600">Manage your material inventory with advanced filters</p>
        </div>
        <Link
          href="/materials/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-disabled={!isOnline}
        >
          <span className="mr-2">+</span> Add New Material
        </Link>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <div className="flex items-center space-x-4">
            {!isOnline && (
              <span className="text-sm text-yellow-600 flex items-center">
                <span className="mr-1">⚠️</span> Filters work offline
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Materials
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, description, supplier..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isOnline && materials.length === 0}
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isOnline && materials.length === 0}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
              disabled={!isOnline && materials.length === 0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
              disabled={!isOnline && materials.length === 0}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-600">Showing Materials</div>
            <div className="text-2xl font-bold text-blue-700">{filteredMaterials.length}</div>
            <div className="text-sm text-blue-500">out of {materials.length} total</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-600">Total Quantity</div>
            <div className="text-2xl font-bold text-green-700">{totalQuantity}</div>
            <div className="text-sm text-green-500">items in stock</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-purple-600">Total Value</div>
            <div className="text-2xl font-bold text-purple-700">${totalValue.toFixed(2)}</div>
            <div className="text-sm text-purple-500">inventory value</div>
          </div>
        </div>
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-4">
            {isOnline ? '🔍' : '📶'}
          </div>
          <p className="text-gray-500 mb-4">
            {materials.length === 0 
              ? isOnline 
                ? "No materials found. Create your first material!"
                : "No cached data available. Please go online to load materials."
              : "No materials match your filters. Try adjusting your search criteria."}
          </p>
          {materials.length === 0 ? (
            isOnline ? (
              <Link
                href="/materials/create"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Create your first material
              </Link>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md"
              >
                Retry Connection
              </button>
            )
          ) : (
            <button
              onClick={resetFilters}
              className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Materials ({filteredMaterials.length} items)
                {!isOnline && <span className="ml-2 text-sm text-yellow-600">(Offline)</span>}
              </h2>
              <div className="text-sm text-gray-500">
                Total Value: ${totalValue.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <Link 
                              href={`/materials/${material.id}`} 
                              className="hover:text-blue-600"
                              aria-disabled={!isOnline}
                            >
                              {material.name}
                              {!isOnline && <span className="ml-1 text-xs text-gray-400">(view only)</span>}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {material.description || 'No description'}
                          </div>
                          {material.supplier && (
                            <div className="text-xs text-gray-400">
                              Supplier: {material.supplier}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {material.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${material.quantity > 50 ? 'bg-green-500' : material.quantity > 10 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{material.quantity}</div>
                          <div className="text-sm text-gray-500">{material.unit}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${material.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ${(material.quantity * material.unitPrice).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          href={`/materials/${material.id}`}
                          className={`text-blue-600 hover:text-blue-900 ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="View Details"
                          aria-disabled={!isOnline}
                        >
                          👁️
                        </Link>
                        <Link
                          href={`/materials/edit/${material.id}`}
                          className={`text-green-600 hover:text-green-900 ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Edit"
                          aria-disabled={!isOnline}
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(material.id, material.name)}
                          className={`text-red-600 hover:text-red-900 ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Delete"
                          disabled={!isOnline}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                Showing {filteredMaterials.length} material{filteredMaterials.length !== 1 ? 's' : ''}
                {filteredMaterials.length !== materials.length && ` (filtered from ${materials.length})`}
                {!isOnline && ' • Using cached data'}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleExport}
                  className={`text-blue-600 hover:text-blue-800 ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isOnline}
                >
                  📥 Export to CSV
                </button>
                <Link 
                  href="/materials/create" 
                  className={`text-blue-600 hover:text-blue-800 ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-disabled={!isOnline}
                >
                  + Add Another Material
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
