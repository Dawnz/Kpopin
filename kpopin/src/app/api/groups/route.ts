import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const groups = await prisma.kpopGroup.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true, agency: true, members: true, description: true },
  });
  return NextResponse.json({ groups });
}
