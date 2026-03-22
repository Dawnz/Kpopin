import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PostCard } from '@/components/feed/PostCard';
import { TrendingUp } from 'lucide-react';

export default async function TrendingPage() {
  const session = await auth();

  const posts = await prisma.post.findMany({
    where: { createdAt: { gte: new Date(Date.now() - 86400000 * 7) } },
    orderBy: [{ votes: { _count: 'desc' } }, { comments: { _count: 'desc' } }],
    take: 30,
    include: {
      author:  { select: { id: true, name: true, username: true, image: true } },
      group:   { select: { id: true, name: true, slug: true } },
      _count:  { select: { comments: true, votes: true } },
      votes:   { where: { userId: session!.user!.id }, select: { type: true } },
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp size={20} className="text-kpop-pink" />
        <h1 className="font-display text-2xl font-800">Trending</h1>
      </div>
      <p className="text-kpop-muted text-sm mb-6">Top posts from the last 7 days</p>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center">
            <p className="text-kpop-muted">No trending posts yet. Be the first to post!</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <div key={post.id} className="relative">
              <div className="absolute -left-6 top-5 text-kpop-muted text-xs font-bold w-4 text-right">{i + 1}</div>
              <PostCard post={post as any} currentUserId={session!.user!.id as string} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
