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

  // Create sample teachers
  const teachers = [
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

  for (const teacherData of teachers) {
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const user = await prisma.user.create({
      data: {
        name: teacherData.name,
        email: teacherData.email,
        password: hashedPassword,
        role: 'teacher'
      }
    })

    const teacherProfile = await prisma.teacherProfile.create({
      data: {
        userId: user.id,
        bio: teacherData.bio,
        experience: teacherData.experience,
        hourlyRate: teacherData.hourlyRate,
        level: teacherData.level,
        rating: 4.5 + Math.random() * 0.5,
        totalReviews: Math.floor(Math.random() * 50) + 10
      }
    })

    // Create sample schedule slots
    const now = new Date()
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() + i)
      
      for (let hour = 9; hour <= 17; hour += 2) {
        const startTime = new Date(date)
        startTime.setHours(hour, 0, 0, 0)
        
        const endTime = new Date(startTime)
        endTime.setHours(hour + 1, 0, 0, 0)

        await prisma.scheduleSlot.create({
          data: {
            teacherProfileId: teacherProfile.id,
            startTime,
            endTime,
            isAvailable: Math.random() > 0.3
          }
        })
      }
    }
  }

  // Create a sample student
  const studentPassword = await bcrypt.hash('password123', 12)
  await prisma.user.create({
    data: {
      name: 'John Student',
      email: 'student@example.com',
      password: studentPassword,
      role: 'student'
    }
  })

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

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })