import { useState, useEffect, useCallback } from 'react';
import { getGeolocationErrorMessage } from '@/utils/errorMessages';

interface UseUserLocationOptions {
  onLocationChange?: (latitude: number, longitude: number) => void;
  onError?: (message: string) => void;
}

export function useUserLocation({ onLocationChange, onError }: UseUserLocationOptions = {}) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  const requestLocation = useCallback(() => {
    setIsRequestingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setIsRequestingLocation(false);
          
          // Call the callback if provided
          if (onLocationChange) {
            onLocationChange(latitude, longitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          const errorMessage = getGeolocationErrorMessage(error);
          setIsRequestingLocation(false);
          
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
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      const errorMessage = 'Browser tidak mendukung geolocation';
      setIsRequestingLocation(false);
      
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

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { 
    userLocation, 
    isRequestingLocation,
    requestLocation 
  };
}
