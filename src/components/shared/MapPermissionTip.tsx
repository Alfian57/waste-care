'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components';

interface MapPermissionTipProps {
  show: boolean;
  onDismiss: () => void;
}

export function MapPermissionTip({ show, onDismiss }: MapPermissionTipProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this tip before (localStorage for PWA)
    const isDismissed = localStorage.getItem('mapPermissionTipDismissed') === 'true';
    setDismissed(isDismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('mapPermissionTipDismissed', 'true');
    setDismissed(true);
    onDismiss();
  };

  if (!show || dismissed) return null;

  return (
    <div className="absolute bottom-24 left-4 right-4 z-20 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              💡 Tips Penggunaan Peta
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Izinkan akses lokasi untuk melihat posisi Anda di peta dan menemukan laporan sampah terdekat dengan lebih mudah.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleDismiss}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-xs"
              >
                Mengerti
              </Button>
              <button
                onClick={handleDismiss}
                className="text-xs text-gray-500 hover:text-gray-700 px-2"
              >
                Jangan tampilkan lagi
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
