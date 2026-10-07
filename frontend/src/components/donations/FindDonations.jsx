import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, ArrowRight, X } from 'lucide-react';
import UrgencyBadge from '../ui/UrgencyBadge';
import MapView from '../map/MapView';

const categories = ['All', 'Prepared Meals', 'Bakery', 'Produce', 'Dairy', 'Packaged Food', 'Beverages', 'Other'];
const sortOptions = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Expiring soon', value: 'expiring' },
  { label: 'Nearest', value: 'nearest' },
  { label: 'Largest quantity', value: 'largest' },
];

export default function FindDonations({ donations, onSelectDonation, radiusKm, onRadiusChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Filter by search query and category
  let filtered = donations.filter(d => {
    const matchesSearch = !searchQuery ||
      d.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || d.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'expiring':
        return new Date(a.availableUntil) - new Date(b.availableUntil);
      case 'nearest':
        const distA = isNaN(parseFloat(a.distance)) ? Infinity : parseFloat(a.distance);
        const distB = isNaN(parseFloat(b.distance)) ? Infinity : parseFloat(b.distance);
        return distA - distB;
      case 'largest':
        return b.quantity - a.quantity;
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const mapMarkers = filtered.map(d => ({
    id: d._id,
    lat: d.approximateLocation?.latitude,
    lng: d.approximateLocation?.longitude,
    color: '#0D9488' // brand-teal
  })).filter(m => m.lat && m.lng);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold text-brand-text mb-2 tracking-tight">Find donations</h2>
        <p className="text-gray-500 text-lg">Discover available surplus food from donors near you.</p>
      </div>

      {/* Search + Filters Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by food name, category, or donor..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Radius dropdown */}
          {onRadiusChange && (
            <select
              value={radiusKm}
              onChange={e => onRadiusChange(Number(e.target.value))}
              className="px-4 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal appearance-none cursor-pointer font-medium text-brand-text w-full sm:w-32"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
            </select>
          )}

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal appearance-none cursor-pointer font-medium text-brand-text w-full sm:w-48"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Filter toggle on mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg text-sm font-medium text-brand-text border border-transparent hover:bg-gray-100 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Category Chips */}
        <div className={`flex flex-wrap gap-2 ${showFilters ? 'block' : 'hidden sm:flex'}`}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-brand-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium">{filtered.length} donation{filtered.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Map View */}
      {mapMarkers.length > 0 && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-gray-200">
          <MapView
            height="300px"
            interactive={true}
            markers={mapMarkers}
            onMarkerClick={(id) => {
              const donation = filtered.find(d => d._id === id);
              if (donation) onSelectDonation(donation);
            }}
          />
        </div>
      )}

      {/* Donation Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-brand-text mb-2 tracking-tight">No donations found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find available food.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(don => (
            <button
              key={don._id}
              onClick={() => onSelectDonation(don)}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-brand-teal/40 hover:shadow-lg transition-all text-left group relative overflow-hidden w-full"
            >
              {/* Subtle accent line at top */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-teal/80 to-brand-teal/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-brand-text text-base truncate group-hover:text-brand-darkTeal transition-colors">{don.foodName}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{don.donorName}</p>
                </div>
                <UrgencyBadge availableUntil={don.availableUntil} />
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                  {don.category}
                </span>
                <span className="text-sm font-semibold text-gray-700">{don.quantity} <span className="font-medium text-gray-400">{don.unit}</span></span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="truncate max-w-[180px]">{don.pickupAddress ? don.pickupAddress.split(',')[0] : 'Approximate Area'}</span>
                  <span className="text-brand-teal font-semibold ml-1">{don.distance} km</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-brand-teal transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
