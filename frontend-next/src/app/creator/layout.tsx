import type { ReactNode } from 'react';
import { requirePagePermission } from '@/security/page-access';

export default async function CreatorLayout({ children }: { children: ReactNode }) {
  await requirePagePermission('creator:use');
  return children;
}
