// app/requests/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function RequestDetailPage() {
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Failed to parse user data:', error)
      }
    }
    
    fetchRequest()
  }, [])

  const fetchRequest = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/requests/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const result = await response.json()
      if (result.success) {
        setRequest(result.data)
      } else {
        router.push('/requests')
      }
    } catch (error) {
      console.error('Error fetching request:', error)
      router.push('/requests')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading request...</p>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Request not found</h2>
          <Link
            href="/requests"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Requests
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/requests"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Requests
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Request Details</h1>
          <p className="text-gray-600 mt-1">ID: {request.id}</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{request.material?.name}</h2>
              <p className="text-gray-600">SKU: {request.material?.sku}</p>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Request Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-medium">{request.quantity} {request.material?.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Purpose</p>
                  <p className="font-medium">{request.purpose || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Requested Date</p>
                  <p className="font-medium">{new Date(request.requestedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Requester Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{request.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{request.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium">{request.user?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {request.notes && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700">{request.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/requests"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Back to List
          </Link>
          <Link
            href="/requests/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            New Request
          </Link>
        </div>
      </div>
    </div>
  )
}