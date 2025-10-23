'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { BottomNavigation, MapTilerMap, Button, BottomSheet } from '../components';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Get display name
  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      // Get first part of email before @
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const displayName = getDisplayName();

  // Sample waste markers data - memoized to prevent re-creation on every render
  const wasteMarkers = useMemo(() => [
    {
      id: '1',
      coordinates: [110.3695, -7.7956] as [number, number],
      type: 'waste' as const,
      title: 'Tumpukan sampah',
      location: 'Kost Ndalem A',
      wasteType: 'Campuran',
      amount: 'Lebih dari 10kg',
      category: 'Di tengah sungai'
    },
    {
      id: '2',
      coordinates: [110.3795, -7.7856] as [number, number],
      type: 'waste' as const,
      title: 'Sampah plastik',
      location: 'Jalan Malioboro',
      wasteType: 'Plastik',
      amount: '5-10kg',
      category: 'Pinggir jalan'
    },
    {
      id: '3',
      coordinates: [110.3595, -7.8056] as [number, number],
      type: 'waste' as const,
      title: 'Sampah organik',
      location: 'Pasar Beringharjo',
      wasteType: 'Organik',
      amount: '1-5kg',
      category: 'Area pasar'
    }
  ], []);

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
        userName={displayName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClick={handleSearch}
        title={selectedMarker?.title || ''}
        description="Detail laporan sampah pada titik ini"
        images={['/images/template-image.png', '/images/template-image.png']}
        wasteType={selectedMarker?.wasteType || ''}
        amount={selectedMarker?.amount || ''}
        category={selectedMarker?.category || ''}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}