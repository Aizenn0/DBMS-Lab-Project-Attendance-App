import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  try {
    const teachers = await sql`SELECT * FROM teachers ORDER BY name ASC`;
    return NextResponse.json(teachers);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const result = await sql`INSERT INTO teachers (name) VALUES (${name}) RETURNING *`;
    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add teacher' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Teacher ID required' }, { status: 400 });

    await sql`DELETE FROM teachers WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
  }
}
