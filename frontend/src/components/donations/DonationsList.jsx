import React from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import UrgencyBadge from '../ui/UrgencyBadge';
import EmptyState from '../ui/EmptyState';
import { List } from 'lucide-react';

export default function DonationsList({ donations }) {
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
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">My Donations</h2>
        <p className="text-gray-500 text-lg">Track and manage the surplus food you've shared.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by food name or category..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select className="pl-10 pr-8 py-2.5 bg-gray-50/50 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none font-medium text-gray-700 w-full sm:w-48 cursor-pointer">
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
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Food Item</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Category</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Quantity</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Urgency</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {donations.map((don) => (
                <tr key={don._id} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="font-semibold text-gray-900">{don.foodName}</p>
                    <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider">{new Date(don.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                      {don.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-semibold text-gray-700">
                    {don.quantity} <span className="text-gray-400 font-medium">{don.unit}</span>
                  </td>
                  <td className="px-6 py-5">
                    <UrgencyBadge availableUntil={don.availableUntil} />
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={don.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <MoreHorizontal size={18} />
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
