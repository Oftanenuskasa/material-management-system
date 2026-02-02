const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function forceFixAdmin() {
  console.log('Force fixing admin password...\n')
  
  // Create a fresh hash for 'admin123'
  const newPassword = 'admin123'
  const newHash = await bcrypt.hash(newPassword, 10)
  
  console.log('New password:', newPassword)
  console.log('New hash:', newHash)
  console.log('Hash length:', newHash.length)
  
  // Update the admin user
  const updatedAdmin = await prisma.user.update({
    where: { email: 'admin@system.com' },
    data: {
      password: newHash,
      isActive: true
    }
  })
  
  console.log('\n✅ Admin user updated!')
  console.log('Email:', updatedAdmin.email)
  console.log('New password hash stored')
  
  // Verify it works
  console.log('\n🔍 Verifying the fix...')
  const isValid = await bcrypt.compare('admin123', updatedAdmin.password)
  console.log('Password "admin123" valid?', isValid ? '✅ YES' : '❌ NO')
  
  if (isValid) {
    console.log('\n🎉 SUCCESS! You can now login with:')
    console.log('   Email: admin@system.com')
    console.log('   Password: admin123')
  } else {
    console.log('\n❌ Something went wrong...')
    console.log('Stored hash:', updatedAdmin.password.substring(0, 30) + '...')
  }
  
  await prisma.$disconnect()
}

forceFixAdmin().catch(console.error)
