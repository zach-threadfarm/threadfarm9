import { createClient } from '@supabase/supabase-js';
import type { Thread, Post, Draft } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createUserUploadsBucket() {
  const { data, error } = await supabase.storage.createBucket('user-uploads', {
    public: false,
    fileSizeLimit: 200 * 1024 * 1024, // 200MB in bytes
  });
  if (error) {
    console.error('Error creating user-uploads bucket:', error);
  } else {
    console.log('User uploads bucket created:', data);
  }
}

export async function createImagesBucket() {
  const { data, error } = await supabase.storage.createBucket('images', {
    public: false,
    fileSizeLimit: 200 * 1024 * 1024, // 200MB in bytes
  });
  if (error) {
    console.error('Error creating images bucket:', error);
  } else {
    console.log('Images bucket created:', data);
  }
}

// THREADS
/**
 * Get all threads for a user
 */
export async function getThreadsByUser(user_id: string): Promise<{ data: Thread[] } | { error: unknown }> {
  try {
    const { data, error } = await supabase
      .from('threads')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data };
  } catch (error) {
    return { error };
  }
}

/**
 * Get a thread by its ID
 */
export async function getThreadById(id: string): Promise<{ data: Thread } | { error: unknown }> {
  try {
    const { data, error } = await supabase
      .from('threads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data };
  } catch (error) {
    return { error };
  }
}

/**
 * Create a new thread
 */
export async function createThread(thread: Omit<Thread, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Thread } | { error: unknown }> {
  try {
    const { data, error } = await supabase
      .from('threads')
      .insert([thread])
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  } catch (error) {
    return { error };
  }
}

/**
 * Update a thread by ID
 */
export async function updateThread(id: string, updates: Partial<Thread>): Promise<{ data: Thread } | { error: unknown }> {
  try {
    const { data, error } = await supabase
      .from('threads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  } catch (error) {
    return { error };
  }
}

/**
 * Delete a thread by ID
 */
export async function deleteThread(id: string): Promise<{ data: null } | { error: unknown }> {
  try {
    const { error } = await supabase
      .from('threads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { data: null };
  } catch (error) {
    return { error };
  }
}

// POSTS
/**
 * Get all posts for a thread
 */
export async function getPostsByThread(thread_id: string) {
  try {
    return await supabase.from('posts').select('*').eq('thread_id', thread_id).order('post_order', { ascending: true });
  } catch (error) {
    return { error };
  }
}

/**
 * Create a new post
 */
export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
  try {
    return await supabase.from('posts').insert([post]).select().single();
  } catch (error) {
    return { error };
  }
}

/**
 * Update a post by ID
 */
export async function updatePost(id: string, updates: Partial<Post>) {
  try {
    return await supabase.from('posts').update(updates).eq('id', id).select().single();
  } catch (error) {
    return { error };
  }
}

/**
 * Delete a post by ID
 */
export async function deletePost(id: string) {
  try {
    return await supabase.from('posts').delete().eq('id', id);
  } catch (error) {
    return { error };
  }
}

// DRAFTS
/**
 * Get all drafts for a user
 */
export async function getDraftsByUser(user_id: string) {
  try {
    return await supabase.from('drafts').select('*').eq('user_id', user_id).order('created_at', { ascending: false });
  } catch (error) {
    return { error };
  }
}

/**
 * Get a draft by its ID
 */
export async function getDraftById(id: string) {
  try {
    return await supabase.from('drafts').select('*').eq('id', id).single();
  } catch (error) {
    return { error };
  }
}

/**
 * Create a new draft
 */
export async function createDraft(draft: Omit<Draft, 'id' | 'created_at' | 'updated_at'>) {
  try {
    return await supabase.from('drafts').insert([draft]).select().single();
  } catch (error) {
    return { error };
  }
}

/**
 * Update a draft by ID
 */
export async function updateDraft(id: string, updates: Partial<Draft>) {
  try {
    return await supabase.from('drafts').update(updates).eq('id', id).select().single();
  } catch (error) {
    return { error };
  }
}

/**
 * Delete a draft by ID
 */
export async function deleteDraft(id: string) {
  try {
    return await supabase.from('drafts').delete().eq('id', id);
  } catch (error) {
    return { error };
  }
} 