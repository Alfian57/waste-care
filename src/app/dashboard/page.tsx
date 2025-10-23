'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { BottomNavigation, MapTilerMap, Button, BottomSheet } from '../components';
import { useAuth } from '@/hooks/useAuth';
import { 
  getNearbyReports, 
  formatWasteType, 
  formatWasteVolume, 
  formatLocationCategory,
  formatDistance,
  type ReportLocation 
} from '@/lib/nearbyReportsService';

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [reports, setReports] = useState<ReportLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [radiusKm, setRadiusKm] = useState(5);

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

  // Fetch nearby reports from API
  const fetchNearbyReports = useCallback(async (latitude: number, longitude: number, radius?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getNearbyReports({
        latitude,
        longitude,
        radiusKm: radius || radiusKm,
        limit: 50,
      });

      if (result.success && result.data) {
        setReports(result.data.reports);
        console.log(`Loaded ${result.data.reports.length} nearby reports`);
      } else {
        setError(result.error || 'Gagal memuat data laporan');
        setReports([]);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Terjadi kesalahan saat memuat data');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [radiusKm]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          console.log('User location:', { latitude, longitude });
          
          // Fetch nearby reports
          fetchNearbyReports(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Tidak dapat mengakses lokasi. Menggunakan lokasi default.');
          // Use default location (Yogyakarta center)
          const defaultLat = -7.7956;
          const defaultLon = 110.3695;
          setUserLocation([defaultLon, defaultLat]);
          fetchNearbyReports(defaultLat, defaultLon);
        }
      );
    } else {
      setError('Browser tidak mendukung geolocation');
      // Use default location
      const defaultLat = -7.7956;
      const defaultLon = 110.3695;
      setUserLocation([defaultLon, defaultLat]);
      fetchNearbyReports(defaultLat, defaultLon);
    }
  }, [fetchNearbyReports]);

  // Convert reports to markers format
  const wasteMarkers = useMemo(() => {
    return reports.map((report) => ({
      id: report.id.toString(),
      coordinates: [parseFloat(report.longitude), parseFloat(report.lattitude)] as [number, number],
      type: 'waste' as const,
      title: formatWasteType(report.waste_type),
      location: formatLocationCategory(report.location_category),
      wasteType: formatWasteType(report.waste_type),
      amount: formatWasteVolume(report.waste_volume),
      category: formatLocationCategory(report.location_category),
      distance: formatDistance(report.distance_km),
      imageUrls: report.image_urls,
      notes: report.notes,
      createdAt: report.created_at,
    }));
  }, [reports]);

  const handleSearch = useCallback(() => {
    console.log('Searching for:', searchQuery);
    
    // If user location is available, refetch with current search parameters
    if (userLocation) {
      const [lon, lat] = userLocation;
      fetchNearbyReports(lat, lon);
    }
  }, [searchQuery, userLocation, fetchNearbyReports]);

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
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="text-gray-700 font-medium">Memuat laporan...</p>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {error && !loading && (
        <div className="fixed top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-50 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative">
        {/* Map Section */}

        <div className="relative h-screen">
          <MapTilerMap
            className="w-full h-full"
            center={userLocation || [110.3695, -7.7956]}
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
        title={selectedMarker ? `${selectedMarker.title} - ${selectedMarker.distance}` : ''}
        description={selectedMarker?.notes || 'Detail laporan sampah pada titik ini'}
        images={selectedMarker?.imageUrls || ['/images/template-image.png']}
        wasteType={selectedMarker?.wasteType || ''}
        amount={selectedMarker?.amount || ''}
        category={selectedMarker?.category || ''}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}