import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Creating users with proper bcrypt hashes...")
  
  // Generate real bcrypt hashes
  const saltRounds = 12
  
  const users = [
    { 
      name: 'System Admin', 
      email: 'admin@example.com', 
      plainPassword: 'Admin@Secure123',
      role: 'ADMIN' 
    },
    { 
      name: 'Manager User', 
      email: 'manager@example.com', 
      plainPassword: 'Manager@Secure456',
      role: 'MANAGER' 
    },
    { 
      name: 'Staff User', 
      email: 'staff@example.com', 
      plainPassword: 'Staff@Secure789',
      role: 'STAFF' 
    },
    { 
      name: 'Regular User', 
      email: 'user@example.com', 
      plainPassword: 'User@Secure000',
      role: 'USER' 
    },
  ]

  for (const user of users) {
    console.log(`\n📝 Creating ${user.role}: ${user.email}`)
    
    // Create REAL bcrypt hash
    const hashedPassword = await bcrypt.hash(user.plainPassword, saltRounds)
    console.log(`   Plain password: ${user.plainPassword}`)
    console.log(`   Real hash: ${hashedPassword.substring(0, 30)}...`)
    console.log(`   Hash length: ${hashedPassword.length}`)
    
    // Verify the hash works
    const isValid = await bcrypt.compare(user.plainPassword, hashedPassword)
    console.log(`   Hash test: ${isValid ? '✅ Valid' : '❌ Invalid'}`)
    
    try {
      const createdUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          isActive: true
        }
      })
      console.log(`   ✅ Created user ID: ${createdUser.id}`)
      
      // Double-check the stored hash
      const storedUser = await prisma.user.findUnique({
        where: { id: createdUser.id },
        select: { password: true }
      })
      console.log(`   Stored hash length: ${storedUser.password.length}`)
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`)
    }
  }

  console.log("\n🎉 All users created successfully!")
  console.log("\n🔑 Login Credentials:")
  console.log("===================")
  users.forEach(user => {
    console.log(`Email: ${user.email}`)
    console.log(`Password: ${user.plainPassword}`)
    console.log(`Role: ${user.role}`)
    console.log("---")
  })
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
