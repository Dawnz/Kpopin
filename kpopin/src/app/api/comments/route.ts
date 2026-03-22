export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content, postId, parentId } = await req.json();
  if (!content || !postId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      parentId: parentId ?? null,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, username: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}

