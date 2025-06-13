"use client";

import DashboardNav from '../components/DashboardNav';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

type Draft = {
  id: number;
  title: string;
  step: number;
  lastEdited: string;
};

export default function DashboardPage() {
  const [drafts, setDrafts] = useState<Draft[]>([
    // Example dummy draft
    // { id: 1, title: 'How to grow tomatoes', step: 3, lastEdited: '2024-07-01 14:32' },
  ]);
  const [tab, setTab] = useState<'published' | 'drafts'>(drafts.length > 0 ? 'drafts' : 'published');
  const [deleteDraftId, setDeleteDraftId] = useState<number | null>(null);
  const router = useRouter();

  // Load drafts from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('threadfarm_drafts');
      if (stored) setDrafts(JSON.parse(stored));
    }
  }, []);

  // When deleting, update localStorage
  const handleDeleteDraft = (id: number) => {
    setDrafts(drafts => {
      const updated = drafts.filter(d => d.id !== id);
      localStorage.setItem('threadfarm_drafts', JSON.stringify(updated));
      return updated;
    });
  };

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
        {/* Drafts Tab */}
        {tab === 'drafts' && (
          <div className="w-full flex flex-col gap-6 mt-8">
            {drafts.length === 0 ? (
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
              drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between bg-white border border-[#e5e7eb] rounded-xl px-6 py-4 shadow-sm">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-black">{draft.title}</span>
                    <span className="text-xs text-gray-500">Step: {draft.step} &middot; Last edited: {draft.lastEdited}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="px-5 py-2 rounded-lg font-semibold bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200"
                      onClick={() => router.push(`/create?draft=${draft.id}`)}
                    >
                      Resume
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-[#e6f4ea] transition-colors"
                      onClick={() => setDeleteDraftId(draft.id)}
                      aria-label="Delete draft"
                    >
                      <Trash2 size={20} className="text-[#1a7f37]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {/* Delete Draft Modal */}
        {deleteDraftId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] max-w-xs border border-[#e5e7eb] relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl" onClick={() => setDeleteDraftId(null)}>&times;</button>
              <h3 className="text-lg font-bold mb-2 text-[#1a7f37]">Delete Draft</h3>
              <div className="text-gray-700 mb-4 text-center">Are you sure you want to delete this draft? This action cannot be undone.</div>
              <div className="flex gap-4">
                <button className="px-5 py-2 rounded-lg font-semibold bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200" onClick={() => {
                  if (deleteDraftId !== null) handleDeleteDraft(deleteDraftId);
                  setDeleteDraftId(null);
                }}>Yes</button>
                <button className="px-5 py-2 rounded-lg font-semibold bg-white text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#e6f4ea] transition-colors duration-200" onClick={() => setDeleteDraftId(null)}>No</button>
              </div>
            </div>
          </div>
        )}
        {/* Published Threads Tab (unchanged) */}
        {tab === 'published' && (
          <div className="flex flex-col items-center justify-center mt-24">
            <span className="text-xl font-semibold text-black mb-2">No threads yet</span>
            <span className="text-gray-500 mb-6">Create your first thread to get started</span>
            <Link href="/create">
              <button className="bg-[#1a7f37] text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#17692e] transition-colors duration-200 flex items-center gap-2 text-base">
                <span className="text-xl leading-none">+</span> Create Thread
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 