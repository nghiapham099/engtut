'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session) {
      fetchBookings()
    }
  }, [status, session, router])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings/my')
      const data = await res.json()
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) return <div className="text-center py-8">Loading...</div>
  if (!session) return null

  const isTeacher = session.user.role === 'teacher'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {isTeacher ? '📚 My Teaching Sessions' : '🎓 My Lessons'}
        </h1>
        <p className="text-gray-600">
          {isTeacher ? 'Manage your teaching schedule and student sessions' : 'Track your learning journey and upcoming lessons'}
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="grid gap-6">
          {bookings.map((booking: any) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-blue-500">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {isTeacher ? booking.student.name[0] : booking.teacher.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {isTeacher ? `Student: ${booking.student.name}` : `Teacher: ${booking.teacher.name}`}
                      </h3>
                      <p className="text-gray-600">
                        📅 {new Date(booking.scheduleSlot.startTime).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      🕐 {new Date(booking.scheduleSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(booking.scheduleSlot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {booking.isTrialLesson && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                        ⭐ Trial Lesson
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-3">
                  <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status === 'completed' ? '✅ Completed' :
                     booking.status === 'confirmed' ? '📋 Confirmed' : 
                     '⏳ Pending'}
                  </span>
                  
                  {booking.status === 'confirmed' && (
                    <a 
                      href={booking.zoomLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 font-medium"
                    >
                      🎥 Join Meeting
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            {isTeacher ? 'No teaching sessions yet' : 'No lessons booked yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {isTeacher ? 'Students will appear here once they book your lessons' : 'Start your learning journey by booking your first lesson'}
          </p>
          {!isTeacher && (
            <button
              onClick={() => router.push('/search')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold"
            >
              🔍 Find Teachers
            </button>
          )}
        </div>
      )}
    </div>
  )
}