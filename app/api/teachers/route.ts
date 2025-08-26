import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Only students and admins can view teachers
    if (!session || session.user.role === 'teacher') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const teachers = await prisma.teacherProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(teachers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 })
  }
}