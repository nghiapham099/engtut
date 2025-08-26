'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    bio: '',
    experience: '',
    hourlyRate: 25,
    level: 'intermediate'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user.role !== 'teacher') {
      router.push('/dashboard')
    } else {
      fetchProfile()
    }
  }, [status, session, router])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      const data = await res.json()
      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })

      if (res.ok) {
        toast.success('Profile updated successfully!')
        router.push('/dashboard')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') return <div className="text-center py-8">Loading...</div>
  if (!session || session.user.role !== 'teacher') return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">✏️ Edit Profile</h1>
        <p className="text-gray-600">Update your teaching profile and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Tell students about yourself, your teaching style, and experience..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎓 Experience
            </label>
            <textarea
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Describe your teaching experience, certifications, and qualifications..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Hourly Rate ($)
              </label>
              <input
                type="number"
                value={profile.hourlyRate}
                onChange={(e) => setProfile({ ...profile, hourlyRate: parseInt(e.target.value) })}
                min="10"
                max="200"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📊 Teaching Level
              </label>
              <select
                value={profile.level}
                onChange={(e) => setProfile({ ...profile, level: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold disabled:opacity-50"
            >
              {loading ? '⏳ Updating...' : '💾 Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}