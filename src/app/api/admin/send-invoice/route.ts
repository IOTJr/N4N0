import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from '@/lib/admin-auth';
import { supabaseServer } from '@/lib/supabase-server';

const resend = new Resend(process.env.RESEND_API_KEY);

function isAuthorized(request: NextRequest) {
  return verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const clinicName = String(body.clinicName ?? '').trim();
    const to = String(body.to ?? body.clinicEmail ?? '').trim();
    const amount = Number(body.amount ?? 0);
    const dueDate = String(body.dueDate ?? '').trim();
    const period = String(body.period ?? '').trim();
    const notes = String(body.notes ?? '').trim();

    if (!clinicName || !to || !amount || !dueDate) {
      return NextResponse.json(
        { error: 'Clinic name, recipient, amount, and due date are required.' },
        { status: 400 },
      );
    }

    const invoiceRecord = {
      clinic_name: clinicName,
      amount,
      status: 'due',
      due_date: dueDate,
      period,
      notes,
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabaseServer.from('invoices').insert([invoiceRecord]);
    if (insertError) {
      console.warn('Invoice insert warning:', insertError.message);
    }

    await resend.emails.send({
      from: 'N4N0 Billing <billing@n4n0.tech>',
      to,
      subject: `Invoice for ${clinicName} - ${period || 'Current cycle'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #0f172a;">
          <h2 style="margin-bottom: 12px;">Invoice for ${clinicName}</h2>
          <p style="font-size: 15px; line-height: 1.7;">Amount due: <strong>$${amount.toLocaleString('en-US')}</strong></p>
          <p style="font-size: 15px; line-height: 1.7;">Due date: <strong>${dueDate}</strong></p>
          ${period ? `<p style="font-size: 15px; line-height: 1.7;">Billing period: <strong>${period}</strong></p>` : ''}
          ${notes ? `<p style="font-size: 15px; line-height: 1.7;">Notes: ${notes}</p>` : ''}
          <p style="margin-top: 24px; color: #475569;">This invoice was generated from the N4N0 admin dashboard.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send invoice:', error);
    return NextResponse.json({ error: 'Failed to send invoice' }, { status: 500 });
  }
}
