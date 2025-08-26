import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = session.user.role === 'teacher'
    
    const bookings = await prisma.booking.findMany({
      where: isTeacher 
        ? { teacherId: session.user.id }
        : { studentId: session.user.id },
      include: {
        student: { select: { name: true } },
        teacher: { select: { name: true } },
        scheduleSlot: true
      },
      orderBy: { scheduleSlot: { startTime: 'desc' } }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}