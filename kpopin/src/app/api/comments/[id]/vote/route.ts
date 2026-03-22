export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { type }  = await req.json();
  const userId    = session.user.id;
  const commentId = params.id;

  const existing = await prisma.vote.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });

  if (existing) {
    if (existing.type === type) {
      await prisma.vote.delete({ where: { userId_commentId: { userId, commentId } } });
    } else {
      await prisma.vote.update({ where: { userId_commentId: { userId, commentId } }, data: { type } });
    }
  } else {
    await prisma.vote.create({ data: { userId, commentId, type } });
  }

  return NextResponse.json({ ok: true });
}
