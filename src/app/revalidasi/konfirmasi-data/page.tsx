'use client';

import React, { useState } from 'react';
import { Button, Toast } from '@/components';
import { useRevalidation } from '@/contexts/RevalidationContext';
import { useConfirmation } from './useConfirmation';
import ConfirmationHeader from './ConfirmationHeader';
import StatusSection from './StatusSection';
import PhotoPreview from './PhotoPreview';
import LocationDetails from './LocationDetails';
import NotesInput from './NotesInput';

export default function RevalidasiKonfirmasiDataPage() {
  const { revalidationData, setNotes, setStatus, resetRevalidation } = useRevalidation();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const {
    loading,
    selectedStatus,
    notes,
    handleStatusChange,
    handleNotesChange,
    handleSubmit,
    handleBack,
  } = useConfirmation({
    onSetStatus: setStatus,
    onSetNotes: setNotes,
    onResetRevalidation: resetRevalidation,
    onSetToast: setToast,
  });

  return (
    <div className="min-h-screen bg-white pb-32">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmationHeader onBack={handleBack} />

      <div className="p-6">
        <StatusSection
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
        />

        <PhotoPreview photos={revalidationData.photos} />

        <LocationDetails location={revalidationData.location} />

        <NotesInput value={notes} onChange={handleNotesChange} />

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
