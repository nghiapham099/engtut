import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { isAvailable } = await request.json()

    const slot = await prisma.scheduleSlot.update({
      where: { id },
      data: { isAvailable }
    })

    return NextResponse.json(slot)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}