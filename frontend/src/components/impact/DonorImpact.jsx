import React, { useState, useEffect } from 'react';
import ImpactCard from './ImpactCard';
import { HandHeart, PackageOpen, Scale, Loader2, AlertCircle } from 'lucide-react';
import { getMyDonations } from '../../services/api';

export default function DonorImpact() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await getMyDonations();
        setDonations(res.data.donations || []);
      } catch (err) {
        setError(err.message || 'Unable to load impact data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <Loader2 className="animate-spin h-10 w-10 text-brand-donor mb-4" />
        <p className="text-[14px] font-bold text-brand-text-muted">Calculating impact metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[800px] mx-auto pt-12">
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-8 text-center text-red-700 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
          <AlertCircle className="mx-auto mb-4" size={32} />
          <h3 className="font-bold text-[16px] mb-2">Error Loading Impact</h3>
          <p className="text-[13px]">{error}</p>
        </div>
      </div>
    );
  }

  const donationsPosted = donations.length;
  const successfulPickups = donations.filter(c => c.status === 'PICKED_UP').length;
  
  const quantityRedistributed = donations
    .filter(c => c.status === 'PICKED_UP')
    .reduce((sum, c) => sum + (Number(c.quantity) || 0), 0);

  const impactStats = [
    { label: 'Donations Posted', value: donationsPosted, icon: HandHeart },
    { label: 'Successful Pickups', value: successfulPickups, icon: PackageOpen },
    { label: 'Quantity Redistributed', value: quantityRedistributed, icon: Scale },
  ];

  return (
    <div className="max-w-[1240px] mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-[26px] font-bold text-brand-text mb-1 tracking-tight">Community Impact</h2>
        <p className="text-[14px] text-brand-text-muted">Your organization's contribution to fighting food waste and hunger.</p>
      </div>

      <div className="bg-brand-surface rounded-[12px] p-4 text-[13px] text-brand-text-muted font-bold border border-brand-border flex items-center justify-between shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
        <p>This impact data is updated automatically based on your completed donations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {impactStats.map(stat => (
          <ImpactCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            theme="donor"
          />
        ))}
      </div>
    </div>
  );
}
