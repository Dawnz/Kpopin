import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, content, type, groupId } = await req.json();
  if (!title || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const post = await prisma.post.create({
    data: {
      title,
      content,
      type: type ?? 'DISCUSSION',
      authorId: session.user.id,
      groupId: groupId ?? null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');
  const cursor  = searchParams.get('cursor');
  const take    = 20;

  const posts = await prisma.post.findMany({
    where: groupId ? { groupId } : {},
    take,
    skip:    cursor ? 1 : 0,
    cursor:  cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      author:  { select: { id: true, name: true, username: true } },
      group:   { select: { id: true, name: true, slug: true } },
      _count:  { select: { comments: true, votes: true } },
    },
  });

  const nextCursor = posts.length === take ? posts[posts.length - 1].id : null;
  return NextResponse.json({ posts, nextCursor });
}
