const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function test() {
  console.log('Testing Prisma authentication...')
  console.log('Connection URL:', process.env.DATABASE_URL)
  
  try {
    await prisma.$connect()
    console.log('✅ Prisma connected successfully!')
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT version() as version`
    console.log('✅ Query successful:', result[0].version)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    
    // Diagnostic help
    if (error.message.includes('password authentication')) {
      console.log('\n🔧 Password auth failed. Try:')
      console.log('1. Verify password: sudo -u postgres psql -c "\\password oftaan"')
      console.log('2. Check pg_hba.conf: sudo grep -A2 -B2 "local.*all" /etc/postgresql/*/main/pg_hba.conf')
    }
    
  } finally {
    await prisma.$disconnect()
  }
}

// Load .env.local
require('dotenv').config({ path: '.env.local' })
test()
