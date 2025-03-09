'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserProfile } from '@/lib/auth'
import { User } from '@/types'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserProfile()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {user && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-6">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name || 'User'} 
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-semibold">{user.name || 'User'}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Account Information</h3>
            <p><span className="font-medium">Account ID:</span> {user.id}</p>
            <p><span className="font-medium">Authentication Method:</span> {user.googleId ? 'Google' : 'Email/Password'}</p>
          </div>
        </div>
      )}
    </div>
  )
}