'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TeacherCard from '@/components/TeacherCard'

export default function SearchPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    level: '',
    minPrice: '',
    maxPrice: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const session = await res.json()
      
      if (session?.user?.role === 'teacher') {
        // Teachers cannot search for other teachers
        router.push('/dashboard')
        return
      }
      
      fetchTeachers()
    } catch (error) {
      fetchTeachers()
    }
  }

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/teachers')
      const data = await res.json()
      setTeachers(data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeachers = teachers.filter((teacher: any) => {
    const matchesSearch = !filters.search || 
      teacher.user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      teacher.bio.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesLevel = !filters.level || teacher.level === filters.level
    
    const matchesPrice = (!filters.minPrice || teacher.hourlyRate >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || teacher.hourlyRate <= parseFloat(filters.maxPrice))
    
    return matchesSearch && matchesLevel && matchesPrice
  })

  if (loading) return <div className="text-center py-8">Loading teachers...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect English Teacher</h1>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search teachers..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={filters.level}
            onChange={(e) => setFilters({...filters, level: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher: any) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No teachers found matching your criteria
          </div>
        )}
      </div>
    </div>
  )
}