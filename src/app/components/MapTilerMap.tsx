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
  apiKey = 'FA6JDSQtAH4StLAmSKL0',
  className = 'w-full h-full',
  center = [110.3695, -7.7956],
  zoom = 12,
  markers = [],
  onMarkerClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize the map
    map.current = new Map({
      container: mapContainer.current,
      style: MapStyle.HYBRID,
      center: center,
      zoom: zoom,
      apiKey: apiKey,
      attributionControl: false
    });

    // Force remove any remaining attribution elements
    setTimeout(() => {
      const attributions = mapContainer.current?.querySelectorAll('.maplibregl-ctrl-attrib, .maptiler-attribution, .mapboxgl-ctrl-attrib');
      attributions?.forEach(attr => attr.remove());
    }, 100);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [apiKey, center, zoom]);

  // Update markers separately
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
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
        const marker = new Marker({ element: el })
          .setLngLat(markerData.coordinates)
          .addTo(map.current);
        
        markersRef.current.push(marker);
      }
    });
  }, [markers, onMarkerClick]);

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