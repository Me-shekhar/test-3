import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { patientId, audioLanguageUsed } = await request.json();

    const consentId = uuidv4();
    const now = new Date();

    const result = await query(
      `INSERT INTO consent_records (id, patient_id, audio_played, audio_language_used, playback_finished_timestamp, consent_obtained, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        consentId,
        patientId,
        true,
        audioLanguageUsed,
        now,
        true,
        now,
      ]
    );

    return NextResponse.json({ success: true, consentId, data: result.rows[0] });
  } catch (error) {
    console.error('Error recording consent:', error);
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
      `SELECT * FROM consent_records WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [patientId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (error) {
    console.error('Error fetching consent:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
