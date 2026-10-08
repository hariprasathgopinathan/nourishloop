import React from 'react';

/**
 * Logo component with two display modes:
 * - compact: circular icon only (for sidebars, navbars, small spaces)
 * - full: complete logo with wordmark and tagline (for landing pages, auth pages)
 */
export default function Logo({ className = "h-8", compact = false }) {
  return (
    <div className={`flex items-center ${compact ? 'justify-center' : ''}`}>
      <img
        src={compact ? "/logo-icon.png" : "/logo.png"}
        alt="NourishLoop Logo"
        className={`object-contain ${className.replace('drop-shadow-sm', '')}`}
      />
    </div>
  );
}
