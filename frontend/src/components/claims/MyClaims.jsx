import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Clock, MapPin, Building2, Loader2, HandHeart } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../ui/EmptyState';
import { getMyClaims } from '../../services/api';



const statusFilters = ['All', 'CLAIMED', 'READY_FOR_PICKUP', 'PICKED_UP', 'EXPIRED', 'CANCELLED'];
const statusLabels = {
  All: 'All status',
  CLAIMED: 'Claimed',
  READY_FOR_PICKUP: 'Ready for Pickup',
  PICKED_UP: 'Picked Up',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
};

export default function MyClaims({ onSelectClaim }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyClaims();
      setClaims(res.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load your claims.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const filtered = claims.filter(c => {
    const matchesSearch = !searchQuery || 
      c.foodName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.donorOrganizationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.pickupAddress?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <Loader2 className="animate-spin h-10 w-10 text-emerald-500 mb-4" />
        <p className="text-gray-500 font-medium">Loading your claims...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-12">
        <EmptyState 
          title="Configuration Error" 
          description={error} 
          actionLabel="Try Again"
          onAction={fetchClaims}
        />
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <div className="pt-12">
        <EmptyState 
          icon={HandHeart} 
          title="No claims yet" 
          description="Browse available donations and claim food for your organization. Claimed donations will appear here." 
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">My claims</h2>
        <p className="text-gray-500 text-lg">Track and manage food you've claimed from donors.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by food, category, donor, or address..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-gray-50/50 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer font-medium text-gray-700 w-full sm:w-48"
            >
              {statusFilters.map(s => (
                <option key={s} value={s}>{statusLabels[s]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <p className="text-gray-500">No claims match your criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(claim => (
            <div key={claim._id} className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-100 hover:shadow-md transition-all group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{claim.foodName}</h3>
                    <StatusBadge status={claim.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{claim.quantity} {claim.unit}</span>
                    <span className="flex items-center gap-1">
                      <Building2 size={13} className="text-gray-400" />
                      {claim.donorOrganizationName || claim.donorName || "Anonymous Donor"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-gray-400" />
                      {claim.pickupAddress?.split(',')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-gray-400" />
                      Claimed {new Date(claim.claimedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button 
                    onClick={() => onSelectClaim?.(claim)}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-md transition-colors"
                  >
                    View details
                  </button>
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <MoreHorizontal size={18} />
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
