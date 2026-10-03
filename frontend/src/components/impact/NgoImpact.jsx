import React from 'react';
import ImpactCard from './ImpactCard';
import { HandHeart, Users, PackageOpen, Scale } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

export default function NgoImpact() {
  const impactStats = [
    { label: 'Meals Distributed', value: '1,450', icon: HandHeart, trend: '12%' },
    { label: 'Food Rescued (kg)', value: '870', icon: Scale, trend: '8%' },
    { label: 'People Served', value: '3,200', icon: Users, trend: '15%' },
    { label: 'Successful Pickups', value: '84', icon: PackageOpen, trend: '5%' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Community impact</h2>
        <p className="text-gray-500 text-lg">Your organization's contribution to fighting food waste and hunger.</p>
      </div>

      <div className="bg-emerald-50 rounded-2xl p-4 sm:p-6 text-emerald-800 text-sm font-medium border border-emerald-100 flex items-center justify-between shadow-sm">
        <p>This impact data is updated automatically based on your completed claims.</p>
        <span className="hidden sm:inline-block px-2.5 py-1 bg-emerald-100 rounded-md text-emerald-700 text-xs font-semibold uppercase tracking-wider">Demo Data</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {impactStats.map(stat => (
          <ImpactCard 
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Visualizations Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center">
          <EmptyState 
            icon={Scale} 
            title="Monthly Food Rescue" 
            description="Chart visualization of your food rescue volume over time will appear here." 
          />
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center">
          <EmptyState 
            icon={Users} 
            title="Demographics Reached" 
            description="Breakdown of communities and locations served by your redistributions." 
          />
        </div>
      </div>
    </div>
  );
}
