import React from 'react';
import { Calendar, Package, Users, Truck, Clock, ArrowRight } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

export default function Overview({ onCreateClick, stats, recentDonations, expiringSoon }) {
  const { appProfile } = useAuth();
  
  // Create a placeholder image logic based on category
  const getPlaceholderImage = (category) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(category || 'Food')}&background=E8F7EF&color=008A4B&size=120&font-size=0.33`;
  };

  const statCards = [
    { label: 'Total', value: stats.total, icon: Calendar, iconBg: 'bg-brand-donor-light', iconColor: 'text-brand-donor' },
    { label: 'Available', value: stats.available, icon: Package, iconBg: 'bg-brand-donor-light', iconColor: 'text-brand-donor' },
    { label: 'Claimed', value: stats.claimed, icon: Users, iconBg: 'bg-brand-ngo-light', iconColor: 'text-brand-ngo' },
    { label: 'Picked Up', value: stats.pickedUp, icon: Truck, iconBg: 'bg-gray-100', iconColor: 'text-gray-700' },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-[1240px] mx-auto pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-[26px] font-bold text-brand-text mb-1 tracking-tight">
            {greeting()}, {appProfile?.name?.split(' ')[0] || 'Donor'}
          </h2>
          <p className="text-[13px] font-medium text-brand-text-muted">
            DONOR - {appProfile?.organizationName || 'Organization'}
          </p>
        </div>
        <Button onClick={onCreateClick} variant="primary" className="px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          + Post Donation
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-brand-surface border border-brand-border/60 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${stat.iconBg} ${stat.iconColor}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-brand-text-muted mb-0.5">{stat.label}</p>
              <p className="text-[22px] font-extrabold text-brand-text leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {recentDonations.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No donations yet"
          description="Share your first surplus food donation with your community."
          actionLabel="Post Donation"
          onAction={onCreateClick}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: Recent Donations */}
          <div className="flex-1 lg:w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[18px] font-bold text-brand-text tracking-tight">Recent Donations</h3>
              <button className="text-[13px] font-bold text-brand-ngo hover:text-brand-ngo-hover flex items-center gap-1 transition-colors">
                View all <ArrowRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {recentDonations.slice(0, 5).map(don => (
                <div key={don._id} className="bg-brand-surface border border-brand-border/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 hover:border-brand-donor/40">
                  <div className="w-[72px] h-[72px] rounded-2xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                    {don.imageUrl ? (
                      <img src={don.imageUrl} alt={don.foodName} className="w-full h-full object-cover" />
                    ) : (
                      <img src={getPlaceholderImage(don.category)} alt={don.category} className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-brand-text truncate leading-tight mb-1">{don.foodName}</h4>
                    <p className="text-[13px] text-brand-text-muted truncate mb-1.5">
                      {don.category} - {don.quantity} {don.unit}
                    </p>
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-brand-text-muted">
                      <Clock size={14} className="text-gray-400" />
                      Available until {format(new Date(don.availableUntil), 'dd Oct, h:mm a')}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge status={don.status} />
                    <button className="text-[13px] font-bold text-brand-ngo hover:text-brand-ngo-hover transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Expiring Soon & Recent Activity */}
          <div className="lg:w-1/3 flex flex-col gap-8">
            <div>
              <h3 className="text-[18px] font-bold text-brand-text tracking-tight mb-4">Expiring Soon</h3>
              {expiringSoon.length === 0 ? (
                <div className="bg-brand-surface border border-brand-border/60 rounded-2xl p-6 text-center shadow-sm">
                  <p className="text-[13px] font-medium text-brand-text-muted">No urgent donations.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {expiringSoon.slice(0, 3).map(don => {
                    const hoursLeft = Math.max(0, Math.round((new Date(don.availableUntil) - new Date()) / (1000 * 60 * 60)));
                    return (
                      <div key={don._id} className="bg-brand-surface border border-brand-border/60 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <div className="w-[56px] h-[56px] rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                          {don.imageUrl ? (
                            <img src={don.imageUrl} alt={don.foodName} className="w-full h-full object-cover" />
                          ) : (
                            <img src={getPlaceholderImage(don.category)} alt={don.category} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[14px] font-bold text-brand-text truncate leading-tight mb-0.5">{don.foodName}</h4>
                          <p className="text-[12px] text-brand-text-muted mb-1">{don.quantity} {don.unit}</p>
                          <p className="text-[11px] font-bold text-red-600">Expires in {hoursLeft}h</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-[18px] font-bold text-brand-text tracking-tight mb-4">Recent Activity</h3>
              <div className="bg-brand-surface border border-brand-border/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="space-y-5">
                  <div className="relative pl-4 border-l-2 border-brand-ngo">
                    <p className="text-[13px] text-brand-text leading-snug">
                      <span className="font-bold">Hope Foundation</span> claimed your donation
                    </p>
                    <p className="text-[11px] text-brand-text-muted mt-0.5">2h ago</p>
                  </div>
                  <div className="relative pl-4 border-l-2 border-brand-donor">
                    <p className="text-[13px] text-brand-text leading-snug">
                      <span className="font-bold">Morning Star Shelter</span> picked up donation
                    </p>
                    <p className="text-[11px] text-brand-text-muted mt-0.5">1d ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
