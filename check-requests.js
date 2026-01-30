const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRequests() {
  try {
    console.log('Checking database for requests...');
    
    // Count total requests
    const totalRequests = await prisma.materialRequest.count();
    console.log(`Total requests in database: ${totalRequests}`);
    
    // Get last 5 requests
    const recentRequests = await prisma.materialRequest.findMany({
      take: 5,
      orderBy: { requestedAt: 'desc' },
      include: {
        material: {
          select: { name: true, sku: true }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });
    
    console.log('\nRecent requests:');
    recentRequests.forEach((req, i) => {
      console.log(`${i + 1}. ID: ${req.id}`);
      console.log(`   Material: ${req.material?.name || 'N/A'} (${req.material?.sku || 'N/A'})`);
      console.log(`   User: ${req.user?.name || 'N/A'} (${req.user?.email || 'N/A'})`);
      console.log(`   Quantity: ${req.quantity}, Status: ${req.status}, Priority: ${req.priority}`);
      console.log(`   Date: ${req.requestedAt}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error checking requests:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRequests();
