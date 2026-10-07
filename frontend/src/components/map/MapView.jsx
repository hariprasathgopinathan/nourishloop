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
  markers = [], // Array of { lng, lat, id, color }
  route = null, // GeoJSON LineString
  className = '',
  height = '400px',
  onClick = null,
  onMarkerClick = null,
  interactive = true,
  fitBounds = null // [[minLng, minLat], [maxLng, maxLat]]
}) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const markersInstances = useRef({}); // Store multiple markers
  const onClickRef = useRef(onClick);
  const onMarkerClickRef = useRef(onMarkerClick);
  const [error, setError] = useState(null);

  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

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
        attributionControl: true,
        interactive: interactive
      });

      map.addControl(new NavigationControl(), 'top-right');

      map.on('click', (e) => {
        if (onClickRef.current) {
          onClickRef.current({ lng: e.lngLat.lng, lat: e.lngLat.lat });
        }
      });

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
      Object.values(markersInstances.current).forEach(m => m.remove());
      markersInstances.current = {};

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
        markerInstance.current = new Marker({ color: '#138A53' }) // brand-green
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

  // Handle multiple markers
  useEffect(() => {
    if (!mapInstance.current) return;

    const currentInstances = markersInstances.current;
    const newInstances = {};

    markers.forEach(m => {
      if (typeof m.lng === 'number' && typeof m.lat === 'number' && m.id) {
        // Reuse existing marker if it hasn't moved (optimization)
        if (currentInstances[m.id]) {
          newInstances[m.id] = currentInstances[m.id];
          newInstances[m.id].setLngLat([m.lng, m.lat]);
          // We can also update color by recreating if necessary, but keep simple for now
          delete currentInstances[m.id];
        } else {
          // Create new marker
          const newMarker = new Marker({ color: m.color || '#f59e0b' }) // amber-500
            .setLngLat([m.lng, m.lat])
            .addTo(mapInstance.current);

          const el = newMarker.getElement();
          if (el) {
            el.style.cursor = 'pointer';
            el.addEventListener('click', (e) => {
              e.stopPropagation();
              if (onMarkerClickRef.current) {
                onMarkerClickRef.current(m.id);
              }
            });
          }

          newInstances[m.id] = newMarker;
        }
      }
    });

    // Remove any markers that are no longer in the list
    Object.values(currentInstances).forEach(markerObj => markerObj.remove());

    markersInstances.current = newInstances;
  }, [markers]);

  // Handle route rendering
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const renderRoute = () => {
      if (route) {
        if (map.getSource('route')) {
          map.getSource('route').setData(route);
        } else {
          map.addSource('route', {
            type: 'geojson',
            data: route
          });
          map.addLayer({
            id: 'route-layer',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#138A53', // brand-green
              'line-width': 4
            }
          });
        }
      } else {
        if (map.getLayer('route-layer')) map.removeLayer('route-layer');
        if (map.getSource('route')) map.removeSource('route');
      }
    };

    if (map.isStyleLoaded()) {
      renderRoute();
    } else {
      map.once('styledata', renderRoute);
    }
  }, [route]);

  // Handle fitBounds
  useEffect(() => {
    const map = mapInstance.current;
    if (map && fitBounds) {
      map.fitBounds(fitBounds, { padding: 50, maxZoom: 16 });
    }
  }, [fitBounds]);

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
