'use client';

import { useState, useEffect } from 'react';

interface Booking {
  id: string;
  clinic_name: string;
  location: string;
  email: string;
  phone: string;
  preferred_date: string;
  message: string;
  created_at: string;
}

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchBookings();
    // Poll for new bookings every 30 seconds
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Clinic Name', 'Location', 'Email', 'Phone', 'Preferred Date', 'Message', 'Submitted'],
      ...bookings.map((b) => [
        b.clinic_name,
        b.location,
        b.email,
        b.phone,
        b.preferred_date,
        b.message,
        new Date(b.created_at).toLocaleString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="site-shell min-h-screen text-slate-50">
      <div className="container mx-auto max-w-6xl px-6 py-8 lg:px-10 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-white mb-2">Booking Dashboard</h1>
            <p className="text-slate-400">Manage demo requests and client information</p>
          </div>
          <a href="/" className="button button-secondary">
            ← Back
          </a>
        </div>

        {/* Stats */}
        <div className="grid gap-4 lg:grid-cols-3 mb-8">
          <div className="metric-card">
            <span className="metric-label">Total Bookings</span>
            <strong className="metric-value">{bookings.length}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">This Month</span>
            <strong className="metric-value">
              {bookings.filter((b) => {
                const date = new Date(b.created_at);
                const now = new Date();
                return (
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear()
                );
              }).length}
            </strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Unique Locations</span>
            <strong className="metric-value">
              {new Set(bookings.map((b) => b.location)).size}
            </strong>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={fetchBookings}
            className="button button-secondary"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleExport}
            className="button button-secondary"
          >
            📥 Export CSV
          </button>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="section-shell text-center py-12">
            <p className="text-slate-400">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="section-shell text-center py-12">
            <p className="text-slate-400">No bookings yet. Share your demo link to get started!</p>
          </div>
        ) : (
          <div className="section-shell overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Clinic</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Location</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Contact</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Preferred Date</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Submitted</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-white">{booking.clinic_name}</p>
                      {booking.message && (
                        <p className="text-xs text-slate-400 mt-1 truncate">{booking.message}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{booking.location}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <a
                          href={`mailto:${booking.email}`}
                          className="block text-cyan-300 hover:text-cyan-200 text-xs"
                        >
                          {booking.email}
                        </a>
                        <a
                          href={`tel:${booking.phone}`}
                          className="block text-cyan-300 hover:text-cyan-200 text-xs"
                        >
                          {booking.phone}
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {new Date(booking.preferred_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`mailto:${booking.email}`}
                        className="text-cyan-300 hover:text-cyan-200 text-xs font-medium"
                      >
                        Email
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
