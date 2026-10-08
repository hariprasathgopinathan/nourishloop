import React from 'react';
import { Search, Filter, MoreHorizontal, List } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import UrgencyBadge from '../ui/UrgencyBadge';
import EmptyState from '../ui/EmptyState';

export default function DonationsList({ donations }) {
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

  return (
    <div className="max-w-[1240px] mx-auto pb-12">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[26px] font-bold text-brand-text mb-1 tracking-tight">My Donations</h2>
        <p className="text-[14px] text-brand-text-muted">Track and manage the surplus food you've shared.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-brand-surface p-3 rounded-[12px] border border-brand-border shadow-[0_2px_8px_rgba(15,23,42,0.02)] mb-6">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-[320px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search donations..."
              className="w-full pl-9 pr-4 py-2 bg-brand-neutral border border-brand-border rounded-[8px] text-[13px] focus:outline-none focus:bg-brand-surface focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all"
            />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select className="pl-9 pr-8 py-2 bg-brand-neutral border border-brand-border rounded-[8px] text-[13px] focus:outline-none focus:bg-brand-surface focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all appearance-none font-semibold text-brand-text w-full sm:w-[140px] cursor-pointer">
              <option>All Status</option>
              <option>Available</option>
              <option>Claimed</option>
              <option>Picked Up</option>
              <option>Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-brand-surface border border-brand-border rounded-[12px] shadow-[0_2px_8px_rgba(15,23,42,0.02)] overflow-hidden">
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
              {donations.map((don) => (
                <tr key={don._id} className="hover:bg-brand-donor-light/50 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-[40px] h-[40px] rounded-[6px] bg-gray-100 overflow-hidden shrink-0 border border-gray-200/60">
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
                    <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-gray-100 text-gray-700 text-[11px] font-bold">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
