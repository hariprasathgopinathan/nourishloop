import React from 'react';
import { User, Mail, Phone, Building, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileView() {
  const { appProfile } = useAuth();

  if (!appProfile) return null;

  const isNgo = appProfile.role === 'NGO';

  return (
    <div className="max-w-3xl mx-auto pt-8">
      <div className="bg-white rounded-[24px] border border-brand-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className={`h-32 ${isNgo ? 'bg-brand-ngo/10' : 'bg-brand-donor/10'} relative`}>
          <div className="absolute -bottom-12 left-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-md ${isNgo ? 'bg-brand-ngo' : 'bg-brand-donor'}`}>
              {appProfile.name ? appProfile.name.substring(0, 2).toUpperCase() : 'U'}
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-brand-text mb-1">{appProfile.name}</h2>
              <p className="text-brand-text-muted font-medium">{isNgo ? 'NGO Account' : 'Donor Account'}</p>
            </div>
            {/* Future edit button could go here */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-[13px] font-bold text-brand-text-muted uppercase tracking-wider mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-neutral flex items-center justify-center text-brand-text-muted">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-brand-text-muted">Email</p>
                      <p className="text-[15px] font-medium text-brand-text">{appProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-neutral flex items-center justify-center text-brand-text-muted">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-brand-text-muted">Phone</p>
                      <p className="text-[15px] font-medium text-brand-text">{appProfile.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-[13px] font-bold text-brand-text-muted uppercase tracking-wider mb-4">Organization Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-neutral flex items-center justify-center text-brand-text-muted">
                      <Building size={18} />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-brand-text-muted">Organization Name</p>
                      <p className="text-[15px] font-medium text-brand-text">{appProfile.organizationName || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-neutral flex items-center justify-center text-brand-text-muted shrink-0 mt-1">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-brand-text-muted">Address</p>
                      <p className="text-[15px] font-medium text-brand-text">{appProfile.address || 'Not provided'}</p>
                      {appProfile.pincode && <p className="text-[14px] text-brand-text-muted mt-1">{appProfile.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
