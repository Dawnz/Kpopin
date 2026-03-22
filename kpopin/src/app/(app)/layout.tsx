export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/auth/login');

  return (
    <div className="flex min-h-screen bg-kpop-dark">
      <Sidebar />

      {/* Main content — offset for desktop sidebar, top/bottom bars on mobile */}
      <div className="flex flex-1 lg:ml-64 w-full">
        <main className="flex-1 min-w-0 pt-14 pb-20 lg:pt-0 lg:pb-0">
          {children}
        </main>

        {/* Right sidebar — desktop only */}
        <div className="hidden xl:block w-72 flex-shrink-0 px-4 py-8">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}