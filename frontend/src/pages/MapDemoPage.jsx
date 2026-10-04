import React from 'react';
import MapView from '../components/map/MapView';

export default function MapDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">MapLibre OSM Demo</h1>
          <p className="text-sm text-gray-500 mt-1">Open-source mapping layer foundation test</p>
        </div>
        
        <div className="p-6 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Default View (Chennai)</h2>
            <MapView className="w-full" height="400px" />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">View with Marker</h2>
            <MapView 
              className="w-full" 
              height="300px" 
              zoom={14}
              marker={{ lng: 80.2785, lat: 13.0827 }} // Sample coords in Chennai
            />
          </section>
        </div>
      </div>
    </div>
  );
}
