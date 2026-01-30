const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  console.log('Verifying database tables...\n');
  
  try {
    // Check User table
    const userCount = await prisma.user.count();
    console.log(`✅ User table: ${userCount} users`);
    
    // Check Material table
    const materialCount = await prisma.material.count();
    console.log(`✅ Material table: ${materialCount} materials`);
    
    // Check MaterialRequest table
    const requestCount = await prisma.materialRequest.count();
    console.log(`✅ MaterialRequest table: ${requestCount} requests`);
    
    // Show sample data
    console.log('\nSample Users:');
    const users = await prisma.user.findMany({ take: 3 });
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}): ${user.role}`);
    });
    
    console.log('\nSample Materials:');
    const materials = await prisma.material.findMany({ take: 3 });
    materials.forEach(material => {
      console.log(`  - ${material.name} (${material.sku}): ${material.quantity} ${material.unit}`);
    });
    
    console.log('\n🎉 Database is ready!');
    console.log('\nNext steps:');
    console.log('1. Visit Prisma Studio: http://localhost:5555');
    console.log('2. Create a request at: http://localhost:3001/requests/new');
    console.log('3. Check the request in Prisma Studio');
    
  } catch (error) {
    console.error('Verification failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
