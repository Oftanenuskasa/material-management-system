// app/requests/debug-new/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DebugNewRequestPage() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    materialId: '',
    quantity: 1,
    purpose: '',
    notes: ''
  })
  const [logs, setLogs] = useState([])
  const router = useRouter()

  const addLog = (message) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        addLog(`User loaded: ${parsedUser.name}`)
      } catch (error) {
        addLog(`Error parsing user: ${error.message}`)
      }
    }
    
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      addLog('Fetching materials...')
      
      const response = await fetch('/api/materials', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const result = await response.json()
      addLog(`Materials response: ${result.success ? 'Success' : 'Failed'}`)
      
      if (result.success) {
        const availableMaterials = result.data.filter(m => m.quantity > 0)
        setMaterials(availableMaterials)
        addLog(`Found ${availableMaterials.length} available materials`)
        
        // Auto-select first material
        if (availableMaterials.length > 0) {
          setFormData(prev => ({
            ...prev,
            materialId: availableMaterials[0].id
          }))
        }
      }
    } catch (error) {
      addLog(`Error fetching materials: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    addLog('Form submission started')
    
    if (!user) {
      addLog('No user found')
      alert('Please login first')
      return
    }
    
    if (!formData.materialId) {
      addLog('No material selected')
      alert('Please select a material')
      return
    }
    
    setSubmitting(true)
    addLog('Setting submitting to true')
    
    try {
      const token = localStorage.getItem('token')
      addLog(`User ID: ${user.id}, Material ID: ${formData.materialId}`)
      
      const requestData = {
        materialId: formData.materialId,
        userId: user.id,
        quantity: parseInt(formData.quantity),
        purpose: formData.purpose,
        notes: formData.notes
      }
      
      addLog(`Sending request: ${JSON.stringify(requestData)}`)
      
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      })
      
      addLog(`Response status: ${response.status}`)
      const result = await response.json()
      addLog(`Response: ${JSON.stringify(result)}`)
      
      if (result.success) {
        addLog('Request successful!')
        alert('✅ Request submitted successfully!')
        router.push('/requests')
      } else {
        addLog(`Request failed: ${result.error}`)
        alert(`❌ ${result.error || 'Failed to submit request'}`)
      }
    } catch (error) {
      addLog(`Error: ${error.message}`)
      alert('❌ Failed to submit request')
    } finally {
      addLog('Setting submitting to false')
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    addLog(`Field changed: ${name} = ${value}`)
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const selectedMaterial = materials.find(m => m.id === formData.materialId)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Debug: New Request</h1>
        
        {/* Debug Logs */}
        <div className="mb-6 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-60 overflow-auto">
          <h2 className="font-bold mb-2">Debug Logs:</h2>
          {logs.map((log, index) => (
            <div key={index} className="border-b border-gray-700 py-1">
              {log}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Material *
                </label>
                <select
                  name="materialId"
                  value={formData.materialId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={loading}
                >
                  <option value="">Choose a material...</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name} ({material.sku}) - Available: {material.quantity} {material.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  max={selectedMaterial ? selectedMaterial.quantity : 0}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose *
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Why do you need this material?"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !formData.materialId}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Request (Debug)'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}