'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState({
    users: [],
    bookings: [],
    stats: { totalUsers: 0, totalTeachers: 0, totalStudents: 0, totalBookings: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session && session.user.role !== 'admin') {
      router.push('/dashboard')
    } else if (session && session.user.role === 'admin') {
      fetchAdminData()
    }
  }, [status, session, router])

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin')
      const adminData = await res.json()
      setData(adminData)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' })
      })
      if (res.ok) {
        fetchAdminData()
      }
    } catch (error) {
      console.error('Error approving booking:', error)
    }
  }

  const rejectBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      })
      if (res.ok) {
        fetchAdminData()
      }
    } catch (error) {
      console.error('Error rejecting booking:', error)
    }
  }

  if (status === 'loading' || loading) return <div className="text-center py-8">Loading...</div>
  if (!session || session.user.role !== 'admin') return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{data.stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Teachers</h3>
          <p className="text-3xl font-bold text-green-600">{data.stats.totalTeachers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Students</h3>
          <p className="text-3xl font-bold text-purple-600">{data.stats.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-orange-600">{data.stats.totalBookings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* All Class History */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">📚 All Class History</h3>
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, data.bookings.length)} of {data.bookings.length} classes
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Student</th>
                  <th className="text-left py-2">Teacher</th>
                  <th className="text-left py-2">Date & Time</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {data.bookings
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((booking: any) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          {booking.student.name[0]}
                        </div>
                        {booking.student.name}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          {booking.teacher.name[0]}
                        </div>
                        {booking.teacher.name}
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        <div className="font-medium">
                          {new Date(booking.scheduleSlot.startTime).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {new Date(booking.scheduleSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(booking.scheduleSlot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {booking.isTrialLesson ? (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          ⭐ Trial
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                          📚 Regular
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(data.bookings.length / itemsPerPage) }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), Math.min(Math.ceil(data.bookings.length / itemsPerPage), currentPage + 2))
                .map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data.bookings.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(data.bookings.length / itemsPerPage)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">👥 All Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user: any) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2">{user.name}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                          user.role === 'student' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">⏳ Pending Approvals</h3>
            <div className="space-y-3">
              {data.bookings.filter((b: any) => b.status === 'pending').slice(0, 5).map((booking: any) => (
                <div key={booking.id} className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 p-3 rounded">
                  <p className="font-semibold">{booking.student.name} → {booking.teacher.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.scheduleSlot.startTime).toLocaleDateString()} at{' '}
                    {new Date(booking.scheduleSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => approveBooking(booking.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => rejectBooking(booking.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
              {data.bookings.filter((b: any) => b.status === 'pending').length === 0 && (
                <p className="text-gray-500">No pending approvals</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}