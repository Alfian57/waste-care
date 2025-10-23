'use client';

import React, { useState } from 'react';
import { Button, DetailItem } from '../../components';

export default function KonfirmasiDataPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmitReport = () => {
    setLoading(true);
    // Simulate final submission
    setTimeout(() => {
      // Navigate to success page or dashboard
      alert('Laporan berhasil dikirim!');
      window.location.href = '/dashboard';
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
              <div className="flex-1 h-1 bg-orange-500 rounded"></div>
              <div className="flex-1 h-1 bg-orange-500 rounded"></div>
            </div>
          </div>
          
          <div className="w-8"></div>
        </div>
        
        {/* Step Info */}
        <div className="mt-3">
          <p className="text-sm text-orange-500 font-medium font-['CircularStd']">LANGKAH 5/5</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 font-['CircularStd'] text-center">
            Konfirmasi data
          </h1>

          {/* Photos Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 font-['CircularStd']">4 Foto diunggah</span>
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg border-2 border-white"></div>
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg border-2 border-white"></div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg border-2 border-white"></div>
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-white">+1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="space-y-4">
            {/* Waste Type */}
            <DetailItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
              title="Jenis sampah"
              description="Campuran"
            />

            {/* Waste Amount */}
            <DetailItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              }
              title="Muatan sampah"
              description="Lebih dari 10kg"
            />

            {/* Location */}
            <DetailItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              title="Kategori lokasi"
              description="Di tengah sungai"
            />
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6">
        <Button
          onClick={handleSubmitReport}
          loading={loading}
          fullWidth
          className="bg-[#16a34a] hover:bg-[#15803d]"
        >
          Kirim laporan
        </Button>
      </div>
    </div>
  );
}