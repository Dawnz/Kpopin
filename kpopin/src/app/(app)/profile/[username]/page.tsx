export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/feed/PostCard';
import { timeAgo } from '@/lib/utils';
import { Calendar, Hash } from 'lucide-react';

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const session = await auth();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: params.username },
        { email: params.username },
        { id: params.username },
      ],
    },
    include: {
      groupMembers: { include: { group: { select: { id: true, name: true, slug: true } } } },
      _count: { select: { posts: true, followers: true, following: true } },
      posts: {
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          author:  { select: { id: true, name: true, username: true, image: true } },
          group:   { select: { id: true, name: true, slug: true } },
          _count:  { select: { comments: true, votes: true } },
          votes:   { where: { userId: session!.user!.id }, select: { type: true } },
        },
      },
    },
  });

  if (!user) notFound();

  const isOwn = user.id === session!.user!.id;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Profile header */}
      <div className="bg-card rounded-xl overflow-hidden mb-6">
        <div className="h-24 bg-gradient-to-r from-kpop-pink/30 via-kpop-purple/30 to-kpop-cyan/20" />
        <div className="px-6 pb-6 -mt-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-kpop-pink to-kpop-purple flex items-center justify-center text-2xl font-bold border-2 border-kpop-dark mb-3">
            {user.name?.[0]?.toUpperCase() ?? 'U'}
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-xl font-800">{user.name}</h1>
              {user.username && <p className="text-kpop-muted text-sm">@{user.username}</p>}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 text-sm">
            <div><strong>{user._count.posts}</strong> <span className="text-kpop-muted">posts</span></div>
            <div><strong>{user._count.followers}</strong> <span className="text-kpop-muted">followers</span></div>
            <div><strong>{user._count.following}</strong> <span className="text-kpop-muted">following</span></div>
          </div>

          {/* Groups */}
          {user.groupMembers.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-kpop-muted mb-2 flex items-center gap-1"><Hash size={11} /> Groups</p>
              <div className="flex flex-wrap gap-1.5">
                {user.groupMembers.map((gm) => (
                  <a
                    key={gm.group.id}
                    href={`/groups/${gm.group.slug}`}
                    className="px-2.5 py-1 bg-kpop-pink/10 text-kpop-pink border border-kpop-pink/20 rounded-full text-xs hover:bg-kpop-pink/20 transition-colors"
                  >
                    {gm.group.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 mt-3 text-xs text-kpop-muted">
            <Calendar size={11} />
            Joined {timeAgo(user.createdAt)}
          </div>
        </div>
      </div>

      {/* Posts */}
      <h2 className="font-display text-lg font-700 mb-4">Posts</h2>
      <div className="space-y-4">
        {user.posts.length === 0 ? (
          <div className="bg-card rounded-xl p-10 text-center">
            <p className="text-kpop-muted">{isOwn ? "You haven't posted yet." : 'No posts yet.'}</p>
          </div>
        ) : (
          user.posts.map((post) => (
            <PostCard key={post.id} post={post as any} currentUserId={session!.user!.id as string} />
          ))
        )}
      </div>
    </div>
  );
}
