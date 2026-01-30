import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Creating ALL user accounts...")
  
  // Clear existing users
  await prisma.user.deleteMany({})
  console.log("✅ Cleared existing users")
  
  // All users with strong passwords
  const users = [
    // Admin users
    { name: 'Super Admin', email: 'superadmin@example.com', plainPassword: 'Super@Admin123', role: 'ADMIN' },
    { name: 'System Admin', email: 'admin@example.com', plainPassword: 'Admin@Secure123', role: 'ADMIN' },
    
    // Manager users
    { name: 'Operations Manager', email: 'opsmanager@example.com', plainPassword: 'Ops@Manager456', role: 'MANAGER' },
    { name: 'Inventory Manager', email: 'inventorymanager@example.com', plainPassword: 'Inventory@Manager789', role: 'MANAGER' },
    { name: 'Manager User', email: 'manager@example.com', plainPassword: 'Manager@Secure456', role: 'MANAGER' },
    
    // Staff users
    { name: 'Warehouse Staff', email: 'warehouse@example.com', plainPassword: 'Warehouse@Staff123', role: 'STAFF' },
    { name: 'Procurement Staff', email: 'procurement@example.com', plainPassword: 'Procurement@Staff456', role: 'STAFF' },
    { name: 'Staff User', email: 'staff@example.com', plainPassword: 'Staff@Secure789', role: 'STAFF' },
    
    // Regular users
    { name: 'Project Lead', email: 'projectlead@example.com', plainPassword: 'Project@Lead123', role: 'USER' },
    { name: 'Engineer', email: 'engineer@example.com', plainPassword: 'Engineer@Secure456', role: 'USER' },
    { name: 'Technician', email: 'technician@example.com', plainPassword: 'Technician@Secure789', role: 'USER' },
    { name: 'Regular User', email: 'user@example.com', plainPassword: 'User@Secure000', role: 'USER' },
  ]

  const saltRounds = 12
  let createdCount = 0

  for (const user of users) {
    try {
      const hashedPassword = await bcrypt.hash(user.plainPassword, saltRounds)
      
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          isActive: true,
          department: getDepartment(user.role, user.name)
        }
      })
      
      console.log(`✅ ${user.role.padEnd(8)}: ${user.email.padEnd(30)} (${user.plainPassword})`)
      createdCount++
      
    } catch (error) {
      console.log(`❌ Failed: ${user.email} - ${error.message}`)
    }
  }

  console.log(`\n🎉 Created ${createdCount}/${users.length} users successfully!`)
  
  // Print login summary
  console.log("\n📋 LOGIN CREDENTIALS SUMMARY")
  console.log("=".repeat(50))
  
  const roles = ['ADMIN', 'MANAGER', 'STAFF', 'USER']
  roles.forEach(role => {
    const roleUsers = users.filter(u => u.role === role)
    console.log(`\n${role}:`)
    roleUsers.forEach(u => {
      console.log(`  ${u.email} - ${u.plainPassword}`)
    })
  })
}

function getDepartment(role, name) {
  if (name.includes('Warehouse')) return 'Warehouse'
  if (name.includes('Procurement')) return 'Procurement'
  if (name.includes('Operations')) return 'Operations'
  if (name.includes('Inventory')) return 'Inventory'
  if (name.includes('Project')) return 'Projects'
  if (name.includes('Engineer')) return 'Engineering'
  if (name.includes('Technician')) return 'Maintenance'
  
  switch(role) {
    case 'ADMIN': return 'Administration'
    case 'MANAGER': return 'Management'
    case 'STAFF': return 'Operations'
    default: return 'General'
  }
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
