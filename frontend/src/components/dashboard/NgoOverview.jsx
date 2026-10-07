import React from 'react';
import Button from '../ui/Button';
import ImpactCard from '../impact/ImpactCard';
import UrgencyBadge from '../ui/UrgencyBadge';
import StatusBadge from '../ui/StatusBadge';
import { Package, HandHeart, Truck, CheckCircle, MapPin, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function NgoOverview({ stats, recentAvailable, activeClaims, onFindDonations, onViewClaims }) {
  const { appProfile } = useAuth();

  const statCards = [
    { label: 'Available nearby', value: stats.availableNearby, icon: Package, trend: '5%' },
    { label: 'Active claims', value: stats.activeClaims, icon: HandHeart },
    { label: 'Ready for pickup', value: stats.readyForPickup, icon: Truck },
    { label: 'Completed pickups', value: stats.completedPickups, icon: CheckCircle, trend: '18%' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-brand-text mb-2 tracking-tight">
            Good morning, {appProfile?.name || 'NGO Partner'}
          </h2>
          <p className="text-gray-500 text-lg">Find surplus food available near your organization.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onViewClaims}>View my claims</Button>
          <Button onClick={onFindDonations} variant="ngoPrimary" size="lg">
            Find donations
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map(stat => (
          <ImpactCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            theme="ngo"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Food Nearby */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-xl font-semibold text-brand-text tracking-tight">Available nearby</h3>
              <p className="text-sm text-gray-500 mt-1">Surplus food ready for your organization to claim.</p>
            </div>
            <button
              onClick={onFindDonations}
              className="text-sm font-semibold text-brand-teal hover:text-brand-darkTeal hover:bg-brand-teal/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              Browse all &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {recentAvailable.slice(0, 4).map(don => (
              <div key={don._id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-brand-teal/30 hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-brand-text truncate">{don.foodName}</h4>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium flex-shrink-0">
                        {don.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{don.quantity} {don.unit}</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-gray-400" />
                        {don.distance} km away
                      </span>
                      <span className="text-gray-400">{don.donorName}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <UrgencyBadge availableUntil={don.availableUntil} />
                    <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-brand-teal group-hover:bg-brand-teal/10 transition-colors">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Claims Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-brand-text tracking-tight flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal/70 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-teal"></span>
              </span>
              Active claims
            </h3>
            <p className="text-sm text-gray-500 mt-1">Your pending and ready pickups.</p>
          </div>

          {activeClaims.length === 0 ? (
            <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
              <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <HandHeart size={20} />
              </div>
              <p className="text-sm font-medium text-gray-600">No active claims.</p>
              <p className="text-xs text-gray-400 mt-1">Browse available donations to start claiming.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeClaims.map(claim => (
                <div key={claim._id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group hover:border-brand-teal/40 transition-colors cursor-pointer">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-teal"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-brand-text leading-tight">{claim.foodName}</h4>
                      <p className="text-xs font-medium text-gray-500 mt-1">{claim.quantity} {claim.unit} · {claim.donorName}</p>
                    </div>
                    <StatusBadge status={claim.status} />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock size={12} className="text-gray-400" />
                    Claimed {new Date(claim.claimedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
