import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAPI() {
  console.log('🧪 Testing API routes...\n')
  
  // 1. First, get a material ID to test with
  const material = await prisma.material.findFirst({
    select: { id: true, sku: true, name: true }
  })
  
  if (!material) {
    console.log('❌ No materials found in database')
    console.log('   Please run: node seed-materials.js')
    return
  }
  
  console.log('📦 Found material for testing:')
  console.log(`   ID: ${material.id}`)
  console.log(`   SKU: ${material.sku}`)
  console.log(`   Name: ${material.name}`)
  
  // 2. Test GET single material (simulate API call)
  console.log('\n🔍 Testing GET /api/materials/[id]:')
  try {
    const foundMaterial = await prisma.material.findUnique({
      where: { id: material.id },
      include: {
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } }
      }
    })
    
    if (foundMaterial) {
      console.log('   ✅ Success - Material found')
      console.log(`   SKU: ${foundMaterial.sku}`)
      console.log(`   Name: ${foundMaterial.name}`)
      console.log(`   Quantity: ${foundMaterial.quantity}`)
      console.log(`   Created by: ${foundMaterial.createdBy?.name || 'Unknown'}`)
    } else {
      console.log('   ❌ Material not found')
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message)
  }
  
  // 3. Test UPDATE material
  console.log('\n✏️ Testing UPDATE material:')
  try {
    const updatedMaterial = await prisma.material.update({
      where: { id: material.id },
      data: {
        quantity: 100,
        updatedById: material.id // Using same ID for test
      }
    })
    console.log('   ✅ Success - Material updated')
    console.log(`   New quantity: ${updatedMaterial.quantity}`)
    
    // Reset to original
    await prisma.material.update({
      where: { id: material.id },
      data: { quantity: foundMaterial.quantity }
    })
  } catch (error) {
    console.log('   ❌ Error:', error.message)
  }
  
  // 4. Check database counts
  console.log('\n📊 Database Status:')
  const [materialCount, userCount] = await Promise.all([
    prisma.material.count(),
    prisma.user.count()
  ])
  
  console.log(`   Materials: ${materialCount}`)
  console.log(`   Users: ${userCount}`)
  
  // 5. Check materials by status
  const statusCounts = await prisma.material.groupBy({
    by: ['status'],
    _count: true
  })
  
  console.log('\n📈 Material Status:')
  statusCounts.forEach(item => {
    console.log(`   ${item.status}: ${item._count}`)
  })
  
  console.log('\n🎉 API tests completed!')
  console.log('\nIf these tests pass but the UI shows errors, check:')
  console.log('1. Make sure you are logged in as ADMIN')
  console.log('2. Check browser console for specific errors')
  console.log('3. Check server logs for API errors')
}

testAPI()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
