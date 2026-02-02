const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo users...");

  const users = [
    // System admin (the one you're trying to login with)
    { name: 'System Admin', email: 'admin@system.com', password: 'admin123', role: 'ADMIN' },
    
    // Example users from your seed
    { name: 'Demo Admin', email: 'admin@example.com', password: 'admin123', role: 'ADMIN' },
    { name: 'Manager', email: 'manager@example.com', password: 'manager123', role: 'MANAGER' },
    { name: 'Staff', email: 'staff@example.com', password: 'staff123', role: 'STAFF' },
    { name: 'User', email: 'user@example.com', password: 'user123', role: 'USER' },
  ];

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: u.email }
    });
    
    if (existingUser) {
      console.log(`Updating existing user: ${u.email}`);
      await prisma.user.update({
        where: { email: u.email },
        data: {
          name: u.name,
          password: hashedPassword,
          role: u.role,
          isActive: true
        }
      });
    } else {
      console.log(`Creating new user: ${u.email}`);
      await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          password: hashedPassword,
          role: u.role,
          isActive: true
        }
      });
    }
  }

  console.log("\n✅ Demo users created!");
  
  // Show all users
  const allUsers = await prisma.user.findMany({
    orderBy: { email: 'asc' }
  });
  
  console.log("\n📋 All users in database:");
  console.log("=".repeat(60));
  allUsers.forEach(user => {
    console.log(`${user.email.padEnd(25)} - ${user.name.padEnd(20)} - ${user.role}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
