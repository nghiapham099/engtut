'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function TeacherProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      checkAccess()
    }
  }, [params.id])

  const checkAccess = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const session = await res.json()
      
      if (session?.user?.role === 'teacher') {
        // Teachers cannot view other teacher profiles
        router.push('/dashboard')
        return
      }
      
      fetchTeacher()
      fetchReviews()
    } catch (error) {
      fetchTeacher()
      fetchReviews()
    }
  }

  const fetchTeacher = async () => {
    try {
      const res = await fetch(`/api/teachers/${params.id}`)
      const data = await res.json()
      setTeacher(data)
    } catch (error) {
      console.error('Error fetching teacher:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/teachers/${params.id}/reviews`)
      const data = await res.json()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (!teacher) return <div className="text-center py-8">Teacher not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col sm:flex-row items-start space-y-6 sm:space-y-0 sm:space-x-6 mb-8">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {teacher.user.image ? (
              <Image
                src={teacher.user.image}
                alt={teacher.user.name}
                width={128}
                height={128}
                className="rounded-full"
              />
            ) : (
              <span className="text-4xl">👨🏫</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{teacher.user.name}</h1>
            <div className="flex items-center mb-4">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="ml-2 text-lg">{teacher.rating.toFixed(1)} ({teacher.totalReviews} reviews)</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {teacher.level}
              </span>
              <span className="text-2xl font-bold text-green-600">
                ${teacher.hourlyRate}/hour
              </span>
            </div>
            <Link
              href={`/book/${teacher.id}`}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block"
            >
              Book a Lesson
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            <p className="text-gray-700 mb-6">{teacher.bio}</p>
            
            <h3 className="text-xl font-semibold mb-2">Experience</h3>
            <p className="text-gray-700 mb-4">{teacher.experience}</p>
            
            {teacher.certifications && (
              <>
                <h3 className="text-xl font-semibold mb-2">Certifications</h3>
                <p className="text-gray-700">{teacher.certifications}</p>
              </>
            )}
          </div>

          <div>
            {teacher.introVideo && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Introduction Video</h3>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Video Player</span>
                </div>
              </div>
            )}

            <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.slice(0, 3).map((review: any) => (
                  <div key={review.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center mb-1">
                      <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                      <span className="ml-2 font-semibold">{review.user.name}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}