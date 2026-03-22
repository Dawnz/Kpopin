'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUp, ArrowDown, MessageSquare, Share2 } from 'lucide-react';
import { cn, timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    type: string;
    createdAt: Date | string;
    author: { id: string; name: string | null; username: string | null; image: string | null };
    group: { id: string; name: string; slug: string } | null;
    _count: { comments: number; votes: number };
    votes: { type: string }[];
  };
  currentUserId: string;
}

const typeColors: Record<string, string> = {
  NEWS:       'bg-kpop-cyan/10    text-kpop-cyan    border-kpop-cyan/20',
  UPDATE:     'bg-kpop-pink/10   text-kpop-pink   border-kpop-pink/20',
  DISCUSSION: 'bg-kpop-purple/10 text-kpop-purple border-kpop-purple/20',
  MEDIA:      'bg-kpop-yellow/10 text-kpop-yellow border-kpop-yellow/20',
};

export function PostCard({ post, currentUserId }: PostCardProps) {
  const userVote = post.votes[0]?.type ?? null;
  const [voteState, setVoteState] = useState<string | null>(userVote);
  const [voteCount, setVoteCount] = useState(post._count.votes);

  async function handleVote(type: 'UP' | 'DOWN') {
    const newVote = voteState === type ? null : type;
    setVoteState(newVote);
    setVoteCount((c) => c + (newVote === 'UP' ? 1 : newVote === 'DOWN' ? -1 : voteState === 'UP' ? -1 : 1));

    await fetch(`/api/posts/${post.id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
  }

  function handleShare() {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    toast.success('Link copied!');
  }

  return (
    <article className="bg-card rounded-xl p-5 hover:border-kpop-border/60 transition-all animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-kpop-pink to-kpop-purple flex items-center justify-center text-xs font-bold flex-shrink-0">
          {post.author.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <span className="text-sm text-kpop-muted">
          <span className="text-white font-medium">{post.author.name ?? post.author.username}</span>
          {post.group && (
            <>
              {' · '}
              <Link href={`/groups/${post.group.slug}`} className="text-kpop-pink hover:underline">
                {post.group.name}
              </Link>
            </>
          )}
          {' · '}
          {timeAgo(post.createdAt)}
        </span>
        <span className={cn('ml-auto text-xs px-2 py-0.5 rounded-full border font-medium', typeColors[post.type] ?? typeColors.DISCUSSION)}>
          {post.type}
        </span>
      </div>

      {/* Content */}
      <Link href={`/post/${post.id}`}>
        <h2 className="font-display font-700 text-lg mb-1 hover:text-kpop-pink transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-kpop-muted text-sm line-clamp-3">{post.content}</p>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleVote('UP')}
            className={cn('p-1.5 rounded-lg transition-all', voteState === 'UP' ? 'text-kpop-pink bg-kpop-pink/10' : 'text-kpop-muted hover:text-kpop-pink hover:bg-kpop-pink/10')}
          >
            <ArrowUp size={16} />
          </button>
          <span className={cn('text-sm font-medium min-w-[24px] text-center', voteState ? 'text-kpop-pink' : 'text-kpop-muted')}>
            {voteCount}
          </span>
          <button
            onClick={() => handleVote('DOWN')}
            className={cn('p-1.5 rounded-lg transition-all', voteState === 'DOWN' ? 'text-kpop-purple bg-kpop-purple/10' : 'text-kpop-muted hover:text-kpop-purple hover:bg-kpop-purple/10')}
          >
            <ArrowDown size={16} />
          </button>
        </div>

        <Link href={`/post/${post.id}`} className="flex items-center gap-1.5 text-kpop-muted hover:text-white transition-colors text-sm">
          <MessageSquare size={15} />
          {post._count.comments} comments
        </Link>

        <button onClick={handleShare} className="flex items-center gap-1.5 text-kpop-muted hover:text-white transition-colors text-sm ml-auto">
          <Share2 size={15} />
          Share
        </button>
      </div>
    </article>
  );
}
