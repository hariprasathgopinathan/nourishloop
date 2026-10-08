import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Loader2, HandHeart } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../ui/EmptyState';
import { getMyClaims } from '../../services/api';

const statusFilters = ['All', 'CLAIMED', 'READY_FOR_PICKUP', 'PICKED_UP', 'EXPIRED', 'CANCELLED'];
const statusLabels = {
  All: 'All Status',
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

  const getPlaceholderImage = (category) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(category || 'Food')}&background=E0F2FE&color=0284C7&size=120&font-size=0.33`;
  };

  const fetchClaims = async () => {
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
        <Loader2 className="animate-spin h-10 w-10 text-brand-ngo mb-4" />
        <p className="text-brand-text-muted font-bold text-[14px]">Loading your claims...</p>
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
    <div className="max-w-[1240px] mx-auto pb-12">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[26px] font-bold text-brand-text mb-1 tracking-tight">My Claims</h2>
        <p className="text-[14px] text-brand-text-muted">Track and manage food you've claimed from donors.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-brand-surface p-3 rounded-[12px] border border-brand-border shadow-[0_2px_8px_rgba(15,23,42,0.02)] mb-6">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-[320px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search claims..."
              className="w-full pl-9 pr-4 py-2 bg-brand-neutral border border-brand-border rounded-[8px] text-[13px] focus:outline-none focus:bg-brand-surface focus:border-brand-ngo focus:ring-1 focus:ring-brand-ngo transition-all"
            />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 bg-brand-neutral border border-brand-border rounded-[8px] text-[13px] focus:outline-none focus:bg-brand-surface focus:border-brand-ngo focus:ring-1 focus:ring-brand-ngo transition-all appearance-none font-semibold text-brand-text w-full sm:w-[140px] cursor-pointer"
            >
              {statusFilters.map(s => (
                <option key={s} value={s}>{statusLabels[s]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {filtered.length === 0 ? (
        <div className="bg-brand-surface border border-brand-border rounded-[12px] p-16 text-center shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
          <p className="text-[14px] font-medium text-brand-text-muted">No claims match your criteria.</p>
        </div>
      ) : (
        <div className="bg-brand-surface border border-brand-border rounded-[12px] shadow-[0_2px_8px_rgba(15,23,42,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead className="bg-brand-neutral/50 border-b border-brand-border">
                <tr>
                  <th className="px-5 py-3 font-bold text-brand-text-muted">Food Item</th>
                  <th className="px-5 py-3 font-bold text-brand-text-muted">Donor</th>
                  <th className="px-5 py-3 font-bold text-brand-text-muted">Quantity</th>
                  <th className="px-5 py-3 font-bold text-brand-text-muted">Claim Date</th>
                  <th className="px-5 py-3 font-bold text-brand-text-muted">Status</th>
                  <th className="px-5 py-3 font-bold text-brand-text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filtered.map((claim) => (
                  <tr key={claim._id} className="hover:bg-brand-ngo-light/50 transition-colors group cursor-pointer" onClick={() => onSelectClaim?.(claim)}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] rounded-[6px] bg-gray-100 overflow-hidden shrink-0 border border-gray-200/60">
                          {claim.imageUrl ? (
                            <img src={claim.imageUrl} alt={claim.foodName} className="w-full h-full object-cover" />
                          ) : (
                            <img src={getPlaceholderImage(claim.category)} alt={claim.category} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-brand-text">{claim.foodName}</p>
                          <p className="text-[11px] text-brand-text-muted font-medium mt-0.5">{claim.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-bold text-brand-text">{claim.donorOrganizationName || claim.donorName || "Anonymous"}</p>
                    </td>
                    <td className="px-5 py-3 font-bold text-brand-text">
                      {claim.quantity} <span className="text-brand-text-muted font-medium">{claim.unit}</span>
                    </td>
                    <td className="px-5 py-3 text-brand-text">
                      {new Date(claim.claimedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={claim.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="p-1.5 text-gray-400 hover:text-brand-ngo hover:bg-brand-ngo-light rounded-[6px] transition-colors focus:outline-none focus:ring-1 focus:ring-brand-ngo">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
