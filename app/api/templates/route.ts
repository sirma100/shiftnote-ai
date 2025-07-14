import { NextRequest, NextResponse } from 'next/server';
import { templateDb } from '@/lib/database-supabase';

export async function GET(request: NextRequest) {
  try {
    const templates = await templateDb.findAll();

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
