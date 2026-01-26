console.log('=== Testing Project Setup ===\n');

// Test 1: Check Node.js
console.log('1. Node.js version:', process.version);

// Test 2: Check if Prisma Client can be loaded
try {
  const { PrismaClient } = require('@prisma/client');
  console.log('2. ✅ Prisma Client loaded successfully');
  
  const prisma = new PrismaClient();
  console.log('3. ✅ Prisma instance created');
  
  // Test connection
  prisma.$connect()
    .then(async () => {
      console.log('4. ✅ Database connection successful');
      
      // Try a simple query
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('5. ✅ Database query successful:', result[0].test);
      
      // Check tables
      const tables = await prisma.$queryRaw`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
      `;
      console.log('6. Tables in database:', tables.map(t => t.tablename));
      
      await prisma.$disconnect();
      console.log('\n✅ All tests passed! Project is ready.');
    })
    .catch(err => {
      console.log('4. ❌ Database connection failed:', err.message);
    });
    
} catch (error) {
  console.log('2. ❌ Failed to load Prisma Client:', error.message);
}

// Test 3: Check environment
console.log('\n7. Environment check:');
console.log('   - DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
