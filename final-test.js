const { PrismaClient } = require('@prisma/client');
console.log('🔍 Final Prisma Test...');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function test() {
  try {
    console.log('1. Testing connection...');
    await prisma.$connect();
    console.log('✅ Connected');
    
    console.log('2. Testing create...');
    const result = await prisma.material.create({
      data: {
        sku: 'FINAL-' + Date.now(),
        name: 'Final Test Item',
        quantity: 5,
        unit: 'pieces',
        unitPrice: 12.50
      }
    });
    
    console.log('✅ Created successfully!');
    console.log('   ID:', result.id);
    console.log('   SKU:', result.sku);
    
    console.log('3. Testing count...');
    const count = await prisma.material.count();
    console.log(`✅ Total materials: ${count}`);
    
  } catch (error) {
    console.error('❌ Error:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    console.error('   Meta:', error.meta);
    
    if (error.code === 'P2022') {
      console.error('\n⚠️  DATABASE ISSUE: sku column missing!');
      console.error('Run: npx prisma db push --force-reset');
    }
    
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected');
  }
}

test();
