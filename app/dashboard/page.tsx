'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({ bookings: 0, reviews: 0, rating: 0 })
  const [recentBookings, setRecentBookings] = useState([])
  const [upcomingLessons, setUpcomingLessons] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    
    if (status === 'authenticated' && session) {
      if (session.user.role === 'admin') {
        router.push('/admin')
        return
      }
      fetchDashboardData()
    }
  }, [status, session, router])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard')
      const data = await res.json()
      setStats(data.stats)
      setRecentBookings(data.recentBookings || [])
      setUpcomingLessons(data.upcomingLessons || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  if (status === 'loading') return <div className="text-center py-8">Loading...</div>
  if (status === 'unauthenticated') return null
  if (!session) return null

  const isTeacher = session.user.role === 'teacher'



  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Welcome back, {session.user.name}!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">
              {isTeacher ? 'Total Students' : 'Lessons Taken'}
            </h3>
            <div className="text-2xl">{isTeacher ? '👨‍🎓' : '📚'}</div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.bookings}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Reviews</h3>
            <div className="text-2xl">📝</div>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.reviews}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border border-yellow-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Rating</h3>
            <div className="text-2xl">⭐</div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{stats.rating ? stats.rating.toFixed(1) : 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isTeacher ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Teacher Actions</h3>
              <div className="space-y-3">
                <Link href="/profile/edit" className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg">
                  ✏️ Edit Profile
                </Link>
                <Link href="/schedule" className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg">
                  📅 Manage Schedule
                </Link>
                <Link href="/bookings" className="block w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg">
                  📚 View Bookings
                </Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
              {recentBookings.length > 0 ? (
                <div className="space-y-3">
                  {recentBookings.slice(0, 3).map((booking: any) => (
                    <div key={booking.id} className="border-l-4 border-blue-500 pl-4">
                      <p className="font-semibold">{booking.student.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.scheduleSlot.startTime).toLocaleDateString()} at{' '}
                        {new Date(booking.scheduleSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent bookings</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Student Actions</h3>
              <div className="space-y-3">
                <Link href="/search" className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg">
                  🔍 Find Teachers
                </Link>
                <Link href="/bookings" className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg">
                  🎓 My Lessons
                </Link>
                <Link href="/messages" className="block w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg">
                  💬 Messages
                </Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Upcoming Lessons</h3>
              {upcomingLessons.length > 0 ? (
                <div className="space-y-3">
                  {upcomingLessons.slice(0, 3).map((lesson: any) => (
                    <div key={lesson.id} className="border-l-4 border-green-500 pl-4">
                      <p className="font-semibold">{lesson.teacher?.name || lesson.student?.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(lesson.scheduleSlot.startTime).toLocaleDateString()} at{' '}
                        {new Date(lesson.scheduleSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <a href={lesson.zoomLink} className="text-blue-500 text-xs hover:underline">
                        Join Zoom Meeting
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming lessons</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}