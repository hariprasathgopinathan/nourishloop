import React from 'react';

export default function ImpactCard({ icon: Icon, value, label, trend, trendUp = true }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full relative overflow-hidden group hover:border-emerald-100 transition-colors">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
      
      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 relative z-10">
        <Icon size={20} />
      </div>
      
      <div className="relative z-10">
        <h4 className="text-3xl font-semibold text-gray-900 tracking-tight mb-1">{value}</h4>
        <p className="text-sm font-medium text-gray-500 mb-3">{label}</p>
        
        {trend && (
          <div className="flex items-center gap-1.5 mt-auto">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
