const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkMaterials() {
  console.log('Checking materials in database...\n')
  
  const materials = await prisma.material.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  console.log(`Found ${materials.length} materials in database:`)
  console.log('='.repeat(80))
  
  materials.forEach((m, i) => {
    console.log(`${i+1}. ${m.sku} - ${m.name}`)
    console.log(`   Category: ${m.category || 'N/A'}`)
    console.log(`   Quantity: ${m.quantity} ${m.unit}`)
    console.log(`   Price: $${m.unitPrice || '0.00'}`)
    console.log(`   Status: ${m.status}`)
    console.log(`   ID: ${m.id}`)
    console.log('')
  })
  
  await prisma.$disconnect()
}

checkMaterials().catch(console.error)
