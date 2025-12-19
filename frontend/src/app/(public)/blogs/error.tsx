'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function BlogsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blogs page error:', error);
  }, [error]);

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-error" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Something went wrong</h1>
          <p className="text-text-secondary">
            We couldn&apos;t load the blogs. Please try again.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
          <Link href={ROUTES.BLOGS}>
            <Button>Go to Blogs</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

