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

          {/* Upload Animation Circle */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              {/* Background Circle */}
              <div className="absolute inset-0 bg-gray-100 rounded-full"></div>
              
              {/* Progress Circle */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="4"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  className="transition-all duration-300 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-900 font-['CircularStd']">{progress}%</p>
              </div>
            </div>
          </div>

          {/* Status Text */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900 font-['CircularStd']">
              {progress < 50 ? 'Mengunggah foto...' : 
               progress < 90 ? 'Memproses data...' : 
               progress < 100 ? 'Hampir selesai...' : 'Selesai!'}
            </p>
            <p className="text-sm text-gray-600 font-['CircularStd']">
              {progress < 100 ? 'Harap tunggu, jangan tutup aplikasi' : 'Laporan berhasil diunggah'}
            </p>
          </div>

          {/* Loading Dots */}
          {progress < 100 && (
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}