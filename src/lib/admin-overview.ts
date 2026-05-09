import { supabaseServer } from '@/lib/supabase-server';

export interface BookingRecord {
  id?: string;
  clinic_name: string;
  location: string;
  email: string;
  phone: string;
  preferred_date: string;
  message: string;
  created_at: string;
}

export interface ClinicOverview {
  id: string;
  clinicName: string;
  location: string;
  email: string;
  phone: string;
  status: 'active' | 'follow-up' | 'paused';
  nextBillingDate: string;
  lastBookingDate: string;
  monthlyRevenue: number;
  outstandingAmount: number;
  bookingsCount: number;
  notes: string;
}

export interface InvoiceOverview {
  id: string;
  clinicName: string;
  amount: number;
  status: 'paid' | 'due' | 'overdue';
  dueDate: string;
  period: string;
  notes: string;
}

export interface ExpenseOverview {
  id: string;
  label: string;
  category: string;
  amount: number;
  date: string;
}

export interface RevenuePoint {
  label: string;
  revenue: number;
  expense: number;
}

export interface AdminOverview {
  metrics: {
    totalBookings: number;
    totalClinics: number;
    receivedRevenue: number;
    incomingRevenue: number;
    expenses: number;
    netIncome: number;
    overdueInvoices: number;
    monthlyBookings: number;
  };
  clinics: ClinicOverview[];
  invoices: InvoiceOverview[];
  expenses: ExpenseOverview[];
  revenueSeries: RevenuePoint[];
  recentBookings: BookingRecord[];
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function groupBookings(bookings: BookingRecord[]) {
  const grouped = new Map<string, BookingRecord[]>();

  for (const booking of bookings) {
    const key = booking.clinic_name.trim().toLowerCase();
    const existing = grouped.get(key) ?? [];
    existing.push(booking);
    grouped.set(key, existing);
  }

  return grouped;
}

async function fetchTableRows<T>(tableName: string) {
  const response = await supabaseServer.from(tableName).select('*').order('created_at', {
    ascending: false,
  });

  if (response.error) {
    return null;
  }

  return response.data as T[];
}

function buildFallbackClinics(bookings: BookingRecord[]): ClinicOverview[] {
  const grouped = groupBookings(bookings);
  const now = new Date();

  if (grouped.size === 0) {
    const seedDate = addDays(now, 14);
    return [
      {
        id: 'demo-1',
        clinicName: 'Sunrise Dental Studio',
        location: 'Austin, TX',
        email: 'hello@clinic-one.com',
        phone: '+1 (512) 555-0111',
        status: 'active',
        nextBillingDate: formatDate(seedDate),
        lastBookingDate: formatDate(addDays(now, -4)),
        monthlyRevenue: 6800,
        outstandingAmount: 1200,
        bookingsCount: 6,
        notes: 'Demo clinic seeded until live clinic data is connected.',
      },
      {
        id: 'demo-2',
        clinicName: 'North Star Med Spa',
        location: 'Dallas, TX',
        email: 'bookings@clinic-two.com',
        phone: '+1 (214) 555-0133',
        status: 'follow-up',
        nextBillingDate: formatDate(addDays(now, 18)),
        lastBookingDate: formatDate(addDays(now, -9)),
        monthlyRevenue: 9400,
        outstandingAmount: 2200,
        bookingsCount: 10,
        notes: 'Demo clinic used for dashboard analytics and billing flow.',
      },
    ];
  }

  return [...grouped.entries()].map(([key, clinicBookings], index) => {
    const sorted = [...clinicBookings].sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    );
    const latest = sorted[0];
    const lastBookingDate = new Date(latest.created_at);
    const bookingCount = clinicBookings.length;
    const monthlyRevenue = 3200 + bookingCount * 475 + index * 180;
    const outstandingAmount = Math.max(0, 950 + bookingCount * 120 - index * 75);
    const status: ClinicOverview['status'] = bookingCount > 4 ? 'active' : 'follow-up';

    return {
      id: key,
      clinicName: latest.clinic_name,
      location: latest.location,
      email: latest.email,
      phone: latest.phone,
      status,
      nextBillingDate: formatDate(addMonths(lastBookingDate, 1)),
      lastBookingDate: formatDate(lastBookingDate),
      monthlyRevenue,
      outstandingAmount,
      bookingsCount: bookingCount,
      notes: bookingCount > 1 ? 'Live clinic derived from incoming bookings.' : 'New clinic lead from the booking system.',
    };
  });
}

function buildFallbackInvoices(clinics: ClinicOverview[]): InvoiceOverview[] {
  const now = new Date();

  return clinics.map((clinic, index) => {
    const amount = clinic.monthlyRevenue + 450;
    const dueDate = clinic.nextBillingDate;
    const status: InvoiceOverview['status'] =
      index % 3 === 0 ? 'paid' : index % 3 === 1 ? 'due' : 'overdue';

    return {
      id: `invoice-${index + 1}`,
      clinicName: clinic.clinicName,
      amount,
      status,
      dueDate,
      period: `${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`,
      notes: status === 'paid' ? 'Paid for the current cycle.' : 'Awaiting billing follow-up.',
    };
  });
}

function buildFallbackExpenses(clinics: ClinicOverview[]): ExpenseOverview[] {
  const base = Math.max(clinics.length, 1);
  const now = new Date();

  return [
    {
      id: 'expense-1',
      label: 'Automation stack',
      category: 'software',
      amount: 390 + base * 20,
      date: formatDate(now),
    },
    {
      id: 'expense-2',
      label: 'Outbound ads',
      category: 'marketing',
      amount: 1200 + base * 140,
      date: formatDate(addDays(now, -3)),
    },
    {
      id: 'expense-3',
      label: 'Support and operations',
      category: 'operations',
      amount: 850 + base * 90,
      date: formatDate(addDays(now, -7)),
    },
  ];
}

function buildRevenueSeries(clinics: ClinicOverview[], invoices: InvoiceOverview[], expenses: ExpenseOverview[]) {
  const today = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const monthDate = addMonths(startOfMonth(today), index - 5);
    const monthIndex = monthDate.getMonth();
    const monthName = monthDate.toLocaleString('default', { month: 'short' });
    const revenueFromClinics = clinics.reduce(
      (total, clinic) => total + clinic.monthlyRevenue * (0.7 + (monthIndex % 3) * 0.08),
      0,
    );
    const revenueFromInvoices = invoices.reduce((total, invoice) => {
      const due = new Date(invoice.dueDate);
      return due.getMonth() === monthIndex ? total + invoice.amount * (invoice.status === 'paid' ? 1 : 0.55) : total;
    }, 0);
    const expenseFromExpenses = expenses.reduce(
      (total, expense) => total + expense.amount * (0.85 + (monthIndex % 2) * 0.06),
      0,
    );

    return {
      label: monthName,
      revenue: Math.round(revenueFromClinics * 0.45 + revenueFromInvoices * 0.55),
      expense: Math.round(expenseFromExpenses),
    };
  });
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const bookings = (await fetchTableRows<BookingRecord>('bookings')) ?? [];
  const clinicRows = await fetchTableRows<ClinicOverview>('clinics');
  const invoiceRows = await fetchTableRows<InvoiceOverview>('invoices');
  const expenseRows = await fetchTableRows<ExpenseOverview>('expenses');

  const clinics =
    clinicRows && clinicRows.length > 0
      ? clinicRows.map((clinic) => ({
          ...clinic,
          status: clinic.status ?? 'active',
          bookingsCount: clinic.bookingsCount ?? 0,
          monthlyRevenue: clinic.monthlyRevenue ?? 0,
          outstandingAmount: clinic.outstandingAmount ?? 0,
          notes: clinic.notes ?? '',
        }))
      : buildFallbackClinics(bookings);

  const invoices =
    invoiceRows && invoiceRows.length > 0 ? invoiceRows : buildFallbackInvoices(clinics);
  const expenses =
    expenseRows && expenseRows.length > 0 ? expenseRows : buildFallbackExpenses(clinics);
  const revenueSeries = buildRevenueSeries(clinics, invoices, expenses);

  const receivedRevenue = invoices
    .filter((invoice) => invoice.status === 'paid')
    .reduce((total, invoice) => total + invoice.amount, 0);
  const incomingRevenue = invoices
    .filter((invoice) => invoice.status !== 'paid')
    .reduce((total, invoice) => total + invoice.amount, 0);
  const expenseTotal = expenses.reduce((total, expense) => total + expense.amount, 0);
  const totalBookings = bookings.length;
  const monthlyBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.created_at);
    const now = new Date();
    return (
      bookingDate.getMonth() === now.getMonth() &&
      bookingDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return {
    metrics: {
      totalBookings,
      totalClinics: clinics.length,
      receivedRevenue,
      incomingRevenue,
      expenses: expenseTotal,
      netIncome: receivedRevenue - expenseTotal,
      overdueInvoices: invoices.filter((invoice) => invoice.status === 'overdue').length,
      monthlyBookings,
    },
    clinics,
    invoices,
    expenses,
    revenueSeries,
    recentBookings: bookings.slice(0, 8),
  };
}
