import { MapTilerMap } from '@/components';
import { useCallback } from 'react';
import CloseButton from './CloseButton';
import LocationPermissionButton from './LocationPermissionButton';
import type { WasteMarker } from '.';

interface MapViewProps {
  userLocation: [number, number] | null;
  markers: WasteMarker[];
  showDetails: boolean;
  onMarkerClick: (markerId: string) => void;
  onCloseDetails: () => void;
  showRoute?: boolean;
  routeStart?: [number, number] | null;
  routeEnd?: [number, number] | null;
  isRequestingLocation?: boolean;
  onRequestLocation?: () => void;
}

export default function MapView({
  userLocation,
  markers,
  showDetails,
  onMarkerClick,
  onCloseDetails,
  showRoute = false,
  routeStart = null,
  routeEnd = null,
  isRequestingLocation = false,
  onRequestLocation,
}: MapViewProps) {
  const handleMapReady = useCallback(() => {
    // Map is ready
  }, []);

  const handleMapError = useCallback((error: Error) => {
    console.error('Map error:', error);
  }, []);

  return (
    <div className="relative h-screen">
      <MapTilerMap
        className="w-full h-full"
        center={userLocation || [110.3695, -7.7956]}
        zoom={13}
        markers={markers}
        onMarkerClick={onMarkerClick}
        showRoute={showRoute}
        routeStart={routeStart}
        routeEnd={routeEnd}
        userLocation={userLocation}
      />

      {/* Location Permission Button */}
      {onRequestLocation && (
        <LocationPermissionButton 
          onClick={onRequestLocation}
          isRequesting={isRequestingLocation}
          hasLocation={userLocation !== null}
        />
      )}

      {/* Close button for selected marker */}
      {showDetails && <CloseButton onClick={onCloseDetails} />}
    </div>
  );
}
