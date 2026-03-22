'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PostVoteBar({ postId, initialVote, initialCount }: {
  postId: string;
  initialVote: string | null;
  initialCount: number;
}) {
  const [vote, setVote]   = useState<string | null>(initialVote);
  const [count, setCount] = useState(initialCount);

  async function handleVote(type: 'UP' | 'DOWN') {
    const newVote = vote === type ? null : type;
    setVote(newVote);
    setCount((c) => c + (newVote === 'UP' ? 1 : newVote === 'DOWN' ? -1 : vote === 'UP' ? -1 : 1));

    await fetch(`/api/posts/${postId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote('UP')}
        className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all', vote === 'UP' ? 'bg-kpop-pink/10 text-kpop-pink' : 'text-kpop-muted hover:text-kpop-pink hover:bg-kpop-pink/10')}
      >
        <ArrowUp size={16} /> Upvote
      </button>
      <span className={cn('text-sm font-medium px-2', vote ? 'text-kpop-pink' : 'text-kpop-muted')}>{count}</span>
      <button
        onClick={() => handleVote('DOWN')}
        className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all', vote === 'DOWN' ? 'bg-kpop-purple/10 text-kpop-purple' : 'text-kpop-muted hover:text-kpop-purple hover:bg-kpop-purple/10')}
      >
        <ArrowDown size={16} /> Downvote
      </button>
    </div>
  );
}
