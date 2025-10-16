'use client';

import React, { useState } from 'react';
import { Button } from '../components';

export default function LaporGPSPage() {
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    // Navigate to photo page
    setTimeout(() => {
      window.location.href = '/lapor/foto';
    }, 1000);
  };

  const handleLocationEdit = () => {
    console.log('Edit location clicked');
    // TODO: Open location picker/map
  };

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
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="w-8"></div>
        </div>
        
        {/* Step Info */}
        <div className="mt-3">
          <p className="text-sm text-orange-500 font-medium font-['CircularStd']">LANGKAH 1/5</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 font-['CircularStd']">
            Konfirmasi titik lokasi
          </h1>

          {/* Location Circle Placeholder */}
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900 font-['CircularStd']">Lokasi mati</p>
                <p className="text-sm text-gray-600 font-['CircularStd']">
                  Izinkan untuk membagikan lokasi untuk melanjutkan
                </p>
              </div>
              <button 
                onClick={handleLocationEdit}
                className="text-sm text-orange-500 font-medium font-['CircularStd']"
              >
                Izinkan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6">
        <Button
          onClick={handleConfirm}
          loading={loading}
          fullWidth
          className="bg-[#16a34a] hover:bg-[#15803d]"
        >
          Konfirmasi
        </Button>
      </div>
    </div>
  );
}