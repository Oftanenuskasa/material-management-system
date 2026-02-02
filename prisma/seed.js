const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  try {
    // Create users
    console.log('Creating users...')
    
    const users = [
      {
        email: 'admin@material.com',
        name: 'System Admin',
        role: 'ADMIN',
        password: await bcrypt.hash('admin123', 10)
      },
      {
        email: 'manager@material.com',
        name: 'Project Manager',
        role: 'MANAGER',
        password: await bcrypt.hash('manager123', 10)
      },
      {
        email: 'worker@material.com',
        name: 'John Worker',
        role: 'WORKER',
        password: await bcrypt.hash('worker123', 10)
      }
    ]

    for (const userData of users) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      })
      console.log(`Created user: ${user.email} (${user.role})`)
    }

    // Get admin user for material creator
    const adminUser = await prisma.user.findFirst({ 
      where: { email: 'admin@material.com' } 
    })

    // Create materials
    console.log('Creating materials...')
    
    const materials = [
      {
        sku: 'STL-BM-001',
        name: 'Steel Beams',
        description: 'Structural steel beams for construction',
        quantity: 100,
        unit: 'pieces',
        unitPrice: 250.50,
        category: 'Structural',
        supplier: 'SteelCo Inc.',
        location: 'Warehouse A, Rack 3',
        minStockLevel: 20
      },
      {
        sku: 'CON-MX-005',
        name: 'Concrete Mix',
        description: 'Ready-mix concrete bags',
        quantity: 500,
        unit: 'bags',
        unitPrice: 45.75,
        category: 'Construction',
        supplier: 'BuildMaterials Ltd.',
        location: 'Warehouse B, Rack 1',
        minStockLevel: 50
      },
      {
        sku: 'ELC-WR-003',
        name: 'Electrical Wires',
        description: 'Copper electrical wires 2.5mm',
        quantity: 1000,
        unit: 'meters',
        unitPrice: 3.25,
        category: 'Electrical',
        supplier: 'PowerSystems Co.',
        location: 'Warehouse A, Rack 5',
        minStockLevel: 100
      }
    ]

    for (const materialData of materials) {
      const material = await prisma.material.upsert({
        where: { sku: materialData.sku },
        update: {},
        create: materialData
      })
      console.log(`Created material: ${material.name} (${material.sku})`)
    }

    // Create some sample requests
    console.log('Creating sample requests...')
    
    const workerUser = await prisma.user.findFirst({ 
      where: { email: 'worker@material.com' } 
    })
    
    const steelBeam = await prisma.material.findFirst({
      where: { sku: 'STL-BM-001' }
    })
    
    const concreteMix = await prisma.material.findFirst({
      where: { sku: 'CON-MX-005' }
    })
    
    if (workerUser && steelBeam) {
      await prisma.request.create({
        data: {
          materialId: steelBeam.id,
          userId: workerUser.id,
          quantity: 10,
          purpose: 'For construction project at site A',
          urgency: 'HIGH',
          status: 'PENDING'
        }
      })
      console.log('Created sample request for Steel Beams')
    }
    
    if (workerUser && concreteMix) {
      await prisma.request.create({
        data: {
          materialId: concreteMix.id,
          userId: workerUser.id,
          quantity: 50,
          purpose: 'Foundation work for building B',
          urgency: 'MEDIUM',
          status: 'APPROVED'
        }
      })
      console.log('Created sample request for Concrete Mix')
    }

    console.log('Seeding completed successfully!')
    
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
