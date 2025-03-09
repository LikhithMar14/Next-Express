import { User } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

/**
 * Login with email and password
 */
export const loginWithCredentials = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to login')
  }

  const data = await response.json()
  return data.user
}

/**
 * Register a new user
 */
export const registerUser = async (userData: { email: string; password: string; name: string }): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to register')
  }

  const data = await response.json()
  return data.user
}

/**
 * Get current user profile
 */
export const getUserProfile = async (): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user profile')
  }

  const data = await response.json()
  return data.user
}

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
  
  // Redirect to login page (client-side)
  window.location.href = '/login'
}

/**
 * Refresh the access token
 */
export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    })

    return response.ok
  } catch (error) {
    console.error('Failed to refresh token:', error)
    return false
  }
}

/**
 * Check if user is authenticated (client-side)
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await getUserProfile()
    return true
  } catch (error) {
    return false
  }
}