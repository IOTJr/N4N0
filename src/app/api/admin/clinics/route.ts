import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from '@/lib/admin-auth';
import { supabaseServer } from '@/lib/supabase-server';

function isAuthorized(request: NextRequest) {
  return verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseServer.from('clinics').select('*').order('created_at', {
    ascending: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const clinicName = String(body.clinicName ?? '').trim();
    const location = String(body.location ?? '').trim();
    const email = String(body.email ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const status = String(body.status ?? 'active').trim();
    const nextBillingDate = String(body.nextBillingDate ?? '').trim();
    const monthlyRevenue = Number(body.monthlyRevenue ?? 0);
    const outstandingAmount = Number(body.outstandingAmount ?? 0);
    const notes = String(body.notes ?? '').trim();

    if (!clinicName || !email) {
      return NextResponse.json({ error: 'Clinic name and email are required.' }, { status: 400 });
    }

    const payload = {
      clinic_name: clinicName,
      location,
      email,
      phone,
      status,
      next_billing_date: nextBillingDate,
      monthly_revenue: monthlyRevenue,
      outstanding_amount: outstandingAmount,
      notes,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer
      .from('clinics')
      .upsert(payload, { onConflict: 'clinic_name' })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, clinic: data });
  } catch (error) {
    console.error('Failed to save clinic:', error);
    return NextResponse.json({ error: 'Failed to save clinic' }, { status: 500 });
  }
}
