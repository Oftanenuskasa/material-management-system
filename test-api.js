// Simple test script to check API endpoints
async function testAPI(endpoint, method = 'GET', data = null) {
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
    const response = await fetch(`http://localhost:3001${endpoint}`, options)
    const result = await response.json()
    console.log(`Status: ${response.status}`)
    console.log('Response:', JSON.stringify(result, null, 2))
    return { success: response.ok, data: result }
  } catch (error) {
    console.error('Error:', error.message)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('=== Testing API Endpoints ===\n')
  
  // Test 1: Get materials
  console.log('1. Testing GET /api/materials')
  await testAPI('/api/materials')
  console.log()
  
  // Test 2: Create material
  console.log('2. Testing POST /api/materials')
  await testAPI('/api/materials', 'POST', {
    name: 'Test Material ' + Date.now(),
    sku: 'TEST-' + Date.now(),
    quantity: 100,
    unit: 'pieces',
    unitPrice: 10.50,
    category: 'Test',
    supplier: 'Test Supplier',
    location: 'Test Location',
    minStockLevel: 10
  })
  console.log()
  
  // Test 3: Get requests
  console.log('3. Testing GET /api/requests')
  await testAPI('/api/requests')
  console.log()
  
  // Test 4: Get admin materials
  console.log('4. Testing GET /api/admin/materials')
  await testAPI('/api/admin/materials')
}

runTests()
