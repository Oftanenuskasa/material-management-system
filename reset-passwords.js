const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetPasswords() {
  console.log('🔄 RESETTING ALL PASSWORDS TO KNOWN VALUES...\n')
  
  const users = [
    { email: 'admin@system.com', newPassword: 'Admin123@', role: 'ADMIN' },
    { email: 'manager@system.com', newPassword: 'Manager123@', role: 'MANAGER' },
    { email: 'staff@system.com', newPassword: 'Staff123@', role: 'STAFF' },
    { email: 'user@system.com', newPassword: 'User123@', role: 'USER' },
    { email: 'admin@example.com', newPassword: 'Admin123@', role: 'ADMIN' },
    { email: 'manager@example.com', newPassword: 'Manager123@', role: 'MANAGER' },
    { email: 'staff@example.com', newPassword: 'Staff123@', role: 'STAFF' },
    { email: 'user@example.com', newPassword: 'User123@', role: 'USER' }
  ]
  
  for (const userData of users) {
    console.log(`Resetting ${userData.email} (${userData.role})...`)
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(userData.newPassword, 10)
    
    // Update in database
    await prisma.user.update({
      where: { email: userData.email },
      data: { 
        password: hashedPassword,
        isActive: true  // Ensure all users are active
      }
    })
    
    console.log(`  ✅ Password set to: ${userData.newPassword}`)
    console.log(`  New hash: ${hashedPassword.substring(0, 30)}...\n`)
  }
  
  console.log('✅ ALL PASSWORDS RESET!')
  console.log('\n📋 LOGIN CREDENTIALS:')
  console.log('=====================')
  console.log('👑 ADMIN: admin@system.com / Admin123@')
  console.log('📊 MANAGER: manager@system.com / Manager123@')
  console.log('📦 STAFF: staff@system.com / Staff123@')
  console.log('👤 USER: user@system.com / User123@')
  console.log('\nExample accounts (same passwords):')
  console.log('admin@example.com / Admin123@')
  console.log('manager@example.com / Manager123@')
  console.log('staff@example.com / Staff123@')
  console.log('user@example.com / User123@')
}

resetPasswords()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
