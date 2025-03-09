import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Welcome to the App</h1>
      <p className="text-xl mb-8">A secure application with Google OAuth and JWT authentication</p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link 
          href="/dashboard" 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Dashboard
        </Link>
      </div>
    </main>
  )
}