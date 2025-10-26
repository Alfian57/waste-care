import { MapTilerMap, MapPermissionTip } from '@/components';
import { useState, useCallback } from 'react';
import UserLocationButton from './UserLocationButton';
import CloseButton from './CloseButton';
import type { WasteMarker } from '.';

interface MapViewProps {
  userLocation: [number, number] | null;
  markers: WasteMarker[];
  showDetails: boolean;
  onMarkerClick: (markerId: string) => void;
  onCloseDetails: () => void;
}

export default function MapView({
  userLocation,
  markers,
  showDetails,
  onMarkerClick,
  onCloseDetails,
}: MapViewProps) {
  const [showPermissionTip, setShowPermissionTip] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const handleMapReady = useCallback(() => {
    // Map is ready, check if we should show permission tip
    if (!userLocation) {
      // Show tip after a short delay
      setTimeout(() => setShowPermissionTip(true), 2000);
    }
  }, [userLocation]);

  const handleMapError = useCallback((error: Error) => {
    console.error('Map error:', error);
    setMapError(error.message);
  }, []);

  return (
    <div className="relative h-screen">
      <MapTilerMap
        className="w-full h-full"
        center={userLocation || [110.3695, -7.7956]}
        zoom={13}
        markers={markers}
        onMarkerClick={onMarkerClick}
        showUserLocation={!!userLocation}
        onMapReady={handleMapReady}
        onMapError={handleMapError}
      />
      
      {/* Permission Tip */}
      <MapPermissionTip 
        show={showPermissionTip && !showDetails && !mapError}
        onDismiss={() => setShowPermissionTip(false)}
      />

      {/* Map Overlay - User Location Indicator */}
      {!showDetails && <UserLocationButton />}

      {/* Close button for selected marker */}
      {showDetails && <CloseButton onClick={onCloseDetails} />}
    </div>
  );
}
