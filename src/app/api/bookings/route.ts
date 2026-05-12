import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clinicName,
      location,
      email,
      phone,
      preferredDate,
      message,
      monthlyBookings,
      mainChallenge,
      inquiryType,
    } = body;

    // Validate required fields
    if (!clinicName || !location || !email || !phone || !preferredDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { error } = await supabaseServer.from('bookings').insert([
      {
        clinic_name: clinicName,
        location,
        email,
        phone,
        preferred_date: preferredDate,
        inquiry_type: String(inquiryType ?? 'demo_request'),
        monthly_bookings: String(monthlyBookings ?? '').trim(),
        main_challenge: String(mainChallenge ?? '').trim(),
        message: message || '',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Supabase error:', error);
      // Continue anyway if DB fails, but send emails
    }

    // Send confirmation email to client
    await sendConfirmationEmail(email, clinicName);

    // Send notification to admin
    await sendAdminNotification({
      clinic_name: clinicName,
      location,
      email,
      phone,
      preferred_date: preferredDate,
      message,
    });

    return NextResponse.json(
      { success: true, message: 'Booking submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
