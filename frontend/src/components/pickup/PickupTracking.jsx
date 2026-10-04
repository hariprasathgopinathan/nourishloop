
import React, { useState, useEffect } from 'react';
import { MapPin, ArrowLeft, Clock, Building2, CheckCircle, Circle, Package, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import { markReadyForPickup, markPickedUp, getMyClaims } from '../../services/api';

// const DEV_NGO_ID = import.meta.env.VITE_DEV_NGO_ID;
// const DEV_DONOR_ID = import.meta.env.VITE_DEV_DONOR_ID;

const timelineSteps = [
  { key: 'claimed', label: 'Donation claimed', description: 'The food is reserved for pickup.' },
  { key: 'preparing', label: 'Preparing for pickup', description: 'The donor is preparing the order.' },
  { key: 'ready', label: 'Ready for pickup', description: 'Food is packaged and waiting for collection.' },
  { key: 'picked_up', label: 'Picked up', description: 'The organization successfully collected the food.' },
];

function getActiveStep(status) {
  switch (status) {
    case 'CLAIMED': return 0;
    case 'READY_FOR_PICKUP': return 2;
    case 'PICKED_UP': return 3;
    default: return -1;
  }
}

export default function PickupTracking({ role = 'NGO', initialDonations, onUpdate, onBack }) {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claimsList, setClaimsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Action state
  const [actionState, setActionState] = useState('idle'); // idle | loading | success | error
  const [actionError, setActionError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (role === 'DONOR' && initialDonations) {
      setClaimsList(initialDonations.filter(d => ['CLAIMED', 'READY_FOR_PICKUP', 'PICKED_UP'].includes(d.status)));
    } else if (role === 'NGO') {
      fetchNgoClaims();
    }
  }, [role, initialDonations]);

  const fetchNgoClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyClaims();
      setClaimsList((res.data || []).filter(d => ['CLAIMED', 'READY_FOR_PICKUP', 'PICKED_UP'].includes(d.status)));
    } catch (err) {
      setError(err.message || 'Unable to load pickups.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedClaim) return;
    setActionState('loading');
    setActionError('');
    
    try {
      if (role === 'DONOR' && selectedClaim.status === 'CLAIMED') {
        const res = await markReadyForPickup(selectedClaim._id);
        handleActionSuccess(res.data || res);
      } else if (role === 'NGO' && selectedClaim.status === 'READY_FOR_PICKUP') {
        const res = await markPickedUp(selectedClaim._id);
        handleActionSuccess(res.data || res);
      }
    } catch (err) {
      setActionState('error');
      setActionError(err.message || 'Unable to update status.');
    }
  };

  const handleActionSuccess = (updatedData) => {
    setActionState('success');
    setShowConfirm(false);
    
    // Merge the updated data with existing donor fields
    const updatedClaim = { ...selectedClaim, ...updatedData };
    setSelectedClaim(updatedClaim);
    
    // Update local list
    setClaimsList(prev => prev.map(c => c._id === updatedClaim._id ? updatedClaim : c));

    // Notify parent if needed (DonorDashboard)
    if (onUpdate) onUpdate();
  };

  const handleBackToList = () => {
    if (onBack && !selectedClaim) {
      onBack();
    } else {
      setSelectedClaim(null);
      setActionState('idle');
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <Loader2 className="animate-spin h-10 w-10 text-emerald-500 mb-4" />
        <p className="text-gray-500 font-medium">Loading active pickups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto pt-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-700">
          <AlertCircle className="mx-auto mb-4" size={32} />
          <h3 className="font-bold text-lg mb-2">Error Loading Pickups</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  if (!selectedClaim) {
    if (claimsList.length === 0) {
      return (
        <div className="max-w-4xl mx-auto pb-12">
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">No active pickups</h3>
            <p className="text-gray-500 mb-6">There are no donations currently in progress for pickup.</p>
            {onBack && (
              <Button onClick={onBack} variant="secondary">Go back</Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto pb-12 space-y-4">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 mb-4 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
        )}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Pickups</h2>
        {claimsList.map(c => (
          <div 
            key={c._id} 
            onClick={() => setSelectedClaim(c)}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-emerald-200 hover:shadow-md transition-all flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{c.foodName}</h3>
              <div className="flex gap-3 text-sm text-gray-500">
                <span>{c.quantity} {c.unit}</span>
                <span>•</span>
                <span className="truncate max-w-[200px]">{role === 'NGO' ? c.donorName : 'NGO Pickup'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge status={c.status} />
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- DETAIL VIEW ---
  const activeStep = getActiveStep(selectedClaim.status);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <button
        onClick={handleBackToList}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 mb-8 group transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to pickups
      </button>

      {actionState === 'error' && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4 shadow-sm">
          <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={22} />
          <div>
            <h4 className="text-red-900 font-bold text-base mb-1">Update failed</h4>
            <p className="text-red-700 text-sm">{actionError}</p>
          </div>
        </div>
      )}

      {actionState === 'success' && (
        <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4 shadow-sm">
          <CheckCircle className="text-emerald-600 mt-0.5 flex-shrink-0" size={22} />
          <div>
            <h4 className="text-emerald-900 font-bold text-base mb-1">Update successful</h4>
            <p className="text-emerald-700 text-sm">The pickup status has been successfully updated.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{selectedClaim.foodName}</h2>
                <p className="text-gray-500">{selectedClaim.quantity} {selectedClaim.unit}</p>
              </div>
              <StatusBadge status={selectedClaim.status} />
            </div>

            <div className="space-y-0">
              {timelineSteps.map((step, i) => {
                const isComplete = i <= activeStep;
                const isCurrent = i === activeStep;
                const isLast = i === timelineSteps.length - 1;

                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isComplete ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}>
                        {isComplete ? <CheckCircle size={16} /> : <Circle size={16} />}
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-16 ${isComplete && i < activeStep ? 'bg-emerald-300' : 'bg-gray-200'}`}></div>
                      )}
                    </div>
                    <div className="pb-8">
                      <h4 className={`font-semibold text-sm ${isComplete ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </h4>
                      <p className={`text-xs mt-0.5 ${isComplete ? 'text-gray-500' : 'text-gray-300'}`}>
                        {step.description}
                      </p>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Current step
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-emerald-600" />
              Pickup location
            </h3>
            <div className="w-full h-48 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                  <MapPin size={22} />
                </div>
                <p className="text-xs text-gray-500 font-medium">Map preview available after integration</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900">{selectedClaim.pickupAddress}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {role === 'NGO' && selectedClaim.donorName && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Building2 size={15} className="text-gray-400" />
                Donor
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100">
                  {selectedClaim.donorName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedClaim.donorName}</p>
                  <p className="text-xs text-gray-500 font-medium">Verified donor</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Timing</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1.5"><Clock size={13}/> Claimed</span>
                <span className="text-gray-900 font-medium">{new Date(selectedClaim.claimedAt).toLocaleDateString()}</span>
              </div>
              {selectedClaim.pickedUpAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><CheckCircle size={13}/> Picked up</span>
                  <span className="text-gray-900 font-medium">{new Date(selectedClaim.pickedUpAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {role === 'DONOR' && selectedClaim.status === 'CLAIMED' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              {!showConfirm ? (
                <>
                  <h3 className="font-semibold text-gray-900 mb-2">Ready for pickup?</h3>
                  <p className="text-sm text-gray-500 mb-5">Mark this as ready when the food is packaged and waiting.</p>
                  <Button onClick={() => setShowConfirm(true)} className="w-full shadow-emerald-500/20 shadow-lg">
                    Mark Ready for Pickup
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-gray-900 mb-2">Confirm status</h3>
                  <p className="text-sm text-gray-500 mb-5">The NGO will be notified to come collect the food.</p>
                  <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setShowConfirm(false)} className="flex-1" disabled={actionState === 'loading'}>Cancel</Button>
                    <Button onClick={handleAction} className="flex-1" isLoading={actionState === 'loading'}>Confirm</Button>
                  </div>
                </>
              )}
            </div>
          )}

          {role === 'NGO' && selectedClaim.status === 'READY_FOR_PICKUP' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              {!showConfirm ? (
                <>
                  <h3 className="font-semibold text-gray-900 mb-2">Collected food?</h3>
                  <p className="text-sm text-gray-500 mb-5">Confirm once you have successfully picked up the donation.</p>
                  <Button onClick={() => setShowConfirm(true)} className="w-full shadow-emerald-500/20 shadow-lg">
                    Confirm Pickup
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-gray-900 mb-2">Confirm collection</h3>
                  <p className="text-sm text-gray-500 mb-5">This marks the donation process as fully complete.</p>
                  <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setShowConfirm(false)} className="flex-1" disabled={actionState === 'loading'}>Cancel</Button>
                    <Button onClick={handleAction} className="flex-1" isLoading={actionState === 'loading'}>Confirm</Button>
                  </div>
                </>
              )}
            </div>
          )}

          {selectedClaim.status === 'PICKED_UP' && (
            <div className="bg-emerald-50 p-4 rounded-xl text-emerald-700 text-sm font-medium flex items-center justify-center gap-2">
              <CheckCircle size={16} /> Picked Up
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
