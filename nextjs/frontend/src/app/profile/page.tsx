'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile</h1>
          <ProfileContent />
        </div>
      </div>
    </ProtectedRoute>
  )
}

function ProfileContent() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Username</label>
          <p className="text-lg">{user.username}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="text-lg">{user.email}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Role</label>
          <p className="text-lg capitalize">{user.role}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Status</label>
          <p className="text-lg capitalize">{user.status}</p>
        </div>

        <div className="pt-4">
          <Button onClick={logout} variant="destructive">
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
