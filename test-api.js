async function testAPIs() {
  console.log('=== Testing Material CRUD APIs ===\n')
  
  // First, get all materials to see what's in the database
  console.log('1. Getting all materials...')
  try {
    const response = await fetch('http://localhost:3000/api/materials')
    const materials = await response.json()
    
    if (Array.isArray(materials)) {
      console.log(`✅ Found ${materials.length} materials`)
      if (materials.length > 0) {
        console.log('First material:', {
          id: materials[0].id,
          name: materials[0].name,
          category: materials[0].category
        })
        
        // Test GET single material
        console.log('\n2. Testing GET single material...')
        const singleResponse = await fetch(`http://localhost:3000/api/materials/${materials[0].id}`)
        const singleMaterial = await singleResponse.json()
        
        if (singleResponse.ok) {
          console.log('✅ GET single material successful:', singleMaterial.name)
        } else {
          console.log('❌ GET single material failed:', singleMaterial.error)
        }
      }
    } else {
      console.log('❌ Response is not an array:', materials)
    }
  } catch (error) {
    console.log('❌ Error fetching materials:', error.message)
  }
  
  // Test POST (create) a new material
  console.log('\n3. Testing POST (create) material...')
  try {
    const newMaterial = {
      name: `Test Material ${Date.now()}`,
      description: 'API Test Material',
      quantity: 10,
      unit: 'pcs',
      unitPrice: 15.99,
      category: 'Test',
      supplier: 'Test Supplier'
    }
    
    const response = await fetch('http://localhost:3000/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMaterial)
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ POST material successful:', result.name)
      console.log('Created ID:', result.id)
      
      // Test DELETE the created material
      console.log('\n4. Testing DELETE material...')
      const deleteResponse = await fetch(`http://localhost:3000/api/materials/${result.id}`, {
        method: 'DELETE'
      })
      
      const deleteResult = await deleteResponse.json()
      
      if (deleteResponse.ok) {
        console.log('✅ DELETE material successful:', deleteResult.message)
      } else {
        console.log('❌ DELETE material failed:', deleteResult.error)
      }
    } else {
      console.log('❌ POST material failed:', result.error)
    }
  } catch (error) {
    console.log('❌ Error during POST test:', error.message)
  }
  
  console.log('\n=== Test Complete ===')
}

testAPIs()
