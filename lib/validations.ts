import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'teacher'])
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export const teacherProfileSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  experience: z.string().min(5, 'Experience must be at least 5 characters'),
  certifications: z.string().optional(),
  hourlyRate: z.number().min(5, 'Hourly rate must be at least $5'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  introVideo: z.string().url().optional().or(z.literal(''))
})

export const bookingSchema = z.object({
  teacherProfileId: z.string(),
  scheduleSlotId: z.string(),
  isTrialLesson: z.boolean().default(false)
})

export const reviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
})