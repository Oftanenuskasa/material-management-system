'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewRequestPage() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    materialId: '',
    quantity: '',
    purpose: '',
    urgency: 'MEDIUM'
  })
  const router = useRouter()

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }
      
      const response = await fetch('/api/materials', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      if (result.success) {
        setMaterials(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }
      
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`)
      }
      
      const result = await response.json()
      if (result.success) {
        // Show success message
        alert('Request created successfully!')
        
        // Redirect to requests page which will refresh the data
        router.push('/requests')
      } else {
        alert(result.message || 'Failed to create request')
      }
    } catch (error) {
      console.error('Error creating request:', error)
      alert('Error creating request: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/requests')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              ← Back to Requests
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Material Request</h1>
              <p className="text-gray-600 mt-1">Request materials for your project or task</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            {/* Material Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Material *
              </label>
              <select
                name="materialId"
                value={formData.materialId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a material</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name} ({material.sku}) - Available: {material.quantity} {material.unit}
                  </option>
                ))}
              </select>
              {materials.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Loading materials...
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter quantity"
              />
            </div>

            {/* Purpose */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose *
              </label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what you need this material for..."
              />
            </div>

            {/* Urgency */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <div className="flex space-x-4">
                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="urgency"
                      value={level}
                      checked={formData.urgency === level}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/requests')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-1">Need help?</h3>
          <p className="text-sm text-blue-700">
            • Select the material you need from the dropdown list<br/>
            • Enter the required quantity (must be available in stock)<br/>
            • Describe what you need it for - this helps with approval<br/>
            • Set urgency level based on your project timeline
          </p>
        </div>
      </div>
    </div>
  )
}
