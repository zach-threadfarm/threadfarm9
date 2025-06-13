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
export async function getThreadsByUser(user_id: string) {
  return supabase.from('threads').select('*').eq('user_id', user_id).order('created_at', { ascending: false });
}

export async function getThreadById(id: string) {
  return supabase.from('threads').select('*').eq('id', id).single();
}

export async function createThread(thread: Omit<Thread, 'id' | 'created_at' | 'updated_at'>) {
  return supabase.from('threads').insert([thread]).select().single();
}

export async function updateThread(id: string, updates: Partial<Thread>) {
  return supabase.from('threads').update(updates).eq('id', id).select().single();
}

export async function deleteThread(id: string) {
  return supabase.from('threads').delete().eq('id', id);
}

// POSTS
export async function getPostsByThread(thread_id: string) {
  return supabase.from('posts').select('*').eq('thread_id', thread_id).order('post_order', { ascending: true });
}

export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
  return supabase.from('posts').insert([post]).select().single();
}

export async function updatePost(id: string, updates: Partial<Post>) {
  return supabase.from('posts').update(updates).eq('id', id).select().single();
}

export async function deletePost(id: string) {
  return supabase.from('posts').delete().eq('id', id);
}

// DRAFTS
export async function getDraftsByUser(user_id: string) {
  return supabase.from('drafts').select('*').eq('user_id', user_id).order('created_at', { ascending: false });
}

export async function getDraftById(id: string) {
  return supabase.from('drafts').select('*').eq('id', id).single();
}

export async function createDraft(draft: Omit<Draft, 'id' | 'created_at' | 'updated_at'>) {
  return supabase.from('drafts').insert([draft]).select().single();
}

export async function updateDraft(id: string, updates: Partial<Draft>) {
  return supabase.from('drafts').update(updates).eq('id', id).select().single();
}

export async function deleteDraft(id: string) {
  return supabase.from('drafts').delete().eq('id', id);
} 