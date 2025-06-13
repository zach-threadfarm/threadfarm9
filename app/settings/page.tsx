"use client";

import DashboardNav from '../components/DashboardNav';
import { Twitter, Instagram } from 'lucide-react';
import { useState } from 'react';

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

export default function SettingsPage() {
  const [connected, setConnected] = useState<'x' | 'insta' | null>(null);
  const [feedback, setFeedback] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('Alex Brown');
  const [profileEmail, setProfileEmail] = useState('alex.brown@email.com');
  const [tempName, setTempName] = useState(profileName);
  const [tempEmail, setTempEmail] = useState(profileEmail);
  const [modal, setModal] = useState<'upgrade' | 'cancel' | 'review' | 'connect-x' | 'disconnect-x' | 'connect-insta' | 'disconnect-insta' | null>(null);
  const [currentPlan, setCurrentPlan] = useState<'Starter' | 'Growth' | 'Scale'>('Growth');
  const planPrices = { Starter: 14.99, Growth: 29, Scale: 59 };
  const renewalDate = '2024-08-15';

  const handleUpgrade = (plan: 'Starter' | 'Growth' | 'Scale') => {
    setCurrentPlan(plan);
    setModal(null);
    showToast(`Upgraded to ${plan} (dummy)`);
  };
  const handleCancel = () => {
    setCurrentPlan('Starter');
    setModal(null);
    showToast('Subscription cancelled (dummy)');
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8f4]">
      <DashboardNav />
      <main className="flex-1 ml-64 px-10 py-10">
        <h1 className="text-3xl font-extrabold text-black mb-10">Settings</h1>
        {/* User Profile Section */}
        <section className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row items-center gap-8 border border-[#f3f4f6] mb-10">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-[#e6f4ea] flex items-center justify-center text-4xl font-bold text-[#1a7f37] border-2 border-[#1a7f37]">
              {/* Avatar Placeholder */}
              <span>{profileName.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            {editingProfile ? (
              <>
                <input
                  className="border border-gray-200 rounded-lg px-4 py-2 text-lg font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#1a7f37]"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                />
                <input
                  className="border border-gray-200 rounded-lg px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a7f37]"
                  value={tempEmail}
                  onChange={e => setTempEmail(e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-4 py-2 rounded-lg font-semibold bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200"
                    onClick={() => {
                      setProfileName(tempName);
                      setProfileEmail(tempEmail);
                      setEditingProfile(false);
                      showToast('Profile updated (dummy)');
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg font-semibold bg-white text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#e6f4ea] transition-colors duration-200"
                    onClick={() => {
                      setTempName(profileName);
                      setTempEmail(profileEmail);
                      setEditingProfile(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-lg font-semibold text-black">{profileName}</div>
                <div className="text-gray-500 text-base">{profileEmail}</div>
                <button
                  className="mt-2 px-4 py-2 rounded-lg font-semibold bg-white text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#e6f4ea] transition-colors duration-200 w-max"
                  onClick={() => setEditingProfile(true)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </section>
        {/* Connected Accounts Section */}
        <section className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-6 border border-[#f3f4f6] mb-10">
          <h2 className="text-xl font-bold text-[#1a7f37] mb-4">Connected Accounts</h2>
          <div className="flex flex-col gap-4">
            {/* X (Twitter) */}
            <div className="flex items-center gap-4 p-4 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl">
              <Twitter size={28} className="text-[#1a7f37]" />
              <div className="flex-1">
                <div className="font-semibold text-black">@dummy_x_user</div>
                <div className="text-xs text-gray-500">X (Twitter)</div>
              </div>
              {connected === 'x' ? (
                <button
                  className="px-5 py-2 rounded-lg font-semibold bg-[#e6f4ea] text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#1a7f37] hover:text-white transition-colors duration-200"
                  onClick={() => setModal('disconnect-x')}
                >
                  Disconnect
                </button>
              ) : (
                <button
                  className="px-5 py-2 rounded-lg font-semibold bg-white text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#e6f4ea] transition-colors duration-200"
                  onClick={() => setModal('connect-x')}
                  disabled={connected === 'insta'}
                >
                  Connect
                </button>
              )}
            </div>
            {/* Instagram Threads */}
            <div className="flex items-center gap-4 p-4 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl">
              <Instagram size={28} className="text-[#1a7f37]" />
              <div className="flex-1">
                <div className="font-semibold text-black">@dummy_insta_user</div>
                <div className="text-xs text-gray-500">Instagram Threads</div>
              </div>
              {connected === 'insta' ? (
                <button
                  className="px-5 py-2 rounded-lg font-semibold bg-[#e6f4ea] text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#1a7f37] hover:text-white transition-colors duration-200"
                  onClick={() => setModal('disconnect-insta')}
                >
                  Disconnect
                </button>
              ) : (
                <button
                  className="px-5 py-2 rounded-lg font-semibold bg-white text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#e6f4ea] transition-colors duration-200"
                  onClick={() => setModal('connect-insta')}
                  disabled={connected === 'x'}
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </section>
        {/* Manage Subscription Section */}
        <section className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-6 border border-[#f3f4f6] mb-10">
          <h2 className="text-xl font-bold text-[#1a7f37] mb-4">Manage Subscription</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-black">Current Plan:</span>
              <span className="px-3 py-1 rounded-full bg-[#e6f4ea] text-[#1a7f37] font-semibold text-sm">{currentPlan}</span>
            </div>
            <div className="flex gap-4 mt-2">
              <button className="px-5 py-2 rounded-lg font-semibold bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200" onClick={() => setModal('upgrade')}>Upgrade</button>
              <button className="px-5 py-2 rounded-lg font-semibold bg-white text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#e6f4ea] transition-colors duration-200" onClick={() => setModal('cancel')}>Cancel</button>
              <button className="px-5 py-2 rounded-lg font-semibold bg-white text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#e6f4ea] transition-colors duration-200" onClick={() => setModal('review')}>Review</button>
            </div>
          </div>
        </section>
        {/* Subscription Modals */}
        {modal === 'upgrade' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[340px] max-w-xs border border-[#e5e7eb] relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl" onClick={() => setModal(null)}>&times;</button>
              <h3 className="text-lg font-bold mb-2 text-[#1a7f37]">Upgrade Plan</h3>
              <div className="flex flex-col gap-4 w-full">
                {(['Starter', 'Growth', 'Scale'] as const).map(plan => (
                  <div key={plan} className={`flex items-center justify-between p-4 rounded-xl border ${currentPlan === plan ? 'border-[#1a7f37] bg-[#e6f4ea]' : 'border-[#e5e7eb] bg-[#f8fafc]' }`}>
                    <div>
                      <div className="font-semibold text-black">{plan}</div>
                      <div className="text-xs text-gray-500">${planPrices[plan]} / month</div>
                    </div>
                    {currentPlan === plan ? (
                      <span className="px-3 py-1 rounded-full bg-[#1a7f37] text-white font-semibold text-xs">Current</span>
                    ) : (
                      <button className="px-4 py-2 rounded-lg font-semibold bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200" onClick={() => handleUpgrade(plan)}>Upgrade</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {modal === 'cancel' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] max-w-xs border border-[#e5e7eb] relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl" onClick={() => setModal(null)}>&times;</button>
              <h3 className="text-lg font-bold mb-2 text-[#1a7f37]">Cancel Subscription</h3>
              <div className="text-gray-700 mb-4">Are you sure you want to cancel your subscription?</div>
              <div className="flex gap-4">
                <button className="px-5 py-2 rounded-lg font-semibold bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200" onClick={handleCancel}>Yes</button>
                <button className="px-5 py-2 rounded-lg font-semibold bg-white text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#e6f4ea] transition-colors duration-200" onClick={() => setModal(null)}>No</button>
              </div>
            </div>
          </div>
        )}
        {modal === 'review' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] max-w-xs border border-[#e5e7eb] relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl" onClick={() => setModal(null)}>&times;</button>
              <h3 className="text-lg font-bold mb-2 text-[#1a7f37]">Subscription Details</h3>
              <div className="w-full flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-black">Plan:</span>
                  <span className="text-[#1a7f37] font-semibold">{currentPlan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-black">Price:</span>
                  <span className="text-[#1a7f37] font-semibold">${planPrices[currentPlan]} / month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-black">Renews:</span>
                  <span className="text-[#1a7f37] font-semibold">{renewalDate}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Connected Accounts Modals */}
        {modal === 'connect-x' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] max-w-xs border border-[#e5e7eb] relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl" onClick={() => setModal(null)}>&times;</button>
              <Twitter size={32} className="text-[#1a7f37] mb-2" />
              <h3 className="text-lg font-bold mb-2 text-[#1a7f37]">Connect to X (Twitter)</h3>
              <div className="text-gray-700 mb-4 text-center">You'll be redirected to X to authorize your account.</div>
              <button className="px-5 py-2 rounded-lg font-semibold bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200 w-full" onClick={() => { setConnected('x'); setModal(null); showToast('Connected to X (dummy)'); }}>Connect</button>
            </div>
          </div>
        )}
        {modal === 'disconnect-x' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] max-w-xs border border-[#e5e7eb] relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl" onClick={() => setModal(null)}>&times;</button>
              <Twitter size={32} className="text-[#1a7f37] mb-2" />
              <h3 className="text-lg font-bold mb-2 text-[#1a7f37]">Disconnect X (Twitter)</h3>
              <div className="text-gray-700 mb-4 text-center">Are you sure you want to disconnect <span className="font-semibold">@dummy_x_user</span>?</div>
              <div className="flex gap-4">
                <button className="px-5 py-2 rounded-lg font-semibold bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200" onClick={() => { setConnected(null); setModal(null); showToast('Disconnected from X (dummy)'); }}>Yes</button>
                <button className="px-5 py-2 rounded-lg font-semibold bg-white text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#e6f4ea] transition-colors duration-200" onClick={() => setModal(null)}>No</button>
              </div>
            </div>
          </div>
        )}
        {modal === 'connect-insta' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] max-w-xs border border-[#e5e7eb] relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl" onClick={() => setModal(null)}>&times;</button>
              <Instagram size={32} className="text-[#1a7f37] mb-2" />
              <h3 className="text-lg font-bold mb-2 text-[#1a7f37]">Connect to Instagram Threads</h3>
              <div className="text-gray-700 mb-4 text-center">You'll be redirected to Threads to authorize your account.</div>
              <button className="px-5 py-2 rounded-lg font-semibold bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200 w-full" onClick={() => { setConnected('insta'); setModal(null); showToast('Connected to Threads (dummy)'); }}>Connect</button>
            </div>
          </div>
        )}
        {modal === 'disconnect-insta' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[320px] max-w-xs border border-[#e5e7eb] relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl" onClick={() => setModal(null)}>&times;</button>
              <Instagram size={32} className="text-[#1a7f37] mb-2" />
              <h3 className="text-lg font-bold mb-2 text-[#1a7f37]">Disconnect Instagram Threads</h3>
              <div className="text-gray-700 mb-4 text-center">Are you sure you want to disconnect <span className="font-semibold">@dummy_insta_user</span>?</div>
              <div className="flex gap-4">
                <button className="px-5 py-2 rounded-lg font-semibold bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200" onClick={() => { setConnected(null); setModal(null); showToast('Disconnected from Threads (dummy)'); }}>Yes</button>
                <button className="px-5 py-2 rounded-lg font-semibold bg-white text-[#1a7f37] border-2 border-[#1a7f37] hover:bg-[#e6f4ea] transition-colors duration-200" onClick={() => setModal(null)}>No</button>
              </div>
            </div>
          </div>
        )}
        {/* Feedback Section */}
        <section className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-6 border border-[#f3f4f6] mb-10">
          <h2 className="text-xl font-bold text-[#1a7f37] mb-4">Feedback</h2>
          <textarea
            className="w-full min-h-[100px] max-h-[200px] resize-vertical border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#1a7f37] bg-[#f8fafc] placeholder:text-gray-400 shadow-sm"
            placeholder="Report any issues or feedback you have here..."
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
          />
          <button
            className="self-end px-6 py-2 rounded-lg font-semibold shadow-md bg-[#1a7f37] text-white hover:bg-[#17692e] transition-colors duration-200"
            onClick={() => { setFeedback(''); showToast('Feedback submitted (dummy)'); }}
            disabled={!feedback.trim()}
          >
            Submit
          </button>
        </section>
      </main>
    </div>
  );
} 