import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('class_id');
    const date = searchParams.get('date');

    let records;
    if (classId && date) {
      records = await sql`
        SELECT * FROM attendance 
        WHERE class_id = ${classId} AND date = ${date}
      `;
    } else {
      records = await sql`
        SELECT a.*, s.name as student_name, c.name as class_name 
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN classes c ON a.class_id = c.id
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
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { records } = await req.json();
    if (!records || !Array.isArray(records)) {
      return NextResponse.json({ error: 'Invalid records payload' }, { status: 400 });
    }

    if (records.length === 0) return NextResponse.json({ success: true });

    const userId = (session.user as any).id;
    const classId = records[0].class_id;
    const date = records[0].date;

    await sql.transaction([
      ...records.map(r => 
        sql`
          INSERT INTO attendance (student_id, class_id, date, status)
          VALUES (${r.student_id}, ${r.class_id}, ${r.date}, ${r.status})
          ON CONFLICT (student_id, date) 
          DO UPDATE SET status = EXCLUDED.status
        `
      ),
      sql`
        INSERT INTO audit_logs (user_id, action, details)
        VALUES (${userId}, 'UPSERT_ATTENDANCE', ${`Submitted attendance for class ${classId} on date ${date}`})
      `
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upsert attendance' }, { status: 500 });
  }
}
