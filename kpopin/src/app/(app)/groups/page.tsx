import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GroupCard } from '@/components/groups/GroupCard';

export default async function GroupsPage() {
  const session = await auth();

  const groups = await prisma.kpopGroup.findMany({
    orderBy: { groupMembers: { _count: 'desc' } },
    include: {
      _count: { select: { groupMembers: true, posts: true } },
      groupMembers: { where: { userId: session!.user!.id }, select: { id: true } },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-800 text-gradient-pink">K-Pop Groups</h1>
        <p className="text-kpop-muted mt-1">Follow your favourite groups to personalise your feed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            isFollowing={group.groupMembers.length > 0}
            currentUserId={session!.user!.id as string}
          />
        ))}
      </div>
    </div>
  );
}
