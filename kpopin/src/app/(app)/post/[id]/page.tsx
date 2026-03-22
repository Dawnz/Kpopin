export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { timeAgo } from '@/lib/utils';
import { CommentSection } from '@/components/feed/CommentSection';
import { PostVoteBar } from '@/components/feed/PostVoteBar';
import Link from 'next/link';

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      group:  { select: { id: true, name: true, slug: true } },
      _count: { select: { comments: true, votes: true } },
      votes:  { where: { userId: session!.user!.id }, select: { type: true } },
      comments: {
        where:   { parentId: null },
        orderBy: { createdAt: 'desc' },
        include: {
          author:  { select: { id: true, name: true, username: true } },
          _count:  { select: { votes: true, replies: true } },
          votes:   { where: { userId: session!.user!.id }, select: { type: true } },
          replies: {
            include: {
              author: { select: { id: true, name: true, username: true } },
              _count: { select: { votes: true } },
              votes:  { where: { userId: session!.user!.id }, select: { type: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
  });

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-kpop-muted mb-6">
        <Link href="/feed" className="hover:text-white transition-colors">Feed</Link>
        {post.group && (
          <>
            <span>/</span>
            <Link href={`/groups/${post.group.slug}`} className="text-kpop-pink hover:underline">{post.group.name}</Link>
          </>
        )}
      </div>

      {/* Post */}
      <article className="bg-card rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-kpop-pink to-kpop-purple flex items-center justify-center text-sm font-bold">
            {post.author.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <span className="text-sm font-medium">{post.author.name}</span>
            <span className="text-xs text-kpop-muted ml-2">{timeAgo(post.createdAt)}</span>
          </div>
        </div>

        <h1 className="font-display text-2xl font-800 mb-3">{post.title}</h1>
        <p className="text-kpop-muted leading-relaxed whitespace-pre-wrap">{post.content}</p>

        <div className="mt-6 pt-4 border-t border-kpop-border">
          <PostVoteBar
            postId={post.id}
            initialVote={post.votes[0]?.type ?? null}
            initialCount={post._count.votes}
          />
        </div>
      </article>

      {/* Comments */}
      <CommentSection
        postId={post.id}
        comments={post.comments as any}
        currentUserId={session!.user!.id as string}
      />
    </div>
  );
}
