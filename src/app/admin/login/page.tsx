'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('rohajohn54@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/admin');
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-shell min-h-screen text-slate-50">
      <div className="container mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="section-shell">
            <p className="section-kicker">Admin access</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">Sign in to the N4N0 dashboard.</h1>
            <p className="mt-4 max-w-lg text-lg leading-8 text-slate-300">
              View clinic activity, send updates and invoices, and monitor revenue and expense trends from one place.
            </p>
            <div className="mt-8 space-y-3 text-sm text-slate-400">
              <p>Use your admin email and password.</p>
              <p>Session expires automatically after 12 hours.</p>
              <p>Access to this page is protected by a signed session cookie.</p>
            </div>
          </section>

          <section className="section-shell">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                  placeholder="Enter your admin password"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="button button-primary w-full disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <a href="/" className="button button-secondary w-full">
                Back to website
              </a>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
