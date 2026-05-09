import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getAdminOverview } from '@/lib/admin-overview';
import AdminDashboard from '@/components/admin-dashboard';

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login');
  }

  const initialData = await getAdminOverview();
  return <AdminDashboard initialData={initialData} />;
}
