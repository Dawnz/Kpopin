'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Users, FileText, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    agency: string | null;
    debutYear: number | null;
    members: string[];
    _count: { groupMembers: number; posts: number };
  };
  isFollowing: boolean;
  currentUserId: string;
}

export function GroupCard({ group, isFollowing: initialFollowing }: GroupCardProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading]     = useState(false);

  async function toggleFollow() {
    setLoading(true);
    try {
      const res = await fetch(`/api/groups/${group.id}/follow`, { method: 'POST' });
      if (!res.ok) throw new Error();
      setFollowing(!following);
      toast.success(following ? `Unfollowed ${group.name}` : `Following ${group.name}!`);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  // Generate a consistent gradient per group name
  const gradients = [
    'from-kpop-pink to-kpop-purple',
    'from-kpop-purple to-kpop-cyan',
    'from-kpop-cyan to-kpop-pink',
    'from-kpop-yellow to-kpop-pink',
  ];
  const gradient = gradients[group.name.charCodeAt(0) % gradients.length];

  return (
    <div className="bg-card rounded-xl overflow-hidden hover:border-kpop-pink/20 transition-all animate-fade-in">
      {/* Cover */}
      <div className={cn('h-16 bg-gradient-to-r', gradient, 'opacity-60')} />

      <div className="p-4 -mt-6">
        {/* Avatar */}
        <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br', gradient, 'flex items-center justify-center text-white font-display font-800 text-lg mb-3 border-2 border-kpop-dark')}>
          {group.name[0]}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/groups/${group.slug}`}>
              <h3 className="font-display font-700 text-base hover:text-kpop-pink transition-colors">{group.name}</h3>
            </Link>
            {group.agency && <p className="text-xs text-kpop-muted">{group.agency} · {group.debutYear}</p>}
          </div>
          <button
            onClick={toggleFollow}
            disabled={loading}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex-shrink-0',
              following
                ? 'bg-kpop-pink/10 text-kpop-pink border-kpop-pink/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                : 'border-kpop-border text-kpop-muted hover:border-kpop-pink/30 hover:text-kpop-pink'
            )}
          >
            {following ? <><Check size={12} /> Following</> : <><Plus size={12} /> Follow</>}
          </button>
        </div>

        {group.description && (
          <p className="text-xs text-kpop-muted mt-2 line-clamp-2">{group.description}</p>
        )}

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-kpop-border">
          <span className="flex items-center gap-1 text-xs text-kpop-muted">
            <Users size={11} /> {group._count.groupMembers} fans
          </span>
          <span className="flex items-center gap-1 text-xs text-kpop-muted">
            <FileText size={11} /> {group._count.posts} posts
          </span>
          <div className="ml-auto text-xs text-kpop-muted truncate max-w-[120px]">
            {group.members.slice(0, 3).join(', ')}{group.members.length > 3 ? '...' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
