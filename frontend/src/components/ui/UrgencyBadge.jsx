import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export default function UrgencyBadge({ availableUntil }) {
  const date = new Date(availableUntil);
  const now = new Date();
  const diffMs = date - now;
  
  if (diffMs <= 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
        <AlertCircle size={12} /> Expired
      </div>
    );
  }
  
  const diffHours = diffMs / (1000 * 60 * 60);
  
  let level = 'NORMAL';
  let styles = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
  
  if (diffHours < 1) {
    level = 'CRITICAL';
    styles = 'bg-red-50 text-red-700 border border-red-200 shadow-sm';
  } else if (diffHours < 3) {
    level = 'URGENT';
    styles = 'bg-orange-50 text-orange-700 border border-orange-200';
  } else if (diffHours < 12) {
    level = 'EXPIRING SOON';
    styles = 'bg-amber-50 text-amber-700 border border-amber-200';
  }

  let timeText = '';
  if (diffHours < 1) {
    const mins = Math.ceil(diffMs / 60000);
    timeText = `Expires in ${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
  } else if (diffHours < 24) {
    const hrs = Math.floor(diffHours);
    timeText = `Expires in ${hrs} ${hrs === 1 ? 'hour' : 'hours'}`;
  } else {
    const days = Math.floor(diffHours / 24);
    timeText = `Expires in ${days} ${days === 1 ? 'day' : 'days'}`;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${styles}`}>
      <Clock size={12} /> {timeText}
    </div>
  );
}
