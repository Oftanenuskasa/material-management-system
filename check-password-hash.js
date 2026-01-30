import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Checking password hash for admin user...")
  
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
    select: { 
      email: true, 
      password: true,
      createdAt: true
    }
  })
  
  if (adminUser) {
    console.log(`User: ${adminUser.email}`)
    console.log(`Created at: ${adminUser.createdAt}`)
    console.log(`Password hash: ${adminUser.password}`)
    console.log(`Hash length: ${adminUser.password.length}`)
    console.log(`Hash starts with: ${adminUser.password.substring(0, 20)}...`)
    
    // Check if it's bcrypt hash (should start with $2a$, $2b$, or $2y$)
    if (adminUser.password.startsWith('$2')) {
      console.log("✅ Password appears to be a bcrypt hash")
    } else {
      console.log("❌ Password does NOT appear to be a bcrypt hash!")
      console.log("It might be stored as plain text or using different hashing.")
    }
  } else {
    console.log("❌ Admin user not found!")
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
