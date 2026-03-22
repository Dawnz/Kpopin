import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { timeAgo } from '@/lib/utils';
import Link from 'next/link';
import { Bell, MessageSquare, ArrowUp, UserPlus, Rss } from 'lucide-react';

const icons: Record<string, React.ReactNode> = {
  NEW_POST:  <Rss size={14} className="text-kpop-cyan" />,
  COMMENT:   <MessageSquare size={14} className="text-kpop-purple" />,
  REPLY:     <MessageSquare size={14} className="text-kpop-pink" />,
  VOTE:      <ArrowUp size={14} className="text-kpop-yellow" />,
  FOLLOW:    <UserPlus size={14} className="text-kpop-cyan" />,
  MESSAGE:   <MessageSquare size={14} className="text-kpop-pink" />,
};

export default async function NotificationsPage() {
  const session = await auth();

  const notifications = await prisma.notification.findMany({
    where:   { userId: session!.user!.id },
    orderBy: { createdAt: 'desc' },
    take:    50,
  });

  // Mark all as read
  await prisma.notification.updateMany({
    where: { userId: session!.user!.id, read: false },
    data:  { read: true },
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Bell size={20} className="text-kpop-pink" />
        <h1 className="font-display text-2xl font-800">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center">
          <Bell size={32} className="text-kpop-muted mx-auto mb-3" />
          <p className="text-kpop-muted">Nothing here yet. Start engaging with the community!</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl divide-y divide-kpop-border">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3 p-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-7 h-7 rounded-full bg-kpop-dark border border-kpop-border flex items-center justify-center flex-shrink-0 mt-0.5">
                {icons[n.type] ?? <Bell size={12} className="text-kpop-muted" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{n.content}</p>
                <p className="text-xs text-kpop-muted mt-0.5">{timeAgo(n.createdAt)}</p>
              </div>
              {n.link && (
                <Link href={n.link} className="text-xs text-kpop-pink hover:underline flex-shrink-0">View</Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
