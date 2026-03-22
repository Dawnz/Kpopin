import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Users, TrendingUp } from 'lucide-react';

export async function RightSidebar() {
  const topGroups = await prisma.kpopGroup.findMany({
    take: 8,
    include: { _count: { select: { groupMembers: true, posts: true } } },
    orderBy: { groupMembers: { _count: 'desc' } },
  });

  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { votes: { _count: 'desc' } },
    where: { createdAt: { gte: new Date(Date.now() - 86400000 * 7) } },
    select: { id: true, title: true, _count: { select: { votes: true } } },
  });

  return (
    <aside className="w-72 flex-shrink-0 space-y-4 sticky top-8 self-start">
      {/* Trending posts */}
      <div className="bg-card rounded-xl p-4">
        <h3 className="font-display font-700 text-sm flex items-center gap-2 mb-3">
          <TrendingUp size={15} className="text-kpop-pink" />
          Trending this week
        </h3>
        <div className="space-y-2">
          {recentPosts.map((post, i) => (
            <Link key={post.id} href={`/post/${post.id}`} className="flex items-start gap-2 hover:text-kpop-pink transition-colors group">
              <span className="text-kpop-muted text-xs mt-0.5 w-4">{i + 1}.</span>
              <span className="text-sm line-clamp-2 group-hover:text-kpop-pink transition-colors">{post.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Top groups */}
      <div className="bg-card rounded-xl p-4">
        <h3 className="font-display font-700 text-sm flex items-center gap-2 mb-3">
          <Users size={15} className="text-kpop-purple" />
          Popular Groups
        </h3>
        <div className="space-y-2">
          {topGroups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.slug}`}
              className="flex items-center justify-between py-1.5 hover:text-kpop-pink transition-colors"
            >
              <span className="text-sm font-medium">{group.name}</span>
              <span className="text-xs text-kpop-muted">{group._count.groupMembers} fans</span>
            </Link>
          ))}
        </div>
        <Link href="/groups" className="mt-3 block text-xs text-kpop-pink hover:underline">
          View all groups →
        </Link>
      </div>
    </aside>
  );
}
