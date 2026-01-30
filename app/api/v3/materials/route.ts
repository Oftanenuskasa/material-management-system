import { NextResponse } from 'next/server';
import { Client } from 'pg';

const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'material_db',
  user: 'postgres',
};

export async function GET() {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM "Material"');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function POST(request: Request) {
  const client = new Client(dbConfig);
  try {
    const data = await request.json();
    
    if (!data.sku || !data.name) {
      return NextResponse.json({ error: 'SKU and Name required' }, { status: 400 });
    }
    
    await client.connect();
    
    const result = await client.query(
      \`INSERT INTO "Material" (id, sku, name, quantity) 
       VALUES (gen_random_uuid(), \$1, \$2, \$3) RETURNING *\`,
      [data.sku, data.name, Number(data.quantity) || 0]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.end();
  }
}
