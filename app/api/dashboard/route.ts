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
    
    if (isTeacher) {
      // Teacher dashboard data
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id }
      })

      if (!teacherProfile) {
        return NextResponse.json({ 
          stats: { bookings: 0, reviews: 0, rating: 0 },
          recentBookings: [],
          upcomingLessons: []
        })
      }

      const [bookings, reviews, upcomingLessons] = await Promise.all([
        prisma.booking.count({
          where: { teacherId: session.user.id }
        }),
        prisma.review.count({
          where: { teacherProfileId: teacherProfile.id }
        }),
        prisma.booking.findMany({
          where: {
            teacherId: session.user.id,
            status: 'confirmed',
            scheduleSlot: {
              startTime: { gte: new Date() }
            }
          },
          include: {
            student: { select: { name: true } },
            scheduleSlot: true
          },
          orderBy: { scheduleSlot: { startTime: 'asc' } },
          take: 5
        })
      ])

      const recentBookings = await prisma.booking.findMany({
        where: { teacherId: session.user.id },
        include: {
          student: { select: { name: true } },
          scheduleSlot: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })

      return NextResponse.json({
        stats: {
          bookings,
          reviews,
          rating: teacherProfile.rating
        },
        recentBookings,
        upcomingLessons
      })
    } else {
      // Student dashboard data
      const [bookings, upcomingLessons] = await Promise.all([
        prisma.booking.count({
          where: { studentId: session.user.id }
        }),
        prisma.booking.findMany({
          where: {
            studentId: session.user.id,
            status: 'confirmed',
            scheduleSlot: {
              startTime: { gte: new Date() }
            }
          },
          include: {
            teacher: { select: { name: true } },
            scheduleSlot: true
          },
          orderBy: { scheduleSlot: { startTime: 'asc' } },
          take: 5
        })
      ])

      const reviews = await prisma.review.count({
        where: { userId: session.user.id }
      })

      return NextResponse.json({
        stats: {
          bookings,
          reviews,
          rating: 0
        },
        recentBookings: [],
        upcomingLessons
      })
    }
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}