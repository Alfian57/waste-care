'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, DetailItem } from '../../components';

export default function LaporFotoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddPhoto = () => {
    console.log('Add photo clicked');
    // Navigate to confirmation using Next.js router
    setTimeout(() => {
      router.push('/lapor/konfirmasi-foto');
    }, 500);
  };

  const handleBack = () => {
    router.back();
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
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="w-8"></div>
        </div>
        
        {/* Step Info */}
        <div className="mt-3">
          <p className="text-sm text-orange-500 font-medium font-['CircularStd']">LANGKAH 2/4</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 font-['CircularStd']">
            Tambahkan foto sampah
          </h1>

          {/* Camera Image */}
          <div className="flex justify-center">
            <img 
              src="/images/lapor-foto.png" 
              alt="Add photo" 
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <DetailItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              iconBgColor="bg-gray-100"
              iconColor="text-gray-500"
              title="Pastikan gambar jelas"
              description="Ai kami akan menganalisa foto untuk validasi otomatis"
            />
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6">
        <Button
          onClick={handleAddPhoto}
          loading={loading}
          fullWidth
          className="bg-[#16a34a] hover:bg-[#15803d]"
        >
          Tambahkan
        </Button>
      </div>
    </div>
  );
}