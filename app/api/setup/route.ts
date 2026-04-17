import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    await sql`UPDATE users SET password = ${hash} WHERE email = 'admin@school.com'`;
    return NextResponse.json({ success: true, message: "Admin password successfully reset to 'admin123' with valid bcrypt hash." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
