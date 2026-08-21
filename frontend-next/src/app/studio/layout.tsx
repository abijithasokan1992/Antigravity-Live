import type { ReactNode } from 'react';
import { requirePagePermission } from '@/security/page-access';

export default async function StudioLayout({ children }: { children: ReactNode }) {
  await requirePagePermission('studio:use');
  return children;
}
