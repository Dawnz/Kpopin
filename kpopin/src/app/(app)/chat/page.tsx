export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ChatLayout } from '@/components/chat/ChatLayout';
export default async function ChatPage() {
  const session = await auth();

  const chats = await prisma.chat.findMany({
    where: { members: { some: { userId: session!.user!.id } } },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, username: true, image: true } } },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { sender: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Fan discovery: users who share groups with you
  const myGroupIds = (
    await prisma.groupMember.findMany({
      where: { userId: session!.user!.id },
      select: { groupId: true },
    })
  ).map((g) => g.groupId);

  const similarFans = myGroupIds.length
    ? await prisma.user.findMany({
        where: {
          id: { not: session!.user!.id },
          groupMembers: { some: { groupId: { in: myGroupIds } } },
        },
        take: 10,
        select: {
          id: true, name: true, username: true, image: true,
          groupMembers: { include: { group: { select: { name: true } } }, take: 3 },
        },
      })
    : [];

  return (
    <ChatLayout
      chats={chats as any}
      similarFans={similarFans as any}
      currentUserId={session!.user!.id as string}
    />
  );
}
