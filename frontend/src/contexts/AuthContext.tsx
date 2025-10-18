'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export interface User {
  id: string
  email: string
  username: string
  role: 'buyer' | 'seller' | 'admin'
  status: string
  profile?: {
    firstName?: string
    lastName?: string
    profilePicture?: string
  }
}
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  login: (identifier: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>
  switchRole: (role: 'buyer' | 'seller') => Promise<void>
  clearError: () => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
      checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        setIsAuthenticated(true);
      } else if (response.status === 401 || response.status === 403) {
        setUser(null);
        setIsAuthenticated(false);
      } else {
        // Handle other errors
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }


  // No token required endpoints
  const login = async (identifier: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }
      setUser(data.data.user)
      setIsAuthenticated(true)
    } catch (err:unknown) {
      setError((err as Error).message || 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Request failed')
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Request failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed')
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Password reset failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (token: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Email verification failed')
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Email verification failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification email')
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to send verification email')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Token required endpoints (need credentials: 'include')
  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Always clear local state regardless of server response
      setUser(null);
      setIsAuthenticated(false);
  
      if (!response.ok) {
        console.warn('Logout request failed, but local state was cleared');
      }
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  const switchRole = async (role: 'buyer' | 'seller') => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/auth/switch-role`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Role switch failed')
      }

      if (data.requiresReauth) {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Role switch failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    switchRole,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}