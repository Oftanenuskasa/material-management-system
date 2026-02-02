const { PrismaClient } = require('@prisma/client')
const { hashPassword, comparePassword } = require('./lib/auth')

const prisma = new PrismaClient()

async function testLogin(email, password) {
  console.log(`\nTesting login for: ${email}`)
  
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (!user) {
    console.log('❌ User not found')
    return false
  }
  
  console.log(`✅ User found: ${user.name}`)
  console.log(`   Role: ${user.role}`)
  console.log(`   Active: ${user.isActive}`)
  console.log(`   Has password field: ${!!user.password}`)
  console.log(`   Password length: ${user.password?.length || 0}`)
  
  if (!user.isActive) {
    console.log('❌ User is not active')
    return false
  }
  
  // Try to verify password
  try {
    const isValid = await comparePassword(password, user.password)
    console.log(`   Password valid: ${isValid}`)
    return isValid
  } catch (error) {
    console.log(`   Password check error: ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('Testing user logins...')
  console.log('='.repeat(80))
  
  // Test with your seed users
  await testLogin('admin@example.com', 'admin123')
  await testLogin('manager@example.com', 'manager123')
  await testLogin('staff@example.com', 'staff123')
  await testLogin('user@example.com', 'user123')
  
  // Also test with admin@system.com if it exists
  await testLogin('admin@system.com', 'admin123')
  
  await prisma.$disconnect()
}

runTests().catch(console.error)
