import { useState, useEffect } from 'react';

interface UseUserLocationOptions {
  onLocationChange?: (latitude: number, longitude: number) => void;
  onError?: (message: string) => void;
}

export function useUserLocation({ onLocationChange, onError }: UseUserLocationOptions = {}) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          // Call the callback if provided
          if (onLocationChange) {
            onLocationChange(latitude, longitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          const errorMessage = 'Tidak dapat mengakses lokasi. Menggunakan lokasi default.';
          
          if (onError) {
            onError(errorMessage);
          }
          
          // Use default location (Yogyakarta center)
          const defaultLat = -7.7956;
          const defaultLon = 110.3695;
          setUserLocation([defaultLon, defaultLat]);
          
          if (onLocationChange) {
            onLocationChange(defaultLat, defaultLon);
          }
        }
      );
    } else {
      const errorMessage = 'Browser tidak mendukung geolocation';
      
      if (onError) {
        onError(errorMessage);
      }
      
      // Use default location
      const defaultLat = -7.7956;
      const defaultLon = 110.3695;
      setUserLocation([defaultLon, defaultLat]);
      
      if (onLocationChange) {
        onLocationChange(defaultLat, defaultLon);
      }
    }
  }, [onLocationChange, onError]);

  return { userLocation };
}
