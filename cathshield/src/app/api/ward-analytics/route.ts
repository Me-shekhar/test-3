import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wardId = searchParams.get('wardId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!wardId) {
      return NextResponse.json(
        { success: false, error: 'wardId required' },
        { status: 400 }
      );
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await query(
      `SELECT * FROM ward_analytics 
       WHERE ward_id = $1 AND date >= $2
       ORDER BY date DESC`,
      [wardId, startDate]
    );

    // Calculate CLABSI rate and trends
    const data = result.rows.map((row: any) => ({
      ...row,
      clabsiRate: row.total_central_line_days > 0 
        ? ((row.clabsi_cases * 1000) / row.total_central_line_days).toFixed(2)
        : 0,
    }));

    // Calculate % reduction in last 30 days
    let percentReduction = 0;
    if (data.length > 1) {
      const oldestRate = parseFloat(data[data.length - 1].clabsiRate);
      const latestRate = parseFloat(data[0].clabsiRate);
      if (oldestRate > 0) {
        percentReduction = (((oldestRate - latestRate) / oldestRate) * 100).toFixed(2);
      }
    }

    return NextResponse.json({
      success: true,
      data,
      stats: {
        percentReduction,
        totalDays: data.length,
      },
    });
  } catch (error) {
    console.error('Error fetching ward analytics:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { wardId, clabsiCases, totalCentralLineDays, dressingChangeCount, catheterChangeCount } =
      await request.json();

    const now = new Date();
    const derivedRate = totalCentralLineDays > 0
      ? (clabsiCases * 1000) / totalCentralLineDays
      : 0;

    const result = await query(
      `INSERT INTO ward_analytics (ward_id, date, clabsi_cases, total_central_line_days, dressing_change_count, catheter_change_count, derived_rate)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [wardId, now, clabsiCases, totalCentralLineDays, dressingChangeCount, catheterChangeCount, derivedRate]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating ward analytics:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
