import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { calculateResourceDeprivation } from '@/lib/resourceDeprivation';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { wardId, patientsNeedingToday, availableDressings, availableCatheters } = await request.json();

    const deprivation = calculateResourceDeprivation({
      wardId,
      patientsNeedingToday,
      availableDressings,
      availableCatheters,
    });

    const result = await query(
      `INSERT INTO resource_deprivation (id, ward_id, patients_needing_today, available_dressings, available_catheters,
        dressing_deprivation_rate, catheter_deprivation_rate, combined_deprived_rate, deprivation_band, alert_triggered, computed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        deprivation.id,
        wardId,
        patientsNeedingToday,
        availableDressings,
        availableCatheters,
        deprivation.dressingDeprivationRate,
        deprivation.catheterDeprivationRate,
        deprivation.combinedDeprivedRate,
        deprivation.deprivationBand,
        deprivation.alertTriggered,
        deprivation.computedAt,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error computing resource deprivation:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wardId = searchParams.get('wardId');

    if (!wardId) {
      return NextResponse.json(
        { success: false, error: 'wardId required' },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT * FROM resource_deprivation WHERE ward_id = $1 ORDER BY computed_at DESC LIMIT 1`,
      [wardId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (error) {
    console.error('Error fetching resource deprivation:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
