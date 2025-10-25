'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, BottomNavigation, Toast } from '@/components';
import { useRevalidation } from '@/contexts/RevalidationContext';

export default function RevalidasiGPSPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('reportId');
  const latitude = searchParams.get('lat');
  const longitude = searchParams.get('lng');

  const { setReportId, setLocation, revalidationData } = useRevalidation();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (reportId) {
      setReportId(parseInt(reportId));
    }
    if (latitude && longitude) {
      const location = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
      setLocation(location);
      setCurrentLocation(location);
    }
  }, [reportId, latitude, longitude, setReportId, setLocation]);

  const handleGetLocation = async () => {
    setLoading(true);
    setLocationError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation tidak didukung oleh browser Anda');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      setLocation(location);
      setCurrentLocation(location);
      setToast({
        message: 'Lokasi berhasil didapatkan',
        type: 'success'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal mendapatkan lokasi';
      setLocationError(errorMessage);
      setToast({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!currentLocation) {
      setToast({
        message: 'Silakan dapatkan lokasi terlebih dahulu',
        type: 'warning'
      });
      return;
    }

    router.push('/revalidasi/foto');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center px-4 py-4">
          <button onClick={handleBack} className="mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Revalidasi Lokasi</h1>
            <p className="text-sm text-gray-500">Langkah 1 dari 3</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Konfirmasi Lokasi
          </h2>
          <p className="text-gray-600 mb-6">
            Pastikan Anda berada di lokasi yang sama dengan laporan sampah untuk melakukan revalidasi
          </p>

          {currentLocation ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
              <div className="flex items-start mb-2">
                <svg className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-emerald-800">Lokasi Berhasil Didapatkan</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Lat: {currentLocation.latitude.toFixed(6)}, Long: {currentLocation.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          ) : locationError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-red-800">Gagal Mendapatkan Lokasi</p>
                  <p className="text-xs text-red-700 mt-1">{locationError}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">
                Tekan tombol di bawah untuk mendapatkan lokasi Anda saat ini
              </p>
            </div>
          )}

          {!currentLocation && (
            <Button
              onClick={handleGetLocation}
              loading={loading}
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Dapatkan Lokasi Saya
            </Button>
          )}
        </div>
      </div>

      <div className="p-6">
        <Button
          onClick={handleConfirm}
          disabled={!currentLocation}
          fullWidth
          className="bg-[#16a34a] hover:bg-[#15803d]"
        >
          Lanjut ke Foto
        </Button>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
