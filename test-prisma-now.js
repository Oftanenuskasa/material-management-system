const { PrismaClient } = require('@prisma/client');
console.log('Testing Prisma...');

const prisma = new PrismaClient();

async function test() {
  try {
    // Test create
    const material = await prisma.material.create({
      data: {
        sku: 'TEST-' + Date.now(),
        name: 'Test Item',
        quantity: 10,
        unit: 'pieces',
        unitPrice: 5.99
      }
    });
    console.log('✅ Created material:', material.id);
    
    // Test read
    const count = await prisma.material.count();
    console.log(`✅ Total materials: ${count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Code:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

test();
