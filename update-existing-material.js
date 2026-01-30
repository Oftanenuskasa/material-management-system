const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateExistingMaterial() {
  try {
    // Find the existing material
    const existingMaterial = await prisma.material.findFirst({
      where: { sku: 'QORQORRO-666' }
    });
    
    if (existingMaterial) {
      // Update it to ACTIVE
      await prisma.material.update({
        where: { id: existingMaterial.id },
        data: { 
          status: 'ACTIVE',
          category: 'Construction', // Add a category
          unit: 'kilograms',
          unitPrice: 45.50,
          location: 'Main Warehouse',
          minStockLevel: 20
        }
      });
      console.log('Updated existing material to ACTIVE status');
    }
    
    // Show all materials
    const materials = await prisma.material.findMany();
    console.log('\nCurrent materials:');
    materials.forEach(m => {
      console.log(`- ${m.name} (${m.sku}): ${m.quantity} ${m.unit}, Status: ${m.status}, Category: ${m.category}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingMaterial();
