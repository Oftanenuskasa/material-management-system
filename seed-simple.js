import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Creating 4 demo users...")
  
  // Clear existing users
  await prisma.user.deleteMany({})
  console.log("✅ Cleared existing users")
  
  // Only 4 users - one for each role
  const users = [
    { name: 'Admin User', email: 'admin@system.com', plainPassword: 'Admin123@', role: 'ADMIN' },
    { name: 'Manager User', email: 'manager@system.com', plainPassword: 'Manager123@', role: 'MANAGER' },
    { name: 'Staff User', email: 'staff@system.com', plainPassword: 'Staff123@', role: 'STAFF' },
    { name: 'Regular User', email: 'user@system.com', plainPassword: 'User123@', role: 'USER' },
  ]

  const saltRounds = 12

  for (const user of users) {
    try {
      const hashedPassword = await bcrypt.hash(user.plainPassword, saltRounds)
      
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          isActive: true
        }
      })
      
      console.log(`✅ ${user.role.padEnd(7)}: ${user.email} (${user.plainPassword})`)
      
    } catch (error) {
      console.log(`❌ Failed: ${user.email} - ${error.message}`)
    }
  }

  console.log("\n🎉 Created 4 users successfully!")
  console.log("\n🔑 SIMPLE LOGIN CREDENTIALS")
  console.log("=".repeat(40))
  console.log("\n1. ADMIN")
  console.log("   Email: admin@system.com")
  console.log("   Password: Admin123@")
  console.log("\n2. MANAGER")
  console.log("   Email: manager@system.com")
  console.log("   Password: Manager123@")
  console.log("\n3. STAFF")
  console.log("   Email: staff@system.com")
  console.log("   Password: Staff123@")
  console.log("\n4. USER")
  console.log("   Email: user@system.com")
  console.log("   Password: User123@")
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
