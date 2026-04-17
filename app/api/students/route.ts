import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('class_id');

    let students;
    if (classId) {
      students = await sql`SELECT * FROM students WHERE class_id = ${classId} ORDER BY name ASC`;
    } else {
      students = await sql`SELECT * FROM students ORDER BY name ASC`;
    }
    return NextResponse.json(students);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, class_id } = await req.json();
    if (!name || !class_id) return NextResponse.json({ error: 'Name and class_id are required' }, { status: 400 });

    const result = await sql`
      INSERT INTO students (name, class_id) 
      VALUES (${name}, ${class_id}) 
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add student' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Student ID required' }, { status: 400 });

    await sql`DELETE FROM students WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
