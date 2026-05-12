'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/brand-logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'setup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = mode === 'setup' ? '/api/admin/setup' : '/api/admin/login';
      const payload =
        mode === 'setup'
          ? { email, password, fullName, setupKey }
          : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Invalid credentials');
      }

      if (mode === 'setup') {
        setSuccess('Admin account created successfully. Redirecting...');
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
            <BrandLogo compact className="mb-6" />
            <p className="section-kicker">Admin access</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">Control center access for N4N0.</h1>
            <p className="mt-4 max-w-lg text-lg leading-8 text-slate-300">
              View clinic activity, send updates and invoices, and monitor revenue and expense trends from one place.
            </p>
            <div className="mt-8 space-y-3 text-sm text-slate-400">
              <p>Use your admin email and password to sign in.</p>
              <p>Session expires automatically after 12 hours.</p>
              <p>If this is your first time, switch to account setup and create your admin user in the database.</p>
              <p>
                The setup key is the <span className="text-white">ADMIN_SETUP_KEY</span> value in your local `.env.local` file.
              </p>
            </div>
          </section>

          <section className="section-shell">
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccess('');
                }}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  mode === 'login' ? 'bg-cyan-300/20 text-cyan-100' : 'text-slate-300'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('setup');
                  setError('');
                  setSuccess('');
                }}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  mode === 'setup' ? 'bg-cyan-300/20 text-cyan-100' : 'text-slate-300'
                }`}
              >
                First-time setup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'setup' && (
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-200">
                    Full Name (optional)
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                    placeholder="Jane Smith"
                  />
                </div>
              )}

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
                  placeholder={mode === 'setup' ? 'Create a strong password (min 10 chars)' : 'Enter your admin password'}
                />
              </div>

              {mode === 'setup' && (
                <div>
                  <label htmlFor="setupKey" className="mb-2 block text-sm font-medium text-slate-200">
                    Setup Key
                  </label>
                  <input
                    id="setupKey"
                    type="password"
                    value={setupKey}
                    onChange={(event) => setSetupKey(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                    placeholder="Enter ADMIN_SETUP_KEY"
                  />
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-200">
                  {success}
                </div>
              )}

              <button type="submit" disabled={loading} className="button button-primary w-full disabled:opacity-50">
                {loading ? 'Please wait...' : mode === 'setup' ? 'Create admin account' : 'Sign in'}
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
