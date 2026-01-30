'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MaterialDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [material, setMaterial] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchMaterial()
    }
  }, [params.id])

  const fetchMaterial = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/materials/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch material')
      }
      
      const data = await response.json()
      setMaterial(data)
    } catch (error) {
      console.error('Error fetching material:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/materials/${params.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/materials')
      }
    } catch (error) {
      console.error('Error deleting material:', error)
      alert('Failed to delete material')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading material details...</p>
        </div>
      </div>
    )
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Material not found</h2>
          <p className="mt-2 text-gray-600">The material you're looking for doesn't exist.</p>
          <Link
            href="/materials"
            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Materials
          </Link>
        </div>
      </div>
    )
  }

  const getStockStatus = () => {
    if (material.quantity === 0) {
      return { text: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: '❌' }
    }
    if (material.quantity <= material.minStockLevel) {
      return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' }
    }
    return { text: 'In Stock', color: 'bg-green-100 text-green-800', icon: '✅' }
  }

  const status = getStockStatus()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <Link href="/materials" className="hover:text-gray-700">
                  Materials
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{material.name}</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">{material.name}</h1>
              <p className="mt-2 text-gray-600">{material.description}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/materials/${material.id}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Status Banner */}
          <div className={`px-6 py-4 ${status.color} flex items-center`}>
            <span className="text-2xl mr-3">{status.icon}</span>
            <div>
              <h3 className="font-bold">{status.text}</h3>
              <p className="text-sm opacity-90">
                Current quantity: {material.quantity} {material.unit} • Minimum required: {material.minStockLevel}
              </p>
            </div>
          </div>

          <div className="p-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">SKU</dt>
                    <dd className="mt-1 text-lg font-medium text-gray-900">{material.sku}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {material.category || 'Uncategorized'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Supplier</dt>
                    <dd className="mt-1 text-gray-900">{material.supplier || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="mt-1 text-gray-900">{material.location || 'Not specified'}</dd>
                  </div>
                </dl>
              </div>

              {/* Stock & Pricing */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock & Pricing</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Current Quantity</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">
                      {material.quantity} {material.unit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Unit Price</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">
                      ${material.unitPrice?.toFixed(2) || '0.00'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total Value</dt>
                    <dd className="mt-1 text-2xl font-bold text-green-600">
                      ${((material.quantity || 0) * (material.unitPrice || 0)).toFixed(2)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Description */}
            {material.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{material.description}</p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(material.createdAt).toLocaleDateString()} at{' '}
                  {new Date(material.createdAt).toLocaleTimeString()}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{' '}
                  {new Date(material.updatedAt).toLocaleDateString()} at{' '}
                  {new Date(material.updatedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/materials"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Materials List
          </Link>
        </div>
      </div>
    </div>
  )
}
