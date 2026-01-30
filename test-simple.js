console.log('Testing database setup...\n');

// Check .env file
const fs = require('fs');
const path = require('path');

console.log('1. Checking .env file...');
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  console.log('   ✅ .env exists');
  if (envContent.includes('DATABASE_URL')) {
    console.log('   ✅ DATABASE_URL found');
    const dbUrl = envContent.match(/DATABASE_URL=["']?([^"'\s]+)["']?/);
    if (dbUrl) {
      console.log('   URL:', dbUrl[1].substring(0, 50) + '...');
    }
  } else {
    console.log('   ❌ DATABASE_URL not found');
  }
} else {
  console.log('   ❌ .env file not found');
}

console.log('\n2. Checking Prisma files...');
const prismaFiles = [
  'prisma/schema.prisma',
  'node_modules/@prisma/client/index.js',
  'node_modules/.prisma/client/libquery_engine-*'
];

prismaFiles.forEach(file => {
  try {
    if (file.includes('*')) {
      const glob = require('glob');
      const matches = glob.sync(file);
      if (matches.length > 0) {
        console.log(`   ✅ ${file}: FOUND`);
      } else {
        console.log(`   ❌ ${file}: NOT FOUND`);
      }
    } else if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}: FOUND`);
    } else {
      console.log(`   ❌ ${file}: NOT FOUND`);
    }
  } catch (err) {
    console.log(`   ❓ ${file}: ERROR - ${err.message}`);
  }
});

console.log('\n3. Testing Prisma...');
try {
  const { PrismaClient } = require('@prisma/client');
  console.log('   ✅ Prisma imported');
  
  const prisma = new PrismaClient();
  console.log('   ✅ Prisma client created');
  
  // Simple test
  prisma.$connect()
    .then(() => {
      console.log('   ✅ Connected to database');
      return prisma.$queryRaw`SELECT 1 as test`;
    })
    .then(result => {
      console.log('   ✅ Database query successful');
      console.log('   Result:', result);
      return prisma.$disconnect();
    })
    .then(() => {
      console.log('\n✅ ALL TESTS PASSED!');
      process.exit(0);
    })
    .catch(error => {
      console.error('   ❌ Database error:', error.message);
      if (error.code === 'P1000') {
        console.error('\n   Authentication failed. Check DATABASE_URL in .env');
      } else if (error.code === 'P1001') {
        console.error('\n   Cannot connect to database. Is PostgreSQL running?');
        console.error('   Run: sudo systemctl start postgresql');
      } else if (error.code === 'P1002') {
        console.error('\n   Database connection timed out.');
      } else if (error.code === 'P1003') {
        console.error('\n   Database does not exist.');
        console.error('   Run: createdb material_db');
      }
      process.exit(1);
    });
    
} catch (error) {
  console.error('   ❌ Prisma import failed:', error.message);
  console.error('\n   Try: npx prisma generate');
  process.exit(1);
}
