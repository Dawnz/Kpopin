export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId  = session.user.id;
  const groupId = params.id;

  const existing = await prisma.groupMember.findUnique({
    where: { userId_groupId: { userId, groupId } },
  });

  if (existing) {
    await prisma.groupMember.delete({ where: { userId_groupId: { userId, groupId } } });
    return NextResponse.json({ following: false });
  } else {
    await prisma.groupMember.create({ data: { userId, groupId } });
    return NextResponse.json({ following: true });
  }
}
