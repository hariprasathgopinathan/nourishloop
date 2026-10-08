import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export default function UrgencyBadge({ availableUntil }) {
  const date = new Date(availableUntil);
  const now = new Date();
  const diffMs = date - now;

  if (diffMs <= 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-gray-100 text-gray-700 text-[11px] font-bold border border-gray-200">
        <AlertCircle size={10} /> Expired
      </div>
    );
  }

  const diffHours = diffMs / (1000 * 60 * 60);

  let styles = 'bg-brand-donor-light text-brand-donor border border-brand-donor/20';

  if (diffHours < 1) {
    styles = 'bg-red-50 text-red-600 border border-red-200 shadow-[0_2px_4px_rgba(239,68,68,0.1)]';
  } else if (diffHours < 3) {
    styles = 'bg-orange-50 text-orange-600 border border-orange-200';
  } else if (diffHours < 12) {
    styles = 'bg-amber-100 text-amber-600 border border-amber-200';
  }

  let timeText = '';
  if (diffHours < 1) {
    const mins = Math.ceil(diffMs / 60000);
    timeText = `Expires in ${mins} ${mins === 1 ? 'min' : 'mins'}`;
  } else if (diffHours < 24) {
    const hrs = Math.floor(diffHours);
    timeText = `Expires in ${hrs} ${hrs === 1 ? 'hr' : 'hrs'}`;
  } else {
    const days = Math.floor(diffHours / 24);
    timeText = `Expires in ${days} ${days === 1 ? 'day' : 'days'}`;
  }

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-bold ${styles}`}>
      <Clock size={10} /> {timeText}
    </div>
  );
}
