export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/feed/PostCard';
import { GroupFollowButton } from '@/components/groups/GroupFollowButton';
import { YouTubeVideos } from '@/components/groups/YouTubeVideos';
import { CreatePostButton } from '@/components/feed/CreatePostButton';
import { Users, Calendar, Building2 } from 'lucide-react';
import { YOUTUBE_CHANNELS } from '@/lib/youtube-channels';

export default async function GroupPage({ params }: { params: { slug: string } }) {
  const session = await auth();

  const group = await prisma.kpopGroup.findUnique({
    where: { slug: params.slug },
    include: {
      _count: { select: { groupMembers: true, posts: true } },
      groupMembers: { where: { userId: session!.user!.id }, select: { id: true } },
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

  if (!group) notFound();

  const isFollowing = group.groupMembers.length > 0;
  const hasYouTube  = !!YOUTUBE_CHANNELS[group.slug];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="bg-card rounded-xl overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-kpop-pink/40 via-kpop-purple/40 to-kpop-cyan/20" />
        <div className="px-6 pb-6 -mt-8">
          <div className="flex items-end justify-between">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-kpop-pink to-kpop-purple flex items-center justify-center text-white font-display font-800 text-2xl border-2 border-kpop-dark">
              {group.name[0]}
            </div>
            <GroupFollowButton groupId={group.id} initialFollowing={isFollowing} groupName={group.name} />
          </div>

          <h1 className="font-display text-2xl font-800 mt-3">{group.name}</h1>
          {group.description && <p className="text-kpop-muted text-sm mt-1">{group.description}</p>}

          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-1.5 text-sm text-kpop-muted">
              <Users size={14} className="text-kpop-pink" />
              <span><strong className="text-white">{group._count.groupMembers}</strong> fans</span>
            </div>
            {group.agency && (
              <div className="flex items-center gap-1.5 text-sm text-kpop-muted">
                <Building2 size={14} className="text-kpop-purple" />
                {group.agency}
              </div>
            )}
            {group.debutYear && (
              <div className="flex items-center gap-1.5 text-sm text-kpop-muted">
                <Calendar size={14} className="text-kpop-cyan" />
                Since {group.debutYear}
              </div>
            )}
          </div>

          {/* Members */}
          <div className="mt-4">
            <p className="text-xs text-kpop-muted mb-2">Members</p>
            <div className="flex flex-wrap gap-1.5">
              {group.members.map((m) => (
                <span key={m} className="px-2 py-0.5 bg-white/5 rounded-full text-xs text-kpop-muted border border-kpop-border">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Latest Videos */}
      {hasYouTube && (
        <YouTubeVideos slug={group.slug} groupName={group.name} />
      )}

      {/* Create Post */}
      <div className="mb-6">
        <CreatePostButton groupId={group.id} groupName={group.name} />
      </div>

      {/* Posts */}
      <h2 className="font-display text-lg font-700 mb-4">{group._count.posts} Posts</h2>
      <div className="space-y-4">
        {group.posts.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center">
            <p className="text-kpop-muted">No posts yet for {group.name}. Be the first!</p>
          </div>
        ) : (
          group.posts.map((post) => (
            <PostCard key={post.id} post={post as any} currentUserId={session!.user!.id as string} />
          ))
        )}
      </div>
    </div>
  );
}