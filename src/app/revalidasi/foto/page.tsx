'use client';

import React from 'react';
import { Button } from '@/components';
import { usePhotoNavigation } from './usePhotoNavigation';
import PhotoStepHeader from './PhotoStepHeader';
import PhotoInstructions from './PhotoInstructions';

export default function RevalidasiFotoPage() {
  const { loading, handleAddPhoto, handleBack } = usePhotoNavigation();

  return (
    <div className="min-h-screen bg-white">
      <PhotoStepHeader onBack={handleBack} />

      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <PhotoInstructions />
      </div>

      <div className="p-6">
        <Button
          onClick={handleAddPhoto}
          loading={loading}
          fullWidth
          className="bg-[#16a34a] hover:bg-[#15803d]"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ambil Foto
        </Button>
      </div>
    </div>
  );
}
