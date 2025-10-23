'use client';

import React, { useState, useEffect } from 'react';

export default function MengunggahPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate to confirmation page after upload complete
          setTimeout(() => {
            window.location.href = '/lapor/konfirmasi-data';
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Progress Bar */}
          <div className="flex-1 mx-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-1 bg-orange-500 rounded"></div>
              <div className="flex-1 h-1 bg-orange-500 rounded"></div>
              <div className="flex-1 h-1 bg-orange-500 rounded"></div>
              <div className="flex-1 h-1 bg-orange-500 rounded"></div>
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="w-8"></div>
        </div>
        
        {/* Step Info */}
        <div className="mt-3">
          <p className="text-sm text-orange-500 font-medium font-['CircularStd']">LANGKAH 4/5</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="text-center space-y-8">
          <h1 className="text-2xl font-bold text-gray-900 font-['CircularStd']">
            Mulai mengunggah...
          </h1>

          {/* Upload Animation Image */}
          <div className="flex justify-center pt-24">
            <div className="relative">
              <img 
                src="/images/lapor-uploading.png" 
                alt="Uploading" 
                className="w-64 h-64 object-contain animate-bounce"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}