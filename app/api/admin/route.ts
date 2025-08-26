import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }

    const [users, bookings, pendingBookings, totalUsers, totalTeachers, totalStudents, totalBookings] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.booking.findMany({
        include: {
          student: { select: { name: true } },
          teacher: { select: { name: true } },
          scheduleSlot: true
        },
        orderBy: { scheduleSlot: { startTime: 'desc' } }
      }),
      prisma.booking.findMany({
        where: { status: 'pending' },
        include: {
          student: { select: { name: true } },
          teacher: { select: { name: true } },
          scheduleSlot: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count(),
      prisma.user.count({ where: { role: 'teacher' } }),
      prisma.user.count({ where: { role: 'student' } }),
      prisma.booking.count()
    ])

    return NextResponse.json({
      users,
      bookings,
      stats: {
        totalUsers,
        totalTeachers,
        totalStudents,
        totalBookings
      }
    })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}