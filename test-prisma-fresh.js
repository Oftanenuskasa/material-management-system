const { PrismaClient } = require('@prisma/client');
console.log('Testing fresh Prisma Client...\n');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
});

async function test() {
  try {
    console.log('1. Testing connection...');
    await prisma.$connect();
    console.log('   ✅ Connected\n');
    
    console.log('2. Testing create...');
    const material = await prisma.material.create({
      data: {
        sku: 'FRESH-' + Date.now(),
        name: 'Fresh Test',
        quantity: 5,
        unit: 'pieces',
        unitPrice: 9.99
      }
    });
    console.log('   ✅ Created material:', material.id);
    console.log('      SKU:', material.sku);
    console.log('      Name:', material.name, '\n');
    
    console.log('3. Testing count...');
    const count = await prisma.material.count();
    console.log(`   ✅ Total materials: ${count}\n`);
    
    console.log('4. Testing findMany...');
    const materials = await prisma.material.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log(`   ✅ Found ${materials.length} materials`);
    materials.forEach(m => {
      console.log(`      - ${m.sku}: ${m.name} (${m.quantity} ${m.unit})`);
    });
    
    console.log('\n✅ ALL TESTS PASSED!');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Code:', error.code);
    console.error('Meta:', error.meta);
    console.error('\nStack trace (first line):', error.stack.split('\n')[1]);
    
    if (error.code === 'P2022') {
      console.error('\n⚠️  Prisma thinks sku column is missing, but database shows it exists!');
      console.error('   This is a Prisma Client caching issue.');
      console.error('   Try: rm -rf node_modules/.prisma node_modules/@prisma && npx prisma generate');
    }
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Disconnected from database');
  }
}

test();
