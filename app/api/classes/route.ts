import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  try {
    const classes = await sql`
      SELECT c.*, u.name as teacher_name 
      FROM classes c 
      LEFT JOIN users u ON c.teacher_id = u.id 
      ORDER BY c.name ASC
    `;
    return NextResponse.json(classes);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, teacher_id, term } = await req.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const result = await sql`
      INSERT INTO classes (name, teacher_id, term) 
      VALUES (${name}, ${teacher_id || null}, ${term || 'Full Year'}) 
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add class' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Class ID required' }, { status: 400 });

    await sql`DELETE FROM classes WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
  }
}
