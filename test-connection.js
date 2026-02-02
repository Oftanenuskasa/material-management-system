require('dotenv').config({ path: '.env' })
const { PrismaClient } = require('@prisma/client')

console.log('Testing Prisma connection...')
console.log('DATABASE_URL:', process.env.DATABASE_URL)

const prisma = new PrismaClient()

async function test() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Create a test user if none exist
    const userCount = await prisma.user.count()
    console.log(`👤 Total users: ${userCount}`)
    
    const materialCount = await prisma.material.count()
    console.log(`📦 Total materials: ${materialCount}`)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

test()
