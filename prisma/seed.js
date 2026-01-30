const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with CORRECT passwords...');

  // Create users with CORRECT passwords from your demo
  const users = [
    {
      email: 'admin@system.com',
      name: 'Admin User',
      password: 'Admin123@',  // Correct password from demo
      role: 'ADMIN',
      department: 'Administration',
      phone: '123-456-7890',
      isActive: true
    },
    {
      email: 'manager@system.com',
      name: 'Manager User',
      password: 'Manager123@',  // Correct password from demo
      role: 'MANAGER',
      department: 'Management',
      phone: '123-456-7891',
      isActive: true
    },
    {
      email: 'staff@system.com',
      name: 'Staff User',
      password: 'Staff123@',  // Correct password from demo
      role: 'STAFF',
      department: 'Operations',
      phone: '123-456-7892',
      isActive: true
    },
    {
      email: 'user@system.com',
      name: 'User User',
      password: 'User123@',  // Correct password from demo
      role: 'USER',
      department: 'General',
      phone: '123-456-7893',
      isActive: true
    }
  ];

  console.log('Creating users with correct passwords...');
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: { password: userData.password }, // Update password if user exists
      create: userData
    });
    console.log(`Created/updated user: ${user.name} (${user.email})`);
    console.log(`  Password: ${userData.password}`);
  }

  // Create materials
  const materials = [
    {
      sku: 'HAM-001',
      name: 'Hammer',
      description: 'Standard claw hammer',
      category: 'Tools',
      quantity: 25,
      unit: 'pieces',
      unitPrice: 15.99,
      supplier: 'ToolCo Inc',
      location: 'Shelf A1',
      minStockLevel: 5,
      status: 'ACTIVE'
    },
    {
      sku: 'SCR-001',
      name: 'Screwdriver Set',
      description: 'Set of 6 screwdrivers',
      category: 'Tools',
      quantity: 18,
      unit: 'sets',
      unitPrice: 29.99,
      supplier: 'ToolCo Inc',
      location: 'Shelf A2',
      minStockLevel: 3,
      status: 'ACTIVE'
    },
    {
      sku: 'LAP-001',
      name: 'Laptop',
      description: 'Dell Latitude business laptop',
      category: 'Electronics',
      quantity: 8,
      unit: 'units',
      unitPrice: 1200.00,
      supplier: 'Dell Technologies',
      location: 'IT Storage',
      minStockLevel: 2,
      status: 'ACTIVE'
    },
    {
      sku: 'MON-001',
      name: 'Monitor',
      description: '24-inch LED monitor',
      category: 'Electronics',
      quantity: 12,
      unit: 'units',
      unitPrice: 199.99,
      supplier: 'Samsung',
      location: 'IT Storage',
      minStockLevel: 4,
      status: 'ACTIVE'
    }
  ];

  console.log('\nCreating materials...');
  for (const materialData of materials) {
    const material = await prisma.material.upsert({
      where: { sku: materialData.sku },
      update: {},
      create: materialData
    });
    console.log(`Created material: ${material.name} (${material.sku})`);
  }

  console.log('\n✅ Seeding completed with CORRECT passwords!');
  console.log('\n=== LOGIN CREDENTIALS ===');
  console.log('👑 ADMIN: admin@system.com / Admin123@');
  console.log('📊 MANAGER: manager@system.com / Manager123@');
  console.log('📦 STAFF: staff@system.com / Staff123@');
  console.log('👤 USER: user@system.com / User123@');
  console.log('\nNote: Passwords are case-sensitive!');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
