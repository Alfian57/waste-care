'use client';

import React, { useState } from 'react';
import { Button, Toast } from '@/components';
import { useRevalidation } from '@/contexts/RevalidationContext';
import { usePhotoManagement } from './usePhotoManagement';
import PhotoHeader from './PhotoHeader';
import PhotoGrid from './PhotoGrid';

export default function RevalidasiKonfirmasiFotoPage() {
  const { revalidationData, removePhoto, addPhoto } = useRevalidation();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const {
    loading,
    handleAddMorePhotos,
    handleRemovePhoto,
    handleContinue,
    handleBack,
  } = usePhotoManagement({
    photos: revalidationData.photos,
    onAddPhoto: addPhoto,
    onRemovePhoto: removePhoto,
    onSetToast: setToast,
  });

  return (
    <div className="min-h-screen bg-white pb-32 text-black">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <PhotoHeader onBack={handleBack} />

      <div className="p-6">
        <PhotoGrid
          photos={revalidationData.photos}
          onRemovePhoto={handleRemovePhoto}
          onAddMorePhotos={handleAddMorePhotos}
          loading={loading}
        />
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
