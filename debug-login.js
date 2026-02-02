const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function debugLogin() {
  const email = 'admin@system.com'
  const testPassword = 'Admin123@'
  
  console.log('🔍 DEBUGGING LOGIN FOR:', email)
  console.log('Test password:', testPassword)
  console.log('===============================\n')
  
  // 1. Find the user
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (!user) {
    console.log('❌ USER NOT FOUND IN DATABASE')
    return
  }
  
  console.log('✅ USER FOUND:')
  console.log('   ID:', user.id)
  console.log('   Name:', user.name)
  console.log('   Email:', user.email)
  console.log('   Role:', user.role)
  console.log('   Active:', user.isActive)
  console.log('   Password length:', user.password.length)
  console.log('   Password (first 30 chars):', user.password.substring(0, 30) + '...')
  
  // 2. Check if password is hashed
  const isHashed = user.password.startsWith('$2a$') || 
                   user.password.startsWith('$2b$') ||
                   user.password.startsWith('$2y$')
  
  console.log('\n🔐 PASSWORD ANALYSIS:')
  console.log('   Is bcrypt hash?', isHashed)
  
  if (!isHashed) {
    console.log('   ❌ PASSWORD IS PLAIN TEXT, NOT HASHED!')
    console.log('   Actual stored password:', user.password)
    console.log('   Test password:', testPassword)
    console.log('   Match?', user.password === testPassword)
  }
  
  // 3. Try to compare
  console.log('\n🔐 TRYING BCRYPT COMPARE:')
  try {
    const isValid = await bcrypt.compare(testPassword, user.password)
    console.log('   Bcrypt.compare result:', isValid)
    
    if (!isValid && isHashed) {
      console.log('   ⚠️ Password mismatch - wrong password')
    } else if (!isValid && !isHashed) {
      console.log('   ⚠️ Bcrypt fails because stored password is not hashed')
    }
  } catch (error) {
    console.log('   ❌ Bcrypt.compare ERROR:', error.message)
  }
  
  // 4. Show ALL users for reference
  console.log('\n👥 ALL USERS IN DATABASE:')
  const allUsers = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      role: true,
      password: true
    }
  })
  
  allUsers.forEach(u => {
    console.log(`   ${u.email} (${u.name}) - ${u.role}`)
    console.log(`     Password: ${u.password.substring(0, 20)}...`)
    console.log(`     Length: ${u.password.length} chars`)
  })
}

debugLogin()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
