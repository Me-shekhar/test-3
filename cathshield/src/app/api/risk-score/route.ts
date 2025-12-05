import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { calculateRiskScore } from '@/lib/riskEngine';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const {
      patientId,
      daysOnCatheter,
      dressingIntegrityScore,
      dressingRecentChange,
      yellowPullsLast12h,
      redPullsLast12h,
      patientFactors,
      safetyChecklist,
    } = await request.json();

    const riskScore = calculateRiskScore({
      daysOnCatheter,
      dressing: {
        integrityScore: dressingIntegrityScore,
        recentChange: dressingRecentChange,
      },
      traction: {
        yellowPullsLast12h,
        redPullsLast12h,
      },
      patientFactors,
      safetyChecklist,
    });

    riskScore.patientId = patientId;

    const scoreId = uuidv4();
    const result = await query(
      `INSERT INTO risk_scores (id, patient_id, clisa_score, predictive_clabsi_score, predictive_clabsi_band, 
        predictive_venous_resistance_band, recommended_action, action_color, computed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        scoreId,
        patientId,
        riskScore.clisaScore,
        riskScore.predictiveClabsiScore,
        riskScore.predictiveClabsiBand,
        riskScore.predictiveVenousResistanceBand,
        riskScore.recommendedAction,
        riskScore.actionColor,
        riskScore.computedAt,
      ]
    );

    return NextResponse.json({ success: true, scoreId, data: result.rows[0] });
  } catch (error) {
    console.error('Error computing risk score:', error);
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
      `SELECT * FROM risk_scores WHERE patient_id = $1 ORDER BY computed_at DESC LIMIT 1`,
      [patientId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (error) {
    console.error('Error fetching risk score:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
