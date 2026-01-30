'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { materialSchema } from '@/schemas/material'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditMaterialPage() {
  const router = useRouter()
  const params = useParams()
  const [material, setMaterial] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(materialSchema),
  })

  // Fetch material data
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
        reset(data) // Pre-fill form with existing data
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterial()
  }, [params?.id, reset])

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`/api/materials/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      
      if (response.ok) {
        alert('Material updated successfully!')
        router.push('/materials')
        router.refresh()
      } else {
        alert(`Error: ${result.error || 'Failed to update material'}`)
      }
    } catch (error) {
      console.error('Error updating material:', error)
      alert('Failed to update material')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading material...</p>
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/materials')}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Materials
          </button>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Edit Material: {material?.name}
        </h1>
        <p className="text-gray-600 mb-6">Update the material information</p>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter material name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  {...register('category')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Electronics, Raw Materials"
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  {...register('quantity', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <input
                  {...register('unit')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., kg, piece, meter"
                />
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price *
                </label>
                <input
                  {...register('unitPrice', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.unitPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.unitPrice.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <input
                  {...register('supplier')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter supplier name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter material description"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure? Any unsaved changes will be lost.')) {
                    router.push('/materials')
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => router.push(`/materials/${params.id}`)}
                  className="px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50"
                >
                  View Details
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Material'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
