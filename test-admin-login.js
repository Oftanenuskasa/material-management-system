const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const adminCredentials = [
  { email: 'admin@system.com', password: 'admin123' },
  { email: 'admin@example.com', password: 'admin123' },
]

async function testAdminLogin(email, password) {
  console.log(`\n🔐 Testing ADMIN login: ${email}`)
  
  try {
    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('❌ User not found in database')
      return false
    }
    
    console.log(`✅ User found: ${user.name}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Active: ${user.isActive}`)
    console.log(`   Password field exists: ${!!user.password}`)
    console.log(`   Password starts with: ${user.password?.substring(0, 20)}...`)
    
    if (!user.isActive) {
      console.log('❌ User is marked as inactive')
      return false
    }
    
    if (user.role !== 'ADMIN') {
      console.log(`❌ User role is ${user.role}, not ADMIN`)
      return false
    }
    
    // Check if password is hashed
    if (!user.password.startsWith('$2')) {
      console.log('❌ Password is not properly hashed (should start with $2)')
      return false
    }
    
    // Try to verify password
    const isValid = await bcrypt.compare(password, user.password)
    console.log(`   Password validation result: ${isValid}`)
    
    if (isValid) {
      console.log('✅ ADMIN login successful!')
      return true
    } else {
      console.log('❌ Password incorrect')
      // Try to see what the actual password hash is
      console.log(`   Trying to hash input password...`)
      const testHash = await bcrypt.hash(password, 10)
      console.log(`   Input password hash: ${testHash.substring(0, 20)}...`)
      console.log(`   Stored password hash: ${user.password.substring(0, 20)}...`)
      return false
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('Testing ADMIN user logins...')
  console.log('='.repeat(80))
  
  let successCount = 0
  for (const cred of adminCredentials) {
    const success = await testAdminLogin(cred.email, cred.password)
    if (success) successCount++
  }
  
  console.log('\n' + '='.repeat(80))
  console.log(`Results: ${successCount}/${adminCredentials.length} ADMIN logins successful`)
  
  await prisma.$disconnect()
}

runTests().catch(console.error)
