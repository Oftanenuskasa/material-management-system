const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMaterials() {
  try {
    const materials = await prisma.material.findMany();
    console.log('Total materials in DB:', materials.length);
    console.log('\nFirst 5 materials:');
    materials.slice(0, 5).forEach(m => {
      console.log(`- ${m.name} (${m.sku}): ${m.quantity} ${m.unit}, Status: ${m.status}`);
    });
    
    // Check users too
    const users = await prisma.user.findMany();
    console.log('\nTotal users in DB:', users.length);
    users.slice(0, 3).forEach(u => {
      console.log(`- ${u.name} (${u.email}): ${u.role}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkMaterials();
