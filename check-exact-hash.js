import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Checking exact password hash...")
  
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
    select: { 
      email: true, 
      password: true
    }
  })
  
  if (adminUser) {
    console.log(`User: ${adminUser.email}`)
    console.log("Full password hash (as JSON):")
    console.log(JSON.stringify(adminUser.password))
    console.log("\nHash character by character:")
    for (let i = 0; i < adminUser.password.length; i++) {
      const char = adminUser.password[i]
      console.log(`  [${i}] = '${char}' (code: ${char.charCodeAt(0)})`)
    }
    console.log(`\nTotal length: ${adminUser.password.length}`)
    
    // Try to see if there are any non-printable characters
    const hex = Buffer.from(adminUser.password).toString('hex')
    console.log(`\nHex representation: ${hex}`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
