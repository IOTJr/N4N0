import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BookingSubmission {
  id?: string;
  clinic_name: string;
  location: string;
  email: string;
  phone: string;
  preferred_date: string;
  message: string;
  created_at?: string;
}
