import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from '@/lib/admin-auth';

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
    const to = String(body.to ?? body.clinicEmail ?? '').trim();
    const clinicName = String(body.clinicName ?? 'Clinic').trim();
    const subject = String(body.subject ?? 'Update from N4N0').trim();
    const message = String(body.message ?? '').trim();

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Recipient and message are required.' },
        { status: 400 },
      );
    }

    await resend.emails.send({
      from: 'N4N0 Admin <noreply@n4n0.tech>',
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #0f172a;">
          <h2 style="margin-bottom: 12px;">${subject}</h2>
          <p style="font-size: 15px; line-height: 1.7; white-space: pre-line;">${message}</p>
          <p style="margin-top: 24px; color: #475569;">Sent from the N4N0 admin dashboard for ${clinicName}.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send admin email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
