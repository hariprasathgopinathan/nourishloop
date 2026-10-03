export default function StatusBadge({ status }) {
  const config = {
    AVAILABLE: { label: 'Available', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    CLAIMED: { label: 'Claimed', style: 'bg-amber-50 text-amber-700 border-amber-200' },
    READY_FOR_PICKUP: { label: 'Ready for Pickup', style: 'bg-blue-50 text-blue-700 border-blue-200' },
    PICKED_UP: { label: 'Picked Up', style: 'bg-gray-100 text-gray-700 border-gray-200' },
    EXPIRED: { label: 'Expired', style: 'bg-red-50 text-red-600 border-red-200' },
    CANCELLED: { label: 'Cancelled', style: 'bg-gray-100 text-gray-500 border-gray-200' },
    EXPIRING_SOON: { label: 'Expiring Soon', style: 'bg-orange-50 text-orange-700 border-orange-200' },
  };

  const current = config[status] || { label: status, style: 'bg-gray-100 text-gray-700 border-gray-200' };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${current.style}`}>
      {current.label}
    </span>
  );
}
