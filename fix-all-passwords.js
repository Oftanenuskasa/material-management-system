const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function fixPasswords() {
  console.log('🛠️ FIXING ALL PASSWORDS...\n')
  
  const users = await prisma.user.findMany()
  
  for (const user of users) {
    console.log(`Processing ${user.email}...`)
    
    // Skip if already hashed
    if (user.password.startsWith('$2a$') || 
        user.password.startsWith('$2b$') ||
        user.password.startsWith('$2y$')) {
      console.log(`  ✅ Already hashed, skipping`)
      continue
    }
    
    console.log(`  Current (plain): ${user.password}`)
    const hashed = await bcrypt.hash(user.password, 10)
    
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed }
    })
    
    console.log(`  ✅ Hashed to: ${hashed.substring(0, 30)}...`)
  }
  
  console.log('\n✅ ALL PASSWORDS FIXED!')
}

fixPasswords()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
