export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { targetUserId } = await req.json();
  const userId = session.user.id;

  // Find existing DM between the two users
  const existing = await prisma.chat.findFirst({
    where: {
      isGroup: false,
      AND: [
        { members: { some: { userId } } },
        { members: { some: { userId: targetUserId } } },
      ],
    },
  });

  if (existing) return NextResponse.json({ chatId: existing.id });

  const chat = await prisma.chat.create({
    data: {
      isGroup: false,
      members: {
        create: [{ userId }, { userId: targetUserId }],
      },
    },
  });

  return NextResponse.json({ chatId: chat.id }, { status: 201 });
}

