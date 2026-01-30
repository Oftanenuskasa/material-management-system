import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Deleting all users...")
  const count = await prisma.user.deleteMany({})
  console.log(`✅ Deleted ${count.count} users`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
