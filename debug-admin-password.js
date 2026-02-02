const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function debugAdminPassword() {
  console.log('Debugging admin password issue...\n')
  
  // Get the admin user
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@system.com' }
  })
  
  if (!admin) {
    console.log('❌ Admin user not found')
    return
  }
  
  console.log('✅ Admin user found:')
  console.log('   Email:', admin.email)
  console.log('   Name:', admin.name)
  console.log('   Role:', admin.role)
  console.log('   Active:', admin.isActive)
  console.log('   Password length:', admin.password.length)
  console.log('   Password starts with:', admin.password.substring(0, 30))
  console.log('   Is bcrypt hash?', admin.password.startsWith('$2'))
  
  // Test different passwords
  const testPasswords = [
    'admin123',
    'Admin123',
    'admin',
    'password',
    'admin@system.com'
  ]
  
  console.log('\n🔑 Testing password validation:')
  console.log('='.repeat(60))
  
  for (const testPassword of testPasswords) {
    const isValid = await bcrypt.compare(testPassword, admin.password)
    console.log(`   "${testPassword}": ${isValid ? '✅ MATCHES' : '❌ NO MATCH'}`)
  }
  
  // Try to see what the hash should be for 'admin123'
  console.log('\n🔄 Creating new hash for "admin123":')
  const newHash = await bcrypt.hash('admin123', 10)
  console.log('   New hash:', newHash.substring(0, 30))
  console.log('   Stored hash:', admin.password.substring(0, 30))
  console.log('   Are they equal?', newHash === admin.password)
  
  await prisma.$disconnect()
}

debugAdminPassword().catch(console.error)
