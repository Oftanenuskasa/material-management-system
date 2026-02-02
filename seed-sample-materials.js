const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleMaterials = [
  {
    sku: 'MON-001',
    name: 'Monitor',
    description: '24-inch LED Monitor',
    category: 'Electronics',
    quantity: 12,
    unit: 'units',
    unitPrice: 199.99,
    supplier: 'Dell',
    location: 'Warehouse A',
    minStockLevel: 5,
    status: 'ACTIVE'
  },
  {
    sku: 'LAP-001',
    name: 'Laptop',
    description: 'Dell XPS 15 Laptop',
    category: 'Electronics',
    quantity: 8,
    unit: 'units',
    unitPrice: 1200.00,
    supplier: 'Dell',
    location: 'Warehouse A',
    minStockLevel: 3,
    status: 'ACTIVE'
  },
  {
    sku: 'SCR-001',
    name: 'Screwdriver Set',
    description: '10-piece screwdriver set',
    category: 'Tools',
    quantity: 18,
    unit: 'sets',
    unitPrice: 29.99,
    supplier: 'Stanley',
    location: 'Warehouse B',
    minStockLevel: 10,
    status: 'ACTIVE'
  },
  {
    sku: 'HAM-001',
    name: 'Hammer',
    description: '16oz Claw Hammer',
    category: 'Tools',
    quantity: 25,
    unit: 'pieces',
    unitPrice: 15.99,
    supplier: 'Stanley',
    location: 'Warehouse B',
    minStockLevel: 15,
    status: 'ACTIVE'
  }
]

async function seedMaterials() {
  console.log('Seeding sample materials...\n')
  
  for (const material of sampleMaterials) {
    // Check if material already exists
    const existing = await prisma.material.findUnique({
      where: { sku: material.sku }
    })
    
    if (existing) {
      console.log(`Material ${material.sku} already exists, updating...`)
      await prisma.material.update({
        where: { sku: material.sku },
        data: material
      })
    } else {
      console.log(`Creating material ${material.sku}...`)
      await prisma.material.create({ data: material })
    }
  }
  
  console.log('\n✅ Sample materials seeded successfully!')
  
  // Show what was created
  const allMaterials = await prisma.material.findMany({
    orderBy: { sku: 'asc' }
  })
  
  console.log('\nCurrent materials in database:')
  console.log('='.repeat(80))
  allMaterials.forEach(m => {
    console.log(`${m.sku} - ${m.name} (${m.quantity} ${m.unit}) - $${m.unitPrice}`)
  })
  
  await prisma.$disconnect()
}

seedMaterials().catch(console.error)
