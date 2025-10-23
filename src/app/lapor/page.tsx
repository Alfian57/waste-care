'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, BottomNavigation, DetailItem } from '../components';
import { useReport } from '@/contexts/ReportContext';

export default function LaporGPSPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { setLocation, reportData } = useReport();

  useEffect(() => {
    // Check if location is already captured
    if (reportData.location) {
      setLocationEnabled(true);
    }
  }, [reportData.location]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Browser Anda tidak mendukung geolocation');
      return;
    }

    setLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location captured:', { latitude, longitude });
        setLocation({ latitude, longitude });
        setLocationEnabled(true);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Izin lokasi ditolak. Mohon izinkan akses lokasi di pengaturan browser.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Informasi lokasi tidak tersedia');
            break;
          case error.TIMEOUT:
            setLocationError('Permintaan lokasi timeout');
            break;
          default:
            setLocationError('Terjadi kesalahan saat mendapatkan lokasi');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleConfirm = () => {
    if (!locationEnabled) {
      alert('Mohon izinkan akses lokasi terlebih dahulu');
      return;
    }

    console.log('Confirming with location:', reportData.location);
    setLoading(true);
    // Navigate to foto page using Next.js router (skip detail page)
    setTimeout(() => {
      router.push('/lapor/foto');
    }, 500);
  };

  const handleLocationEdit = () => {
    handleGetLocation();
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button 
            className="p-2 -ml-2"
            onClick={handleBack}
          >
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
            </div>
          </div>
          
          <div className="w-8"></div>
        </div>
        
        {/* Step Info */}
        <div className="mt-3">
          <p className="text-sm text-orange-500 font-medium font-['CircularStd']">LANGKAH 1/4</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 font-['CircularStd']">
            Konfirmasi titik lokasi
          </h1>

          {/* Location Image */}
          <div className="flex justify-center">
            <img 
              src="/images/lapor-location.png" 
              alt="Location confirmation" 
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* Location Info */}
          <div className="space-y-3">
            <DetailItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              iconBgColor={locationEnabled ? "bg-green-100" : "bg-gray-100"}
              iconColor={locationEnabled ? "text-green-500" : "text-gray-500"}
              title={locationEnabled ? "Lokasi aktif" : "Lokasi mati"}
              description={
                locationError 
                  ? locationError
                  : locationEnabled 
                    ? `Lat: ${reportData.location?.latitude.toFixed(6)}, Lon: ${reportData.location?.longitude.toFixed(6)}`
                    : "Izinkan untuk membagikan lokasi untuk melanjutkan"
              }
              actionText={locationEnabled ? "Perbarui" : "Izinkan"}
              onActionClick={handleLocationEdit}
            />
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
      <BottomNavigation />
    </div>
  );
}