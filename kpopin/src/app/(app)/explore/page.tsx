import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PostCard } from '@/components/feed/PostCard';
import { Compass } from 'lucide-react';

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const session = await auth();
  const query   = searchParams.q ?? '';
  const type    = searchParams.type;

  const posts = await prisma.post.findMany({
    where: {
      ...(query ? {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      } : {}),
      ...(type ? { type: type as any } : {}),
    },
    orderBy: { createdAt: 'desc' },
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
      <div className="flex items-center gap-2 mb-6">
        <Compass size={20} className="text-kpop-purple" />
        <h1 className="font-display text-2xl font-800">Explore</h1>
      </div>

      {/* Search */}
      <form className="mb-6">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search posts, artists, discussions..."
          className="w-full bg-card border border-kpop-border rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-kpop-pink/50 transition-colors placeholder:text-kpop-muted"
        />
      </form>

      {/* Filter chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', 'NEWS', 'DISCUSSION', 'UPDATE', 'MEDIA'].map((t) => (
          <a
            key={t}
            href={`/explore?${query ? `q=${query}&` : ''}${t !== 'ALL' ? `type=${t}` : ''}`}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              (t === 'ALL' && !type) || type === t
                ? 'bg-kpop-pink/10 text-kpop-pink border-kpop-pink/30'
                : 'border-kpop-border text-kpop-muted hover:border-kpop-pink/20'
            }`}
          >
            {t}
          </a>
        ))}
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center">
            <p className="text-kpop-muted">No posts found{query ? ` for "${query}"` : ''}.</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post as any} currentUserId={session!.user!.id} />
          ))
        )}
      </div>
    </div>
  );
}
