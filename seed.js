import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo users...");

  const users = [
    { name: 'System Admin', email: 'admin@example.com', password: 'admin123', role: 'ADMIN' },
    { name: 'manager', email: 'manager@example.com', password: 'manager123', role: 'MANAGER' },
    { name: 'staff', email: 'staff@example.com', password: 'staff123', role: 'STAFF' },
    { name: 'user', email: 'user@example.com', password: 'user123', role: 'USER' },
  ];

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        isActive: true
      },
    });
    console.log(`User created: ${u.email}`);
  }

  console.log("Demo users created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
