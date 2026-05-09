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

export const supabase = {
  from() {
    throw new Error('The client-side Supabase helper is not configured for direct use in this app.');
  },
};