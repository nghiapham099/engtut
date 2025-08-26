import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { teacherProfileId, scheduleSlotId, isTrialLesson } = await request.json()

    const slot = await prisma.scheduleSlot.findUnique({
      where: { id: scheduleSlotId },
      include: { teacherProfile: true }
    })

    if (!slot || !slot.isAvailable) {
      return NextResponse.json({ message: 'Slot not available' }, { status: 400 })
    }

    const booking = await prisma.booking.create({
      data: {
        studentId: session.user.id,
        teacherId: slot.teacherProfile.userId,
        teacherProfileId,
        scheduleSlotId,
        isTrialLesson,
        zoomLink: `https://zoom.us/j/mock-${Date.now()}`
      }
    })

    await prisma.scheduleSlot.update({
      where: { id: scheduleSlotId },
      data: { isAvailable: false }
    })

    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}