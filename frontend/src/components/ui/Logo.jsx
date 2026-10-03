import React from 'react';

export default function Logo({ className = "w-8 h-8", compact = false }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? 'justify-center' : ''}`}>
      <div className={`relative flex items-center justify-center bg-emerald-600 rounded-xl shadow-sm overflow-hidden flex-shrink-0 ${className}`}>
        {/* Abstract leaf/bowl shape */}
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3/4 h-3/4 text-white">
          <path d="M12 21.5C12 21.5 3 16 3 9.5C3 6.5 5.5 4 8.5 4C10.5 4 11.5 5 12 6C12.5 5 13.5 4 15.5 4C18.5 4 21 6.5 21 9.5C21 16 12 21.5 12 21.5Z" fill="currentColor" opacity="0.4"/>
          <path d="M12 21.5C12 21.5 3 16 3 9.5C3 6.5 5.5 4 8.5 4C10.5 4 11.5 5 12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.5 4C18.5 4 21 6.5 21 9.5C21 16 12 21.5 12 21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Subtle dot for 'food' inside the bowl/leaf */}
          <circle cx="12" cy="11" r="2" fill="currentColor" className="text-amber-300" />
        </svg>
      </div>
      {!compact && (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 leading-tight tracking-tight text-lg">
            Surplus Food
          </span>
          <span className="text-xs font-medium text-emerald-600 uppercase tracking-widest leading-none mt-0.5">
            Donation Network
          </span>
        </div>
      )}
    </div>
  );
}
