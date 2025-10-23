'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '../../components';
import { useReport } from '@/contexts/ReportContext';

export default function LaporDetailPage() {
  const router = useRouter();
  const { reportData, setWasteType, setWasteVolume, setLocationCategory, setNotes } = useReport();
  
  const [wasteType, setLocalWasteType] = useState<string>(reportData.wasteType || '');
  const [wasteVolume, setLocalWasteVolume] = useState<string>(reportData.wasteVolume || '');
  const [locationCategory, setLocalLocationCategory] = useState<string>(reportData.locationCategory || '');
  const [notes, setLocalNotes] = useState<string>(reportData.notes || '');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!wasteType || !wasteVolume || !locationCategory) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setLoading(true);
    
    // Save to context
    setWasteType(wasteType as 'organik' | 'anorganik' | 'berbahaya' | 'campuran');
    setWasteVolume(wasteVolume as 'kurang_dari_1kg' | '1_5kg' | '6_10kg' | 'lebih_dari_10kg');
    setLocationCategory(locationCategory as 'sungai' | 'pinggir_jalan' | 'area_publik' | 'tanah_kosong' | 'lainnya');
    setNotes(notes);

    // Navigate to photo page using Next.js router
    setTimeout(() => {
      router.push('/lapor/foto');
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
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="w-8"></div>
        </div>
        
        {/* Step Info */}
        <div className="mt-3">
          <p className="text-sm text-orange-500 font-medium font-['CircularStd']">LANGKAH 2/5</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto pb-24">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 font-['CircularStd'] text-center">
            Detail Laporan
          </h1>

          {/* Jenis Sampah */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 font-['CircularStd']">
              Jenis Sampah <span className="text-red-500">*</span>
            </label>
            <select
              value={wasteType}
              onChange={(e) => setLocalWasteType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-['CircularStd']"
            >
              <option value="">Pilih jenis sampah</option>
              <option value="organik">Organik</option>
              <option value="anorganik">Anorganik</option>
              <option value="berbahaya">Berbahaya</option>
              <option value="campuran">Campuran</option>
            </select>
          </div>

          {/* Volume Sampah */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 font-['CircularStd']">
              Volume Sampah <span className="text-red-500">*</span>
            </label>
            <select
              value={wasteVolume}
              onChange={(e) => setLocalWasteVolume(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-['CircularStd']"
            >
              <option value="">Pilih volume sampah</option>
              <option value="kurang_dari_1kg">Kurang dari 1kg</option>
              <option value="1_5kg">1-5kg</option>
              <option value="6_10kg">6-10kg</option>
              <option value="lebih_dari_10kg">Lebih dari 10kg</option>
            </select>
          </div>

          {/* Kategori Lokasi */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 font-['CircularStd']">
              Kategori Lokasi <span className="text-red-500">*</span>
            </label>
            <select
              value={locationCategory}
              onChange={(e) => setLocalLocationCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-['CircularStd']"
            >
              <option value="">Pilih kategori lokasi</option>
              <option value="sungai">Sungai</option>
              <option value="pinggir_jalan">Pinggir Jalan</option>
              <option value="area_publik">Area Publik</option>
              <option value="tanah_kosong">Tanah Kosong</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          {/* Catatan Tambahan */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 font-['CircularStd']">
              Catatan Tambahan (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Tambahkan catatan atau deskripsi kondisi sampah..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-['CircularStd'] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
        <Button
          onClick={handleContinue}
          loading={loading}
          fullWidth
          className="bg-[#16a34a] hover:bg-[#15803d]"
        >
          Lanjutkan
        </Button>
      </div>
    </div>
  );
}
