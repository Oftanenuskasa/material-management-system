import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Checking users in database...")
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      password: false // Don't select password
    }
  })
  
  console.log(`Found ${users.length} users:`)
  users.forEach(user => {
    console.log(`- ${user.email} (${user.name}) - Role: ${user.role} - Active: ${user.isActive}`)
  })
  
  // Check if our test user exists
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
    select: { email: true, isActive: true }
  })
  
  if (adminUser) {
    console.log(`\nAdmin user found: ${adminUser.email}`)
    console.log(`Admin user active: ${adminUser.isActive}`)
  } else {
    console.log("\n❌ Admin user NOT found in database!")
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
