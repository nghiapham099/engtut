import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.scheduleSlot.deleteMany()
  await prisma.teacherProfile.deleteMany()
  await prisma.user.deleteMany()

  // Create students
  const students = []
  const studentData = [
    { name: 'John Student', email: 'student@example.com' },
    { name: 'Maria Garcia', email: 'maria@example.com' },
    { name: 'Chen Wei', email: 'chen@example.com' },
    { name: 'Ahmed Hassan', email: 'ahmed@example.com' },
    { name: 'Anna Kowalski', email: 'anna@example.com' }
  ]

  for (const student of studentData) {
    const hashedPassword = await bcrypt.hash('password123', 12)
    const user = await prisma.user.create({
      data: {
        name: student.name,
        email: student.email,
        password: hashedPassword,
        role: 'student'
      }
    })
    students.push(user)
  }

  // Create teachers with profiles
  const teachers = []
  const teacherData = [
    {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      bio: 'Native English speaker with 5 years of teaching experience. Specializing in conversational English and business communication.',
      experience: '5 years teaching English online and in-person. TEFL certified.',
      hourlyRate: 25,
      level: 'intermediate'
    },
    {
      name: 'Michael Brown',
      email: 'michael@example.com',
      bio: 'Experienced English teacher focusing on grammar and pronunciation. Patient and encouraging teaching style.',
      experience: '8 years of ESL teaching experience. Masters in English Literature.',
      hourlyRate: 30,
      level: 'advanced'
    },
    {
      name: 'Emma Wilson',
      email: 'emma@example.com',
      bio: 'Fun and energetic teacher perfect for beginners. Makes learning English enjoyable and stress-free.',
      experience: '3 years teaching beginners. Certified in TESOL.',
      hourlyRate: 20,
      level: 'beginner'
    }
  ]

  for (const teacherInfo of teacherData) {
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const user = await prisma.user.create({
      data: {
        name: teacherInfo.name,
        email: teacherInfo.email,
        password: hashedPassword,
        role: 'teacher'
      }
    })

    const teacherProfile = await prisma.teacherProfile.create({
      data: {
        userId: user.id,
        bio: teacherInfo.bio,
        experience: teacherInfo.experience,
        hourlyRate: teacherInfo.hourlyRate,
        level: teacherInfo.level,
        rating: 4.5 + Math.random() * 0.5,
        totalReviews: 0
      }
    })

    teachers.push({ user, profile: teacherProfile })
  }

  // Create schedule slots and bookings
  const now = new Date()
  const bookings = []

  for (const teacher of teachers) {
    let completedBookings = 0
    
    // Create slots for the next 14 days
    for (let i = 1; i <= 14; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() + i)
      
      for (let hour = 9; hour <= 17; hour += 2) {
        const startTime = new Date(date)
        startTime.setHours(hour, 0, 0, 0)
        
        const endTime = new Date(startTime)
        endTime.setHours(hour + 1, 0, 0, 0)

        const slot = await prisma.scheduleSlot.create({
          data: {
            teacherProfileId: teacher.profile.id,
            startTime,
            endTime,
            isAvailable: true
          }
        })

        // Create some past bookings (completed lessons)
        if (i <= 7 && Math.random() > 0.4) {
          const pastDate = new Date(now)
          pastDate.setDate(pastDate.getDate() - (14 - i))
          pastDate.setHours(hour, 0, 0, 0)

          const pastEndTime = new Date(pastDate)
          pastEndTime.setHours(hour + 1, 0, 0, 0)

          const pastSlot = await prisma.scheduleSlot.create({
            data: {
              teacherProfileId: teacher.profile.id,
              startTime: pastDate,
              endTime: pastEndTime,
              isAvailable: false
            }
          })

          const randomStudent = students[Math.floor(Math.random() * students.length)]
          
          const booking = await prisma.booking.create({
            data: {
              studentId: randomStudent.id,
              teacherId: teacher.user.id,
              teacherProfileId: teacher.profile.id,
              scheduleSlotId: pastSlot.id,
              status: 'completed',
              isTrialLesson: Math.random() > 0.7,
              zoomLink: `https://zoom.us/j/mock-${Date.now()}-${Math.random()}`
            }
          })

          bookings.push(booking)
          completedBookings++

          // Create reviews for completed bookings
          if (Math.random() > 0.3) {
            const reviews = [
              'Excellent teacher! Very patient and helpful.',
              'Great lesson, learned a lot about pronunciation.',
              'Amazing conversation practice, highly recommend!',
              'Very professional and well-prepared lessons.',
              'Helped me improve my business English significantly.',
              'Fun and engaging teaching style, never boring!',
              'Clear explanations and good feedback.',
              'Perfect for beginners, very encouraging.'
            ]

            await prisma.review.create({
              data: {
                bookingId: booking.id,
                userId: randomStudent.id,
                teacherProfileId: teacher.profile.id,
                rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
                comment: reviews[Math.floor(Math.random() * reviews.length)]
              }
            })
          }
        }

        // Create some future bookings
        if (i > 7 && i <= 10 && Math.random() > 0.6) {
          const randomStudent = students[Math.floor(Math.random() * students.length)]
          
          await prisma.booking.create({
            data: {
              studentId: randomStudent.id,
              teacherId: teacher.user.id,
              teacherProfileId: teacher.profile.id,
              scheduleSlotId: slot.id,
              status: Math.random() > 0.7 ? 'pending' : 'confirmed',
              isTrialLesson: Math.random() > 0.8,
              zoomLink: `https://zoom.us/j/mock-${Date.now()}-${Math.random()}`
            }
          })

          await prisma.scheduleSlot.update({
            where: { id: slot.id },
            data: { isAvailable: false }
          })
        }
      }
    }

    // Update teacher profile with review count and rating
    const reviews = await prisma.review.findMany({
      where: { teacherProfileId: teacher.profile.id }
    })

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      
      await prisma.teacherProfile.update({
        where: { id: teacher.profile.id },
        data: {
          rating: avgRating,
          totalReviews: reviews.length
        }
      })
    }
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    }
  })

  console.log('Realistic seed data created successfully!')
  console.log(`Created ${students.length} students`)
  console.log(`Created ${teachers.length} teachers`)
  console.log(`Created ${bookings.length} completed bookings with reviews`)
  console.log('Created 1 admin user')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })