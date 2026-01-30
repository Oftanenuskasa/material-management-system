import { PrismaClient } from '@prisma/client'
import { hashPassword } from '@/lib/auth'

const prisma = new PrismaClient()

async function main() {
  // Seed demo users
  const users = [
    {
      name: 'Admin',
      email: 'admin@example.com',
      password: await hashPassword('admin123'),
      role: 'ADMIN',
    },
    {
      name: 'Manager',
      email: 'manager@example.com',
      password: await hashPassword('manager123'),
      role: 'MANAGER',
    },
    {
      name: 'Staff',
      email: 'staff@example.com',
      password: await hashPassword('staff123'),
      role: 'STAFF',
    },
    {
      name: 'User',
      email: 'user@example.com',
      password: await hashPassword('user123'),
      role: 'USER',
    },
  ]

  for (const user of users) {
    // Check if user already exists to avoid duplicates
    const exists = await prisma.user.findUnique({
      where: { email: user.email },
    })
    if (!exists) {
      await prisma.user.create({ data: user })
      console.log(`Created user: ${user.email}`)
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
