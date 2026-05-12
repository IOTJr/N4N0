import { redirect } from 'next/navigation';

export default function FreeAuditPage() {
  redirect('/booking?intent=audit');
}
