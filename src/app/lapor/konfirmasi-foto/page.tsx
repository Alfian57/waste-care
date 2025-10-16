'use client';

import React, { useState } from 'react';
import { Button } from '../../components';
import Image from 'next/image';

export default function KonfirmasiFotoPage() {
  const [loading, setLoading] = useState(false);

  const handleUploadPhoto = () => {
    setLoading(true);
    // Simulate upload process
    setTimeout(() => {
      window.location.href = '/lapor/mengunggah';
    }, 2000);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="p-2 -ml-2">
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
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="w-8"></div>
        </div>
        
        {/* Step Info */}
        <div className="mt-3">
          <p className="text-sm text-orange-500 font-medium font-['CircularStd']">LANGKAH 3/5</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 font-['CircularStd'] text-center">
            Konfirmasi foto sampah
          </h1>

          {/* Photos Grid */}
          <div className="space-y-4">
            {/* Photo 1 */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-green-400 rounded-xl overflow-hidden">
                <Image
                src=""
                alt="Preview foto"
                width={500}
                height={500}
                className="w-full h-64 object-cover rounded-lg"
                /> 
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Photo 2 */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-400 rounded-xl overflow-hidden">
                <Image
                src=""
                alt="Preview foto"
                width={500}
                height={500}
                className="w-full h-64 object-cover rounded-lg"
                /> 
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6">
        <Button
          onClick={handleUploadPhoto}
          loading={loading}
          fullWidth
          className="bg-[#16a34a] hover:bg-[#15803d]"
        >
          Unggah foto
        </Button>
      </div>
    </div>
  );
}