"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardNav from '../components/DashboardNav';
import { createBrowserClient } from '@supabase/ssr';
import type { Thread } from '@/types';

export default function DashboardPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [tab, setTab] = useState<'published' | 'drafts'>('drafts');
  const [deleteThreadId, setDeleteThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Load threads from Supabase on mount
  useEffect(() => {
    async function loadThreads() {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const { data, error } = await supabase
          .from('threads')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setThreads(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load threads');
      } finally {
        setIsLoading(false);
      }
    }

    loadThreads();
  }, [router, supabase]);

  // When deleting, update Supabase
  const handleDeleteThread = async (id: string) => {
    try {
      const { error } = await supabase
        .from('threads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setThreads(threads => threads.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete thread');
    }
  };

  const publishedThreads = threads.filter(t => t.status === 'published');
  const draftThreads = threads.filter(t => t.status === 'draft');

  return (
    <div className="flex min-h-screen bg-[#f7f8f4]">
      <DashboardNav />
      <main className="flex-1 ml-64 px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-black">Your Content</h1>
          <Link href="/create">
            <button className="bg-[#1a7f37] text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#17692e] transition-colors duration-200 flex items-center gap-2 text-base">
              <span className="text-xl leading-none">+</span> Create Thread
            </button>
          </Link>
        </div>
        <div className="flex items-center gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${tab === 'published' ? 'bg-white text-black shadow-sm' : 'bg-[#f1f2f4] text-black/60'}`}
            onClick={() => setTab('published')}
          >
            Published Threads
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${tab === 'drafts' ? 'bg-white text-black shadow-sm' : 'bg-[#f1f2f4] text-black/60'}`}
            onClick={() => setTab('drafts')}
          >
            Drafts
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center mt-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a7f37]"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center mt-24">
            <span className="text-red-600 font-semibold mb-2">{error}</span>
            <button 
              onClick={() => window.location.reload()}
              className="text-[#1a7f37] underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* Drafts Tab */}
            {tab === 'drafts' && (
              <div className="w-full flex flex-col gap-6 mt-8">
                {draftThreads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center mt-24">
                    <span className="text-xl font-semibold text-black mb-2">No drafts yet</span>
                    <span className="text-gray-500 mb-6">Start a thread to save a draft</span>
                    <Link href="/create">
                      <button className="bg-[#1a7f37] text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#17692e] transition-colors duration-200 flex items-center gap-2 text-base">
                        <span className="text-xl leading-none">+</span> Create Thread
                      </button>
                    </Link>
                  </div>
                ) : (
                  draftThreads.map(thread => (
                    <div key={thread.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-black">{thread.title}</h3>
                        <div className="flex items-center gap-3">
                          <Link href={`/create?id=${thread.id}`}>
                            <button className="px-4 py-2 rounded-lg font-semibold bg-[#e6f4ea] text-[#1a7f37] border border-[#1a7f37] hover:bg-[#1a7f37] hover:text-white transition-colors duration-200">
                              Edit
                            </button>
                          </Link>
                          <button
                            className="px-4 py-2 rounded-lg font-semibold bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors duration-200"
                            onClick={() => setDeleteThreadId(thread.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Last edited: {new Date(thread.updated_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Published Threads Tab */}
            {tab === 'published' && (
              <div className="w-full flex flex-col gap-6 mt-8">
                {publishedThreads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center mt-24">
                    <span className="text-xl font-semibold text-black mb-2">No published threads yet</span>
                    <span className="text-gray-500 mb-6">Create and publish your first thread</span>
                    <Link href="/create">
                      <button className="bg-[#1a7f37] text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#17692e] transition-colors duration-200 flex items-center gap-2 text-base">
                        <span className="text-xl leading-none">+</span> Create Thread
                      </button>
                    </Link>
                  </div>
                ) : (
                  publishedThreads.map(thread => (
                    <div key={thread.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-black">{thread.title}</h3>
                        <div className="flex items-center gap-3">
                          <Link href={`/create?id=${thread.id}`}>
                            <button className="px-4 py-2 rounded-lg font-semibold bg-[#e6f4ea] text-[#1a7f37] border border-[#1a7f37] hover:bg-[#1a7f37] hover:text-white transition-colors duration-200">
                              View
                            </button>
                          </Link>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Published: {new Date(thread.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {deleteThreadId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] max-w-xs border border-[#e5e7eb] relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl" onClick={() => setDeleteThreadId(null)}>&times;</button>
              <h3 className="text-lg font-bold mb-2 text-[#1a7f37]">Delete Thread</h3>
              <div className="text-gray-700 mb-4 text-center">Are you sure you want to delete this thread? This action cannot be undone.</div>
              <div className="flex gap-4">
                <button className="px-5 py-2 rounded-lg font-semibold bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200" onClick={() => {
                  if (deleteThreadId !== null) handleDeleteThread(deleteThreadId);
                  setDeleteThreadId(null);
                }}>Yes</button>
                <button className="px-5 py-2 rounded-lg font-semibold bg-white text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#e6f4ea] transition-colors duration-200" onClick={() => setDeleteThreadId(null)}>No</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 