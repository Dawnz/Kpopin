export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PostCard } from '@/components/feed/PostCard';
import { CreatePostButton } from '@/components/feed/CreatePostButton';
import { RightSidebar } from '@/components/layout/RightSidebar';

export default async function FeedPage() {
  const session = await auth();

  // Get user's followed groups
  const userGroups = await prisma.groupMember.findMany({
    where: { userId: session!.user!.id },
    select: { groupId: true },
  });
  const groupIds = userGroups.map((g) => g.groupId);

  // Personalized feed: posts from followed groups + general posts
  const posts = await prisma.post.findMany({
    where: groupIds.length > 0 ? { OR: [{ groupId: { in: groupIds } }, { groupId: null }] } : {},
    orderBy: { createdAt: 'desc' },
    take: 30,
    include: {
      author:   { select: { id: true, name: true, username: true, image: true } },
      group:    { select: { id: true, name: true, slug: true } },
      _count:   { select: { comments: true, votes: true } },
      votes:    { where: { userId: session!.user!.id }, select: { type: true } },
    },
  });

  return (
    <div className="flex gap-6 max-w-5xl mx-auto px-6 py-8">
      <div className="flex-1 space-y-4">
        <CreatePostButton />
        {posts.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center">
            <p className="text-kpop-muted text-lg">No posts yet.</p>
            <p className="text-kpop-muted text-sm mt-1">Follow some groups or be the first to post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={session!.user!.id as string} />
          ))
        )}
      </div>
      <RightSidebar />
    </div>
  );
}
