const bcrypt = require('bcryptjs')

// This is the exact hash from your database
const storedHash = '$2b$10$36U9iq67Y4iXsyNgy9RJZOMRWuB.9a3XUN53AQmEqA4/HFhA/qEp.'

async function test() {
  console.log('Testing bcrypt compare with exact hash from database...\n')
  
  console.log('Stored hash:', storedHash)
  console.log('Hash length:', storedHash.length)
  console.log('Starts with $2b$?', storedHash.startsWith('$2b$'))
  
  // Test different variations
  const testCases = [
    { password: 'admin123', description: 'Lowercase admin123' },
    { password: 'Admin123', description: 'Capital A Admin123' },
    { password: 'ADMIN123', description: 'All caps ADMIN123' },
    { password: 'admin@123', description: 'admin@123' },
    { password: 'Admin@123', description: 'Admin@123' },
  ]
  
  for (const testCase of testCases) {
    console.log(`\nTesting: ${testCase.description}`)
    console.log(`Password: "${testCase.password}"`)
    
    try {
      const result = await bcrypt.compare(testCase.password, storedHash)
      console.log(`Result: ${result ? '✅ MATCH' : '❌ NO MATCH'}`)
      
      // Also create a new hash to see what it looks like
      if (testCase.password === 'admin123') {
        const newHash = await bcrypt.hash(testCase.password, 10)
        console.log(`New hash for "${testCase.password}":`, newHash.substring(0, 30) + '...')
        console.log(`Matches stored? ${newHash === storedHash}`)
      }
    } catch (error) {
      console.log(`Error: ${error.message}`)
    }
  }
}

test().catch(console.error)
