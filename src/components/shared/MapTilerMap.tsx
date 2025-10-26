'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Map, MapStyle, Marker } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

interface MapTilerMapProps {
  apiKey?: string;
  className?: string;
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    coordinates: [number, number];
    type: 'waste' | 'user';
    title?: string;
    location?: string;
  }>;
  onMarkerClick?: (markerId: string) => void;
  showUserLocation?: boolean;
  onMapReady?: (map: Map) => void;
  onMapError?: (error: Error) => void;
}

const MapTilerMapComponent: React.FC<MapTilerMapProps> = ({
  apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || '',
  className = 'w-full h-full',
  center = [110.3695, -7.7956],
  zoom = 12,
  markers = [],
  onMarkerClick,
  showUserLocation = false,
  onMapReady,
  onMapError
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const onMarkerClickRef = useRef(onMarkerClick);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const userLocationMarkerRef = useRef<Marker | null>(null);

  // Keep onMarkerClick ref updated
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  // Monitor online/offline status for PWA
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Check if API key is available
    if (!apiKey) {
      const error = new Error('MapTiler API key tidak tersedia');
      setMapError('Tidak dapat memuat peta. API key tidak ditemukan.');
      setIsLoading(false);
      onMapError?.(error);
      return;
    }

    try {
      setIsLoading(true);
      setMapError(null);

      // Initialize the map
      const mapInstance = new Map({
        container: mapContainer.current,
        style: MapStyle.HYBRID,
        center: center,
        zoom: zoom,
        apiKey: apiKey,
        attributionControl: false,
        // Add hash for URL sync (useful for PWA)
        hash: false,
        // Add navigation control for better UX
        navigationControl: true,
        geolocateControl: showUserLocation,
      });

      map.current = mapInstance;

      // Handle map load
      mapInstance.on('load', () => {
        setIsLoading(false);
        onMapReady?.(mapInstance);
        
        // Force remove any remaining attribution elements
        setTimeout(() => {
          const attributions = mapContainer.current?.querySelectorAll(
            '.maplibregl-ctrl-attrib, .maptiler-attribution, .mapboxgl-ctrl-attrib'
          );
          attributions?.forEach(attr => attr.remove());
        }, 100);
      });

      // Handle map errors
      mapInstance.on('error', (e) => {
        console.error('Map error:', e);
        const errorMsg = isOnline 
          ? 'Terjadi kesalahan saat memuat peta. Silakan refresh halaman.'
          : 'Tidak ada koneksi internet. Peta tidak dapat dimuat.';
        setMapError(errorMsg);
        setIsLoading(false);
        onMapError?.(new Error(errorMsg));
      });

      // Handle style load errors (e.g., tiles not loading)
      mapInstance.on('styleimagemissing', () => {
        console.warn('Map style image missing');
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      const errorMsg = 'Gagal menginisialisasi peta. Silakan refresh halaman.';
      setMapError(errorMsg);
      setIsLoading(false);
      onMapError?.(error instanceof Error ? error : new Error(errorMsg));
    }

    return () => {
      if (map.current) {
        try {
          map.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        map.current = null;
      }
    };
  }, [apiKey, center, zoom, showUserLocation, onMapReady, onMapError, isOnline]);

  // Update markers separately
  useEffect(() => {
    if (!map.current || isLoading) return;

    try {
      // Clear existing markers (except user location marker)
      markersRef.current.forEach(marker => {
        try {
          marker.remove();
        } catch (error) {
          console.error('Error removing marker:', error);
        }
      });
      markersRef.current = [];

      // Add new markers
      markers.forEach((markerData) => {
        if (map.current) {
          try {
            // Create marker element
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.cursor = 'pointer';
            
            if (markerData.type === 'waste') {
              // Create waste marker with only the trash icon
              el.innerHTML = `
                <img 
                  src="/icons/trashicon.png" 
                  alt="Trash" 
                  loading="lazy"
                  style="
                    width: 50px;
                    height: 50px;
                    object-fit: contain;
                    cursor: pointer;
                  " 
                  onerror="this.style.display='none'"
                />
              `;
            } else if (markerData.type === 'user') {
              el.style.width = '32px';
              el.style.height = '32px';
              el.style.backgroundColor = '#3b82f6';
              el.style.borderRadius = '50%';
              el.innerHTML = '📍';
              el.style.display = 'flex';
              el.style.alignItems = 'center';
              el.style.justifyContent = 'center';
              el.style.fontSize = '16px';
              el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            }

            // Add click handler
            if (onMarkerClickRef.current && markerData.type === 'waste') {
              el.addEventListener('click', () => {
                onMarkerClickRef.current?.(markerData.id);
              });
            }

            // Add marker to map
            const marker = new Marker({ element: el })
              .setLngLat(markerData.coordinates)
              .addTo(map.current);
            
            markersRef.current.push(marker);
          } catch (error) {
            console.error('Error adding marker:', error);
          }
        }
      });
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  }, [markers, isLoading]);

  // Handle user location display
  useEffect(() => {
    if (!map.current || !showUserLocation || isLoading) return;

    const handleLocationSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      
      if (map.current) {
        // Remove old user location marker if exists
        if (userLocationMarkerRef.current) {
          userLocationMarkerRef.current.remove();
        }

        // Create user location marker
        const el = document.createElement('div');
        el.className = 'user-location-marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.backgroundColor = '#3b82f6';
        el.style.border = '3px solid white';
        el.style.borderRadius = '50%';
        el.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';
        el.style.animation = 'pulse 2s ease-in-out infinite';

        // Add CSS animation
        if (!document.getElementById('user-location-styles')) {
          const style = document.createElement('style');
          style.id = 'user-location-styles';
          style.textContent = `
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.7; transform: scale(1.1); }
            }
          `;
          document.head.appendChild(style);
        }

        const marker = new Marker({ element: el })
          .setLngLat([longitude, latitude])
          .addTo(map.current);
        
        userLocationMarkerRef.current = marker;

        // Optionally center map on user location
        // map.current.flyTo({ center: [longitude, latitude], zoom: 15 });
      }
    };

    const handleLocationError = (error: GeolocationPositionError) => {
      console.warn('Geolocation error:', error.message);
      // Don't show error to user, just skip showing location marker
    };

    // Request user location if supported and permission granted
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess, 
        handleLocationError,
        {
          enableHighAccuracy: false, // Use less accurate for better performance
          timeout: 5000,
          maximumAge: 60000, // Cache for 1 minute
        }
      );
    }

    return () => {
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.remove();
        userLocationMarkerRef.current = null;
      }
    };
  }, [showUserLocation, isLoading]);

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Memuat peta...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {mapError && (
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10 p-4">
          <div className="text-center max-w-md">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Gagal Memuat Peta</h3>
            <p className="text-sm text-red-600 mb-4">{mapError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      {!isOnline && !mapError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
            <span className="text-sm font-medium">Mode Offline</span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{
          position: 'relative',
          display: isLoading || mapError ? 'none' : 'block'
        }}
      />
    </div>
  );
};

// Custom comparison function for React.memo
const arePropsEqual = (prevProps: MapTilerMapProps, nextProps: MapTilerMapProps) => {
  // Compare primitives
  if (
    prevProps.apiKey !== nextProps.apiKey ||
    prevProps.className !== nextProps.className ||
    prevProps.zoom !== nextProps.zoom ||
    prevProps.showUserLocation !== nextProps.showUserLocation
  ) {
    return false;
  }

  // Compare center array
  if (
    prevProps.center?.[0] !== nextProps.center?.[0] ||
    prevProps.center?.[1] !== nextProps.center?.[1]
  ) {
    return false;
  }

  // Compare markers array by reference (since we memoize it in parent)
  if (prevProps.markers !== nextProps.markers) {
    return false;
  }

  // Don't compare callback functions as we handle them with ref
  return true;
};

// Memoize component to prevent unnecessary re-renders
export const MapTilerMap = React.memo(MapTilerMapComponent, arePropsEqual);

export default MapTilerMap;