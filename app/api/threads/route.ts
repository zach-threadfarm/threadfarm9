import { NextRequest, NextResponse } from 'next/server';
import { getThreadsByUser, getThreadById, createThread, updateThread, deleteThread } from '../../../lib/supabase';
import type { Thread } from '../../../types';
import { PostgrestResponse } from '@supabase/supabase-js';

// GET: Get all threads for a user
export async function GET(req: NextRequest) {
  try {
    const user_id = req.headers.get('x-user-id');
    if (!user_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await getThreadsByUser(user_id);
    if ('error' in response) {
      throw response.error;
    }

    return NextResponse.json({ threads: response.data });
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch threads' },
      { status: 500 }
    );
  }
}

// POST: Create a new thread
export async function POST(req: NextRequest) {
  try {
    const user_id = req.headers.get('x-user-id');
    if (!user_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, transcript, tone, file_url } = await req.json();

    if (!title || !transcript || !tone) {
      return NextResponse.json(
        { error: 'Title, transcript, and tone are required' },
        { status: 400 }
      );
    }

    const thread: Omit<Thread, 'id' | 'created_at' | 'updated_at'> = {
      user_id,
      title,
      transcript,
      tone,
      file_url,
      status: 'draft'
    };

    const response = await createThread(thread);
    if ('error' in response) {
      throw response.error;
    }

    return NextResponse.json({ thread: response.data });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { error: 'Failed to create thread' },
      { status: 500 }
    );
  }
}

// PUT: Update a thread
export async function PUT(req: NextRequest) {
  try {
    const user_id = req.headers.get('x-user-id');
    if (!user_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, updates } = await req.json();
    if (!id || !updates) {
      return NextResponse.json(
        { error: 'Thread ID and updates are required' },
        { status: 400 }
      );
    }

    const response = await updateThread(id, updates);
    if ('error' in response) {
      throw response.error;
    }

    return NextResponse.json({ thread: response.data });
  } catch (error) {
    console.error('Error updating thread:', error);
    return NextResponse.json(
      { error: 'Failed to update thread' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a thread
export async function DELETE(req: NextRequest) {
  try {
    const user_id = req.headers.get('x-user-id');
    if (!user_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: 'Thread ID is required' },
        { status: 400 }
      );
    }

    const response = await deleteThread(id);
    if ('error' in response) {
      throw response.error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting thread:', error);
    return NextResponse.json(
      { error: 'Failed to delete thread' },
      { status: 500 }
    );
  }
} 