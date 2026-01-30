require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

console.log('=== VERIFICATION ===\n');

console.log('1. Environment check:');
console.log('   DATABASE_URL:', process.env.DATABASE_URL || 'NOT SET');

console.log('\n2. Schema check:');
const fs = require('fs');
if (fs.existsSync('prisma/schema.prisma')) {
  console.log('   ✅ schema.prisma exists');
  const content = fs.readFileSync('prisma/schema.prisma', 'utf8');
  if (content.includes('sku')) {
    console.log('   ✅ schema contains sku field');
  }
} else {
  console.log('   ❌ schema.prisma missing');
}

console.log('\n3. Prisma check:');
try {
  const prisma = new PrismaClient();
  console.log('   ✅ Prisma client created');
  
  console.log('\n4. Database connection test:');
  prisma.$connect()
    .then(() => {
      console.log('   ✅ Connected to database');
      return prisma.$queryRaw`SELECT current_database() as db_name`;
    })
    .then(result => {
      console.log('   Database:', result[0].db_name);
      return prisma.material.create({
        data: {
          sku: 'VERIFY-' + Date.now(),
          name: 'Verification Test',
          quantity: 1,
          unit: 'pieces'
        }
      });
    })
    .then(created => {
      console.log('   ✅ Created material:', created.id);
      console.log('   SKU:', created.sku);
      return prisma.material.count();
    })
    .then(count => {
      console.log('   Total materials:', count);
      return prisma.$disconnect();
    })
    .then(() => {
      console.log('\n✅ ALL TESTS PASSED!');
      process.exit(0);
    })
    .catch(error => {
      console.error('   ❌ Error:', error.message);
      console.error('   Code:', error.code);
      if (error.code === 'P1001') {
        console.log('\n   🔧 Fix: Start PostgreSQL: sudo systemctl start postgresql');
      } else if (error.code === 'P1003') {
        console.log('\n   🔧 Fix: Create database: createdb material_db');
      }
      process.exit(1);
    });
    
} catch (error) {
  console.error('   ❌ Prisma error:', error.message);
  process.exit(1);
}
