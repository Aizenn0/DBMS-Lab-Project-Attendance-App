import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('teacher_id');
    const date = searchParams.get('date');

    let records;
    if (teacherId && date) {
      records = await sql`
        SELECT * FROM attendance 
        WHERE teacher_id = ${teacherId} AND date = ${date}
      `;
    } else {
      records = await sql`
        SELECT a.*, s.name as student_name, t.name as teacher_name 
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN teachers t ON a.teacher_id = t.id
        ORDER BY a.date DESC
      `;
    }
    return NextResponse.json(records);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { records } = await req.json();
    if (!records || !Array.isArray(records)) {
      return NextResponse.json({ error: 'Invalid records payload' }, { status: 400 });
    }

    if (records.length === 0) return NextResponse.json({ success: true });

    await sql.transaction(records.map(r => 
      sql`
        INSERT INTO attendance (student_id, teacher_id, date, status)
        VALUES (${r.student_id}, ${r.teacher_id}, ${r.date}, ${r.status})
        ON CONFLICT (student_id, date) 
        DO UPDATE SET status = EXCLUDED.status
      `
    ));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upsert attendance' }, { status: 500 });
  }
}
