"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetSent(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setResetSent(true);
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
        <h1 className="text-2xl font-bold mb-6 text-[#1a7f37]">Welcome back to Threadfarm</h1>
        {resetSent ? (
          <div className="w-full text-center">
            <div className="text-[#1a7f37] font-semibold mb-4">Password reset email sent!</div>
            <p className="text-gray-600 mb-6">
              Please check your email ({email}) and click the reset link to set a new password.
            </p>
            <button
              onClick={() => setResetSent(false)}
              className="text-[#1a7f37] font-semibold hover:underline"
            >
              Back to login
            </button>
          </div>
        ) : (
          <>
            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a7f37] text-black"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a7f37] text-black"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <button
                type="submit"
                className="bg-[#1a7f37] text-white font-semibold py-3 rounded-lg hover:bg-[#17692e] transition-colors duration-200 mt-2 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="mt-6 text-sm text-gray-600">
              <button
                onClick={handleResetPassword}
                className="text-[#1a7f37] font-semibold hover:underline"
                disabled={loading}
              >
                Forgot your password?
              </button>
              <div className="mt-4">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[#1a7f37] font-semibold hover:underline">Sign up</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 