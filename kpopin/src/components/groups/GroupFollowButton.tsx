'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export function GroupFollowButton({ groupId, initialFollowing, groupName }: {
  groupId: string;
  initialFollowing: boolean;
  groupName: string;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading]     = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      await fetch(`/api/groups/${groupId}/follow`, { method: 'POST' });
      setFollowing(!following);
      toast.success(following ? `Unfollowed ${groupName}` : `Now following ${groupName}!`);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all',
        following
          ? 'bg-kpop-pink/10 text-kpop-pink border-kpop-pink/30'
          : 'bg-gradient-to-r from-kpop-pink to-kpop-purple text-white border-transparent hover:opacity-90'
      )}
    >
      {following ? <><Check size={14} /> Following</> : <><Plus size={14} /> Follow Group</>}
    </button>
  );
}
