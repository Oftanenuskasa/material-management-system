'use client'

import { useState, useEffect } from 'react'
import { getSession } from 'next-auth/react'

export default function EditMaterialModal({ material, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category: '',
    quantity: 0,
    unit: 'pieces',
    unitPrice: 0,
    supplier: '',
    location: '',
    minStockLevel: 10,
    status: 'ACTIVE',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    if (material) {
      setFormData({
        sku: material.sku || '',
        name: material.name || '',
        description: material.description || '',
        category: material.category || '',
        quantity: material.quantity || 0,
        unit: material.unit || 'pieces',
        unitPrice: parseFloat(material.unitPrice) || 0,
        supplier: material.supplier || '',
        location: material.location || '',
        minStockLevel: material.minStockLevel || 10,
        status: material.status || 'ACTIVE',
        notes: material.notes || ''
      })
    }
  }, [material])

  const categories = [
    'ELECTRICAL',
    'PLUMBING', 
    'CONSTRUCTION',
    'TOOLS',
    'SAFETY',
    'HARDWARE',
    'PAINT',
    'LUMBER',
    'FIXTURES',
    'OTHER'
  ]

  const units = [
    'pieces',
    'meters',
    'liters',
    'kilograms',
    'boxes',
    'rolls',
    'pairs',
    'sets'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setApiError('')
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required'
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    
    if (isNaN(formData.quantity)) {
      newErrors.quantity = 'Quantity must be a number'
    }
    
    if (isNaN(formData.unitPrice)) {
      newErrors.unitPrice = 'Price must be a number'
    }
    
    if (isNaN(formData.minStockLevel)) {
      newErrors.minStockLevel = 'Min stock level must be a number'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const session = await getSession()
      
      const response = await fetch(`/api/materials/${material.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        onUpdate(material.id, formData)
      } else {
        setApiError(result.error || 'Failed to update material')
      }
    } catch (error) {
      console.error('Error updating material:', error)
      setApiError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!material) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Material</h2>
              <p className="text-sm text-gray-600">SKU: {material.sku}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 text-xl"
            >
              ✕
            </button>
          </div>

          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SKU */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
              </div>

              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                  <option value="DISCONTINUED">Discontinued</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                  min="0"
                />
                {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              {/* Unit Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price ($)
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.unitPrice ? 'border-red-500' : 'border-gray-300'}`}
                  step="0.01"
                  min="0"
                />
                {errors.unitPrice && <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>}
              </div>

              {/* Min Stock Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Stock Level
                </label>
                <input
                  type="number"
                  name="minStockLevel"
                  value={formData.minStockLevel}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.minStockLevel ? 'border-red-500' : 'border-gray-300'}`}
                  min="0"
                />
                {errors.minStockLevel && <p className="mt-1 text-sm text-red-600">{errors.minStockLevel}</p>}
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Metadata</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Created By</p>
                  <p className="font-medium">{material.createdBy?.name || 'System'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Created At</p>
                  <p className="font-medium">{new Date(material.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated By</p>
                  <p className="font-medium">{material.updatedBy?.name || 'System'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated</p>
                  <p className="font-medium">{new Date(material.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Updating...' : 'Update Material'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
