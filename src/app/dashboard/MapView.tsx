import { MapTilerMap } from '@/components';
import UserLocationButton from './UserLocationButton';
import CloseButton from './CloseButton';
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
}: MapViewProps) {
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
      />
      
      {/* Map Overlay - User Location Indicator */}
      {!showDetails && <UserLocationButton />}

      {/* Close button for selected marker */}
      {showDetails && <CloseButton onClick={onCloseDetails} />}
    </div>
  );
}
