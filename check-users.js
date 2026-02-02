const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  console.log('Checking all users in database:\n')
  
  const users = await prisma.user.findMany({
    orderBy: { email: 'asc' }
  })
  
  console.log(`Found ${users.length} users:`)
  console.log('='.repeat(80))
  
  users.forEach((user, i) => {
    console.log(`${i+1}. ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Active: ${user.isActive}`)
    console.log(`   Created: ${user.createdAt.toISOString()}`)
    console.log('')
  })
  
  await prisma.$disconnect()
}

checkUsers().catch(console.error)
