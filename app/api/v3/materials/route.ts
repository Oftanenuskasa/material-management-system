import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(request: Request) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const data = await request.json();

    const result = await client.query(
      `INSERT INTO "Material" (id, sku, name, quantity) 
       VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *`,
      [data.sku, data.name, Number(data.quantity) || 0]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.end();
  }
}
