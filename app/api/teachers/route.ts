import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const revalidate = 0;

export async function GET() {
  try {
    const teachers = await sql`SELECT id, name, email FROM users WHERE role = 'teacher' ORDER BY name ASC`;
    return NextResponse.json(teachers);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await sql`
      INSERT INTO users (name, email, password, role) 
      VALUES (${name}, ${email}, ${hashedPassword}, 'teacher') 
      RETURNING id, name, email
    `;
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

    await sql`DELETE FROM users WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
  }
}
