import React from 'react';
import { List, Clock } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import UrgencyBadge from '../ui/UrgencyBadge';
import ImpactCard from '../impact/ImpactCard';
import { Package, Utensils, Users, CheckCircle } from 'lucide-react';

export default function Overview({ onCreateClick, stats, recentDonations, expiringSoon }) {
  const statCards = [
    { label: 'Total Donations', value: stats.total, icon: Package },
    { label: 'Available', value: stats.available, icon: Utensils },
    { label: 'Claimed', value: stats.claimed, icon: Users },
    { label: 'Picked Up', value: stats.pickedUp, icon: CheckCircle },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Good evening, Arun</h2>
          <p className="text-gray-500 text-lg">Turn today's surplus into meals for your community.</p>
        </div>
        <Button onClick={onCreateClick} size="lg" className="shadow-emerald-500/20 shadow-lg">
          + Create Donation
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, i) => (
          <ImpactCard 
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={i === 0 ? "12%" : null}
          />
        ))}
      </div>

      {recentDonations.length === 0 ? (
        <div className="pt-8">
          <EmptyState 
            icon={List} 
            title="No donations yet" 
            description="Share your first surplus food donation with your community." 
            actionLabel="Create Donation" 
            onAction={onCreateClick}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Donations Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Recent Donations</h3>
                <p className="text-sm text-gray-500 mt-1">Your latest shared surplus items.</p>
              </div>
              <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-md transition-colors">
                View all &rarr;
              </button>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-4 font-semibold text-gray-600">Food & Category</th>
                      <th className="px-5 py-4 font-semibold text-gray-600">Quantity</th>
                      <th className="px-5 py-4 font-semibold text-gray-600">Expiry</th>
                      <th className="px-5 py-4 font-semibold text-gray-600">Status</th>
                      <th className="px-5 py-4 font-semibold text-gray-600 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentDonations.slice(0, 5).map(don => (
                      <tr key={don._id} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">{don.foodName}</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">{don.category}</p>
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-600">{don.quantity} <span className="text-gray-400">{don.unit}</span></td>
                        <td className="px-5 py-4"><UrgencyBadge availableUntil={don.availableUntil} /></td>
                        <td className="px-5 py-4"><StatusBadge status={don.status} /></td>
                        <td className="px-5 py-4 text-right">
                          <button className="text-sm font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Expiring Soon Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                Expiring Soon
              </h3>
              <p className="text-sm text-gray-500 mt-1">Donations requiring immediate pickup.</p>
            </div>
            
            {expiringSoon.length === 0 ? (
              <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
                <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock size={20} />
                </div>
                <p className="text-sm font-medium text-gray-600">No urgent donations.</p>
                <p className="text-xs text-gray-400 mt-1">All your active donations have plenty of time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {expiringSoon.slice(0, 4).map(don => (
                  <div key={don._id} className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-colors cursor-pointer">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 leading-tight">{don.foodName}</h4>
                        <p className="text-xs font-medium text-gray-500 mt-1">{don.quantity} {don.unit}</p>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-amber-600 group-hover:bg-amber-50 transition-colors">
                        &rarr;
                      </button>
                    </div>
                    <UrgencyBadge availableUntil={don.availableUntil} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
