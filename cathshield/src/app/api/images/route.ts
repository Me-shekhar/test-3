import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const patientId = formData.get('patientId') as string;
    const cathetersiteFile = formData.get('cathetersite') as File;
    const tractionDeviceFile = formData.get('tractionDevice') as File;
    const yellowPulls = parseInt(formData.get('yellowPulls') as string) || 0;
    const redPulls = parseInt(formData.get('redPulls') as string) || 0;

    if (!patientId || !cathetersiteFile) {
      return NextResponse.json(
        { success: false, error: 'patientId and cathetersite image required' },
        { status: 400 }
      );
    }

    // In production, upload to S3 or cloud storage
    // For now, simulate with base64 or file path
    const buffer = await cathetersiteFile.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const cathetersiteUrl = `data:image/jpeg;base64,${base64.slice(0, 100)}...`; // Simulate URL

    let tractionDeviceUrl = null;
    if (tractionDeviceFile) {
      const tractionBuffer = await tractionDeviceFile.arrayBuffer();
      const tractionBase64 = Buffer.from(tractionBuffer).toString('base64');
      tractionDeviceUrl = `data:image/jpeg;base64,${tractionBase64.slice(0, 100)}...`;
    }

    const captureId = uuidv4();
    const now = new Date();

    const result = await query(
      `INSERT INTO image_captures (id, patient_id, cathetersite_url, traction_device_url, yellow_pulls, red_pulls, captured_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        captureId,
        patientId,
        cathetersiteUrl,
        tractionDeviceUrl,
        yellowPulls,
        redPulls,
        now,
      ]
    );

    return NextResponse.json({
      success: true,
      captureId,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error uploading images:', error);
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
      `SELECT * FROM image_captures WHERE patient_id = $1 ORDER BY captured_at DESC LIMIT 100`,
      [patientId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
