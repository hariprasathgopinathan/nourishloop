import React from 'react';
import { MapPin, ArrowLeft, Clock, Building2, CheckCircle, Circle, Package } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';

const timelineSteps = [
  { key: 'claimed', label: 'Donation claimed', description: 'You reserved this food for pickup.' },
  { key: 'preparing', label: 'Preparing for pickup', description: 'The donor is preparing your order.' },
  { key: 'ready', label: 'Ready for pickup', description: 'Food is packaged and waiting for collection.' },
  { key: 'picked_up', label: 'Picked up', description: 'Your organization successfully collected the food.' },
];

function getActiveStep(status) {
  switch (status) {
    case 'CLAIMED': return 0;
    case 'READY_FOR_PICKUP': return 2;
    case 'PICKED_UP': return 3;
    default: return -1;
  }
}

export default function PickupTracking({ claim, onBack }) {
  if (!claim) {
    return (
      <div className="max-w-4xl mx-auto pb-12">
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">No active pickup</h3>
          <p className="text-gray-500">Select a claimed donation to track its pickup status.</p>
        </div>
      </div>
    );
  }

  const activeStep = getActiveStep(claim.status);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 mb-8 group transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to claims
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{claim.foodName}</h2>
                <p className="text-gray-500">{claim.quantity} {claim.unit} from {claim.donorName}</p>
              </div>
              <StatusBadge status={claim.status} />
            </div>

            {/* Visual Timeline */}
            <div className="space-y-0">
              {timelineSteps.map((step, i) => {
                const isComplete = i <= activeStep;
                const isCurrent = i === activeStep;
                const isLast = i === timelineSteps.length - 1;

                return (
                  <div key={step.key} className="flex gap-4">
                    {/* Indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isComplete
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}>
                        {isComplete ? <CheckCircle size={16} /> : <Circle size={16} />}
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-16 ${isComplete && i < activeStep ? 'bg-emerald-300' : 'bg-gray-200'}`}></div>
                      )}
                    </div>

                    {/* Content */}
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

          {/* Map Placeholder */}
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
              <p className="text-sm font-medium text-gray-900">{claim.pickupAddress}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Building2 size={15} className="text-gray-400" />
              Donor
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100">
                {claim.donorName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{claim.donorName}</p>
                <p className="text-xs text-gray-500 font-medium">Verified donor</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Timing</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1.5"><Clock size={13}/> Claimed</span>
                <span className="text-gray-900 font-medium">{new Date(claim.claimedAt).toLocaleDateString()}</span>
              </div>
              {claim.pickedUpAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><CheckCircle size={13}/> Picked up</span>
                  <span className="text-gray-900 font-medium">{new Date(claim.pickedUpAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {claim.status === 'READY_FOR_PICKUP' && (
            <Button className="w-full shadow-emerald-500/20 shadow-lg" size="lg">
              Confirm pickup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
