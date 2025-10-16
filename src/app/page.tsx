'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page on component mount
    router.push('/login');
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16a34a] mx-auto"></div>
        <p className="mt-4 text-gray-600 font-['CircularStd']">Mengalihkan ke halaman login...</p>
      </div>
    </div>
  );
}