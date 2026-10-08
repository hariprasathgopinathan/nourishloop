import React from 'react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { Package, HandHeart, Truck, CheckCircle, MapPin, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

export default function NgoOverview({ stats, recentAvailable, activeClaims, onFindDonations, onViewClaims }) {
  const { appProfile } = useAuth();
  
  const getPlaceholderImage = (category) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(category || 'Food')}&background=E0F2FE&color=0284C7&size=120&font-size=0.33`;
  };

  const statCards = [
    { label: 'Available nearby', value: stats.availableNearby, icon: Package, iconBg: 'bg-brand-ngo-light', iconColor: 'text-brand-ngo' },
    { label: 'Active claims', value: stats.activeClaims, icon: HandHeart, iconBg: 'bg-brand-ngo-light', iconColor: 'text-brand-ngo' },
    { label: 'Ready for pickup', value: stats.readyForPickup, icon: Truck, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
    { label: 'Completed pickups', value: stats.completedPickups, icon: CheckCircle, iconBg: 'bg-gray-100', iconColor: 'text-gray-700' },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-[1240px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-[26px] font-bold text-brand-text mb-1 tracking-tight">
            {greeting()}, {appProfile?.name || 'NGO Partner'}
          </h2>
          <p className="text-[13px] font-medium text-brand-text-muted">
            NGO - {appProfile?.organizationName || 'Organization'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onViewClaims} className="px-5 py-2.5 rounded-[8px] font-semibold text-brand-text">
            View My Claims
          </Button>
          <Button onClick={onFindDonations} variant="primary" className="px-5 py-2.5 rounded-[8px] font-semibold bg-brand-ngo hover:bg-brand-ngo-hover">
            Find Donations
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-brand-surface border border-brand-border rounded-[12px] p-5 shadow-[0_2px_10px_rgba(15,23,42,0.02)] flex items-center gap-4">
            <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-brand-text-muted mb-0.5">{stat.label}</p>
              <p className="text-[22px] font-extrabold text-brand-text leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Available Food Nearby */}
        <div className="flex-1 lg:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[18px] font-bold text-brand-text tracking-tight">Available Nearby</h3>
            <button
              onClick={onFindDonations}
              className="text-[13px] font-bold text-brand-ngo hover:text-brand-ngo-hover flex items-center gap-1 transition-colors"
            >
              Browse all <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {recentAvailable.length === 0 ? (
              <div className="bg-brand-surface border border-brand-border rounded-[12px] p-8 text-center shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
                <Package size={24} className="mx-auto text-brand-text-muted mb-2" />
                <p className="text-[14px] font-medium text-brand-text">No donations available nearby.</p>
              </div>
            ) : (
              recentAvailable.slice(0, 5).map(don => (
                <div key={don._id} className="bg-brand-surface border border-brand-border rounded-[12px] p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:border-brand-ngo/30 transition-colors cursor-pointer" onClick={onFindDonations}>
                  <div className="w-[60px] h-[60px] rounded-[8px] bg-gray-100 overflow-hidden shrink-0 border border-gray-200/60">
                    {don.imageUrl ? (
                      <img src={don.imageUrl} alt={don.foodName} className="w-full h-full object-cover" />
                    ) : (
                      <img src={getPlaceholderImage(don.category)} alt={don.category} className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-brand-text truncate leading-tight mb-1">{don.foodName}</h4>
                    <p className="text-[13px] text-brand-text-muted truncate mb-1.5 flex items-center gap-2">
                      {don.category} - {don.quantity} {don.unit}
                      <span className="flex items-center gap-0.5 text-brand-ngo bg-brand-ngo-light px-1.5 py-0.5 rounded-[4px] text-[11px] font-bold">
                        <MapPin size={10} /> {don.distance} km
                      </span>
                    </p>
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-brand-text-muted">
                      <Clock size={14} className="text-gray-400" />
                      Available until {format(new Date(don.availableUntil), 'dd Oct, h:mm a')}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button className="text-[13px] font-bold text-white bg-brand-ngo hover:bg-brand-ngo-hover px-4 py-1.5 rounded-[6px] transition-colors">
                      Claim Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Active Claims */}
        <div className="lg:w-1/3 flex flex-col gap-8">
          <div>
            <h3 className="text-[18px] font-bold text-brand-text tracking-tight mb-4">Active Claims</h3>
            
            {activeClaims.length === 0 ? (
              <div className="bg-brand-surface border border-brand-border rounded-[12px] p-6 text-center shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
                <p className="text-[13px] font-medium text-brand-text-muted">No active claims.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeClaims.slice(0, 4).map(claim => (
                  <div key={claim._id} className="bg-brand-surface border border-brand-border rounded-[12px] p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(15,23,42,0.02)] cursor-pointer" onClick={onViewClaims}>
                    <div className="w-[48px] h-[48px] rounded-[6px] bg-gray-100 overflow-hidden shrink-0 border border-gray-200/60">
                      {claim.imageUrl ? (
                        <img src={claim.imageUrl} alt={claim.foodName} className="w-full h-full object-cover" />
                      ) : (
                        <img src={getPlaceholderImage(claim.category)} alt={claim.category} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] font-bold text-brand-text truncate leading-tight mb-0.5">{claim.foodName}</h4>
                      <p className="text-[12px] text-brand-text-muted mb-1 truncate">{claim.donorName}</p>
                      <StatusBadge status={claim.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-[18px] font-bold text-brand-text tracking-tight mb-4">Recent Impact</h3>
            <div className="bg-brand-surface border border-brand-border rounded-[12px] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
              <div className="space-y-4">
                <div className="relative pl-4 border-l-2 border-brand-ngo">
                  <p className="text-[13px] text-brand-text leading-snug">
                    You distributed meals to <span className="font-bold">45 people</span>
                  </p>
                  <p className="text-[11px] text-brand-text-muted mt-0.5">2d ago</p>
                </div>
                <div className="relative pl-4 border-l-2 border-brand-ngo">
                  <p className="text-[13px] text-brand-text leading-snug">
                    You rescued <span className="font-bold">20kg of fresh produce</span>
                  </p>
                  <p className="text-[11px] text-brand-text-muted mt-0.5">1w ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
