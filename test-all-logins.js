const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const testCredentials = [
  { email: 'admin@system.com', password: 'admin123', expectedRole: 'ADMIN' },
  { email: 'admin@example.com', password: 'admin123', expectedRole: 'ADMIN' },
  { email: 'manager@example.com', password: 'manager123', expectedRole: 'MANAGER' },
  { email: 'staff@example.com', password: 'staff123', expectedRole: 'STAFF' },
  { email: 'user@example.com', password: 'user123', expectedRole: 'USER' },
]

async function testLogin(email, password) {
  console.log(`\n🔐 Testing: ${email}`)
  
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (!user) {
    console.log('❌ User not found')
    return false
  }
  
  console.log(`   Found: ${user.name} (${user.role})`)
  console.log(`   Active: ${user.isActive}`)
  
  if (!user.isActive) {
    console.log('❌ User is inactive')
    return false
  }
  
  const isValid = await bcrypt.compare(password, user.password)
  console.log(`   Password valid: ${isValid}`)
  
  if (isValid) {
    console.log(`✅ Login successful! Role: ${user.role}`)
  } else {
    console.log('❌ Invalid password')
  }
  
  return isValid
}

async function runAllTests() {
  console.log('Testing all user logins...')
  console.log('='.repeat(60))
  
  let successCount = 0
  let totalCount = 0
  
  for (const cred of testCredentials) {
    totalCount++
    const success = await testLogin(cred.email, cred.password)
    if (success) successCount++
  }
  
  console.log('\n' + '='.repeat(60))
  console.log(`Results: ${successCount}/${totalCount} logins successful`)
  
  await prisma.$disconnect()
}

runAllTests().catch(console.error)
