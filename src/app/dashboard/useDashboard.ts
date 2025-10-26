import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNearbyReports } from './useNearbyReports';
import { useMarkerSelection } from './useMarkerSelection';
import { 
  formatWasteType, 
  formatWasteVolume, 
  formatLocationCategory,
  formatDistance,
} from '@/lib/nearbyReportsService';
import { getCampaignsByReportIds } from '@/lib/campaignService';
import { useUserLocation } from './useUserLocation';
import { WasteMarker } from '.';

export function useDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusKm] = useState(5);
  const [campaignMap, setCampaignMap] = useState<Map<number, boolean>>(new Map());

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

  // Fetch nearby reports
  const { reports, loading, error, setError, fetchNearbyReports } = useNearbyReports(radiusKm);

  // Get user location and fetch reports when location is available
  const { userLocation } = useUserLocation({
    onLocationChange: fetchNearbyReports,
    onError: setError,
  });

  // Fetch campaign status for reports
  useEffect(() => {
    if (reports.length > 0) {
      const reportIds = reports.map(r => r.id);
      getCampaignsByReportIds(reportIds).then(setCampaignMap);
    }
  }, [reports]);

  // Marker selection state
  const {
    selectedMarkerId,
    showDetails,
    handleMarkerClick,
    handleCloseDetails,
  } = useMarkerSelection();

  // Convert reports to markers format
  const wasteMarkers = useMemo<WasteMarker[]>(() => {
    return reports.map((report) => ({
      id: report.id.toString(),
      coordinates: [report.longitude, report.latitude] as [number, number],
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
      hasCampaign: campaignMap.get(report.id) || false,
    }));
  }, [reports, campaignMap]);

  // Search handler
  const handleSearch = useCallback(() => {
    // If user location is available, refetch with current search parameters
    if (userLocation) {
      const [lon, lat] = userLocation;
      fetchNearbyReports(lat, lon);
    }
  }, [userLocation, fetchNearbyReports]);

  // Get selected marker
  const selectedMarker = selectedMarkerId 
    ? wasteMarkers.find(m => m.id === selectedMarkerId) 
    : null;

  return {
    // User data
    displayName,
    
    // Location data
    userLocation,
    
    // Reports data
    wasteMarkers,
    loading,
    error,
    setError,
    
    // Search
    searchQuery,
    setSearchQuery,
    handleSearch,
    
    // Marker selection
    selectedMarkerId,
    showDetails,
    selectedMarker,
    handleMarkerClick,
    handleCloseDetails,
  };
}
