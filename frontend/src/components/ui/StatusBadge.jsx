export default function StatusBadge({ status }) {
  const config = {
    AVAILABLE: { label: 'Available', style: 'bg-brand-donor-light text-brand-donor border border-brand-donor/20' },
    CLAIMED: { label: 'Claimed', style: 'bg-brand-ngo-light text-brand-ngo border border-brand-ngo/20' },
    READY_FOR_PICKUP: { label: 'Ready for Pickup', style: 'bg-amber-100 text-amber-600 border border-amber-200' },
    PICKED_UP: { label: 'Picked Up', style: 'bg-gray-100 text-gray-700 border border-gray-200' },
    EXPIRED: { label: 'Expired', style: 'bg-red-50 text-red-600 border border-red-200' },
    CANCELLED: { label: 'Cancelled', style: 'bg-gray-100 text-gray-500 border border-gray-200' },
    EXPIRING_SOON: { label: 'Expiring Soon', style: 'bg-orange-50 text-orange-700 border border-orange-200' },
  };

  const current = config[status] || { label: status, style: 'bg-gray-100 text-gray-700 border border-gray-200' };

  return (
    <span className={`px-2 py-0.5 text-[11px] font-bold rounded-[4px] ${current.style}`}>
      {current.label}
    </span>
  );
}
