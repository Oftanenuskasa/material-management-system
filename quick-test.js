const { PrismaClient } = require('@prisma/client');
console.log('🚀 Testing Prisma Client...');

const prisma = new PrismaClient();

async function test() {
  try {
    // Create a test material
    const result = await prisma.material.create({
      data: {
        sku: 'QUICK-TEST-' + Date.now(),
        name: 'Quick Test Item',
        quantity: 10,
        unit: 'pieces',
        unitPrice: 19.99,
        category: 'Testing',
        supplier: 'Test Supplier'
      }
    });
    
    console.log('✅ SUCCESS! Created material with ID:', result.id);
    console.log('SKU:', result.sku);
    
    // List all
    const all = await prisma.material.findMany();
    console.log(`📋 Total materials in DB: ${all.length}`);
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Error code:', error.code);
    console.error('Error meta:', error.meta);
  } finally {
    await prisma.$disconnect();
  }
}

test();
