import React, { useRef, useEffect, useState } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapLibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

// Configure the worker for Vite compatibility
if (setWorkerUrl) {
  setWorkerUrl(MapLibreWorker);
}

const DEFAULT_CENTER = [80.2707, 13.0827]; // Chennai, India
const DEFAULT_ZOOM = 12;

export default function MapView({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  marker = null, // { lng: number, lat: number }
  className = '',
  height = '400px'
}) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapInstance.current) return; // Prevent duplicate initialization in StrictMode

    try {
      const map = new Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm-raster': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm-layer',
              type: 'raster',
              source: 'osm-raster',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: center,
        zoom: zoom,
        attributionControl: true
      });

      map.addControl(new NavigationControl(), 'top-right');

      mapInstance.current = map;
    } catch (err) {
      console.error("Map initialization failed:", err);
      setError("Failed to load map.");
    }

    return () => {
      if (markerInstance.current) {
        markerInstance.current.remove();
        markerInstance.current = null;
      }
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Handle marker updates
  useEffect(() => {
    if (!mapInstance.current) return;
    
    // Remove existing marker
    if (markerInstance.current) {
      markerInstance.current.remove();
      markerInstance.current = null;
    }

    // Add new marker if valid coordinates provided
    if (marker && typeof marker.lng === 'number' && typeof marker.lat === 'number') {
      try {
        markerInstance.current = new Marker({ color: '#10b981' }) // Emerald-500
          .setLngLat([marker.lng, marker.lat])
          .addTo(mapInstance.current);
          
        // Re-center map on new marker
        mapInstance.current.flyTo({
          center: [marker.lng, marker.lat],
          essential: true
        });
      } catch (err) {
        console.error("Failed to add marker:", err);
      }
    }
  }, [marker]);

  if (error) {
    return (
      <div 
        className={`bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 p-4 ${className}`}
        style={{ height }}
      >
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className={`rounded-lg overflow-hidden border border-gray-200 shadow-sm ${className}`} 
      style={{ height, width: '100%' }}
    />
  );
}
