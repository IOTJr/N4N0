'use client';

import { useState } from 'react';

export default function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    clinicName: '',
    location: '',
    email: '',
    phone: '',
    preferredDate: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      setSubmitted(true);
      setFormData({
        clinicName: '',
        location: '',
        email: '',
        phone: '',
        preferredDate: '',
        message: '',
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-shell min-h-screen text-slate-50">
      <div className="container mx-auto max-w-4xl px-6 py-8 lg:px-10 lg:py-12">
        <a href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8">
          ← Back to home
        </a>

        <div className="mb-12">
          <h1 className="text-5xl font-semibold leading-tight text-white mb-4">Book Your Demo</h1>
          <p className="text-lg text-slate-300">
            Tell us about your clinic and we&apos;ll schedule a personalized walkthrough of N4N0.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="section-shell max-w-2xl">
          {submitted && (
            <div className="mb-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <p className="font-medium text-emerald-200">Thank you. We&apos;ll contact you within 24 hours.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-300/20 bg-red-300/10 p-4">
              <p className="font-medium text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="clinicName" className="mb-2 block text-sm font-medium text-slate-200">
                Clinic / Business Name *
              </label>
              <input
                type="text"
                id="clinicName"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                placeholder="e.g., Smile Dental Clinic"
              />
            </div>

            <div>
              <label htmlFor="location" className="mb-2 block text-sm font-medium text-slate-200">
                City / Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                placeholder="e.g., New York, NY"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                placeholder="you@clinic.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-200">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                placeholder="+1 (000) 000-0000"
              />
            </div>

            <div>
              <label htmlFor="preferredDate" className="mb-2 block text-sm font-medium text-slate-200">
                Preferred Demo Date *
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-200">
                Additional Notes (optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                placeholder="Tell us a bit about your clinic or any specific questions..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="button button-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Request Demo'}
              </button>
              <a href="/" className="button button-secondary">
                Cancel
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-white/8 pt-6">
            <p className="text-sm text-slate-400">
              We typically respond within 24 hours. Questions? Email us at{' '}
              <a href="mailto:hello@yourdomain.com" className="text-cyan-300 hover:text-cyan-200">
                hello@yourdomain.com
              </a>
            </p>
          </div>
        </form>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold text-white">Or Schedule Directly</h2>
          <div className="section-shell">
            <p className="mb-6 text-center text-slate-300">
              Prefer to book directly? Use the calendar below to select your time.
            </p>
            <div
              className="calendly-inline-widget"
              data-url={process.env.NEXT_PUBLIC_CALENDLY_URL}
              style={{ minWidth: '320px', height: '700px' }}
            />
            <script
              type="text/javascript"
              src="https://assets.calendly.com/assets/external/widget.js"
              async
            />
          </div>
        </div>
      </div>
    </div>
  );
}
