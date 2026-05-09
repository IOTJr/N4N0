'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminOverview, ClinicOverview } from '@/lib/admin-overview';

interface AdminDashboardProps {
  initialData: AdminOverview;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
}

export default function AdminDashboard({ initialData }: AdminDashboardProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [selectedClinicId, setSelectedClinicId] = useState(initialData.clinics[0]?.id ?? '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('Clinic update from N4N0');
  const [emailBody, setEmailBody] = useState('Here is your latest update from the N4N0 team.');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [clinicDraft, setClinicDraft] = useState<ClinicOverview | null>(initialData.clinics[0] ?? null);

  useEffect(() => {
    setData(initialData);
    if (!selectedClinicId && initialData.clinics[0]) {
      setSelectedClinicId(initialData.clinics[0].id);
    }
    if (initialData.clinics.length > 0) {
      const current = initialData.clinics.find((clinic) => clinic.id === selectedClinicId) ?? initialData.clinics[0];
      setClinicDraft(current);
      if (current) {
        setInvoiceAmount(String(Math.round(current.monthlyRevenue + current.outstandingAmount)));
        setInvoiceDueDate(current.nextBillingDate);
        setInvoiceNotes(current.notes);
      }
    }
  }, [initialData, selectedClinicId]);

  const selectedClinic = useMemo(
    () => data.clinics.find((clinic) => clinic.id === selectedClinicId) ?? data.clinics[0] ?? null,
    [data.clinics, selectedClinicId],
  );

  useEffect(() => {
    if (!selectedClinic) {
      return;
    }

    setClinicDraft(selectedClinic);
    setInvoiceAmount(String(Math.round(selectedClinic.monthlyRevenue + selectedClinic.outstandingAmount)));
    setInvoiceDueDate(selectedClinic.nextBillingDate);
    setInvoiceNotes(selectedClinic.notes);
    setEmailSubject(`Update for ${selectedClinic.clinicName}`);
    setEmailBody(`Hello ${selectedClinic.clinicName},\n\nHere is your latest update from the N4N0 team.`);
  }, [selectedClinic]);

  const refreshOverview = async () => {
    const response = await fetch('/api/admin/overview', { cache: 'no-store' });
    if (response.status === 401) {
      router.push('/admin/login');
      return;
    }
    if (!response.ok) {
      throw new Error('Failed to refresh dashboard');
    }
    const nextData: AdminOverview = await response.json();
    setData(nextData);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleSaveClinic = async () => {
    if (!clinicDraft) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clinicDraft),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save clinic');
      }

      setMessage('Clinic updated successfully.');
      await refreshOverview();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save clinic');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedClinic) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedClinic.email,
          clinicName: selectedClinic.clinicName,
          subject: emailSubject,
          message: emailBody,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send email');
      }

      setMessage(`Email sent to ${selectedClinic.clinicName}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!selectedClinic) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedClinic.email,
          clinicName: selectedClinic.clinicName,
          amount: Number(invoiceAmount),
          dueDate: invoiceDueDate,
          period: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
          notes: invoiceNotes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send invoice');
      }

      setMessage(`Invoice sent to ${selectedClinic.clinicName}.`);
      await refreshOverview();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-shell min-h-screen text-slate-50">
      <div className="container mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-kicker">Admin dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Manage clinics, billing, and revenue.</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Send updates, generate invoices, and track the money coming in and the costs going out.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/booking" className="button button-secondary">
              Open booking form
            </a>
            <button onClick={handleLogout} className="button button-primary">
              Logout
            </button>
          </div>
        </header>

        {message && (
          <div className="mb-6 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
            {message}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="metric-card">
            <span className="metric-label">Received revenue</span>
            <strong className="metric-value">{formatCurrency(data.metrics.receivedRevenue)}</strong>
            <p className="metric-detail">Paid invoices collected this cycle.</p>
          </div>
          <div className="metric-card">
            <span className="metric-label">Money coming in</span>
            <strong className="metric-value">{formatCurrency(data.metrics.incomingRevenue)}</strong>
            <p className="metric-detail">Due and pending invoices already in motion.</p>
          </div>
          <div className="metric-card">
            <span className="metric-label">Expenses</span>
            <strong className="metric-value">{formatCurrency(data.metrics.expenses)}</strong>
            <p className="metric-detail">Marketing, software, and operations costs.</p>
          </div>
          <div className="metric-card">
            <span className="metric-label">Net income</span>
            <strong className="metric-value">{formatCurrency(data.metrics.netIncome)}</strong>
            <p className="metric-detail">Revenue minus operating spend.</p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="section-shell">
            <p className="text-sm text-slate-400">Bookings this month</p>
            <p className="mt-3 text-3xl font-semibold text-white">{data.metrics.monthlyBookings}</p>
          </div>
          <div className="section-shell">
            <p className="text-sm text-slate-400">Enrolled clinics</p>
            <p className="mt-3 text-3xl font-semibold text-white">{data.metrics.totalClinics}</p>
          </div>
          <div className="section-shell">
            <p className="text-sm text-slate-400">Overdue invoices</p>
            <p className="mt-3 text-3xl font-semibold text-white">{data.metrics.overdueInvoices}</p>
          </div>
          <div className="section-shell">
            <p className="text-sm text-slate-400">Bookings total</p>
            <p className="mt-3 text-3xl font-semibold text-white">{data.metrics.totalBookings}</p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="section-shell overflow-x-auto">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Clinic roster</h2>
                <p className="mt-1 text-sm text-slate-400">Select a clinic to update details, email them, or send an invoice.</p>
              </div>
              <button onClick={() => refreshOverview().catch((error) => setMessage(error.message))} className="button button-secondary">
                Refresh
              </button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-300">
                  <th className="py-3 pr-4 font-semibold">Clinic</th>
                  <th className="py-3 pr-4 font-semibold">Location</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 pr-4 font-semibold">Next billing</th>
                  <th className="py-3 pr-4 font-semibold">Monthly revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.clinics.map((clinic) => (
                  <tr
                    key={clinic.id}
                    onClick={() => setSelectedClinicId(clinic.id)}
                    className={`cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5 ${
                      selectedClinic?.id === clinic.id ? 'bg-white/5' : ''
                    }`}
                  >
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{clinic.clinicName}</p>
                      <p className="text-xs text-slate-400">{clinic.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{clinic.location}</td>
                    <td className="py-3 pr-4 text-slate-300 capitalize">{clinic.status}</td>
                    <td className="py-3 pr-4 text-slate-300">{formatDate(clinic.nextBillingDate)}</td>
                    <td className="py-3 pr-4 text-slate-300">{formatCurrency(clinic.monthlyRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-6">
            <section className="section-shell">
              <h2 className="text-xl font-semibold text-white">Clinic details</h2>
              {clinicDraft ? (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Clinic name</label>
                      <input
                        value={clinicDraft.clinicName}
                        onChange={(event) => setClinicDraft({ ...clinicDraft, clinicName: event.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Location</label>
                      <input
                        value={clinicDraft.location}
                        onChange={(event) => setClinicDraft({ ...clinicDraft, location: event.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Email</label>
                      <input
                        value={clinicDraft.email}
                        onChange={(event) => setClinicDraft({ ...clinicDraft, email: event.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Phone</label>
                      <input
                        value={clinicDraft.phone}
                        onChange={(event) => setClinicDraft({ ...clinicDraft, phone: event.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Status</label>
                      <select
                        value={clinicDraft.status}
                        onChange={(event) =>
                          setClinicDraft({ ...clinicDraft, status: event.target.value as ClinicOverview['status'] })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                      >
                        <option value="active">active</option>
                        <option value="follow-up">follow-up</option>
                        <option value="paused">paused</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Next billing</label>
                      <input
                        type="date"
                        value={clinicDraft.nextBillingDate}
                        onChange={(event) => setClinicDraft({ ...clinicDraft, nextBillingDate: event.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Monthly revenue</label>
                      <input
                        type="number"
                        value={clinicDraft.monthlyRevenue}
                        onChange={(event) =>
                          setClinicDraft({ ...clinicDraft, monthlyRevenue: Number(event.target.value) })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Outstanding amount</label>
                      <input
                        type="number"
                        value={clinicDraft.outstandingAmount}
                        onChange={(event) =>
                          setClinicDraft({ ...clinicDraft, outstandingAmount: Number(event.target.value) })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Notes</label>
                    <textarea
                      value={clinicDraft.notes}
                      onChange={(event) => setClinicDraft({ ...clinicDraft, notes: event.target.value })}
                      rows={4}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                    />
                  </div>

                  <button onClick={handleSaveClinic} disabled={loading} className="button button-primary w-full disabled:opacity-50">
                    Save clinic
                  </button>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-400">Select a clinic to edit it.</p>
              )}
            </section>

            <section className="section-shell">
              <h2 className="text-xl font-semibold text-white">Send update email</h2>
              <div className="mt-4 space-y-4">
                <input
                  value={emailSubject}
                  onChange={(event) => setEmailSubject(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                  placeholder="Subject"
                />
                <textarea
                  value={emailBody}
                  onChange={(event) => setEmailBody(event.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                  placeholder="Message"
                />
                <button onClick={handleSendEmail} disabled={loading || !selectedClinic} className="button button-secondary w-full disabled:opacity-50">
                  Send update
                </button>
              </div>
            </section>

            <section className="section-shell">
              <h2 className="text-xl font-semibold text-white">Create invoice</h2>
              <div className="mt-4 space-y-4">
                <input
                  type="number"
                  value={invoiceAmount}
                  onChange={(event) => setInvoiceAmount(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                  placeholder="Invoice amount"
                />
                <input
                  type="date"
                  value={invoiceDueDate}
                  onChange={(event) => setInvoiceDueDate(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                />
                <textarea
                  value={invoiceNotes}
                  onChange={(event) => setInvoiceNotes(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-300/50 focus:outline-none"
                  placeholder="Invoice notes"
                />
                <button onClick={handleSendInvoice} disabled={loading || !selectedClinic} className="button button-primary w-full disabled:opacity-50">
                  Send invoice
                </button>
              </div>
            </section>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="section-shell">
            <h2 className="text-xl font-semibold text-white">Revenue vs expense</h2>
            <div className="mt-6 space-y-4">
              {data.revenueSeries.map((point) => (
                <div key={point.label} className="space-y-2 rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{point.label}</span>
                    <span>{formatCurrency(point.revenue - point.expense)}</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-400">Revenue</p>
                      <p className="text-white">{formatCurrency(point.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Expense</p>
                      <p className="text-white">{formatCurrency(point.expense)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-shell">
            <h2 className="text-xl font-semibold text-white">Recent invoices</h2>
            <div className="mt-4 space-y-3">
              {data.invoices.slice(0, 6).map((invoice) => (
                <div key={invoice.id} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{invoice.clinicName}</p>
                      <p className="text-sm text-slate-400">Due {formatDate(invoice.dueDate)}</p>
                      <p className="mt-1 text-xs text-slate-400">{invoice.notes}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{formatCurrency(invoice.amount)}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">{invoice.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 section-shell">
          <h2 className="text-xl font-semibold text-white">Recent bookings</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.recentBookings.map((booking) => (
              <div key={`${booking.clinic_name}-${booking.created_at}`} className="rounded-2xl bg-white/5 p-4">
                <p className="font-medium text-white">{booking.clinic_name}</p>
                <p className="text-sm text-slate-400">{booking.location}</p>
                <p className="mt-2 text-xs text-slate-400">{formatDate(booking.created_at)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
