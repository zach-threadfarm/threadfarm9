"use client";

import DashboardNav from '../components/DashboardNav';
import { useState, useRef, useState as useModalState } from 'react';
import { Upload, FileText, Youtube, RefreshCw, Twitter, Instagram } from 'lucide-react';
import { useEffect } from 'react';

const steps = [
  'Upload',
  'Transcribe',
  'Settings',
  'Edit & Enhance',
  'Publish',
];

// Draft type for localStorage
type Draft = {
  id: number;
  title: string;
  step: number;
  lastEdited: string;
};

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-[#1a7f37] text-white px-6 py-3 rounded-xl shadow-lg z-50 text-base font-semibold animate-fade-in-out';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => document.body.removeChild(toast), 400);
  }, 1500);
}

// Dummy initial post content generator
function getInitialPosts(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    text: `This is the content for post #${i + 1}. Edit as needed.`,
    image: null as string | null,
  }));
}

function saveDraftToStorage(draft: Draft) {
  const drafts = JSON.parse(localStorage.getItem('threadfarm_drafts') || '[]');
  const idx = drafts.findIndex((d: Draft) => d.id === draft.id);
  if (idx !== -1) {
    drafts[idx] = draft;
  } else {
    drafts.push(draft);
  }
  localStorage.setItem('threadfarm_drafts', JSON.stringify(drafts));
}

function getDraftIdFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('draft');
  return id ? Number(id) : null;
}

const getDraftTitle = (transcript: string) => transcript.trim().split(' ').slice(0, 6).join(' ') + (transcript.trim().split(' ').length > 6 ? '...' : '');

const getNow = () => new Date().toISOString().replace('T', ' ').slice(0, 16);

export default function CreateThreadPage() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [transcript, setTranscript] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque.\n\nSed euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque.');
  const [postCount, setPostCount] = useState(10);
  const [charCount, setCharCount] = useState(280);
  const [style, setStyle] = useState<string | null>(null);

  // Step 4: Edit & Enhance state
  const [posts, setPosts] = useState(() => getInitialPosts(postCount));
  const [showImageModal, setShowImageModal] = useModalState(false);
  const [activePostIdx, setActivePostIdx] = useState<number | null>(null);

  // Step 5: Publish state
  const [postToX, setPostToX] = useState(false);
  const [postToInsta, setPostToInsta] = useState(false);
  const [postStatus, setPostStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [postError, setPostError] = useState('');

  // Draft logic
  const draftId = getDraftIdFromUrl();
  const handleSaveDraft = () => {
    const draft: Draft = {
      id: draftId || Date.now(),
      title: getDraftTitle(transcript),
      step,
      lastEdited: getNow(),
    };
    saveDraftToStorage(draft);
    showToast('Draft saved!');
  };

  // Update posts array if postCount changes (e.g., user goes back and forth)
  useEffect(() => {
    setPosts(prev => {
      if (postCount > prev.length) {
        return [
          ...prev,
          ...getInitialPosts(postCount - prev.length),
        ];
      } else if (postCount < prev.length) {
        return prev.slice(0, postCount);
      }
      return prev;
    });
  }, [postCount]);

  const handleMovePost = (idx: number, dir: 'up' | 'down') => {
    setPosts(prev => {
      const newPosts = [...prev];
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
      [newPosts[idx], newPosts[swapIdx]] = [newPosts[swapIdx], newPosts[idx]];
      return newPosts;
    });
  };

  const handleEditPost = (idx: number, value: string) => {
    setPosts(prev => prev.map((p, i) => i === idx ? { ...p, text: value } : p));
  };

  const handleAddImage = (idx: number) => {
    setActivePostIdx(idx);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
    setActivePostIdx(null);
  };

  const handleDummyImage = (type: 'ai' | 'upload') => {
    if (activePostIdx !== null) {
      setPosts(prev => prev.map((p, i) => i === activePostIdx ? { ...p, image: type === 'ai' ? 'ai-image.png' : 'uploaded-image.png' } : p));
    }
    handleCloseModal();
    showToast(type === 'ai' ? 'AI image generated (dummy)' : 'Image uploaded (dummy)');
  };

  // Dummy file preview logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setYoutubeUrl('');
      if (f.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(f));
      } else {
        setPreview(f.name);
      }
    }
  };

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
    setFile(null);
    setPreview(null);
  };

  const isYoutubeUrl = (url: string) => {
    return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
  };

  const canProceed = step === 0
    ? !!file || (youtubeUrl && isYoutubeUrl(youtubeUrl))
    : step === 1
      ? transcript.trim().length > 0
      : step === 2
        ? style !== null
        : true;

  const handlePost = () => {
    // Dummy post logic: randomly succeed or fail
    if (!postToX && !postToInsta) return;
    setTimeout(() => {
      if (Math.random() > 0.3) {
        setPostStatus('success');
      } else {
        setPostStatus('error');
        setPostError('Failed to post due to a network error. Please try again.');
      }
    }, 1000);
  };

  const handleResetStatus = () => {
    setPostStatus('idle');
    setPostError('');
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8f4]">
      <DashboardNav />
      <main className="flex-1 ml-64 px-10 py-10">
        {/* Progress Stepper */}
        <div className="flex items-center gap-6 mb-12 justify-center">
          {steps.map((label, idx) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step === idx ? 'bg-[#1a7f37] text-white border-[#1a7f37]' : 'bg-white text-[#1a7f37] border-[#1a7f37]/40'}`}>{idx + 1}</div>
              <span className={`font-medium ${step === idx ? 'text-[#1a7f37]' : 'text-black/60'}`}>{label}</span>
              {idx < steps.length - 1 && <div className="w-8 h-1 bg-[#e0e0e0] rounded-full mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1: Upload Content */}
        {step === 0 && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center border border-[#f3f4f6] transition-all duration-300">
            <h2 className="text-2xl font-extrabold mb-8 text-[#1a7f37] tracking-tight">Upload your content</h2>
            <div className="w-full flex flex-col gap-5 mb-8">
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-[#1a7f37] rounded-2xl py-12 cursor-pointer bg-[#f8fafc] hover:bg-[#f1f5f9] transition-all duration-200 shadow-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={40} className="text-[#1a7f37] mb-3" />
                <span className="font-semibold text-[#1a7f37] text-lg">Drag & drop or click to upload</span>
                <span className="text-gray-400 text-sm mt-1">Audio, video, or text file</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,video/*,.txt,.md,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="flex items-center gap-2 w-full">
                <Youtube size={22} className="text-[#1a7f37]" />
                <input
                  type="text"
                  placeholder="Paste YouTube URL"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a7f37] bg-[#f8fafc] placeholder:text-gray-400"
                  value={youtubeUrl}
                  onChange={handleYoutubeChange}
                />
              </div>
            </div>
            {/* Preview */}
            {file && (
              <div className="w-full bg-[#f1f5f9] rounded-xl p-4 mb-5 flex items-center gap-3 border border-[#e5e7eb]">
                <FileText size={24} className="text-[#1a7f37]" />
                <span className="text-black font-medium">{file.name}</span>
              </div>
            )}
            {youtubeUrl && isYoutubeUrl(youtubeUrl) && (
              <div className="w-full bg-[#f1f5f9] rounded-xl p-4 mb-5 flex items-center gap-3 border border-[#e5e7eb]">
                <Youtube size={24} className="text-[#1a7f37]" />
                <span className="text-black font-medium">{youtubeUrl}</span>
              </div>
            )}
            <div className="flex w-full justify-between mt-10">
              <button
                className="px-7 py-2.5 rounded-lg font-semibold bg-[#f3f4f6] text-gray-400 border border-[#e5e7eb] cursor-not-allowed shadow-none"
                disabled
              >
                Back
              </button>
              <button
                className={`px-7 py-2.5 rounded-lg font-semibold shadow-md transition-colors duration-200 ${canProceed ? 'bg-[#1a7f37] text-white hover:bg-[#17692e]' : 'bg-[#e5e7eb] text-gray-400 cursor-not-allowed'}`}
                style={{ backgroundColor: canProceed ? '#1a7f37' : '#e5e7eb', color: canProceed ? '#fff' : '#a3a3a3' }}
                disabled={!canProceed}
                onClick={() => canProceed && setStep(1)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Transcribe */}
        {step === 1 && (
          <>
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center border border-[#f3f4f6] transition-all duration-300">
            <h2 className="text-2xl font-extrabold mb-8 text-[#1a7f37] tracking-tight">Edit your transcript</h2>
            <div className="w-full flex flex-col gap-5 mb-8">
              <textarea
                className="w-full min-h-[220px] max-h-[400px] resize-vertical border border-gray-200 rounded-xl px-5 py-4 text-base font-mono focus:outline-none focus:ring-2 focus:ring-[#1a7f37] bg-[#f8fafc] placeholder:text-gray-400 shadow-sm"
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                placeholder="Transcript will appear here..."
              />
              <div className="flex items-center justify-between w-full mt-1">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#e5e7eb] bg-[#f3f4f6] text-[#1a7f37] font-semibold hover:bg-[#e6f4ea] transition-colors duration-200"
                  onClick={() => {
                    showToast('Transcript regenerated (dummy)');
                  }}
                >
                  <RefreshCw size={18} /> Regenerate Transcript
                </button>
                <span className="text-gray-500 text-sm">{transcript.length} characters</span>
              </div>
            </div>
            <div className="flex w-full justify-between mt-10">
              <button
                className="px-7 py-2.5 rounded-lg font-semibold shadow-none bg-[#f3f4f6] text-[#1a7f37] border border-[#e5e7eb] hover:bg-[#e6f4ea] transition-colors duration-200"
                onClick={() => setStep(0)}
              >
                Back
              </button>
              <button
                className={`px-7 py-2.5 rounded-lg font-semibold shadow-md transition-colors duration-200 ${transcript.trim().length > 0 ? 'bg-[#1a7f37] text-white hover:bg-[#17692e]' : 'bg-[#e5e7eb] text-gray-400 cursor-not-allowed'}`}
                style={{ backgroundColor: transcript.trim().length > 0 ? '#1a7f37' : '#e5e7eb', color: transcript.trim().length > 0 ? '#fff' : '#a3a3a3' }}
                disabled={transcript.trim().length === 0}
                onClick={() => transcript.trim().length > 0 && setStep(2)}
              >
                Next
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="px-5 py-2 rounded-lg font-semibold bg-[#e6f4ea] text-[#1a7f37] border border-[#1a7f37] text-sm hover:bg-[#1a7f37] hover:text-white transition-colors duration-200"
              onClick={handleSaveDraft}
            >
              Save Draft
            </button>
          </div>
          </>
        )}

        {/* Step 3: Settings */}
        {step === 2 && (
          <>
          <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center border border-[#f3f4f6] transition-all duration-300">
            <h2 className="text-2xl font-extrabold mb-8 text-[#1a7f37] tracking-tight">Thread Settings</h2>
            <div className="w-full flex flex-col gap-8 mb-8">
              {/* Post Count Slider */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-black mb-1">Number of posts: <span className="text-[#1a7f37] font-bold">{postCount}</span></label>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={postCount}
                  onChange={e => setPostCount(Number(e.target.value))}
                  className="w-full accent-[#1a7f37] h-2 rounded-lg appearance-none bg-[#f3f4f6]"
                />
              </div>
              {/* Character Count Slider */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-black mb-1">Characters per post: <span className="text-[#1a7f37] font-bold">{charCount}</span></label>
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={charCount}
                  onChange={e => setCharCount(Number(e.target.value))}
                  className="w-full accent-[#1a7f37] h-2 rounded-lg appearance-none bg-[#f3f4f6]"
                />
              </div>
              {/* Style Selector */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-black mb-2">Thread style:</label>
                <div className="flex gap-4">
                  {['casual', 'comedic', 'educational'].map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`px-6 py-2 rounded-full border-2 font-semibold capitalize transition-colors duration-200 text-base
                        ${style === option
                          ? 'bg-[#1a7f37] text-white border-[#1a7f37] shadow-md'
                          : 'bg-white text-[#1a7f37] border-[#e5e7eb] hover:bg-[#f3f4f6]'}
                      `}
                      style={style === null ? { backgroundColor: '#f3f4f6', color: '#1a7f37', borderColor: '#e5e7eb' } : {}}
                      onClick={() => setStyle(option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex w-full justify-between mt-10">
              <button
                className="px-7 py-2.5 rounded-lg font-semibold shadow-none bg-[#f3f4f6] text-[#1a7f37] border border-[#e5e7eb] hover:bg-[#e6f4ea] transition-colors duration-200"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className={`px-7 py-2.5 rounded-lg font-semibold shadow-md transition-colors duration-200 ${canProceed ? 'bg-[#1a7f37] text-white hover:bg-[#17692e]' : 'bg-[#e5e7eb] text-gray-400 cursor-not-allowed'}`}
                style={{ backgroundColor: canProceed ? '#1a7f37' : '#e5e7eb', color: canProceed ? '#fff' : '#a3a3a3' }}
                disabled={!canProceed}
                onClick={() => canProceed && setStep(3)}
              >
                Next
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="px-5 py-2 rounded-lg font-semibold bg-[#e6f4ea] text-[#1a7f37] border border-[#1a7f37] text-sm hover:bg-[#1a7f37] hover:text-white transition-colors duration-200"
              onClick={handleSaveDraft}
            >
              Save Draft
            </button>
          </div>
          </>
        )}

        {/* Step 4: Edit & Enhance */}
        {step === 3 && (
          <>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center border border-[#f3f4f6] transition-all duration-300 w-full">
            <h2 className="text-2xl font-extrabold mb-8 text-[#1a7f37] tracking-tight">Edit & Enhance Your Thread</h2>
            <div className="w-full flex flex-col gap-8 mb-8">
              {posts.map((post, idx) => (
                <div key={idx} className="relative bg-[#f8fafc] border border-[#e5e7eb] rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
                  <div className="flex">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 p-1 bg-white/80 rounded-xl shadow-sm">
                      {idx > 0 && (
                        <button
                          className="bg-white border border-[#e5e7eb] rounded-full p-1 shadow hover:bg-[#e6f4ea] transition-colors"
                          onClick={() => handleMovePost(idx, 'up')}
                          aria-label="Move up"
                        >
                          <span className="inline-block rotate-180">▼</span>
                        </button>
                      )}
                      {idx < posts.length - 1 && (
                        <button
                          className="bg-white border border-[#e5e7eb] rounded-full p-1 shadow hover:bg-[#e6f4ea] transition-colors"
                          onClick={() => handleMovePost(idx, 'down')}
                          aria-label="Move down"
                        >
                          <span className="inline-block">▼</span>
                        </button>
                      )}
                    </div>
                    <div className="ml-14 flex-1 flex flex-col gap-3">
                      <textarea
                        className="w-full min-h-[80px] max-h-[200px] resize-vertical border border-gray-200 rounded-xl px-4 py-3 text-base font-mono focus:outline-none focus:ring-2 focus:ring-[#1a7f37] bg-white placeholder:text-gray-400 shadow-sm"
                        value={post.text}
                        onChange={e => handleEditPost(idx, e.target.value)}
                      />
                      {post.image && (
                        <div className="w-full flex items-center gap-2 mt-2">
                          <img src={`/${post.image}`} alt="Post visual" className="w-20 h-20 object-cover rounded-xl border border-[#e5e7eb]" />
                          <span className="text-gray-500 text-xs">(dummy image)</span>
                        </div>
                      )}
                      <button
                        className="mt-2 px-5 py-2 rounded-lg border-2 border-[#1a7f37] text-[#1a7f37] font-semibold bg-white hover:bg-[#e6f4ea] transition-colors duration-200"
                        onClick={() => handleAddImage(idx)}
                      >
                        Add Image
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex w-full justify-between mt-10 gap-4">
              <button
                className="px-7 py-2.5 rounded-lg font-semibold shadow-none bg-[#f3f4f6] text-[#1a7f37] border border-[#e5e7eb] hover:bg-[#e6f4ea] transition-colors duration-200"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                className="px-7 py-2.5 rounded-lg font-semibold shadow-md bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200"
                onClick={() => showToast('Thread saved (dummy)')}
              >
                Save
              </button>
              <button
                className="px-7 py-2.5 rounded-lg font-semibold shadow-md bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200"
                onClick={() => setStep(4)}
              >
                Next
              </button>
            </div>
            {/* Image Modal */}
            {showImageModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] max-w-xs border border-[#e5e7eb]">
                  <h3 className="text-lg font-bold mb-2 text-[#1a7f37]">Add an image</h3>
                  <button
                    className="w-full px-5 py-2 rounded-lg font-semibold bg-[#e6f4ea] text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#1a7f37] hover:text-white transition-colors duration-200"
                    onClick={() => handleDummyImage('ai')}
                  >
                    Generate with AI (dummy)
                  </button>
                  <button
                    className="w-full px-5 py-2 rounded-lg font-semibold bg-white text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#e6f4ea] transition-colors duration-200"
                    onClick={() => handleDummyImage('upload')}
                  >
                    Upload Image (dummy)
                  </button>
                  <button
                    className="mt-2 text-gray-400 hover:text-black text-sm underline"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="px-5 py-2 rounded-lg font-semibold bg-[#e6f4ea] text-[#1a7f37] border border-[#1a7f37] text-sm hover:bg-[#1a7f37] hover:text-white transition-colors duration-200"
              onClick={handleSaveDraft}
            >
              Save Draft
            </button>
          </div>
          </>
        )}

        {/* Step 5: Publish */}
        {step === 4 && (
          <>
          <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center border border-[#f3f4f6] transition-all duration-300">
            <h2 className="text-2xl font-extrabold mb-8 text-[#1a7f37] tracking-tight">Publish Your Thread</h2>
            {/* Compact Preview */}
            <div className="w-full flex flex-col gap-4 mb-8">
              {posts.map((post, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl px-4 py-3">
                  <span className="text-gray-400 font-mono text-xs">{idx + 1}.</span>
                  <span className="flex-1 truncate text-black text-sm">{post.text.slice(0, 60)}{post.text.length > 60 ? '...' : ''}</span>
                  {post.image && <img src={`/${post.image}`} alt="img" className="w-8 h-8 object-cover rounded-md border border-[#e5e7eb]" />}
                </div>
              ))}
            </div>
            {/* Platform Toggles */}
            <div className="w-full flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl">
                <Twitter size={28} className="text-[#1a7f37]" />
                <div className="flex-1">
                  <div className="font-semibold text-black">@dummy_x_user</div>
                  <div className="text-xs text-gray-500">X (Twitter)</div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={postToX} onChange={() => setPostToX(v => !v)} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#1a7f37] transition-colors relative">
                    <div className={`absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow transition-transform ${postToX ? 'translate-x-5' : ''}`}></div>
                  </div>
                </label>
              </div>
              <div className="flex items-center gap-4 p-4 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl">
                <Instagram size={28} className="text-[#1a7f37]" />
                <div className="flex-1">
                  <div className="font-semibold text-black">@dummy_insta_user</div>
                  <div className="text-xs text-gray-500">Instagram Threads</div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={postToInsta} onChange={() => setPostToInsta(v => !v)} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#1a7f37] transition-colors relative">
                    <div className={`absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow transition-transform ${postToInsta ? 'translate-x-5' : ''}`}></div>
                  </div>
                </label>
              </div>
            </div>
            {/* Post/Back Buttons */}
            <div className="flex w-full justify-between mt-10 gap-4">
              <button
                className="px-7 py-2.5 rounded-lg font-semibold shadow-none bg-[#f3f4f6] text-[#1a7f37] border border-[#e5e7eb] hover:bg-[#e6f4ea] transition-colors duration-200"
                onClick={() => setStep(3)}
                disabled={postStatus !== 'idle'}
              >
                Back
              </button>
              <button
                className={`px-7 py-2.5 rounded-lg font-semibold shadow-md transition-colors duration-200 ${postToX || postToInsta ? 'bg-[#1a7f37] text-white hover:bg-[#17692e]' : 'bg-[#e5e7eb] text-gray-400 cursor-not-allowed'}`}
                style={{ backgroundColor: postToX || postToInsta ? '#1a7f37' : '#e5e7eb', color: postToX || postToInsta ? '#fff' : '#a3a3a3' }}
                disabled={!postToX && !postToInsta || postStatus !== 'idle'}
                onClick={handlePost}
              >
                {postStatus === 'idle' ? 'Post' : postStatus === 'success' ? 'Posted!' : 'Try Again'}
              </button>
            </div>
            {/* Success/Error State */}
            {postStatus === 'success' && (
              <div className="mt-8 w-full flex flex-col items-center gap-2">
                <div className="text-green-600 font-bold">Your thread was posted successfully!</div>
                <button className="text-[#1a7f37] underline text-sm mt-1" onClick={handleResetStatus}>Post another thread</button>
              </div>
            )}
            {postStatus === 'error' && (
              <div className="mt-8 w-full flex flex-col items-center gap-2">
                <div className="text-red-600 font-bold">Failed to post your thread.</div>
                <div className="text-gray-500 text-sm">{postError}</div>
                <button className="text-[#1a7f37] underline text-sm mt-1" onClick={handleResetStatus}>Try again</button>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="px-5 py-2 rounded-lg font-semibold bg-[#e6f4ea] text-[#1a7f37] border border-[#1a7f37] text-sm hover:bg-[#1a7f37] hover:text-white transition-colors duration-200"
              onClick={handleSaveDraft}
            >
              Save Draft
            </button>
          </div>
          </>
        )}
      </main>
    </div>
  );
} 