import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Package, Utensils, Building2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import UrgencyBadge from '../ui/UrgencyBadge';
import StatusBadge from '../ui/StatusBadge';

import { claimDonation } from '../../services/api';

// Temporary dev identifier (will be replaced by Firebase Auth user ID)


export default function DonationDetail({ donation, onBack, onClaimSuccess }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [claimState, setClaimState] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

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
        // Keep the donor display fields intact, since the API response strips them
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

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 mb-8 group transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to donations
      </button>

      {/* Success State */}
      {claimState === 'success' && (
        <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4 shadow-sm">
          <CheckCircle2 className="text-emerald-600 mt-0.5 flex-shrink-0" size={22} />
          <div>
            <h4 className="text-emerald-900 font-bold text-base mb-1">Donation claimed successfully</h4>
            <p className="text-emerald-700 text-sm">You have reserved this food for pickup. Please coordinate with the donor for collection.</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {claimState === 'error' && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4 shadow-sm">
          <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={22} />
          <div>
            <h4 className="text-red-900 font-bold text-base mb-1">Failed to claim donation</h4>
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Food Information Card */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">{donation.foodName}</h1>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                    {donation.category}
                  </span>
                  <StatusBadge status={donation.status} />
                </div>
              </div>
              <UrgencyBadge availableUntil={donation.availableUntil} />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Package size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Quantity</p>
                  <p className="text-lg font-semibold text-gray-900">{donation.quantity} <span className="text-gray-400 font-medium text-sm">{donation.unit}</span></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Available until</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {isNaN(new Date(donation.availableUntil).getTime()) 
                      ? 'Unknown date' 
                      : new Date(donation.availableUntil).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Utensils size={14} className="text-gray-400" />
                Description
              </h3>
              <p className={`text-sm leading-relaxed ${donation.description ? 'text-gray-600' : 'text-gray-400 italic'}`}>
                {donation.description || 'No additional description provided.'}
              </p>
            </div>
          </div>

          {/* Pickup Location Card */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
              <MapPin size={18} className="text-emerald-600" />
              Pickup location
            </h3>

            {/* Map Placeholder */}
            <div className="w-full h-48 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2Y5ZmFmYiIvPgo8cGF0aCBkPSJNMzAgMzBMMzAgMTBNMzAgMzBMNTAgMzBNMzAgMzBMMzAgNTBNMzAgMzBMMTAgMzAiIHN0cm9rZT0iI2UwZTBlMCIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPC9zdmc+')] opacity-60"></div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 shadow-sm">
                  <MapPin size={22} />
                </div>
                <p className="text-xs text-gray-500 font-medium">Map preview available after integration</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Address</p>
                <p className="text-sm font-medium text-gray-900">{donation.pickupAddress}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Pincode</p>
                  <p className="text-sm font-medium text-gray-900">{donation.pincode || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Distance</p>
                  <p className="text-sm font-semibold text-emerald-600">
                    {donation.distance === 'N/A' ? 'N/A' : `${donation.distance} km away`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar — Donor Info & CTA */}
        <div className="space-y-6">
          {/* Donor Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Building2 size={15} className="text-gray-400" />
              Donated by
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100">
                {donation.donorName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{donation.donorName}</p>
                <p className="text-xs text-gray-500 font-medium">Verified donor</p>
              </div>
            </div>
          </div>

          {/* Claim CTA */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            {claimState === 'success' ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Claimed</h3>
                <p className="text-sm text-gray-500">Coordinate pickup with the donor.</p>
              </div>
            ) : !showConfirm ? (
              <>
                <h3 className="font-semibold text-gray-900 mb-2">Interested in this food?</h3>
                <p className="text-sm text-gray-500 mb-5">Claim this donation to reserve it for your organization's pickup.</p>
                <Button
                  onClick={() => setShowConfirm(true)}
                  className="w-full shadow-emerald-500/20 shadow-lg"
                  size="lg"
                  disabled={donation.status !== 'AVAILABLE'}
                >
                  Claim donation
                </Button>
              </>
            ) : (
              // Confirmation panel
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Claim this donation?</h3>
                <p className="text-sm text-gray-500 mb-5">Your organization will reserve this food for pickup.</p>
                
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Food</span>
                    <span className="font-medium text-gray-900">{donation.foodName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quantity</span>
                    <span className="font-medium text-gray-900">{donation.quantity} {donation.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pickup</span>
                    <span className="font-medium text-gray-900 text-right max-w-[150px] truncate">{donation.pickupAddress.split(',')[0]}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowConfirm(false)}
                    className="flex-1"
                    disabled={claimState === 'loading'}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleClaim}
                    className="flex-1 shadow-emerald-500/20 shadow-lg"
                    isLoading={claimState === 'loading'}
                  >
                    Confirm claim
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
