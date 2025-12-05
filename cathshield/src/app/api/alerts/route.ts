import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { patientId, reason, severity, recommendedAction } = await request.json();

    const alertId = uuidv4();
    const now = new Date();

    const result = await query(
      `INSERT INTO clinical_alerts (id, patient_id, reason, severity, recommended_action, timestamp, acknowledged)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        alertId,
        patientId,
        reason,
        severity,
        recommendedAction,
        now,
        false,
      ]
    );

    return NextResponse.json({ success: true, alertId, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating alert:', error);
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
      `SELECT * FROM clinical_alerts WHERE patient_id = $1 ORDER BY timestamp DESC LIMIT 50`,
      [patientId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { alertId } = await request.json();

    const result = await query(
      `UPDATE clinical_alerts SET acknowledged = true WHERE id = $1 RETURNING *`,
      [alertId]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
