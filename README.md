# N4N0 Web Platform

Futuristic, conversion-focused booking and growth platform for dental clinics and med spas.

## Local setup

1. Install dependencies.
2. Add environment variables in `.env.local`.
3. Run the dev server.

```bash
pnpm install
pnpm dev
```

## Required environment variables

Use `.env.local.example` as the base.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `RESEND_API_KEY`
- `ADMIN_SESSION_SECRET`
- `ADMIN_SETUP_KEY`
- `NEXT_PUBLIC_CALENDLY_URL`

The admin setup key is not stored in GitHub. Add it to your local `.env.local` as `ADMIN_SETUP_KEY` and use that same value on the admin setup screen.

## Admin DB setup

Create the `admins` table in Supabase SQL editor:

```sql
create table if not exists admins (
	id uuid primary key default gen_random_uuid(),
	email text not null unique,
	full_name text,
	password_hash text not null,
	password_salt text not null,
	created_at timestamptz not null default now()
);
```

Then open `/admin/login`, switch to **First-time setup**, and create the initial admin user using `ADMIN_SETUP_KEY`.

If you have PNG branding assets, place them here:

- `public/logo.png`
- `public/favicon.png`

## Lead capture and free audit flow

- Homepage CTA **Get a Free Audit** routes to `/booking?intent=audit`.
- Booking API stores inquiry type and qualification fields for each lead.

## Production checks

```bash
pnpm build
pnpm start
```
