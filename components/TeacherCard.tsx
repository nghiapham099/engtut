import Link from 'next/link'
import Image from 'next/image'

interface TeacherCardProps {
  teacher: {
    id: string
    user: {
      name: string
      image?: string
    }
    bio: string
    hourlyRate: number
    rating: number
    totalReviews: number
    level: string
  }
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {teacher.user.image ? (
            <Image
              src={teacher.user.image}
              alt={teacher.user.name || 'Teacher'}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <span className="text-2xl text-gray-500">👨‍🏫</span>
          )}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{teacher.user.name}</h3>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-600">
              {teacher.rating.toFixed(1)} ({teacher.totalReviews} reviews)
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 sm:line-clamp-3">{teacher.bio}</p>
      
      <div className="flex justify-between items-center">
        <div>
          <span className="text-lg font-bold text-green-600">${teacher.hourlyRate}/hr</span>
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {teacher.level}
          </span>
        </div>
        <Link
          href={`/teachers/${teacher.id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}