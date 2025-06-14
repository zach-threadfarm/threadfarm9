"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Check if we have a valid reset token in the URL
    const code = searchParams.get('code');
    if (!code) {
      setError('Invalid or expired reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8f4] px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-[#1a7f37]">Reset your password</h1>
        {success ? (
          <div className="w-full text-center">
            <div className="text-[#1a7f37] font-semibold mb-4">Password reset successful!</div>
            <p className="text-gray-600 mb-6">
              Your password has been updated. You will be redirected to the login page shortly.
            </p>
          </div>
        ) : (
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New password"
              className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a7f37] text-black"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a7f37] text-black"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="bg-[#1a7f37] text-white font-semibold py-3 rounded-lg hover:bg-[#17692e] transition-colors duration-200 mt-2 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Resetting password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 