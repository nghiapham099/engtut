'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

export default function BookLessonPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [teacher, setTeacher] = useState<any>(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [isTrialLesson, setIsTrialLesson] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (params.teacherId) {
      fetchTeacher()
      fetchSlots()
    }
  }, [params.teacherId])

  const fetchTeacher = async () => {
    try {
      const res = await fetch(`/api/teachers/${params.teacherId}`)
      const data = await res.json()
      setTeacher(data)
    } catch (error) {
      console.error('Error fetching teacher:', error)
    }
  }

  const fetchSlots = async () => {
    try {
      const res = await fetch(`/api/teachers/${params.teacherId}/slots`)
      const data = await res.json()
      setSlots(data)
    } catch (error) {
      console.error('Error fetching slots:', error)
    }
  }

  const handleBooking = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    if (!selectedSlot) {
      toast.error('Please select a time slot')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherProfileId: params.teacherId,
          scheduleSlotId: selectedSlot,
          isTrialLesson
        })
      })

      if (res.ok) {
        toast.success('Lesson booked successfully!')
        router.push('/dashboard')
      } else {
        const error = await res.json()
        toast.error(error.message || 'Booking failed')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!teacher) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Book a Lesson with {teacher.user.name}</h1>
        
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-2xl font-bold text-green-600">
              ${teacher.hourlyRate}/hour
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {teacher.level}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Available Time Slots</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slots.length > 0 ? (
              slots.map((slot: any) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`p-3 border rounded-lg text-sm ${
                    selectedSlot === slot.id
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {new Date(slot.startTime).toLocaleDateString()} <br />
                  {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </button>
              ))
            ) : (
              <p className="col-span-2 text-gray-500">No available slots</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isTrialLesson}
              onChange={(e) => setIsTrialLesson(e.target.checked)}
              className="mr-2"
            />
            <span>This is a trial lesson (50% discount)</span>
          </label>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Booking Summary</h4>
          <div className="flex justify-between">
            <span>Lesson Price:</span>
            <span>${isTrialLesson ? (teacher.hourlyRate * 0.5).toFixed(2) : teacher.hourlyRate}</span>
          </div>
          {isTrialLesson && (
            <div className="flex justify-between text-green-600">
              <span>Trial Discount:</span>
              <span>-50%</span>
            </div>
          )}
        </div>

        <button
          onClick={handleBooking}
          disabled={loading || !selectedSlot}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  )
}