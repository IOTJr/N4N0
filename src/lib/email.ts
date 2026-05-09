type EmailPayload = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
};

async function sendViaResend(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info('Email skipped because RESEND_API_KEY is not configured.');
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Resend request failed (${response.status})`);
  }
}

export async function sendEmail(payload: EmailPayload) {
  try {
    await sendViaResend(payload);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export async function sendConfirmationEmail(email: string, clinicName: string) {
  try {
    await sendEmail({
      from: 'N4N0 <noreply@n4n0.tech>',
      to: email,
      subject: 'Demo Booking Confirmed – N4N0',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #05121f;">Thank you, ${clinicName}!</h2>
          <p>We've received your booking request and will reach out within 24 hours to confirm your demo time.</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #0c4a6e;"><strong>What's next?</strong></p>
            <ul style="color: #0c4a6e; margin: 10px 0;">
              <li>We'll send you a calendar invite</li>
              <li>You can join via Zoom or phone</li>
              <li>We'll show you exactly how N4N0 works for your clinic</li>
            </ul>
          </div>
          <p>Questions? Reply to this email or contact us at <strong>${process.env.ADMIN_EMAIL ?? 'rohajohn54@gmail.com'}</strong></p>
          <p style="color: #64748b; font-size: 12px;">© 2026 N4N0. Booking + acquisition systems for service businesses.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
}

export async function sendAdminNotification(submission: any) {
  try {
    await sendEmail({
      from: 'N4N0 <noreply@n4n0.tech>',
      to: process.env.ADMIN_EMAIL ?? 'rohajohn54@gmail.com',
      subject: `New Demo Booking: ${submission.clinic_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #05121f;">New Booking Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 10px; background: #f1f5f9; border: 1px solid #e2e8f0;"><strong>Clinic Name</strong></td><td style="padding: 10px; border: 1px solid #e2e8f0;">${submission.clinic_name}</td></tr>
            <tr><td style="padding: 10px; background: #f1f5f9; border: 1px solid #e2e8f0;"><strong>Location</strong></td><td style="padding: 10px; border: 1px solid #e2e8f0;">${submission.location}</td></tr>
            <tr><td style="padding: 10px; background: #f1f5f9; border: 1px solid #e2e8f0;"><strong>Email</strong></td><td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${submission.email}">${submission.email}</a></td></tr>
            <tr><td style="padding: 10px; background: #f1f5f9; border: 1px solid #e2e8f0;"><strong>Phone</strong></td><td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="tel:${submission.phone}">${submission.phone}</a></td></tr>
            <tr><td style="padding: 10px; background: #f1f5f9; border: 1px solid #e2e8f0;"><strong>Preferred Date</strong></td><td style="padding: 10px; border: 1px solid #e2e8f0;">${submission.preferred_date}</td></tr>
            ${submission.message ? `
            <tr><td style="padding: 10px; background: #f1f5f9; border: 1px solid #e2e8f0;"><strong>Notes</strong></td><td style="padding: 10px; border: 1px solid #e2e8f0;">${submission.message}</td></tr>
            ` : ''}
          </table>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/admin/bookings" style="background: #68e0cf; color: #05121f; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">View in Dashboard</a></p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}