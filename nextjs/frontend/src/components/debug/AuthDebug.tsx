'use client'

import { useAuth } from '@/contexts/AuthContext'

export function AuthDebug() {
  const { user, isAuthenticated, isLoading, error, isInitialized } = useAuth()

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <div>Initialized: <span className={isInitialized ? 'text-green-400' : 'text-red-400'}>{String(isInitialized)}</span></div>
        <div>Loading: <span className={isLoading ? 'text-yellow-400' : 'text-green-400'}>{String(isLoading)}</span></div>
        <div>Authenticated: <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>{String(isAuthenticated)}</span></div>
        <div>User: <span className="text-blue-400">{user ? user.username : 'null'}</span></div>
        <div>Token: <span className="text-blue-400">{typeof window !== 'undefined' && localStorage.getItem('accessToken') ? 'exists' : 'missing'}</span></div>
        {error && <div>Error: <span className="text-red-400">{error}</span></div>}
      </div>
    </div>
  )
}
