import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const slots = await prisma.scheduleSlot.findMany({
      where: {
        teacherProfileId: id,
        isAvailable: true,
        startTime: {
          gte: new Date()
        }
      },
      orderBy: { startTime: 'asc' }
    })

    return NextResponse.json(slots)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 })
  }
}