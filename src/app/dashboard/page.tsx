'use client';

import React, { useState } from 'react';
import { BottomNavigation, MapTilerMap, Button } from '../components';
import Image from 'next/image';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Sample waste markers data
  const wasteMarkers = [
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
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleMarkerClick = (markerId: string) => {
    setSelectedMarkerId(markerId);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMarkerId(null);
  };

  const selectedMarker = selectedMarkerId ? wasteMarkers.find(m => m.id === selectedMarkerId) : null;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Section */}
      <div className="relative">
        {/* Map Section */}
        <div className="h-[60vh] relative overflow-hidden">
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

      {/* Welcome Section - Show as container below map when no details are displayed */}
      {!showDetails && (
        <div className="bg-white px-4 py-4 border-t border-gray-100">
          <div className="space-y-3">
            <div>
              <h1 className="text-xl font-semibold   text-orange-600 font-['CircularStd'] mb-1">
                Halo, Alie Pratama
              </h1>
              <p className="text-sm text-gray-600 font-['CircularStd']">
                Berkontribusi untuk jelajah sampah sekitar
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari sampah di ..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-400 text-gray-600 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-['CircularStd'] text-sm"
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              fullWidth
              size='sm'
              variant='primary'
            >
              Cari
            </Button>
          </div>
        </div>
      )}

      {/* Content Section - Only show when marker is selected */}
      {showDetails && selectedMarker && (
        <div className="px-6 pt-6 space-y-6">
          {/* Waste Report Card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 font-['CircularStd']">
                  {selectedMarker.title}
                </h2>
                <button onClick={handleCloseDetails} className="p-1">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 font-['CircularStd'] mt-1">
                Detail laporan sampah pada titik ini
              </p>
            </div>

            {/* Images */}
            <div className="grid grid-cols-2 gap-0">
              <div className="aspect-square bg-gradient-to-br from-blue-400 to-green-400">
                {/* Placeholder for actual image */}
              </div>
              <div className="aspect-square bg-gradient-to-br from-green-400 to-blue-400">
                {/* Placeholder for actual image */}
              </div>
            </div>

            {/* Details */}
            <div className="p-4 space-y-4">
              {/* Waste Type */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 font-['CircularStd']">Jenis sampah</p>
                  <p className="text-sm text-gray-600 font-['CircularStd']">{selectedMarker.wasteType}</p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 font-['CircularStd']">Muatan sampah</p>
                  <p className="text-sm text-gray-600 font-['CircularStd']">{selectedMarker.amount}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 font-['CircularStd']">Kategori lokasi</p>
                  <p className="text-sm text-gray-600 font-['CircularStd']">{selectedMarker.category}</p>
                </div>
              </div>

              {/* Action Button */}
              <Button
                fullWidth
                className="bg-[#16a34a] hover:bg-[#15803d] mt-4"
              >
                Laporkan sudah bersih
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}