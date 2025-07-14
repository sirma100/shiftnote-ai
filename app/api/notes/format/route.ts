import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { userDb, noteDb, templateDb } from '@/lib/database';
import { formatShiftNote } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = userDb.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const { rawInput, templateId, clientName } = await request.json();

    if (!rawInput || !templateId) {
      return NextResponse.json(
        { success: false, error: 'Raw input and template are required' },
        { status: 400 }
      );
    }

    // Check usage limits for free users
    if (user.subscription === 'free') {
      const today = new Date().toISOString().split('T')[0];
      if (user.lastUsageDate !== today) {
        userDb.update(user.id, { usageToday: 0, lastUsageDate: today });
        user.usageToday = 0;
      }
      
      if (user.usageToday >= 2) {
        return NextResponse.json(
          { success: false, error: 'Daily limit reached. Please upgrade to Pro for unlimited notes.' },
          { status: 429 }
        );
      }
    }

    // Get template
    const template = templateDb.findById(templateId);

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    // Format the note using OpenAI
    const formattedOutput = await formatShiftNote(rawInput, template.prompt, clientName);

    // Save the note
    const note = noteDb.create({
      userId: user.id,
      rawInput,
      formattedOutput,
      template: template.name,
      createdAt: new Date().toISOString(),
      clientName: clientName || undefined,
    });

    // Increment usage counter
    userDb.incrementUsage(user.id);

    return NextResponse.json({
      success: true,
      data: {
        formattedOutput,
        noteId: note.id,
      },
    });
  } catch (error) {
    console.error('Format note error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to format note. Please try again.' },
      { status: 500 }
    );
  }
}
