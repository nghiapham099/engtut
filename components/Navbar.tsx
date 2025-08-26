'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              EngTutor
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                {session.user.role === 'student' && (
                  <Link href="/search" className="text-gray-700 hover:text-blue-600">
                    Find Teachers
                  </Link>
                )}
                {session.user.role === 'admin' && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600">
                    Admin Panel
                  </Link>
                )}
                <span className="text-sm text-gray-600">Hi, {session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu */}
          <div className="sm:hidden flex items-center">
            {session ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}