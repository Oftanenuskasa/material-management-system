const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAdmins() {
  console.log('Checking all ADMIN users in database:\n')
  
  const admins = await prisma.user.findMany({
    where: {
      role: 'ADMIN'
    },
    orderBy: { email: 'asc' }
  })
  
  console.log(`Found ${admins.length} ADMIN users:`)
  console.log('='.repeat(80))
  
  admins.forEach((admin, i) => {
    console.log(`${i+1}. ${admin.email}`)
    console.log(`   Name: ${admin.name}`)
    console.log(`   Role: ${admin.role}`)
    console.log(`   Active: ${admin.isActive}`)
    console.log(`   Password exists: ${!!admin.password}`)
    console.log(`   Password length: ${admin.password?.length || 0}`)
    console.log(`   Created: ${admin.createdAt.toISOString()}`)
    console.log('')
  })
  
  await prisma.$disconnect()
}

checkAdmins().catch(console.error)
