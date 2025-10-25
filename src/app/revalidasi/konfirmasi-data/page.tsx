'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Toast } from '@/app/components';
import { useRevalidation } from '@/contexts/RevalidationContext';

export default function RevalidasiKonfirmasiDataPage() {
  const router = useRouter();
  const { revalidationData, setNotes, setStatus, resetRevalidation } = useRevalidation();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'clean' | 'still_dirty'>('clean');
  const [notes, setNotesValue] = useState('');

  const handleStatusChange = (status: 'clean' | 'still_dirty') => {
    setSelectedStatus(status);
    setStatus(status);
  };

  const handleNotesChange = (value: string) => {
    setNotesValue(value);
    setNotes(value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Submit to Supabase
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setToast({
        message: 'Revalidasi berhasil dikirim!',
        type: 'success'
      });

      setTimeout(() => {
        resetRevalidation();
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      setToast({
        message: 'Gagal mengirim revalidasi',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white pb-32">
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
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-black">Konfirmasi Revalidasi</h1>
            <p className="text-sm text-gray-500">Langkah 3 dari 3</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Status Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-black">Status Lokasi</h2>
          <div className="space-y-3">
            <button
              onClick={() => handleStatusChange('clean')}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedStatus === 'clean'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center ${
                  selectedStatus === 'clean' ? 'border-emerald-500' : 'border-gray-300'
                }`}>
                  {selectedStatus === 'clean' && (
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <svg className="w-5 h-5 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Sudah Bersih</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Lokasi ini sudah dibersihkan dan tidak ada lagi sampah
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleStatusChange('still_dirty')}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedStatus === 'still_dirty'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-start">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center ${
                  selectedStatus === 'still_dirty' ? 'border-orange-500' : 'border-gray-300'
                }`}>
                  {selectedStatus === 'still_dirty' && (
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Masih Kotor</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Masih ada sampah di lokasi ini
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Photos Preview */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-black">Foto Bukti ({revalidationData.photos.length})</h2>
          <div className="grid grid-cols-3 gap-2">
            {revalidationData.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Foto ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-black">Lokasi</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-gray-700">
                <p>Latitude: {revalidationData.location?.latitude.toFixed(6)}</p>
                <p>Longitude: {revalidationData.location?.longitude.toFixed(6)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-3 text-black">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Tambahkan catatan atau keterangan..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-gray-500"
            rows={4}
          />
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Revalidasi akan diproses</p>
              <p>Data Anda akan divalidasi oleh AI dan tim untuk memastikan kebenaran laporan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <Button
          onClick={handleSubmit}
          loading={loading}
          fullWidth
          className="bg-[#16a34a] hover:bg-[#15803d]"
        >
          {loading ? 'Mengirim...' : 'Kirim Revalidasi'}
        </Button>
      </div>
    </div>
  );
}
