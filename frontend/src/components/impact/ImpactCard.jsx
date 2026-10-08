import React from 'react';

export default function ImpactCard({ icon: Icon, value, label, trend, trendUp = true, theme = 'donor' }) {
  const isNgo = theme === 'ngo';
  const colorBg = isNgo ? 'bg-brand-ngo/10' : 'bg-brand-donor/10';
  const colorText = isNgo ? 'text-brand-ngo' : 'text-brand-donor';
  const hoverBorder = isNgo ? 'hover:border-brand-ngo/20' : 'hover:border-brand-donor/20';

  return (
    <div className={`bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full relative overflow-hidden group ${hoverBorder} transition-colors`}>
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500 ${colorBg}`}></div>

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative z-10 ${colorBg} ${colorText}`}>
        <Icon size={20} />
      </div>

      <div className="relative z-10">
        <h4 className="text-3xl font-semibold text-brand-text tracking-tight mb-1">{value}</h4>
        <p className="text-sm font-medium text-gray-500 mb-3">{label}</p>

        {trend && (
          <div className="flex items-center gap-1.5 mt-auto">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trendUp ? `${colorBg} ${colorText}` : 'bg-gray-100 text-gray-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
