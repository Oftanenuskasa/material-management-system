'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function MaterialDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [material, setMaterial] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchMaterial() {
      try {
        if (!params?.id) return
        
        setIsLoading(true)
        const response = await fetch(`/api/materials/${params.id}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Material not found')
        }
        
        setMaterial(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterial()
  }, [params?.id])

  const handleDelete = async () => {
    if (!params?.id || !material) return
    
    if (!confirm(`Are you sure you want to delete "${material.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/materials/${params.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      
      if (response.ok) {
        alert(result.message || 'Material deleted successfully!')
        router.push('/materials')
      } else {
        alert(`Error: ${result.error || 'Failed to delete material'}`)
      }
    } catch (error) {
      console.error('Error deleting material:', error)
      alert('Failed to delete material')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading material details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => router.push('/materials')}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Back to Materials
          </button>
        </div>
      </div>
    )
  }

  if (!material) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Material not found</p>
          <button
            onClick={() => router.push('/materials')}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Back to Materials
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/materials')}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Materials
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{material.name}</h1>
                <div className="flex items-center mt-2">
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    {material.category}
                  </span>
                  <span className="ml-3 text-sm text-gray-500">
                    ID: {material.id}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  ${(material.quantity * material.unitPrice).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Total Value</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Material Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Description</label>
                    <p className="mt-1 text-gray-900">{material.description || 'No description provided'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Supplier</label>
                      <p className="mt-1 text-gray-900">{material.supplier || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Unit</label>
                      <p className="mt-1 text-gray-900">{material.unit}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory & Pricing</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-blue-600">Quantity</label>
                      <p className="mt-1 text-2xl font-bold text-blue-700">{material.quantity}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-green-600">Unit Price</label>
                      <p className="mt-1 text-2xl font-bold text-green-700">${material.unitPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(material.createdAt).toLocaleDateString()} at{' '}
                      {new Date(material.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(material.updatedAt).toLocaleDateString()} at{' '}
                      {new Date(material.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex justify-between">
              <div>
                <Link
                  href={`/materials/edit/${material.id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  ✏️ Edit Material
                </Link>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push('/materials')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Back to List
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
