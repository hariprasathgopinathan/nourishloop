import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, ArrowLeft, Clock, Building2, CheckCircle, Circle, Package, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import { markReadyForPickup, markPickedUp, getMyClaims, getDonationRoute } from '../../services/api';
import MapView from '../map/MapView';

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
  const isNgo = role === 'NGO';

  // Theme variables based on role
  const theme = {
    text: isNgo ? 'text-brand-ngo' : 'text-brand-donor',
    textDark: isNgo ? 'text-brand-text' : 'text-brand-text',
    bg: isNgo ? 'bg-brand-ngo-light' : 'bg-brand-donor-light',
    bgSolid: isNgo ? 'bg-brand-ngo text-white' : 'bg-brand-donor text-white',
    border: isNgo ? 'border-brand-ngo/20' : 'border-brand-donor/20',
    ring: isNgo ? 'ring-brand-ngo/20' : 'ring-brand-donor/20',
    hoverText: isNgo ? 'hover:text-brand-ngo' : 'hover:text-brand-donor',
    hoverBorder: isNgo ? 'hover:border-brand-ngo/30' : 'hover:border-brand-donor/30',
    ping: isNgo ? 'bg-brand-ngo/70' : 'bg-brand-donor/70',
    dot: isNgo ? 'bg-brand-ngo' : 'bg-brand-donor',
    buttonClass: isNgo ? 'bg-brand-ngo hover:bg-brand-ngo-hover text-white' : 'bg-brand-donor hover:bg-brand-donor-hover text-white',
  };

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claimsList, setClaimsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Action state
  const [actionState, setActionState] = useState('idle');
  const [actionError, setActionError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Route state
  const [routeData, setRouteData] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState(null);

  useEffect(() => {
    if (selectedClaim && role === 'NGO') {
      const fetchRoute = async () => {
        setRouteLoading(true);
        setRouteError(null);
        setRouteData(null);
        try {
          const res = await getDonationRoute(selectedClaim._id);
          setRouteData(res.data);
        } catch (err) {
          const msg = err.message || '';
          if (msg.includes('NGO location is not set')) {
            setRouteError('Set your organization location to calculate a route.');
          } else if (msg.includes('Donation location is unavailable')) {
            setRouteError('Pickup location is unavailable.');
          } else if (msg.includes('No route') || err.status === 404) {
            setRouteError('No drivable route could be found.');
          } else {
            setRouteError('Route service is temporarily unavailable.');
          }
        } finally {
          setRouteLoading(false);
        }
      };
      fetchRoute();
    }
  }, [selectedClaim, role]);

  const fetchNgoClaims = useCallback(async () => {
    try {
      const res = await getMyClaims();
      setClaimsList((res.data || []).filter(d => ['CLAIMED', 'READY_FOR_PICKUP', 'PICKED_UP'].includes(d.status)));
    } catch (err) {
      setError(err.message || 'Unable to load pickups.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === 'DONOR' && initialDonations) {
      Promise.resolve().then(() => {
        setClaimsList(initialDonations.filter(d => ['CLAIMED', 'READY_FOR_PICKUP', 'PICKED_UP'].includes(d.status)));
      });
    } else if (role === 'NGO') {
      Promise.resolve().then(() => {
        setLoading(true);
        setError(null);
        fetchNgoClaims();
      });
    }
  }, [role, initialDonations, fetchNgoClaims]);

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

    const updatedClaim = { ...selectedClaim, ...updatedData };
    setSelectedClaim(updatedClaim);
    setClaimsList(prev => prev.map(c => c._id === updatedClaim._id ? updatedClaim : c));

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
        <Loader2 className={`animate-spin h-10 w-10 ${theme.text} mb-4`} />
        <p className="text-[14px] text-brand-text-muted font-bold">Loading active pickups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[800px] mx-auto pt-12">
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-8 text-center text-red-700 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
          <AlertCircle className="mx-auto mb-4" size={32} />
          <h3 className="font-bold text-[16px] mb-2">Error Loading Pickups</h3>
          <p className="text-[13px]">{error}</p>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  if (!selectedClaim) {
    if (claimsList.length === 0) {
      return (
        <div className="max-w-[800px] mx-auto pb-12">
          <div className="bg-brand-surface border border-brand-border rounded-[12px] p-16 text-center shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
            <div className="w-[48px] h-[48px] bg-brand-neutral text-gray-400 rounded-[12px] flex items-center justify-center mx-auto mb-4 border border-brand-border">
              <Package size={24} />
            </div>
            <h3 className="text-[16px] font-bold text-brand-text mb-1 tracking-tight">No active pickups</h3>
            <p className="text-[13px] text-brand-text-muted mb-6">There are no donations currently in progress for pickup.</p>
            {onBack && (
              <Button onClick={onBack} variant="ghost" className="text-[13px] font-bold">Go back</Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-[800px] mx-auto pb-12 space-y-4">
        {onBack && (
          <button onClick={onBack} className={`flex items-center gap-1.5 text-[13px] font-bold text-brand-text-muted ${theme.hoverText} mb-4 transition-colors`}>
            <ArrowLeft size={16} /> Back
          </button>
        )}
        <h2 className="text-[24px] font-bold text-brand-text mb-6">Active Pickups</h2>
        <div className="space-y-3">
          {claimsList.map(c => (
            <div
              key={c._id}
              onClick={() => setSelectedClaim(c)}
              className={`bg-brand-surface p-4 rounded-[12px] border border-brand-border shadow-[0_2px_8px_rgba(15,23,42,0.02)] cursor-pointer ${theme.hoverBorder} hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
            >
              <div>
                <h3 className="font-bold text-[15px] text-brand-text mb-1 truncate">{c.foodName}</h3>
                <div className="flex gap-2 text-[12px] text-brand-text-muted font-medium">
                  <span>{c.quantity} {c.unit}</span>
                  <span>•</span>
                  <span className="truncate max-w-[200px]">{role === 'NGO' ? c.donorName : 'NGO Pickup'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <StatusBadge status={c.status} />
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- DETAIL VIEW ---
  const activeStep = getActiveStep(selectedClaim.status);

  return (
    <div className="max-w-[1000px] mx-auto pb-12">
      <button
        onClick={handleBackToList}
        className={`flex items-center gap-1.5 text-[13px] font-bold text-brand-text-muted ${theme.hoverText} mb-6 group transition-colors`}
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to pickups
      </button>

      {actionState === 'error' && (
        <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-[12px] flex items-start gap-4 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
          <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={20} />
          <div>
            <h4 className="text-red-700 font-bold text-[14px] mb-1">Update failed</h4>
            <p className="text-red-600 text-[13px]">{actionError}</p>
          </div>
        </div>
      )}

      {actionState === 'success' && (
        <div className={`mb-6 p-5 ${theme.bg} border ${theme.border} rounded-[12px] flex items-start gap-4 shadow-[0_2px_8px_rgba(15,23,42,0.02)]`}>
          <CheckCircle className={`${theme.text} mt-0.5 shrink-0`} size={20} />
          <div>
            <h4 className={`${theme.textDark} font-bold text-[14px] mb-1`}>Update successful</h4>
            <p className={`${theme.textDark} text-[13px]`}>The pickup status has been successfully updated.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Timeline */}
        <div className="flex-1 lg:w-2/3 space-y-6">
          <div className="bg-brand-surface p-6 sm:p-8 rounded-[16px] border border-brand-border shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-brand-border">
              <div>
                <h2 className="text-[20px] font-bold text-brand-text tracking-tight mb-1">{selectedClaim.foodName}</h2>
                <p className="text-[13px] text-brand-text-muted font-medium">{selectedClaim.quantity} {selectedClaim.unit}</p>
              </div>
              <StatusBadge status={selectedClaim.status} />
            </div>

            <div className="space-y-0 pl-2">
              {timelineSteps.map((step, i) => {
                const isComplete = i <= activeStep;
                const isCurrent = i === activeStep;
                const isLast = i === timelineSteps.length - 1;

                return (
                  <div key={step.key} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isComplete ? theme.bgSolid : 'bg-gray-100 text-gray-400 border border-brand-border'
                      } ${isCurrent ? `ring-4 ${theme.ring}` : ''}`}>
                        {isComplete ? <CheckCircle size={14} /> : <Circle size={14} />}
                      </div>
                      {!isLast && (
                        <div className={`w-[2px] h-[40px] ${isComplete && i < activeStep ? theme.dot : 'bg-brand-border'}`}></div>
                      )}
                    </div>
                    <div className="pb-6">
                      <h4 className={`font-bold text-[14px] ${isComplete ? 'text-brand-text' : 'text-gray-400'}`}>
                        {step.label}
                      </h4>
                      <p className={`text-[12px] mt-0.5 ${isComplete ? 'text-brand-text-muted' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                      {isCurrent && (
                        <span className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-[4px] ${theme.bg} ${theme.textDark} border border-brand-border text-[11px] font-bold`}>
                          <span className="relative flex h-1.5 w-1.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.ping}`}></span>
                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${theme.dot}`}></span>
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

          <div className="bg-brand-surface p-6 sm:p-8 rounded-[16px] border border-brand-border shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
            <h3 className="text-[16px] font-bold text-brand-text tracking-tight mb-5 flex items-center gap-2">
              <MapPin size={16} className={theme.text} />
              Pickup location
            </h3>

            {role === 'DONOR' && (
              <div className="w-full h-[200px] rounded-[12px] bg-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden mb-5">
                {selectedClaim.longitude && selectedClaim.latitude ? (
                  <MapView 
                    height="100%" 
                    interactive={false}
                    center={[selectedClaim.longitude, selectedClaim.latitude]}
                    zoom={14}
                    marker={{ lng: selectedClaim.longitude, lat: selectedClaim.latitude }}
                  />
                ) : (
                  <div className="flex flex-col items-center text-center p-4">
                    <MapPin className="h-[32px] w-[32px] text-gray-400 mb-2" />
                    <p className="text-[13px] text-gray-500 font-bold">Location coordinates unavailable</p>
                  </div>
                )}
              </div>
            )}

            {role === 'NGO' && (
              <div className="w-full h-[240px] rounded-[12px] bg-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden mb-5">
                {routeLoading && (
                  <div className="flex flex-col items-center text-center">
                    <Loader2 className={`animate-spin h-[32px] w-[32px] ${theme.text} mb-2`} />
                    <p className="text-[13px] text-gray-500 font-bold">Calculating pickup route...</p>
                  </div>
                )}
                {routeError && !routeLoading && (
                  <>
                    {selectedClaim.longitude && selectedClaim.latitude ? (
                      <MapView 
                        height="100%" 
                        interactive={false}
                        center={[selectedClaim.longitude, selectedClaim.latitude]}
                        zoom={14}
                        marker={{ lng: selectedClaim.longitude, lat: selectedClaim.latitude }}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-center p-4">
                        <AlertCircle className="h-[32px] w-[32px] text-red-500 mb-2" />
                        <p className="text-[13px] text-gray-600 font-bold">{routeError}</p>
                      </div>
                    )}
                    {selectedClaim.longitude && selectedClaim.latitude && (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-red-200 rounded-[8px] px-3 py-2 flex items-center gap-2 shadow-sm z-10 max-w-[90%]">
                        <AlertCircle className="text-red-500 shrink-0" size={14} />
                        <p className="text-[12px] text-gray-700 font-bold truncate">{routeError}</p>
                      </div>
                    )}
                  </>
                )}
                {routeData && !routeLoading && (
                  <MapView
                    height="100%"
                    interactive={true}
                    route={routeData.geometry}
                    fitBounds={(() => {
                      if (!routeData.geometry?.coordinates) return null;
                      let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
                      routeData.geometry.coordinates.forEach(([lng, lat]) => {
                        if (lng < minLng) minLng = lng;
                        if (lng > maxLng) maxLng = lng;
                        if (lat < minLat) minLat = lat;
                        if (lat > maxLat) maxLat = lat;
                      });
                      return [[minLng, minLat], [maxLng, maxLat]];
                    })()}
                    markers={[
                      {
                        lng: routeData.geometry.coordinates[0][0],
                        lat: routeData.geometry.coordinates[0][1],
                        id: 'ngo-origin',
                        color: '#0D7A70'
                      },
                      {
                        lng: routeData.geometry.coordinates[routeData.geometry.coordinates.length - 1][0],
                        lat: routeData.geometry.coordinates[routeData.geometry.coordinates.length - 1][1],
                        id: 'donation-dest',
                        color: '#138A53'
                      }
                    ]}
                  />
                )}
              </div>
            )}

            {role === 'NGO' && routeData && (
              <div className={`flex gap-8 mb-5 p-4 ${theme.bg} rounded-[12px] border ${theme.border}`}>
                <div>
                  <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Distance</p>
                  <p className={`text-[15px] font-bold ${theme.textDark}`}>{routeData.distanceKm} km</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Est. Travel Time</p>
                  <p className={`text-[15px] font-bold ${theme.textDark}`}>{routeData.durationMinutes} min</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-[13px] font-medium text-brand-text leading-relaxed">{selectedClaim.pickupAddress}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:w-1/3 space-y-6">
          {role === 'NGO' && selectedClaim.donorName && (
            <div className="bg-brand-surface p-5 rounded-[16px] border border-brand-border shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
              <h3 className="text-[13px] font-bold text-brand-text-muted mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Building2 size={14} className="text-gray-400" />
                Donor
              </h3>
              <div className="flex items-center gap-3">
                <div className={`w-[40px] h-[40px] rounded-[10px] ${theme.bg} ${theme.text} flex items-center justify-center font-bold text-[14px] border ${theme.border}`}>
                  {selectedClaim.donorName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[14px] text-brand-text">{selectedClaim.donorName}</p>
                  <p className="text-[12px] text-brand-text-muted font-medium flex items-center gap-1">
                    <CheckCircle size={12} className={theme.text} /> Verified donor
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-brand-surface p-5 rounded-[16px] border border-brand-border shadow-[0_2px_12px_rgba(15,23,42,0.02)] space-y-4">
            <h3 className="text-[13px] font-bold text-brand-text-muted mb-2 uppercase tracking-wider">Timing</h3>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-brand-text-muted font-bold flex items-center gap-1.5"><Clock size={14}/> Claimed</span>
                <span className="text-brand-text font-bold">{new Date(selectedClaim.claimedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              {selectedClaim.pickedUpAt && (
                <div className="flex justify-between">
                  <span className="text-brand-text-muted font-bold flex items-center gap-1.5"><CheckCircle size={14}/> Picked up</span>
                  <span className="text-brand-text font-bold">{new Date(selectedClaim.pickedUpAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {role === 'DONOR' && selectedClaim.status === 'CLAIMED' && (
            <div className="bg-brand-surface p-5 rounded-[16px] border border-brand-border shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
              {!showConfirm ? (
                <>
                  <h3 className="font-bold text-[15px] text-brand-text mb-1.5">Ready for pickup?</h3>
                  <p className="text-[13px] text-brand-text-muted mb-5 leading-snug">Mark this as ready when the food is packaged and waiting.</p>
                  <Button onClick={() => setShowConfirm(true)} className={`w-full py-2.5 rounded-[8px] font-bold text-[13px] ${theme.buttonClass}`}>
                    Mark Ready for Pickup
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-[15px] text-brand-text mb-1.5">Confirm status</h3>
                  <p className="text-[13px] text-brand-text-muted mb-4 leading-snug">The NGO will be notified to come collect the food.</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setShowConfirm(false)} className="flex-1 py-2 text-[13px] font-bold" disabled={actionState === 'loading'}>Cancel</Button>
                    <Button onClick={handleAction} className={`flex-1 py-2 rounded-[8px] text-[13px] font-bold ${theme.buttonClass}`} isLoading={actionState === 'loading'}>Confirm</Button>
                  </div>
                </>
              )}
            </div>
          )}

          {role === 'NGO' && selectedClaim.status === 'READY_FOR_PICKUP' && (
            <div className="bg-brand-surface p-5 rounded-[16px] border border-brand-border shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
              {!showConfirm ? (
                <>
                  <h3 className="font-bold text-[15px] text-brand-text mb-1.5">Collected food?</h3>
                  <p className="text-[13px] text-brand-text-muted mb-5 leading-snug">Confirm once you have successfully picked up the donation.</p>
                  <Button onClick={() => setShowConfirm(true)} className={`w-full py-2.5 rounded-[8px] font-bold text-[13px] ${theme.buttonClass}`}>
                    Confirm Pickup
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-[15px] text-brand-text mb-1.5">Confirm collection</h3>
                  <p className="text-[13px] text-brand-text-muted mb-4 leading-snug">This marks the donation process as fully complete.</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setShowConfirm(false)} className="flex-1 py-2 text-[13px] font-bold" disabled={actionState === 'loading'}>Cancel</Button>
                    <Button onClick={handleAction} className={`flex-1 py-2 rounded-[8px] text-[13px] font-bold ${theme.buttonClass}`} isLoading={actionState === 'loading'}>Confirm</Button>
                  </div>
                </>
              )}
            </div>
          )}

          {selectedClaim.status === 'PICKED_UP' && (
            <div className={`${theme.bg} p-4 rounded-[12px] ${theme.textDark} text-[13px] font-bold flex items-center justify-center gap-2 border border-brand-border`}>
              <CheckCircle size={16} className={theme.text} /> Picked Up
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
