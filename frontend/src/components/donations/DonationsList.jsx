import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, List } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import UrgencyBadge from '../ui/UrgencyBadge';
import EmptyState from '../ui/EmptyState';

export default function DonationsList({ donations }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const getPlaceholderImage = (category) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(category || 'Food')}&background=E8F7EF&color=008A4B&size=120&font-size=0.33`;
  };

  if (!donations || donations.length === 0) {
    return (
      <EmptyState
        icon={List}
        title="No donations found"
        description="You haven't made any donations that match this criteria."
      />
    );
  }

  const filteredDonations = donations.filter((don) => {
    const matchesSearch = don.foodName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          don.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'All Status') {
      return matchesSearch;
    }
    
    return matchesSearch && don.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="max-w-[1240px] mx-auto pb-12">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[26px] font-bold text-brand-text mb-1 tracking-tight">My Donations</h2>
        <p className="text-[14px] text-brand-text-muted">Track and manage the surplus food you've shared.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-brand-surface p-3 rounded-2xl border border-brand-border/60 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-[320px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search donations..."
              className="w-full pl-9 pr-4 py-2.5 bg-brand-neutral border border-brand-border/60 rounded-full text-[13px] focus:outline-none focus:bg-brand-surface focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              className="pl-9 pr-8 py-2.5 bg-brand-neutral border border-brand-border/60 rounded-full text-[13px] focus:outline-none focus:bg-brand-surface focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all appearance-none font-semibold text-brand-text w-full sm:w-[140px] cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All Status">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="CLAIMED">Claimed</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-brand-surface border border-brand-border/60 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead className="bg-brand-neutral/50 border-b border-brand-border">
              <tr>
                <th className="px-5 py-3 font-bold text-brand-text-muted">Food Item</th>
                <th className="px-5 py-3 font-bold text-brand-text-muted">Category</th>
                <th className="px-5 py-3 font-bold text-brand-text-muted">Quantity</th>
                <th className="px-5 py-3 font-bold text-brand-text-muted">Urgency</th>
                <th className="px-5 py-3 font-bold text-brand-text-muted">Status</th>
                <th className="px-5 py-3 font-bold text-brand-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-gray-500 font-medium">
                    No donations match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((don) => (
                  <tr key={don._id} className="hover:bg-brand-donor-light/50 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-4">
                        <div className="w-[48px] h-[48px] rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                          {don.imageUrl ? (
                            <img src={don.imageUrl} alt={don.foodName} className="w-full h-full object-cover" />
                          ) : (
                            <img src={getPlaceholderImage(don.category)} alt={don.category} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-brand-text">{don.foodName}</p>
                          <p className="text-[11px] text-brand-text-muted font-medium mt-0.5">{new Date(don.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-bold uppercase tracking-wider">
                        {don.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-bold text-brand-text">
                      {don.quantity} <span className="text-brand-text-muted font-medium">{don.unit}</span>
                    </td>
                    <td className="px-5 py-3">
                      <UrgencyBadge availableUntil={don.availableUntil} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={don.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="p-1.5 text-gray-400 hover:text-brand-donor hover:bg-brand-donor-light rounded-[6px] transition-colors focus:outline-none focus:ring-1 focus:ring-brand-donor">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
