import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { patientId, eventType } = await request.json();

    const eventId = uuidv4();
    const now = new Date();

    const result = await query(
      `INSERT INTO event_logs (id, patient_id, event_type, logged_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [eventId, patientId, eventType, now]
    );

    return NextResponse.json({ success: true, eventId, data: result.rows[0] });
  } catch (error) {
    console.error('Error logging event:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json(
        { success: false, error: 'patientId required' },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT * FROM event_logs WHERE patient_id = $1 ORDER BY logged_at DESC LIMIT 100`,
      [patientId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
