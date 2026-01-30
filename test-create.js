const { PrismaClient } = require('@prisma/client');
console.log('Testing Prisma create...');

const prisma = new PrismaClient();

async function test() {
  try {
    const result = await prisma.material.create({
      data: {
        sku: 'TEST-' + Date.now(),
        name: 'Test Item',
        quantity: 10,
        unit: 'pieces',
        unitPrice: 5.99
      }
    });
    console.log('✅ SUCCESS! Created:', result.id, 'SKU:', result.sku);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Code:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

test();
