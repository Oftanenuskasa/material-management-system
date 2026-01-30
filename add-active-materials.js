const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addActiveMaterials() {
  try {
    console.log('Adding active materials to database...');
    
    // List of active materials to add
    const activeMaterials = [
      {
        sku: 'TOOL-001',
        name: 'Hammer',
        description: 'Standard claw hammer',
        category: 'Tools',
        quantity: 25,
        unit: 'pieces',
        unitPrice: 15.99,
        supplier: 'ToolCo Inc',
        location: 'Shelf A1',
        minStockLevel: 5,
        status: 'ACTIVE'
      },
      {
        sku: 'TOOL-002',
        name: 'Screwdriver Set',
        description: 'Set of 6 screwdrivers',
        category: 'Tools',
        quantity: 18,
        unit: 'sets',
        unitPrice: 29.99,
        supplier: 'ToolCo Inc',
        location: 'Shelf A2',
        minStockLevel: 3,
        status: 'ACTIVE'
      },
      {
        sku: 'ELEC-001',
        name: 'Laptop',
        description: 'Dell Latitude business laptop',
        category: 'Electronics',
        quantity: 8,
        unit: 'units',
        unitPrice: 1200.00,
        supplier: 'Dell Technologies',
        location: 'IT Storage',
        minStockLevel: 2,
        status: 'ACTIVE'
      },
      {
        sku: 'ELEC-002',
        name: 'Monitor',
        description: '24-inch LED monitor',
        category: 'Electronics',
        quantity: 12,
        unit: 'units',
        unitPrice: 199.99,
        supplier: 'Samsung',
        location: 'IT Storage',
        minStockLevel: 4,
        status: 'ACTIVE'
      },
      {
        sku: 'OFFICE-001',
        name: 'Office Chair',
        description: 'Ergonomic office chair',
        category: 'Furniture',
        quantity: 6,
        unit: 'pieces',
        unitPrice: 299.99,
        supplier: 'OfficeMax',
        location: 'Warehouse B',
        minStockLevel: 2,
        status: 'ACTIVE'
      }
    ];

    for (const materialData of activeMaterials) {
      // Check if SKU already exists
      const existing = await prisma.material.findUnique({
        where: { sku: materialData.sku }
      });
      
      if (!existing) {
        const material = await prisma.material.create({
          data: materialData
        });
        console.log(`Added: ${material.name} (${material.sku})`);
      } else {
        // Update existing material to ACTIVE
        await prisma.material.update({
          where: { sku: materialData.sku },
          data: { status: 'ACTIVE' }
        });
        console.log(`Updated: ${existing.name} to ACTIVE status`);
      }
    }
    
    console.log('\nDone!');
    
    // Show current materials
    const allMaterials = await prisma.material.findMany();
    console.log('\nAll materials in database:');
    allMaterials.forEach(m => {
      console.log(`- ${m.name} (${m.sku}): ${m.quantity} ${m.unit}, Status: ${m.status}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addActiveMaterials();
