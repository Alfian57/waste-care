'use client';

import React from 'react';
import { BottomNavigation } from '../components';
import { useDashboard } from './useDashboard';
import LoadingOverlay from './LoadingOverlay';
import ErrorNotification from './ErrorNotification';
import MapView from './MapView';
import DashboardBottomSheet from './DashboardBottomSheet';

export default function DashboardPage() {
  const {
    displayName,
    userLocation,
    wasteMarkers,
    loading,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    handleSearch,
    showDetails,
    selectedMarker,
    handleMarkerClick,
    handleCloseDetails,
  } = useDashboard();

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
      {loading && <LoadingOverlay />}

      {error && !loading && (
        <ErrorNotification
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      {/* Map Section */}
      <div className="relative">
        <MapView
          userLocation={userLocation}
          markers={wasteMarkers}
          showDetails={showDetails}
          onMarkerClick={handleMarkerClick}
          onCloseDetails={handleCloseDetails}
        />
      </div>

      <DashboardBottomSheet
        showDetails={showDetails}
        userName={displayName}
        searchQuery={searchQuery}
        selectedMarker={selectedMarker}
        onSearchChange={setSearchQuery}
        onSearchClick={handleSearch}
        onClose={handleCloseDetails}
      />

      <BottomNavigation />
    </div>
  );
}