import React from 'react';

/**
 * Logo component carefully crafted to be horizontally aligned, compact, and professional.
 * Uses a cleanly cropped transparent icon alongside highly legible, stylized typography.
 */
export default function Logo({ className = "h-9", compact = false }) {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      {/* 
        The logo image is precisely sized. 
        It uses the cleanly cropped transparent icon.
      */}
      <img
        src="/images/logo-icon.png"
        alt="NourishLoop Icon"
        className={`object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105 ${className}`}
      />
      
      {/* 
        The wordmark is rendered in pure CSS/HTML for infinite sharpness and zero padding issues.
      */}
      {!compact && (
        <div className="flex flex-col justify-center select-none pt-0.5">
          <div className="flex items-baseline">
            <span className="font-extrabold text-[1.2rem] leading-none text-brand-secondary tracking-tight">
              Nourish
            </span>
            <span className="font-extrabold text-[1.2rem] leading-none text-brand-primary tracking-tight">
              Loop
            </span>
          </div>
          <span className="text-[0.55rem] font-bold text-gray-500 uppercase tracking-[0.15em] leading-none mt-1">
            Keep good food in the loop
          </span>
        </div>
      )}
    </div>
  );
}
