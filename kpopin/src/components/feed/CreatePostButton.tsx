'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const POST_TYPES = ['DISCUSSION', 'NEWS', 'UPDATE', 'MEDIA'] as const;

export function CreatePostButton() {
  const { data: session } = useSession();
  const [open, setOpen]   = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType]   = useState<'DISCUSSION' | 'NEWS' | 'UPDATE' | 'MEDIA'>('DISCUSSION');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, type }),
      });
      if (!res.ok) throw new Error();
      toast.success('Post created!');
      setOpen(false);
      setTitle('');
      setContent('');
      router.refresh();
    } catch {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-card rounded-xl p-4 flex items-center gap-3 text-kpop-muted hover:text-white hover:border-kpop-pink/30 transition-all text-sm"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-kpop-pink to-kpop-purple flex items-center justify-center text-xs font-bold text-white">
          {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <span>Share something with the fandom...</span>
        <Plus size={18} className="ml-auto text-kpop-pink" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-kpop-card border border-kpop-border rounded-2xl w-full max-w-lg mx-4 p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-700">Create Post</h2>
              <button onClick={() => setOpen(false)} className="text-kpop-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Type selector */}
            <div className="flex gap-2 mb-4">
              {POST_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                    type === t
                      ? 'bg-kpop-pink/10 text-kpop-pink border-kpop-pink/30'
                      : 'border-kpop-border text-kpop-muted hover:border-kpop-pink/20'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              className="w-full bg-kpop-dark border border-kpop-border rounded-lg px-4 py-3 text-sm mb-3 focus:outline-none focus:border-kpop-pink/50 transition-colors placeholder:text-kpop-muted"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening in the fandom?"
              rows={5}
              className="w-full bg-kpop-dark border border-kpop-border rounded-lg px-4 py-3 text-sm mb-4 focus:outline-none focus:border-kpop-pink/50 transition-colors placeholder:text-kpop-muted resize-none"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-kpop-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-kpop-pink to-kpop-purple text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
