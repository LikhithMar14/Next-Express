'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import GoogleLoginButton from '@/components/GoogleLoginButton'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  // Function to handle login success
  const handleLoginSuccess = () => {
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="mt-2 text-gray-600">Access your account</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <LoginForm onSuccess={handleLoginSuccess} onError={setError} />
        
        <div className="flex items-center justify-center mt-4">
          <span className="border-t w-1/3"></span>
          <span className="px-4 text-gray-500">Or</span>
          <span className="border-t w-1/3"></span>
        </div>
        
        <div className="mt-4">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  )
}
