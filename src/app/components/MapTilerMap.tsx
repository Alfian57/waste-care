'use client';

import React, { useEffect, useRef } from 'react';
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
}

export const MapTilerMap: React.FC<MapTilerMapProps> = ({
  apiKey = 'FA6JDSQtAH4StLAmSKL0', // You can replace this later
  className = 'w-full h-full',
  center = [110.3695, -7.7956], // Yogyakarta coordinates as default
  zoom = 12,
  markers = [],
  onMarkerClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the map
    map.current = new Map({
      container: mapContainer.current,
      style: MapStyle.SATELLITE, // You can change this to other styles
      center: center,
      zoom: zoom,
      apiKey: apiKey,
      attributionControl: false // Remove the attribution/watermark
    });

    // Force remove any remaining attribution elements
    setTimeout(() => {
      const attributions = mapContainer.current?.querySelectorAll('.maplibregl-ctrl-attrib, .maptiler-attribution, .mapboxgl-ctrl-attrib');
      attributions?.forEach(attr => attr.remove());
    }, 100);

    // Add markers
    markers.forEach((markerData) => {
      if (map.current) {
        // Create marker element
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.cursor = 'pointer';
        
        if (markerData.type === 'waste') {
          // Create waste marker with only the trash icon
          el.innerHTML = `
            <img src="/icons/trashicon.png" alt="Trash" style="
              width: 50px;
              height: 50px;
              object-fit: contain;
              cursor: pointer;
            " />
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
        }

        // Add click handler
        if (onMarkerClick && markerData.type === 'waste') {
          el.addEventListener('click', () => {
            onMarkerClick(markerData.id);
          });
        }

        // Add marker to map
        new Marker({ element: el })
          .setLngLat(markerData.coordinates)
          .addTo(map.current);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [apiKey, center, zoom, markers, onMarkerClick]);

  return (
    <div 
      ref={mapContainer} 
      className={className}
      style={{
        position: 'relative'
      }}
    />
  );
};

export default MapTilerMap;