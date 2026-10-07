import React, { useState } from 'react';
import MapView from './MapView';
import { MapPin, Navigation, Trash2 } from 'lucide-react';

export default function LocationPicker({
  value, // { latitude, longitude } or null
  onChange,
  disabled = false
}) {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState('');

  const marker = value ? { lng: value.longitude, lat: value.latitude } : null;

  const handleMapClick = (coords) => {
    if (disabled) return;
    setError('');
    onChange({ latitude: coords.lat, longitude: coords.lng });
  };

  const handleGetCurrentLocation = () => {
    if (disabled) return;

    setError('');
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoadingLocation(false);
        onChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (err) => {
        setLoadingLocation(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. Please allow location access or select on the map.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('The request to get user location timed out.');
            break;
          default:
            setError('An unknown error occurred while getting location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleClear = () => {
    if (disabled) return;
    setError('');
    onChange(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location
          </label>
          <p className="text-xs text-gray-500 max-w-md">
            Select the pickup point on the map, or use your current location. This location helps NGOs find and collect the donation.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-1 text-gray-400" />
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={disabled || loadingLocation}
            className="inline-flex items-center px-3 py-1.5 border border-brand-green shadow-sm text-xs font-medium rounded text-white bg-brand-green hover:bg-brand-darkGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50"
          >
            <Navigation className={`h-4 w-4 mr-1 ${loadingLocation ? 'animate-pulse' : ''}`} />
            {loadingLocation ? 'Locating...' : 'Use current location'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
          {error}
        </div>
      )}

      <div className="relative">
        <MapView
          height="300px"
          marker={marker}
          onClick={handleMapClick}
          interactive={!disabled}
          className={disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-crosshair'}
        />

        {value && (
          <div className="absolute bottom-6 left-2 right-2 flex justify-center pointer-events-none">
            <div className="bg-gray-900/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center backdrop-blur-sm pointer-events-auto">
              <MapPin className="h-3 w-3 mr-1.5 text-brand-green" />
              <span className="font-mono">
                {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
