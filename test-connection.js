const { PrismaClient } = require('@prisma/client')

// Test different connection URLs
const testUrls = [
  'postgresql://postgres:postgres123@localhost:5432/material_management',
  'postgresql://material_user:material123@localhost:5432/material_management',
  'postgresql://oftaan:oftaan123@localhost:5432/material_management'
]

async function testConnection(url) {
  console.log(`\n🔧 Testing: ${url}`)
  
  const prisma = new PrismaClient({
    datasources: { db: { url } }
  })
  
  try {
    await prisma.$connect()
    console.log('✅ Connection successful!')
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT version() as version`
    console.log(`✅ PostgreSQL version: ${result[0].version}`)
    
    await prisma.$disconnect()
    return true
    
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`)
    await prisma.$disconnect()
    return false
  }
}

async function runTests() {
  console.log('=== Testing Database Connections ===')
  
  for (const url of testUrls) {
    const success = await testConnection(url)
    if (success) {
      console.log(`\n🎉 Use this URL in your .env.local: ${url}`)
      
      // Write to .env.local
      require('fs').writeFileSync('.env.local', 
        `DATABASE_URL="${url}"\nNEXT_PUBLIC_API_URL=http://localhost:3000\n`
      )
      console.log('✅ Updated .env.local file')
      return
    }
  }
  
  console.log('\n❌ All connections failed. Check PostgreSQL authentication.')
}

runTests()
