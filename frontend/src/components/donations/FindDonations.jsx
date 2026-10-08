import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Clock, X } from 'lucide-react';
import MapView from '../map/MapView';
import { format } from 'date-fns';

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

  const getPlaceholderImage = (category) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(category || 'Food')}&background=E0F2FE&color=0284C7&size=400&font-size=0.2`;
  };

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
    color: '#008A4B' // brand-donor
  })).filter(m => m.lat && m.lng);

  return (
    <div className="max-w-[1240px] mx-auto pb-12">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[26px] font-bold text-brand-text mb-1 tracking-tight">Find Donations</h2>
        <p className="text-[14px] text-brand-text-muted">Browse available surplus food near your organization.</p>
      </div>

      {/* Search + Filters Toolbar */}
      <div className="bg-brand-surface p-3 rounded-[12px] border border-brand-border shadow-[0_2px_8px_rgba(15,23,42,0.02)] space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by food name, category, or donor..."
              className="w-full pl-9 pr-4 py-2 bg-brand-neutral border border-brand-border rounded-[8px] text-[13px] focus:outline-none focus:bg-brand-surface focus:border-brand-ngo focus:ring-1 focus:ring-brand-ngo transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Radius dropdown */}
          {onRadiusChange && (
            <select
              value={radiusKm}
              onChange={e => onRadiusChange(Number(e.target.value))}
              className="px-4 py-2 bg-brand-neutral border border-brand-border rounded-[8px] text-[13px] focus:outline-none focus:bg-brand-surface focus:border-brand-ngo focus:ring-1 focus:ring-brand-ngo appearance-none cursor-pointer font-semibold text-brand-text w-full sm:w-[100px]"
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
            className="px-4 py-2 bg-brand-neutral border border-brand-border rounded-[8px] text-[13px] focus:outline-none focus:bg-brand-surface focus:border-brand-ngo focus:ring-1 focus:ring-brand-ngo appearance-none cursor-pointer font-semibold text-brand-text w-full sm:w-[140px]"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Filter toggle on mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 bg-brand-neutral rounded-[8px] text-[13px] font-semibold text-brand-text border border-brand-border transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>

        {/* Category Chips */}
        <div className={`flex flex-wrap gap-2 ${showFilters ? 'block' : 'hidden sm:flex'}`}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-[100px] text-[12px] font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-brand-text text-white'
                  : 'bg-brand-neutral text-brand-text-muted hover:bg-brand-surface border border-brand-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] text-brand-text-muted font-medium">{filtered.length} donation{filtered.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Map View */}
      {mapMarkers.length > 0 && (
        <div className="mb-6 rounded-[12px] overflow-hidden border border-brand-border shadow-[0_2px_8px_rgba(15,23,42,0.02)] h-[250px]">
          <MapView
            height="100%"
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
        <div className="bg-brand-surface border border-brand-border rounded-[12px] p-16 text-center shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
          <div className="w-[48px] h-[48px] bg-brand-neutral text-gray-400 rounded-[12px] flex items-center justify-center mx-auto mb-4 border border-brand-border">
            <Search size={24} />
          </div>
          <h3 className="text-[16px] font-bold text-brand-text mb-1 tracking-tight">No donations found</h3>
          <p className="text-[13px] text-brand-text-muted">Try adjusting your search or filters to find available food.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(don => (
            <div
              key={don._id}
              className="bg-brand-surface rounded-[12px] border border-brand-border shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:border-brand-ngo/30 transition-all flex flex-col group overflow-hidden cursor-pointer"
              onClick={() => onSelectDonation(don)}
            >
              {/* Image Section */}
              <div className="h-[160px] w-full bg-gray-100 relative overflow-hidden">
                {don.imageUrl ? (
                  <img src={don.imageUrl} alt={don.foodName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <img src={getPlaceholderImage(don.category)} alt={don.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute top-3 right-3 bg-brand-surface/90 backdrop-blur-md px-2.5 py-1 rounded-[6px] shadow-sm">
                  <span className="text-[12px] font-bold text-brand-text">{don.quantity} {don.unit}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-[15px] text-brand-text truncate mb-1 group-hover:text-brand-ngo transition-colors">{don.foodName}</h3>
                
                <p className="text-[12px] font-bold text-brand-text-muted mb-3 truncate">{don.donorName}</p>
                
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-brand-text-muted mb-1">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="truncate">{don.pickupAddress ? don.pickupAddress.split(',')[0] : 'Approximate Area'}</span>
                </div>
                
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-brand-ngo mb-4 ml-[20px]">
                  {don.distance} km away
                </div>

                <div className="mt-auto pt-4 border-t border-brand-border">
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-brand-text-muted mb-3">
                    <Clock size={14} className="text-gray-400" />
                    Available until {format(new Date(don.availableUntil), 'h:mm a')}
                  </div>
                  
                  <button className="w-full bg-brand-ngo-light text-brand-ngo font-bold text-[13px] py-2 rounded-[8px] group-hover:bg-brand-ngo group-hover:text-white transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
