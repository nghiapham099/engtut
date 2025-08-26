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

    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { bio, experience, hourlyRate, level } = await request.json()

    const profile = await prisma.teacherProfile.upsert({
      where: { userId: session.user.id },
      update: { bio, experience, hourlyRate, level },
      create: {
        userId: session.user.id,
        bio,
        experience,
        hourlyRate,
        level,
        rating: 0,
        totalReviews: 0
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}