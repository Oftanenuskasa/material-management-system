import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testMaterialAPI() {
  console.log('🧪 Testing Material API...\n')
  
  try {
    // 1. Get a material from database
    const material = await prisma.material.findFirst()
    
    if (!material) {
      console.log('❌ No materials found!')
      console.log('   Run: node seed-materials.js')
      return
    }
    
    console.log('📦 Found material:')
    console.log(`   ID: ${material.id}`)
    console.log(`   SKU: ${material.sku}`)
    console.log(`   Name: ${material.name}`)
    
    // 2. Test finding material by ID
    console.log('\n🔍 Testing findUnique by ID:')
    try {
      const found = await prisma.material.findUnique({
        where: { id: material.id }
      })
      
      if (found) {
        console.log('   ✅ Success - Found material by ID')
      } else {
        console.log('   ❌ Failed - Material not found by ID')
      }
    } catch (error) {
      console.log('   ❌ Error:', error.message)
    }
    
    // 3. Test updating material
    console.log('\n✏️ Testing update by ID:')
    try {
      const originalQty = material.quantity
      const updated = await prisma.material.update({
        where: { id: material.id },
        data: { quantity: originalQty + 10 }
      })
      
      console.log('   ✅ Success - Material updated')
      console.log(`   Original quantity: ${originalQty}`)
      console.log(`   New quantity: ${updated.quantity}`)
      
      // Reset
      await prisma.material.update({
        where: { id: material.id },
        data: { quantity: originalQty }
      })
      console.log('   ✅ Quantity reset to original')
      
    } catch (error) {
      console.log('   ❌ Error:', error.message)
    }
    
    // 4. Test all CRUD operations
    console.log('\n🚀 Testing all CRUD operations:')
    
    // CREATE
    console.log('   CREATE:')
    try {
      const newMaterial = await prisma.material.create({
        data: {
          sku: 'TEST-001',
          name: 'Test Material',
          category: 'TEST',
          quantity: 100,
          unit: 'pieces',
          unitPrice: 9.99,
          minStockLevel: 10,
          status: 'ACTIVE',
          createdById: material.id, // Using existing user ID
          updatedById: material.id
        }
      })
      console.log(`     ✅ Created: ${newMaterial.sku} - ${newMaterial.name}`)
      
      // READ
      console.log('   READ:')
      const readMaterial = await prisma.material.findUnique({
        where: { id: newMaterial.id }
      })
      console.log(`     ✅ Read: ${readMaterial.sku}`)
      
      // UPDATE
      console.log('   UPDATE:')
      const updatedMaterial = await prisma.material.update({
        where: { id: newMaterial.id },
        data: { quantity: 50 }
      })
      console.log(`     ✅ Updated: Quantity = ${updatedMaterial.quantity}`)
      
      // DELETE
      console.log('   DELETE:')
      await prisma.material.delete({
        where: { id: newMaterial.id }
      })
      console.log(`     ✅ Deleted: ${newMaterial.sku}`)
      
    } catch (error) {
      console.log(`     ❌ Error: ${error.message}`)
    }
    
    // 5. Show database status
    console.log('\n📊 Database Status:')
    const count = await prisma.material.count()
    console.log(`   Total materials: ${count}`)
    
    // Show first 5 materials
    const materials = await prisma.material.findMany({
      take: 5,
      select: { sku: true, name: true, quantity: true, status: true }
    })
    
    console.log('\n📦 First 5 materials:')
    materials.forEach(m => {
      console.log(`   ${m.sku} - ${m.name} (${m.quantity} ${m.status})`)
    })
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testMaterialAPI()
