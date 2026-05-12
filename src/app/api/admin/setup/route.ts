import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  createAdminUser,
  hasAdminUsers,
} from '@/lib/admin-auth';

function isValidSetupKey(setupKey: string) {
  const envKey = process.env.ADMIN_SETUP_KEY ?? '';
  return envKey.length > 0 && setupKey === envKey;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? '').trim();
    const password = String(body.password ?? '');
    const fullName = String(body.fullName ?? '').trim();
    const setupKey = String(body.setupKey ?? '').trim();

    if (!email || !password || !setupKey) {
      return NextResponse.json(
        { error: 'Email, password, and setup key are required.' },
        { status: 400 },
      );
    }

    if (!isValidSetupKey(setupKey)) {
      return NextResponse.json({ error: 'Invalid setup key.' }, { status: 401 });
    }

    const hasExistingAdmins = await hasAdminUsers();
    if (hasExistingAdmins) {
      return NextResponse.json(
        {
          error:
            'Admin setup is already completed. Use the existing admin account or create a secured internal onboarding flow for additional admins.',
        },
        { status: 409 },
      );
    }

    const result = await createAdminUser({ email, password, fullName });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const token = createAdminSessionToken(email);
    const response = NextResponse.json({ success: true });

    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    console.error('Admin setup failed:', error);
    return NextResponse.json({ error: 'Unable to complete admin setup.' }, { status: 500 });
  }
}
