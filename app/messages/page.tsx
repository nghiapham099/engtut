'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session) {
      fetchConversations()
    }
  }, [status, session, router])

  const fetchConversations = async () => {
    try {
      // Mock conversations for demo
      const mockConversations = [
        {
          id: 1,
          name: 'Sarah Johnson',
          lastMessage: 'Great lesson today! See you next week.',
          time: '2 hours ago',
          unread: 2,
          avatar: '👩‍🏫'
        },
        {
          id: 2,
          name: 'Michael Brown',
          lastMessage: 'Thanks for the grammar exercises!',
          time: '1 day ago',
          unread: 0,
          avatar: '👨‍🏫'
        },
        {
          id: 3,
          name: 'Emma Wilson',
          lastMessage: 'Looking forward to our conversation practice.',
          time: '3 days ago',
          unread: 1,
          avatar: '👩‍💼'
        }
      ]
      setConversations(mockConversations)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) return <div className="text-center py-8">Loading...</div>
  if (!session) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">💬 Messages</h1>
        <p className="text-gray-600">Stay connected with your teachers and students</p>
      </div>

      {conversations.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {conversations.map((conversation: any, index) => (
            <div key={conversation.id} className={`p-6 hover:bg-gray-50 transition-all duration-300 cursor-pointer ${index !== conversations.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                    {conversation.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{conversation.name}</h3>
                    <p className="text-gray-600 text-sm">{conversation.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-2">{conversation.time}</p>
                  {conversation.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No messages yet</h3>
          <p className="text-gray-500 mb-6">Start a conversation with your teachers or students</p>
          <button
            onClick={() => router.push('/search')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold"
          >
            🔍 Find Teachers
          </button>
        </div>
      )}
    </div>
  )
}