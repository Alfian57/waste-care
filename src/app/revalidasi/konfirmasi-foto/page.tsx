'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Toast } from '@/app/components';
import { useRevalidation } from '@/contexts/RevalidationContext';

export default function RevalidasiKonfirmasiFotoPage() {
  const router = useRouter();
  const { revalidationData, removePhoto, addPhoto } = useRevalidation();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddMorePhotos = async () => {
    if (revalidationData.photos.length >= 5) {
      setToast({
        message: 'Maksimal 5 foto',
        type: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            addPhoto(base64);
            setToast({
              message: 'Foto berhasil ditambahkan',
              type: 'success'
            });
          };
          reader.readAsDataURL(file);
        }
        setLoading(false);
      };
      
      input.click();
    } catch (error) {
      console.error('Error adding photo:', error);
      setToast({
        message: 'Gagal menambahkan foto',
        type: 'error'
      });
      setLoading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (revalidationData.photos.length === 1) {
      setToast({
        message: 'Minimal harus ada 1 foto',
        type: 'warning'
      });
      return;
    }
    removePhoto(index);
    setToast({
      message: 'Foto berhasil dihapus',
      type: 'success'
    });
  };

  const handleContinue = () => {
    if (revalidationData.photos.length === 0) {
      setToast({
        message: 'Tambahkan minimal 1 foto',
        type: 'warning'
      });
      return;
    }
    router.push('/revalidasi/konfirmasi-data');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white pb-32 text-black">
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
            <h1 className="text-xl font-bold ">Konfirmasi Foto</h1>
            <p className="text-sm text-gray-500">Langkah 2 dari 3</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Foto yang Diambil ({revalidationData.photos.length})
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {revalidationData.photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Foto ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                Foto {index + 1}
              </div>
            </div>
          ))}

          {revalidationData.photos.length < 5 && (
            <button
              onClick={handleAddMorePhotos}
              disabled={loading}
              className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm text-gray-600">Tambah Foto</span>
            </button>
          )}
        </div>

        {revalidationData.photos.length >= 5 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              Maksimal 5 foto sudah tercapai
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Pastikan foto sudah sesuai</p>
              <p>Foto akan divalidasi oleh AI untuk memastikan lokasi sudah bersih</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <Button
          onClick={handleContinue}
          disabled={revalidationData.photos.length === 0}
          fullWidth
          className="bg-[#16a34a] hover:bg-[#15803d]"
        >
          Lanjutkan
        </Button>
      </div>
    </div>
  );
}
