import React from 'react';

export default function ImpactCard({ icon: Icon, value, label, trend, trendUp = true, theme = 'donor' }) {
  const isNgo = theme === 'ngo';
  const colorBg = isNgo ? 'bg-brand-ngo-light' : 'bg-brand-donor-light';
  const colorText = isNgo ? 'text-brand-ngo' : 'text-brand-donor';
  const hoverBorder = isNgo ? 'hover:border-brand-ngo/40' : 'hover:border-brand-donor/40';

  return (
    <div className={`bg-brand-surface p-4 sm:p-5 rounded-[12px] border border-brand-border shadow-[0_2px_8px_rgba(15,23,42,0.02)] flex flex-col h-full relative overflow-hidden group ${hoverBorder} transition-colors`}>
      <div className={`w-[40px] h-[40px] rounded-[8px] flex items-center justify-center mb-4 relative z-10 ${colorBg} ${colorText} border border-brand-border`}>
        <Icon size={20} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <h4 className="text-[28px] font-bold text-brand-text tracking-tight mb-1">{value}</h4>
        <p className="text-[13px] font-medium text-brand-text-muted mb-4">{label}</p>

        {trend && (
          <div className="flex items-center gap-2 mt-auto pt-2 border-t border-brand-border/50">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-[4px] border ${trendUp ? `${colorBg} ${colorText} border-${colorText}/20` : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
