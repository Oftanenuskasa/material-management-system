import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("🔍 Verifying users and passwords...")
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      password: true,
      role: true
    }
  })
  
  console.log(`Found ${users.length} users:\n`)
  
  // Test passwords for each user
  const testPasswords = {
    'admin@example.com': 'Admin@Secure123',
    'manager@example.com': 'Manager@Secure456',
    'staff@example.com': 'Staff@Secure789',
    'user@example.com': 'User@Secure000'
  }
  
  for (const user of users) {
    console.log(`👤 ${user.email} (${user.role})`)
    console.log(`   Hash: ${user.password.substring(0, 30)}...`)
    console.log(`   Length: ${user.password.length} characters`)
    
    // Test if it's a valid bcrypt hash
    if (user.password.startsWith('$2')) {
      console.log(`   ✅ Valid bcrypt hash format`)
      
      // Test password verification
      const expectedPassword = testPasswords[user.email]
      if (expectedPassword) {
        const isValid = await bcrypt.compare(expectedPassword, user.password)
        console.log(`   Password test: ${isValid ? '✅ CORRECT' : '❌ WRONG'}`)
      } else {
        console.log(`   ⚠️  No test password defined`)
      }
    } else {
      console.log(`   ❌ INVALID hash format!`)
      console.log(`   Hash starts with: ${user.password.substring(0, 10)}`)
    }
    console.log()
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
