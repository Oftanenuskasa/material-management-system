'use client'

import { useState } from 'react'

export default function DebugPage() {
  const [results, setResults] = useState({})

  const testEndpoint = async (endpoint, method = 'GET', data = null) => {
    console.log(`Testing ${method} ${endpoint}`)
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    if (data) {
      options.body = JSON.stringify(data)
    }
    
    try {
      const response = await fetch(endpoint, options)
      const result = await response.json()
      
      return {
        success: response.ok,
        status: response.status,
        data: result
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  const runAllTests = async () => {
    const tests = {}
    
    // Test 1: Simple test endpoint
    tests.testEndpoint = await testEndpoint('/api/test')
    
    // Test 2: Get materials
    tests.getMaterials = await testEndpoint('/api/materials')
    
    // Test 3: Create material
    tests.createMaterial = await testEndpoint('/api/materials', 'POST', {
      name: 'Debug Material ' + Date.now(),
      sku: 'DEBUG-' + Date.now(),
      quantity: 50,
      unit: 'pieces'
    })
    
    // Test 4: Get requests
    tests.getRequests = await testEndpoint('/api/requests')
    
    // Test 5: Get admin materials
    tests.getAdminMaterials = await testEndpoint('/api/admin/materials')
    
    setResults(tests)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">API Debug Tool</h1>
        
        <button
          onClick={runAllTests}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Run All Tests
        </button>
        
        <div className="space-y-4">
          {Object.entries(results).map(([testName, result]) => (
            <div key={testName} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900">{testName}</h3>
              <div className={`mt-2 p-3 rounded ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Debug Steps:</h3>
          <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
            <li>Open Browser Developer Tools (F12)</li>
            <li>Go to Network tab</li>
            <li>Click "Run All Tests" above</li>
            <li>Check each request in Network tab for headers</li>
            <li>Look for "Authorization" header being sent</li>
            <li>Clear localStorage: <code>localStorage.clear()</code></li>
          </ol>
        </div>
      </div>
    </div>
  )
}
