const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function hashAllPasswords() {
  console.log('🔐 Hashing all user passwords...\n');
  
  try {
    // Get all users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users to update\n`);
    
    for (const user of users) {
      console.log(`Processing: ${user.email}`);
      
      // Check if password is already hashed (bcrypt hashes start with $2b$)
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        console.log(`  ⏭️  Password already hashed\n`);
        continue;
      }
      
      // Hash the plain text password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      
      // Update user with hashed password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      
      console.log(`  ✅ Password hashed and updated\n`);
    }
    
    console.log('🎉 All passwords have been hashed!');
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('👑 ADMIN: admin@system.com / Admin123@');
    console.log('📊 MANAGER: manager@system.com / Manager123@');
    console.log('📦 STAFF: staff@system.com / Staff123@');
    console.log('👤 USER: user@system.com / User123@');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

hashAllPasswords();
