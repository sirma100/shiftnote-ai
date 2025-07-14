import { NextRequest, NextResponse } from 'next/server';
import { templateDb } from '@/lib/database-cloud';

export async function GET(request: NextRequest) {
  try {
    const templates = templateDb.findAll();

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
