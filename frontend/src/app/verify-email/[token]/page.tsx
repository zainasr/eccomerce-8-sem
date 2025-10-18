'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, use, useEffect, useState } from 'react'

interface Props {
  params: Promise<{ token: string }>
}

function VerifyEmailClient({ token }: { token: string }) {
  const router = useRouter()
  const { verifyEmail: authVerifyEmail } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    verifyEmail()
  }, [])

  const verifyEmail = async () => {
    try {
      await authVerifyEmail(token)
      setStatus('success')
      setMessage('Your email has been verified successfully! You can now sign in.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Email verification failed. The link may be expired or invalid.')
    }
  }



  const handleRedirect = () => {
    if (status === 'success') {
      router.push('/login?message=Email verified successfully. Please sign in.')
    } else {
      router.push('/login')
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              {status === 'loading' && (
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-12 w-12 text-green-600" />
              )}
              {status === 'error' && (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {status === 'loading' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className={`text-sm ${status === 'success' ? 'text-green-700' :
                status === 'error' ? 'text-red-700' :
                  'text-gray-600'
                }`}>
                {message}
              </p>
            </div>

            <Button
              onClick={handleRedirect}
              className="w-full"
              variant={status === 'success' ? 'default' : 'outline'}
            >
              {status === 'success' ? 'Continue to Login' : 'Back to Login'}
            </Button>

            {status === 'error' && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Need help? Try:
                </p>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/resend-verification')}
                    className="w-full"
                  >
                    Resend Verification Email
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/register')}
                    className="w-full"
                  >
                    Register Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage({ params }: Props) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    }>
      <VerifyEmailClient token={use(params).token} />
    </Suspense>
  )
}


