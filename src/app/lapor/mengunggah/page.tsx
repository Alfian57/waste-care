'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/contexts/ReportContext';
import { submitReport } from '@/lib/reportService';

export default function MengunggahPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { reportData, setAiValidation } = useReport();

  const handleUpload = async () => {
    try {
      // Validate only required data (location and photos)
      if (!reportData.location || reportData.photos.length === 0) {
        throw new Error('Data tidak lengkap');
      }

      // Simulate progress for first photo (0-30%)
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress <= 30) {
          setProgress(currentProgress);
        }
      }, 100);

      // Upload first photo - let AI generate waste type, volume, and location category
      const result = await submitReport({
        imageBase64: reportData.photos[0],
        latitude: reportData.location.latitude.toString(),
        longitude: reportData.location.longitude.toString(),
        notes: reportData.notes,
      });

      clearInterval(progressInterval);

      console.log('Upload result:', result);

      // Check if upload was successful
      if (!result.success) {
        // Handle validation failure (not waste)
        if (result.validation && !result.validation.isWaste) {
          const reason = result.validation.reason || 'Gambar tidak terdeteksi sebagai sampah';
          throw new Error(
            `${result.message || 'Validasi gambar gagal'}\n\nAlasan: ${reason}`
          );
        }
        
        // Handle parsing errors with more specific messages
        const errorMsg = result.error || result.message || 'Gagal mengunggah laporan';
        
        if (errorMsg.includes('AI validation failed - empty response')) {
          throw new Error(
            'Validasi AI gagal. Mohon coba lagi dengan foto yang lebih jelas dan terang.'
          );
        }
        
        if (errorMsg.includes('Failed to parse Gemini AI response')) {
          throw new Error(
            'Terjadi kesalahan saat validasi gambar oleh AI. Mohon coba lagi dengan foto yang lebih jelas.'
          );
        }
        
        if (errorMsg.includes('Gemini AI validation failed')) {
          throw new Error(
            'Layanan validasi AI sedang bermasalah. Mohon coba lagi nanti.'
          );
        }
        
        if (errorMsg.includes('Bucket not found')) {
          throw new Error(
            'Kesalahan konfigurasi storage. Mohon hubungi administrator.'
          );
        }
        
        throw new Error(errorMsg);
      }

      // Save AI validation result to context
      if (result.data?.validation) {
        setAiValidation(result.data.validation);
      }

      // Simulate remaining progress (30-100%)
      const completeProgress = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(completeProgress);
            setUploading(false);
            // Navigate to success page using Next.js router
            setTimeout(() => {
              router.push('/lapor/konfirmasi-data');
            }, 1000);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunggah');
      setUploading(false);
    }
  };

  useEffect(() => {
    // Debug: Log all report data
    console.log('Report data in mengunggah page:', reportData);
    
    // Validate only required data before starting upload
    if (!reportData.location) {
      console.error('Missing location data');
      alert('Data lokasi tidak ditemukan. Mohon mulai dari awal.');
      router.push('/lapor');
      return;
    }
    if (reportData.photos.length === 0) {
      console.error('Missing photos');
      alert('Foto tidak ditemukan. Mohon tambahkan foto terlebih dahulu.');
      router.push('/lapor/konfirmasi-foto');
      return;
    }

    // If all data is available, start upload
    handleUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    setError(null);
    setProgress(0);
    setUploading(true);
    handleUpload();
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
              <div className="flex-1 h-1 bg-orange-500 rounded"></div>
              <div className="flex-1 h-1 bg-orange-500 rounded"></div>
            </div>
          </div>
          
          <div className="w-8"></div>
        </div>
        
        {/* Step Info */}
        <div className="mt-3">
          <p className="text-sm text-orange-500 font-medium font-['CircularStd']">LANGKAH 4/4</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {error ? (
          // Error State
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900 font-['CircularStd']">
                Gagal mengunggah
              </h1>
              <p className="text-gray-600 font-['CircularStd']">
                {error}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Coba lagi
              </button>
              <button
                onClick={handleBack}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        ) : (
          // Uploading State
          <div className="text-center space-y-8">
            <h1 className="text-2xl font-bold text-gray-900 font-['CircularStd']">
              {uploading ? 'Mulai mengunggah...' : 'Berhasil diunggah!'}
            </h1>

            {/* Upload Animation Image */}
            <div className="flex justify-center pt-8">
              <div className="relative">
                {uploading ? (
                  <img 
                    src="/images/lapor-uploading.png" 
                    alt="Uploading" 
                    className="w-64 h-64 object-contain animate-bounce"
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center">
                    <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 font-['CircularStd']">
                  {progress}% selesai
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}