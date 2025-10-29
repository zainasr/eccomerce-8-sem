'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { API_URL, ROUTES } from '@/lib/constants';
import { useParams } from 'next/navigation';
import {toast} from 'sonner';
export default  function VerifyEmailPage() {
  const params = useParams();
  const token = params.token;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');


  useEffect(() => {
    verifyEmail();
  },[]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-email/${token}`);
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully');
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      toast("error in verfigying email",{
        "description":error.message || ''
      })  
      setStatus('error');
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Verifying your email...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                <p className="text-lg font-semibold">{message}</p>
                <Link href={ROUTES.LOGIN}>
                  <Button className="w-full">Go to Login</Button>
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="h-16 w-16 text-red-600 mx-auto" />
                <p className="text-lg font-semibold">{message}</p>
                <Link href={ROUTES.LOGIN}>
                  <Button variant="outline" className="w-full">Back to Login</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}