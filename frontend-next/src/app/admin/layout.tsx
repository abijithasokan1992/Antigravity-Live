import type { ReactNode } from 'react';
import { requirePagePermission } from '@/security/page-access';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requirePagePermission('admin:read');
  return children;
}
