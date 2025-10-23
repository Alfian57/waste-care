'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, DetailItem } from '../../components';
import { useReport } from '@/contexts/ReportContext';

export default function KonfirmasiDataPage() {
  const router = useRouter();
  const { reportData, resetReport } = useReport();

  const handleDone = () => {
    // Reset report data
    resetReport();
    // Navigate to dashboard using Next.js router
    router.push('/dashboard');
  };

  const wasteTypeLabels = {
    organik: 'Organik',
    anorganik: 'Anorganik',
    berbahaya: 'Berbahaya',
    campuran: 'Campuran',
  };

  const wasteVolumeLabels = {
    kurang_dari_1kg: 'Kurang dari 1kg',
    '1_5kg': '1-5kg',
    '6_10kg': '6-10kg',
    lebih_dari_10kg: 'Lebih dari 10kg',
  };

  const locationCategoryLabels = {
    sungai: 'Di sungai',
    pinggir_jalan: 'Pinggir jalan',
    area_publik: 'Area publik',
    tanah_kosong: 'Tanah kosong',
    lainnya: 'Lainnya',
  };

  // Get data from AI validation result
  const wasteType = reportData.aiValidation?.waste_type || reportData.wasteType;
  const wasteVolume = reportData.aiValidation?.waste_volume || reportData.wasteVolume;
  const locationCategory = reportData.aiValidation?.location_category || reportData.locationCategory;

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
      <div className="flex-1 px-6 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 font-['CircularStd']">
              Laporan berhasil dikirim!
            </h1>
            <p className="text-gray-600 font-['CircularStd']">
              Terima kasih telah berkontribusi menjaga lingkungan. AI kami telah menganalisis foto dan mengklasifikasikan sampah secara otomatis.
            </p>
          </div>

          {/* Photos Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 font-['CircularStd']">
                {reportData.photos.length} Foto diunggah
              </span>
              <div className="flex -space-x-2">
                {reportData.photos.slice(0, 3).map((photo, index) => (
                  <div 
                    key={index}
                    className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden"
                    style={{ 
                      backgroundImage: `url(data:image/jpeg;base64,${photo})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                ))}
                {reportData.photos.length > 3 && (
                  <div className="w-10 h-10 bg-gray-300 rounded-lg border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">+{reportData.photos.length - 3}</span>
                  </div>
                )}
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
              title="Jenis sampah (dianalisis AI)"
              description={wasteType ? wasteTypeLabels[wasteType as keyof typeof wasteTypeLabels] : '-'}
            />

            {/* Waste Amount */}
            <DetailItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              }
              title="Volume sampah (dianalisis AI)"
              description={wasteVolume ? wasteVolumeLabels[wasteVolume as keyof typeof wasteVolumeLabels] : '-'}
            />

            {/* Location */}
            <DetailItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              title="Kategori lokasi (dianalisis AI)"
              description={locationCategory ? locationCategoryLabels[locationCategory as keyof typeof locationCategoryLabels] : '-'}
            />

            {/* Notes if exists */}
            {reportData.notes && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 font-['CircularStd'] mb-2">
                  Catatan tambahan
                </h3>
                <p className="text-sm text-gray-600 font-['CircularStd']">
                  {reportData.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6">
        <Button
          onClick={handleDone}
          fullWidth
          className="bg-[#16a34a] hover:bg-[#15803d]"
        >
          Selesai
        </Button>
      </div>
    </div>
  );
}