const { Client } = require('pg');

console.log('Testing PostgreSQL connection...');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'material_db',
  user: 'postgres',
  password: '',
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');
    
    // Test query
    const result = await client.query('SELECT 1 as test, current_database() as db');
    console.log('✅ Query successful:', result.rows[0]);
    
    // Test insert
    const insert = await client.query(
      `INSERT INTO "Material" (id, sku, name, quantity) 
       VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id, sku, name`,
      ['PG-TEST-' + Date.now(), 'PG Test', 5]
    );
    
    console.log('✅ Insert successful:', insert.rows[0]);
    
    // Count
    const count = await client.query('SELECT COUNT(*) as count FROM "Material"');
    console.log('✅ Total materials:', count.rows[0].count);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Disconnected');
  }
}

test();
