export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/auth/login');

  return (
    <div className="flex min-h-screen bg-kpop-dark">
      <Sidebar />

      {/* pt-14 pb-20 = space for mobile top/bottom bars */}
      <main className="flex-1 lg:ml-64 min-w-0 pt-14 pb-20 lg:pt-0 lg:pb-0">
        {children}
      </main>
    </div>
  );
}