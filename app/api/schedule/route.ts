import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!teacherProfile) {
      return NextResponse.json({ message: 'Teacher profile not found' }, { status: 404 })
    }

    const slots = await prisma.scheduleSlot.findMany({
      where: { 
        teacherProfileId: teacherProfile.id,
        startTime: { gte: new Date() }
      },
      include: {
        bookings: {
          include: {
            student: { select: { name: true } }
          }
        }
      },
      orderBy: { startTime: 'asc' }
    })

    return NextResponse.json(slots)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}