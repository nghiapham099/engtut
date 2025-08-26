'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function HomePage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')

  const testimonials = [
    { name: 'Sarah M.', text: 'Amazing teachers! My English improved so much in just 3 months.' },
    { name: 'Carlos R.', text: 'Flexible scheduling and great conversation practice.' },
    { name: 'Li Wei', text: 'Professional teachers who really care about your progress.' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-300 opacity-20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-300 opacity-15 rounded-full animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
            Learn English with Native Speakers
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-gray-100">
            🌟 Connect with qualified English teachers for personalized 1-on-1 lessons. 
            Improve your speaking, writing, and confidence with expert guidance.
          </p>
          
          {/* Quick Search */}
          <div className="max-w-lg mx-auto mb-12">
            <div className="flex flex-col sm:flex-row shadow-2xl rounded-2xl overflow-hidden">
              <input
                type="text"
                placeholder="🔍 Search for your perfect teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-6 py-4 text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300"
              />
              <Link
                href={`/search?q=${searchQuery}`}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 px-8 py-4 font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 text-center"
              >
                Search Now
              </Link>
            </div>
          </div>
          
          {!session && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/register"
                className="bg-white text-purple-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 text-center shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🚀 Get Started Free
              </Link>
              <Link
                href="/login"
                className="border-3 border-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 text-center shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                👋 Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EngTutor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">👨🏫</div>
              <h3 className="text-xl font-semibold mb-2">Qualified Teachers</h3>
              <p className="text-gray-600">Native speakers with teaching experience and certifications</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Book lessons that fit your schedule, available 24/7</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">One-on-one lessons tailored to your goals and level</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8">Join thousands of students improving their English every day</p>
          <Link
            href="/search"
            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-8 py-3 rounded-lg font-semibold"
          >
            Find Your Teacher
          </Link>
        </div>
      </section>
    </div>
  )
}