import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Patient, PatientFactors, SafetyChecklist } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { bedNo, initials, insertionDate, patientFactors, safetyChecklist } = await request.json();

    const patientId = uuidv4();
    const createdAt = new Date();

    const result = await query(
      `INSERT INTO patients (id, bed_no, initials, insertion_date, patient_factors, safety_checklist, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        patientId,
        bedNo,
        initials,
        new Date(insertionDate),
        JSON.stringify(patientFactors),
        JSON.stringify(safetyChecklist),
        createdAt,
        createdAt,
      ]
    );

    return NextResponse.json({ success: true, patientId, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (patientId) {
      const result = await query(`SELECT * FROM patients WHERE id = $1`, [patientId]);
      return NextResponse.json({
        success: true,
        data: result.rows[0] || null,
      });
    }

    const result = await query(`SELECT * FROM patients ORDER BY created_at DESC LIMIT 50`);
    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
