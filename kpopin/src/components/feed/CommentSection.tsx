'use client';

import { useState } from 'react';
import { ArrowUp, Reply, ChevronDown } from 'lucide-react';
import { cn, timeAgo } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
  author: { id: string; name: string | null; username: string | null };
  _count: { votes: number; replies?: number };
  votes: { type: string }[];
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUserId: string;
}

function CommentItem({ comment, postId, depth = 0 }: { comment: Comment; postId: string; depth?: number }) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [vote, setVote]   = useState<string | null>(comment.votes[0]?.type ?? null);
  const [count, setCount] = useState(comment._count.votes);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleVote() {
    const newVote = vote === 'UP' ? null : 'UP';
    setVote(newVote);
    setCount((c) => c + (newVote ? 1 : -1));
    await fetch(`/api/comments/${comment.id}/vote`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'UP' }) });
  }

  async function handleReply() {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyText, postId, parentId: comment.id }),
      });
      if (!res.ok) throw new Error();
      toast.success('Reply posted!');
      setReplying(false);
      setReplyText('');
      router.refresh();
    } catch {
      toast.error('Failed to post reply');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn('', depth > 0 && 'ml-6 pl-4 border-l border-kpop-border')}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-kpop-purple to-kpop-pink flex items-center justify-center text-xs font-bold flex-shrink-0">
            {comment.author.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <span className="text-sm font-medium">{comment.author.name}</span>
          <span className="text-xs text-kpop-muted">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mb-2 ml-8">{comment.content}</p>
        <div className="flex items-center gap-3 ml-8">
          <button
            onClick={handleVote}
            className={cn('flex items-center gap-1 text-xs transition-colors', vote === 'UP' ? 'text-kpop-pink' : 'text-kpop-muted hover:text-kpop-pink')}
          >
            <ArrowUp size={13} /> {count}
          </button>
          {depth < 3 && (
            <button
              onClick={() => setReplying(!replying)}
              className="flex items-center gap-1 text-xs text-kpop-muted hover:text-white transition-colors"
            >
              <Reply size={13} /> Reply
            </button>
          )}
        </div>

        {replying && (
          <div className="ml-8 mt-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={3}
              className="w-full bg-kpop-dark border border-kpop-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kpop-pink/50 transition-colors placeholder:text-kpop-muted resize-none mb-2"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setReplying(false)} className="px-3 py-1 text-xs text-kpop-muted hover:text-white transition-colors">Cancel</button>
              <button onClick={handleReply} disabled={loading} className="px-3 py-1 rounded-lg text-xs font-medium bg-kpop-pink/10 text-kpop-pink border border-kpop-pink/20 hover:bg-kpop-pink/20 transition-colors disabled:opacity-50">
                {loading ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </div>
        )}
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
      ))}
    </div>
  );
}

export function CommentSection({ postId, comments, currentUserId }: CommentSectionProps) {
  const [text, setText]   = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleComment() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, postId }),
      });
      if (!res.ok) throw new Error();
      toast.success('Comment posted!');
      setText('');
      router.refresh();
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-lg font-700 mb-4">{comments.length} Comments</h2>

      {/* New comment */}
      <div className="bg-card rounded-xl p-4 mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Join the discussion..."
          rows={3}
          className="w-full bg-kpop-dark border border-kpop-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kpop-pink/50 transition-colors placeholder:text-kpop-muted resize-none mb-3"
        />
        <div className="flex justify-end">
          <button
            onClick={handleComment}
            disabled={loading || !text.trim()}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-kpop-pink to-kpop-purple text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </div>

      {/* Comment tree */}
      <div className="bg-card rounded-xl divide-y divide-kpop-border px-4">
        {comments.length === 0 ? (
          <p className="text-kpop-muted text-sm py-8 text-center">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))
        )}
      </div>
    </div>
  );
}

// // eslint-disable-next-line
// function toast(arg0: string) {}
