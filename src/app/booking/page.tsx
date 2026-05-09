'use client';

import { useState } from 'react';

export default function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
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

    try {
      // For now, log to console and show success
      // In production, send to an API endpoint
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setFormData({
        clinicName: '',
        location: '',
        email: '',
        phone: '',
        preferredDate: '',
        message: '',
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-shell min-h-screen text-slate-50">
      <div className="container mx-auto max-w-4xl px-6 py-8 lg:px-10 lg:py-12">
        {/* Back link */}
        <a href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8">
          ← Back to home
        </a>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-semibold leading-tight text-white mb-4">Book Your Demo</h1>
          <p className="text-lg text-slate-300">
            Tell us about your clinic and we'll schedule a personalized walkthrough of N4N0.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="section-shell max-w-2xl">
          {submitted && (
            <div className="mb-6 p-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10">
              <p className="text-emerald-200 font-medium">✓ Thank you! We'll contact you soon.</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Clinic Name */}
            <div>
              <label htmlFor="clinicName" className="block text-sm font-medium text-slate-200 mb-2">
                Clinic / Business Name *
              </label>
              <input
                type="text"
                id="clinicName"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/30"
                placeholder="e.g., Smile Dental Clinic"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-200 mb-2">
                City / Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/30"
                placeholder="e.g., New York, NY"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/30"
                placeholder="you@clinic.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-200 mb-2">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/30"
                placeholder="+1 (000) 000-0000"
              />
            </div>

            {/* Preferred Date */}
            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium text-slate-200 mb-2">
                Preferred Demo Date *
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/30"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-200 mb-2">
                Additional Notes (optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/30 resize-none"
                placeholder="Tell us a bit about your clinic or any specific questions..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="button button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Request Demo'}
              </button>
              <a href="/" className="button button-secondary">
                Cancel
              </a>
            </div>
          </div>

          {/* Footer text */}
          <div className="mt-8 pt-6 border-t border-white/8">
            <p className="text-sm text-slate-400">
              We typically respond within 24 hours. Questions? Email us at{' '}
              <a href="mailto:hello@yourdomain.com" className="text-cyan-300 hover:text-cyan-200">
                hello@yourdomain.com
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
