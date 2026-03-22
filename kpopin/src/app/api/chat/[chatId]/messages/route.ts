export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const messages = await prisma.message.findMany({
    where: { chatId: params.chatId },
    orderBy: { createdAt: 'asc' },
    include: { sender: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest, { params }: { params: { chatId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: 'Empty message' }, { status: 400 });

  // Verify user is a member of this chat
  const member = await prisma.chatMember.findUnique({
    where: { userId_chatId: { userId: session.user.id, chatId: params.chatId } },
  });
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const message = await prisma.message.create({
    data: { content, chatId: params.chatId, senderId: session.user.id },
    include: { sender: { select: { id: true, name: true } } },
  });

  return NextResponse.json(message, { status: 201 });
}
