const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');
    
    // Check if database exists
    const result = await client.query('SELECT current_database() as db, version() as version');
    console.log('Database:', result.rows[0].db);
    
    // Check if Material table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'Material'
      ) as table_exists;
    `);
    
    console.log('Material table exists:', tableCheck.rows[0].table_exists);
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check if PostgreSQL is running: sudo systemctl status postgresql');
    console.log('2. Check DATABASE_URL in .env:', process.env.DATABASE_URL);
    console.log('3. Try: psql -h localhost -U postgres -c "CREATE DATABASE material_db;"');
  } finally {
    await client.end();
  }
}

test();
