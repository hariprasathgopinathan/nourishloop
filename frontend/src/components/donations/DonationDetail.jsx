import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Package, Utensils, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import UrgencyBadge from '../ui/UrgencyBadge';
import StatusBadge from '../ui/StatusBadge';
import MapView from '../map/MapView';
import { claimDonation } from '../../services/api';
import { format } from 'date-fns';

export default function DonationDetail({ donation, onBack, onClaimSuccess }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [claimState, setClaimState] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const getPlaceholderImage = (category) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(category || 'Food')}&background=E0F2FE&color=0284C7&size=800&font-size=0.15`;
  };

  const handleClaim = async () => {
    if (!donation || !donation._id) {
      setClaimState('error');
      setErrorMessage('Invalid donation selection.');
      return;
    }

    if (donation.status !== 'AVAILABLE') {
      setClaimState('error');
      setErrorMessage('This donation is no longer available.');
      return;
    }

    setClaimState('loading');
    setErrorMessage('');

    try {
      const response = await claimDonation(donation._id);
      setClaimState('success');

      if (onClaimSuccess) {
        const updatedDonation = {
          ...donation,
          ...response.data.donation
        };
        onClaimSuccess(updatedDonation);
      }
    } catch (err) {
      setClaimState('error');
      if (err.status === 409) {
        setErrorMessage('This donation is no longer available.');
      } else if (err.status === 403) {
        setErrorMessage('Only authorized NGO accounts can claim donations.');
      } else {
        setErrorMessage(err.message || 'Unable to connect to the server. Please try again.');
      }
    }
  };

  if (!donation) return null;

  const lat = donation.latitude || donation.approximateLocation?.latitude;
  const lng = donation.longitude || donation.approximateLocation?.longitude;
  const isAddressHidden = !donation.pickupAddress;

  return (
    <div className="max-w-[1000px] mx-auto pb-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] font-bold text-brand-text-muted hover:text-brand-ngo mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to donations
      </button>

      {/* Success State */}
      {claimState === 'success' && (
        <div className="mb-6 p-5 bg-brand-ngo-light border border-brand-ngo/20 rounded-[12px] flex items-start gap-4 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
          <CheckCircle2 className="text-brand-ngo mt-0.5 shrink-0" size={20} />
          <div>
            <h4 className="text-brand-ngo font-bold text-[14px] mb-1">Donation claimed successfully</h4>
            <p className="text-brand-text-muted text-[13px]">You have reserved this food for pickup. Please coordinate with the donor for collection.</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {claimState === 'error' && (
        <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-[12px] flex items-start gap-4 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
          <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={20} />
          <div>
            <h4 className="text-red-700 font-bold text-[14px] mb-1">Failed to claim donation</h4>
            <p className="text-red-600 text-[13px]">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 lg:w-2/3 space-y-6">
          
          <div className="bg-brand-surface rounded-3xl border border-brand-border/60 shadow-sm overflow-hidden">
            {/* Header Image */}
            <div className="h-[240px] w-full bg-gray-100 relative">
              {donation.imageUrl ? (
                <img src={donation.imageUrl} alt={donation.foodName} className="w-full h-full object-cover" />
              ) : (
                <img src={getPlaceholderImage(donation.category)} alt={donation.category} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-[24px] font-bold text-brand-text tracking-tight mb-2">{donation.foodName}</h1>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] bg-gray-100 text-gray-700 text-[12px] font-bold">
                      {donation.category}
                    </span>
                    <StatusBadge status={donation.status} />
                  </div>
                </div>
                <UrgencyBadge availableUntil={donation.availableUntil} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 bg-brand-neutral p-4 rounded-[12px] border border-brand-border">
                  <div className="w-8 h-8 rounded-[8px] bg-white text-brand-ngo flex items-center justify-center shrink-0 border border-brand-border shadow-sm">
                    <Package size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider mb-0.5">Quantity</p>
                    <p className="text-[15px] font-bold text-brand-text">{donation.quantity} <span className="text-brand-text-muted font-medium text-[13px]">{donation.unit}</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-brand-neutral p-4 rounded-[12px] border border-brand-border">
                  <div className="w-8 h-8 rounded-[8px] bg-white text-brand-ngo flex items-center justify-center shrink-0 border border-brand-border shadow-sm">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider mb-0.5">Available until</p>
                    <p className="text-[14px] font-bold text-brand-text">
                      {isNaN(new Date(donation.availableUntil).getTime())
                        ? 'Unknown date'
                        : format(new Date(donation.availableUntil), 'dd Oct, h:mm a')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-brand-border">
                <h3 className="text-[14px] font-bold text-brand-text mb-2 flex items-center gap-2">
                  <Utensils size={14} className="text-brand-text-muted" />
                  Description
                </h3>
                <p className={`text-[13px] leading-relaxed ${donation.description ? 'text-brand-text-muted' : 'text-gray-400 italic'}`}>
                  {donation.description || 'No additional description provided.'}
                </p>
              </div>
            </div>
          </div>

          {/* Pickup Location Card */}
          <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-brand-border/60 shadow-sm">
            <h3 className="text-[16px] font-bold text-brand-text tracking-tight mb-5 flex items-center gap-2">
              <MapPin size={16} className="text-brand-ngo" />
              Pickup location
            </h3>

            {/* Map */}
            {lat && lng ? (
              <div className="mb-6 rounded-[12px] overflow-hidden border border-brand-border shadow-sm h-[200px]">
                <MapView
                  height="100%"
                  center={[lng, lat]}
                  zoom={13}
                  marker={{ lng, lat }}
                  interactive={false}
                />
              </div>
            ) : (
              <div className="w-full h-[200px] rounded-[12px] bg-gray-100 border border-gray-200 flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2Y5ZmFmYiIvPgo8cGF0aCBkPSJNMzAgMzBMMzAgMTBNMzAgMzBMNTAgMzBNMzAgMzBMMzAgNTBNMzAgMzBMMTAgMzAiIHN0cm9rZT0iI2UwZTBlMCIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPC9zdmc+')] opacity-60"></div>
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-10 h-10 rounded-[8px] bg-white text-brand-ngo flex items-center justify-center mb-2 shadow-sm border border-brand-border">
                    <MapPin size={20} />
                  </div>
                  <p className="text-[12px] text-gray-500 font-bold">Map unavailable</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Address</p>
                <p className={`text-[13px] font-medium ${isAddressHidden ? 'text-gray-500 italic' : 'text-brand-text'}`}>
                  {isAddressHidden ? 'Exact address revealed after claiming' : donation.pickupAddress}
                </p>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Pincode</p>
                  <p className="text-[13px] font-medium text-brand-text">{donation.pincode || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Distance</p>
                  <p className="text-[13px] font-bold text-brand-ngo">
                    {donation.distance === 'N/A' ? 'N/A' : `${donation.distance} km away`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar — Donor Info & CTA */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          {/* Donor Card */}
          <div className="bg-brand-surface p-6 rounded-3xl border border-brand-border/60 shadow-sm">
            <h3 className="text-[13px] font-bold text-brand-text-muted mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Building2 size={14} className="text-gray-400" />
              Donated by
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[10px] bg-brand-donor-light text-brand-donor flex items-center justify-center font-bold text-[16px]">
                {donation.donorName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-[14px] text-brand-text">{donation.donorName}</p>
                <p className="text-[12px] text-brand-text-muted font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-brand-donor" />
                  Verified donor
                </p>
              </div>
            </div>
          </div>

          {/* Claim CTA */}
          <div className="bg-brand-surface p-6 rounded-3xl border border-brand-border/60 shadow-sm">
            {claimState === 'success' ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-[10px] bg-brand-ngo-light text-brand-ngo flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-bold text-[15px] text-brand-text mb-1">Claimed</h3>
                <p className="text-[13px] text-brand-text-muted">Coordinate pickup with the donor.</p>
              </div>
            ) : !showConfirm ? (
              <>
                <h3 className="font-bold text-[15px] text-brand-text mb-1.5">Interested in this food?</h3>
                <p className="text-[13px] text-brand-text-muted mb-5 leading-snug">Claim this donation to reserve it for your organization's pickup.</p>
                <Button
                  onClick={() => setShowConfirm(true)}
                  variant="primary"
                  className="w-full bg-brand-ngo hover:bg-brand-ngo-hover py-3 rounded-full font-bold text-[14px] shadow-sm hover:shadow-md transition-all duration-300"
                  disabled={donation.status !== 'AVAILABLE'}
                >
                  Claim Donation
                </Button>
              </>
            ) : (
              // Confirmation panel
              <div>
                <h3 className="font-bold text-[15px] text-brand-text mb-1">Claim this donation?</h3>
                <p className="text-[13px] text-brand-text-muted mb-4">Your organization will reserve this food for pickup.</p>

                <div className="bg-brand-neutral rounded-[8px] p-3 space-y-2.5 mb-5 text-[12px] border border-brand-border">
                  <div className="flex justify-between">
                    <span className="text-brand-text-muted font-bold">Food</span>
                    <span className="font-bold text-brand-text truncate max-w-[120px]">{donation.foodName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-muted font-bold">Quantity</span>
                    <span className="font-bold text-brand-text">{donation.quantity} {donation.unit}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-brand-text-muted font-bold">Pickup</span>
                    <span className="font-bold text-brand-text text-right max-w-[120px]">
                      {isAddressHidden ? 'Revealed after claim' : donation.pickupAddress.split(',')[0]}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2 text-[13px] font-bold"
                    disabled={claimState === 'loading'}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleClaim}
                    variant="primary"
                    className="flex-1 bg-brand-ngo hover:bg-brand-ngo-hover py-2.5 text-[13px] font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                    isLoading={claimState === 'loading'}
                  >
                    Confirm Claim
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
