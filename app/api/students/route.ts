import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('teacher_id');

    let students;
    if (teacherId) {
      students = await sql`SELECT * FROM students WHERE teacher_id = ${teacherId} ORDER BY name ASC`;
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
    const { name, teacher_id } = await req.json();
    if (!name || !teacher_id) return NextResponse.json({ error: 'Name and teacher_id are required' }, { status: 400 });

    const result = await sql`
      INSERT INTO students (name, teacher_id) 
      VALUES (${name}, ${teacher_id}) 
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
