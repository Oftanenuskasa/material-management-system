const fs = require('fs');
const { execSync } = require('child_process');

console.log('=== SIMPLE TEST ===\n');

console.log('1. Checking files...');
const files = [
  'prisma/schema.prisma',
  '.env',
  'node_modules/@prisma/client/index.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
    if (file === '.env') {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('DATABASE_URL')) {
        console.log('      Contains DATABASE_URL');
      }
    }
  } else {
    console.log(`   ❌ ${file} (missing)`);
  }
});

console.log('\n2. Testing Prisma directly...');

// Read DATABASE_URL from .env
let dbUrl = 'postgresql://postgres:@localhost:5432/material_db';
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  const match = envContent.match(/DATABASE_URL=["']?([^"'\s]+)["']?/);
  if (match) {
    dbUrl = match[1];
  }
}

// Set environment variable
process.env.DATABASE_URL = dbUrl;
console.log('   Using DATABASE_URL:', dbUrl.substring(0, 60) + '...');

try {
  const { PrismaClient } = require('@prisma/client');
  console.log('   ✅ Prisma imported');
  
  const prisma = new PrismaClient();
  console.log('   ✅ Prisma client created');
  
  // Test with timeout
  setTimeout(async () => {
    try {
      console.log('\n3. Testing database connection...');
      await prisma.$connect();
      console.log('   ✅ Connected to database');
      
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('   ✅ Query successful:', result[0].test);
      
      console.log('\n4. Creating test material...');
      const material = await prisma.material.create({
        data: {
          sku: 'SIMPLE-' + Date.now(),
          name: 'Simple Test',
          quantity: 1
        }
      });
      console.log('   ✅ Created material:', material.id);
      console.log('      SKU:', material.sku);
      
      const count = await prisma.material.count();
      console.log('   Total materials in DB:', count);
      
      await prisma.$disconnect();
      console.log('\n✅ ALL TESTS PASSED!');
      process.exit(0);
      
    } catch (error) {
      console.error('   ❌ Error:', error.message);
      if (error.code) console.log('   Error code:', error.code);
      
      if (error.code === 'P1001') {
        console.log('\n   🔧 Fix: PostgreSQL might not be running.');
        console.log('   Run: sudo systemctl start postgresql');
      } else if (error.code === 'P1003') {
        console.log('\n   🔧 Fix: Database does not exist.');
        console.log('   Run: createdb material_db');
      }
      
      process.exit(1);
    }
  }, 1000);
  
} catch (error) {
  console.error('   ❌ Prisma error:', error.message);
  console.log('\n   Try: npx prisma generate');
  process.exit(1);
}
