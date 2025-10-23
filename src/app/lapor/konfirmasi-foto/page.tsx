'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components';
import Image from 'next/image';
import { useReport } from '@/contexts/ReportContext';
import { resizeImage } from '@/lib/reportService';

export default function KonfirmasiFotoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { reportData, addPhoto, removePhoto } = useReport();

  useEffect(() => {
    // Load existing photos from context
    if (reportData.photos.length > 0) {
      setPhotos(reportData.photos.map(p => `data:image/jpeg;base64,${p}`));
    }
  }, [reportData.photos]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Resize and compress image
        const base64 = await resizeImage(file);
        addPhoto(base64);
        setPhotos(prev => [...prev, `data:image/jpeg;base64,${base64}`]);
      }
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Gagal memproses gambar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMorePhotos = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (index: number) => {
    removePhoto(index);
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadPhoto = () => {
    if (photos.length === 0) {
      alert('Tambahkan minimal 1 foto untuk melanjutkan');
      return;
    }
    setLoading(true);
    // Navigate to uploading page using Next.js router
    setTimeout(() => {
      router.push('/lapor/mengunggah');
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
              <div className="flex-1 h-1 bg-orange-500 rounded"></div>
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="w-8"></div>
        </div>
        
        {/* Step Info */}
        <div className="mt-3">
          <p className="text-sm text-orange-500 font-medium font-['CircularStd']">LANGKAH 3/4</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 font-['CircularStd'] text-center">
            Konfirmasi foto sampah
          </h1>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Photos Grid */}
          {photos.length > 0 ? (
            <div className="space-y-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden w-full h-64">
                    <Image
                      src={photo}
                      alt={`Preview foto ${index + 1}`}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Add more photos button */}
              <button
                onClick={handleAddMorePhotos}
                disabled={loading}
                className="w-full aspect-video h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="mt-2 text-sm text-gray-500">Tambah foto lagi</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <button
                onClick={handleAddMorePhotos}
                disabled={loading}
                className="w-full aspect-video h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="mt-4 text-lg font-medium text-gray-700">Tambah foto</span>
                <span className="mt-1 text-sm text-gray-500">Klik untuk memilih foto</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6">
        <Button
          onClick={handleUploadPhoto}
          loading={loading}
          fullWidth
          className="bg-[#16a34a] hover:bg-[#15803d]"
        >
          Unggah foto
        </Button>
      </div>
    </div>
  );
}