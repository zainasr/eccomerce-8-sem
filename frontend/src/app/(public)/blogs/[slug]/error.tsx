'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function BlogDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog detail page error:', error);
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
          <h1 className="text-2xl md:text-3xl font-bold">Blog not found</h1>
          <p className="text-text-secondary">
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
          <Link href={ROUTES.BLOGS}>
            <Button>Browse All Blogs</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

