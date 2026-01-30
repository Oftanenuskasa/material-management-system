import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding materials...")
  
  // First, get an admin user to assign as creator
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })
  
  if (!adminUser) {
    console.log("❌ No admin user found. Please run user seed first.")
    return
  }

  const materials = [
    {
      sku: 'ELEC-001',
      name: 'Electrical Wire 2.5mm',
      description: 'Copper electrical wire, 2.5mm thickness',
      category: 'ELECTRICAL',
      quantity: 500,
      unit: 'meters',
      unitPrice: 1.25,
      supplier: 'WireCo Inc.',
      location: 'Warehouse A, Shelf 12',
      minStockLevel: 100,
      status: 'ACTIVE'
    },
    {
      sku: 'PLUM-001',
      name: 'PVC Pipe 1-inch',
      description: 'PVC plumbing pipe, 1-inch diameter',
      category: 'PLUMBING',
      quantity: 200,
      unit: 'pieces',
      unitPrice: 8.50,
      supplier: 'PipeMaster Ltd.',
      location: 'Warehouse B, Shelf 5',
      minStockLevel: 50,
      status: 'ACTIVE'
    },
    {
      sku: 'CONS-001',
      name: 'Concrete Mix 50kg',
      description: 'Ready-mix concrete, 50kg bags',
      category: 'CONSTRUCTION',
      quantity: 80,
      unit: 'bags',
      unitPrice: 12.75,
      supplier: 'BuildRight Corp.',
      location: 'Yard Storage',
      minStockLevel: 20,
      status: 'ACTIVE'
    },
    {
      sku: 'TOOL-001',
      name: 'Hammer',
      description: 'Steel claw hammer with fiberglass handle',
      category: 'TOOLS',
      quantity: 45,
      unit: 'pieces',
      unitPrice: 15.99,
      supplier: 'ToolTech',
      location: 'Tool Room, Bin 3',
      minStockLevel: 10,
      status: 'ACTIVE'
    },
    {
      sku: 'SAFE-001',
      name: 'Safety Helmet',
      description: 'Industrial safety helmet with chin strap',
      category: 'SAFETY',
      quantity: 120,
      unit: 'pieces',
      unitPrice: 9.95,
      supplier: 'SafeGear Inc.',
      location: 'Safety Storage, Shelf 2',
      minStockLevel: 30,
      status: 'ACTIVE'
    },
    {
      sku: 'HARD-001',
      name: 'Screws Assortment',
      description: 'Assorted screws pack (100 pieces)',
      category: 'HARDWARE',
      quantity: 25,
      unit: 'packs',
      unitPrice: 7.50,
      supplier: 'FixIt Fasteners',
      location: 'Hardware Rack, Bin 7',
      minStockLevel: 5,
      status: 'ACTIVE'
    },
    {
      sku: 'PAINT-001',
      name: 'White Paint 5L',
      description: 'Interior wall paint, white, 5-liter cans',
      category: 'PAINT',
      quantity: 60,
      unit: 'cans',
      unitPrice: 24.99,
      supplier: 'ColorCoat Paints',
      location: 'Paint Storage, Shelf 4',
      minStockLevel: 15,
      status: 'ACTIVE'
    },
    {
      sku: 'LUMB-001',
      name: 'Pine Wood Plank',
      description: 'Pine wood plank, 2x4 inches, 8 feet',
      category: 'LUMBER',
      quantity: 0, // Out of stock
      unit: 'pieces',
      unitPrice: 6.80,
      supplier: 'TimberLand Woods',
      location: 'Lumber Yard',
      minStockLevel: 25,
      status: 'OUT_OF_STOCK'
    },
    {
      sku: 'FIXT-001',
      name: 'LED Light Bulb',
      description: 'Energy efficient LED bulb, 10W, warm white',
      category: 'FIXTURES',
      quantity: 12, // Low stock
      unit: 'pieces',
      unitPrice: 4.25,
      supplier: 'BrightLights Co.',
      location: 'Electrical Store, Shelf 8',
      minStockLevel: 20,
      status: 'ACTIVE'
    },
    {
      sku: 'OTHER-001',
      name: 'Duct Tape',
      description: 'Heavy duty duct tape, 2-inch width',
      category: 'OTHER',
      quantity: 85,
      unit: 'rolls',
      unitPrice: 3.99,
      supplier: 'StickFast Adhesives',
      location: 'General Store, Bin 12',
      minStockLevel: 25,
      status: 'ACTIVE'
    }
  ]

  let createdCount = 0

  for (const materialData of materials) {
    try {
      await prisma.material.create({
        data: {
          ...materialData,
          createdById: adminUser.id,
          updatedById: adminUser.id
        }
      })
      console.log(`✅ Created: ${materialData.sku} - ${materialData.name}`)
      createdCount++
    } catch (error) {
      if (error.code === 'P2002') { // Unique constraint violation
        console.log(`⚠️  Skipping (already exists): ${materialData.sku}`)
      } else {
        console.log(`❌ Error creating ${materialData.sku}:`, error.message)
      }
    }
  }

  console.log(`\n🎉 Created ${createdCount}/${materials.length} materials successfully!`)
  
  // Show summary
  const summary = await prisma.material.groupBy({
    by: ['category', 'status'],
    _count: true
  })
  
  console.log("\n📊 Materials Summary:")
  console.log("=".repeat(30))
  summary.forEach(item => {
    console.log(`${item.category} - ${item.status}: ${item._count}`)
  })
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
