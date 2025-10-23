'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { BottomNavigation, MapTilerMap, Button, BottomSheet } from '../components';
import { useReports } from '@/hooks/useReports';
import Image from 'next/image';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch waste markers from Supabase
  const { reports: wasteMarkers, loading, error } = useReports();

  const handleSearch = useCallback(() => {
    console.log('Searching for:', searchQuery);
  }, [searchQuery]);

  const handleMarkerClick = useCallback((markerId: string) => {
    setSelectedMarkerId(markerId);
    setShowDetails(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setShowDetails(false);
    setSelectedMarkerId(null);
  }, []);

  const selectedMarker = selectedMarkerId ? wasteMarkers.find(m => m.id === selectedMarkerId) : null;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-transparent pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-transparent pb-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Header Section */}
      <div className="relative">
        {/* Map Section */}

        <div className="relative h-screen">
          <MapTilerMap
            className="w-full h-full"
            center={[110.3695, -7.7956]}
            zoom={13}
            markers={wasteMarkers}
            onMarkerClick={handleMarkerClick}
          />
          
          {/* Map Overlay - User Location Indicator */}
          {!showDetails && (
            <div className="absolute top-4 right-4 bg-white rounded-full p-2.5 shadow-lg">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
              </svg>
            </div>
          )}

          {/* Close button for selected marker */}
          {showDetails && (
            <button
              onClick={handleCloseDetails}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center z-10 hover:bg-opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Sheet - Shows welcome or waste details */}
      <BottomSheet
        isOpen={true}
        onClose={handleCloseDetails}
        showWelcome={!showDetails}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClick={handleSearch}
        title={selectedMarker?.title || ''}
        description="Detail laporan sampah pada titik ini"
        images={selectedMarker?.images || []}
        wasteType={selectedMarker?.wasteType || ''}
        amount={selectedMarker?.amount || ''}
        category={selectedMarker?.category || ''}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}