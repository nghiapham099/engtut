'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function SchedulePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    
    if (status === 'authenticated' && session) {
      if (session.user.role !== 'teacher') {
        router.push('/dashboard')
        return
      }
      fetchSchedule()
    }
  }, [status, session, router])

  const fetchSchedule = async () => {
    try {
      const res = await fetch('/api/schedule')
      const data = await res.json()
      setSlots(data)
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (session?.user.role === 'teacher') {
      interval = setInterval(fetchSchedule, 30000) // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [session])

  const toggleSlot = async (slotId: string, isAvailable: boolean) => {
    try {
      const res = await fetch(`/api/schedule/${slotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !isAvailable })
      })

      if (res.ok) {
        toast.success(isAvailable ? 'Slot disabled' : 'Slot enabled')
        // Update local state immediately for instant feedback
        setSlots(prevSlots => 
          Array.isArray(prevSlots) ? prevSlots.map(slot => 
            slot.id === slotId ? { ...slot, isAvailable: !isAvailable } : slot
          ) : prevSlots
        )
      } else {
        toast.error('Failed to update slot')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  if (status === 'loading' || loading) return <div className="text-center py-8">Loading...</div>
  if (status === 'unauthenticated') return null
  if (!session || session.user.role !== 'teacher') return null

  const groupedSlots: Record<string, any[]> = {}
  if (Array.isArray(slots)) {
    slots.forEach((slot: any) => {
      const date = new Date(slot.startTime).toDateString()
      if (!groupedSlots[date]) groupedSlots[date] = []
      groupedSlots[date].push(slot)
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📅 Manage Schedule</h1>
        <p className="text-gray-600">Control your availability and manage your teaching slots</p>
      </div>

      {Object.keys(groupedSlots).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedSlots).map(([date, daySlots]: any) => (
            <div key={date} className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                📆 {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {daySlots.map((slot: any) => {
                  const hasBooking = slot.bookings && slot.bookings.length > 0
                  const isAvailable = slot.isAvailable && !hasBooking
                  
                  return (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        hasBooking 
                          ? 'border-red-300 bg-red-50' 
                          : isAvailable 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-800 mb-2">
                          🕐 {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        
                        <div className="mb-3">
                          {hasBooking ? (
                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                              🚫 Booked
                            </span>
                          ) : isAvailable ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              ✅ Available
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                              ⏸️ Disabled
                            </span>
                          )}
                        </div>

                        {!hasBooking && (
                          <button
                            onClick={() => toggleSlot(slot.id, slot.isAvailable)}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                              isAvailable
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            {isAvailable ? '❌ Disable' : '✅ Enable'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No schedule slots found</h3>
          <p className="text-gray-500">Your schedule will appear here once slots are created</p>
        </div>
      )}
    </div>
  )
}