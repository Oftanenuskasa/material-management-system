'use client'

import { useState } from 'react'

export default function CreateMaterialModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category: '',
    quantity: '',
    unit: 'pieces',
    unitPrice: '',
    supplier: '',
    location: '',
    minStockLevel: '10',
    status: 'ACTIVE',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required'
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    
    if (formData.quantity !== '' && isNaN(formData.quantity)) {
      newErrors.quantity = 'Quantity must be a number'
    }
    
    if (formData.unitPrice !== '' && isNaN(formData.unitPrice)) {
      newErrors.unitPrice = 'Price must be a number'
    }
    
    if (formData.minStockLevel !== '' && isNaN(formData.minStockLevel)) {
      newErrors.minStockLevel = 'Min stock level must be a number'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      await onCreate({
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        unitPrice: parseFloat(formData.unitPrice) || 0,
        minStockLevel: parseInt(formData.minStockLevel) || 10
      })
    } catch (error) {
      console.error('Error creating material:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSKU = () => {
    const prefix = formData.category ? formData.category.substring(0, 3).toUpperCase() : 'MAT'
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const sku = `${prefix}-${random}`
    setFormData(prev => ({ ...prev, sku }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Material</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SKU */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                  <button
                    type="button"
                    onClick={generateSKU}
                    className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Generate SKU
                  </button>
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., ELEC-001"
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
                  placeholder="Enter material name"
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
                  placeholder="Enter material description"
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
                  placeholder="0"
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
                  placeholder="0.00"
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
                  placeholder="10"
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
                  placeholder="Supplier name"
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
                  placeholder="Storage location"
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
                  placeholder="Additional notes"
                />
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Material'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
