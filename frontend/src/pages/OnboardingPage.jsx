import React, { useState } from 'react';
import { Store, HeartHandshake, AlertCircle, CheckCircle2, Bell, LogOut, Check } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import LocationPicker from '../components/map/LocationPicker';

import { createProfile } from '../services/api';

export default function OnboardingPage({ onSuccess, onLogout }) {
  const { user, fetchProfile } = useAuth();
  const [role, setRole] = useState(null); // 'DONOR' or 'NGO'
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    organizationName: '',
    address: '',
    pincode: '',
    location: null
  });

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const getFieldError = (field) => {
    if (!touched[field]) return null;
    const value = formData[field];
    
    if (field === 'location') {
      if (role === 'NGO') {
        if (!value) return 'Please set your organization location on the map';
        if (!Number.isFinite(value.latitude) || !Number.isFinite(value.longitude)) return 'Invalid location coordinates';
      }
      return null;
    }

    if (!value || typeof value !== 'string' || !value.trim()) return 'This field is required';
    if (field === 'phone' && !/^\+?[\d\s-]{10,}$/.test(value)) return 'Please enter a valid phone number';
    if (field === 'pincode' && !/^[\d\w\s-]{4,}$/.test(value)) return 'Please enter a valid pincode';
    return null;
  };

  const isFormValid = () => {
    return role &&
      formData.name.trim() &&
      formData.phone.trim() &&
      !getFieldError('phone') &&
      formData.organizationName.trim() &&
      formData.address.trim() &&
      formData.pincode.trim() &&
      !getFieldError('pincode') &&
      (role === 'DONOR' || (role === 'NGO' && formData.location && !getFieldError('location')));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true, phone: true, organizationName: true, address: true, pincode: true, location: true
    });

    if (!role) {
      setError("Please select a role to continue.");
      return;
    }

    if (!isFormValid()) {
      setError("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      role,
      organizationName: formData.organizationName.trim(),
      address: formData.address.trim(),
      pincode: formData.pincode.trim(),
      latitude: formData.location ? formData.location.latitude : undefined,
      longitude: formData.location ? formData.location.longitude : undefined
    };

    try {
      await createProfile(payload);

      setSuccess(true);
      setTimeout(async () => {
        await fetchProfile();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      if (err.status === 409) {
        try {
          setSuccess(true);
          setTimeout(async () => {
            await fetchProfile();
            if (onSuccess) onSuccess();
          }, 1500);
          return;
        } catch {
          setError("Profile already exists but could not be loaded. Please reload.");
        }
      } else if (err.status === 401) {
        setError("Authentication required. Please sign in again.");
      } else if (err.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(err.message || "Failed to create profile. Please check your information.");
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-brand-donor-light rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={32} className="text-brand-donor" />
        </div>
        <h2 className="text-[24px] font-bold text-brand-text mb-2 tracking-tight">Profile Created!</h2>
        <p className="text-brand-text-muted text-[14px]">Your organization is ready to start making an impact.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col font-sans">
      {/* Header */}
      <header className="px-6 py-4 border-b border-brand-border bg-brand-surface sticky top-0 z-10 flex justify-between items-center h-[72px]">
        <Logo className="h-8 w-auto mix-blend-multiply" />
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer">
            <Bell size={20} className="text-brand-text-muted hover:text-brand-text transition-colors" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-[12px] font-semibold hover:bg-red-100 transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row justify-center gap-16">
          <div className="flex-1 max-w-[640px] mx-auto">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-[8px] flex items-start gap-3 text-red-700 text-[13px] animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Role Selection */}
              <section>
                <div className="mb-4">
                  <h2 className="text-[20px] font-bold text-brand-text mb-1">Choose Your Role</h2>
                  <p className="text-[14px] text-brand-text-muted">Select how you will participate in NourishLoop.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('DONOR')}
                    disabled={loading}
                    className={`relative flex flex-col p-5 rounded-[12px] border text-left transition-all duration-200 ${
                      role === 'DONOR'
                        ? 'border-brand-donor bg-brand-donor-light'
                        : 'border-brand-border bg-brand-surface hover:border-brand-donor/40'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${role === 'DONOR' ? 'bg-brand-donor text-white' : 'bg-brand-surface border border-brand-border text-brand-text-muted'}`}>
                      <Store size={20} />
                    </div>
                    <h3 className={`text-[15px] font-bold mb-1.5 ${role === 'DONOR' ? 'text-brand-text' : 'text-brand-text'}`}>Donor</h3>
                    <p className={`text-[13px] leading-relaxed ${role === 'DONOR' ? 'text-brand-donor' : 'text-brand-text-muted'}`}>
                      Restaurants, grocery stores, hotels, bakeries, caterers and other food providers.
                    </p>
                    {role === 'DONOR' && (
                      <div className="absolute top-4 right-4 text-brand-donor">
                        <CheckCircle2 size={20} className="fill-white" />
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('NGO')}
                    disabled={loading}
                    className={`relative flex flex-col p-5 rounded-[12px] border text-left transition-all duration-200 ${
                      role === 'NGO'
                        ? 'border-brand-ngo bg-brand-ngo-light'
                        : 'border-brand-border bg-brand-surface hover:border-brand-ngo/40'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${role === 'NGO' ? 'bg-brand-ngo text-white' : 'bg-brand-surface border border-brand-border text-brand-text-muted'}`}>
                      <HeartHandshake size={20} />
                    </div>
                    <h3 className={`text-[15px] font-bold mb-1.5 ${role === 'NGO' ? 'text-brand-text' : 'text-brand-text'}`}>NGO</h3>
                    <p className={`text-[13px] leading-relaxed ${role === 'NGO' ? 'text-brand-ngo' : 'text-brand-text-muted'}`}>
                      NGOs, shelters, community organizations and other food recipients.
                    </p>
                    {role === 'NGO' && (
                      <div className="absolute top-4 right-4 text-brand-ngo">
                        <CheckCircle2 size={20} className="fill-white" />
                      </div>
                    )}
                  </button>
                </div>
              </section>

              {/* Personal & Org Details Combined visually as one flowing form like the reference */}
              <section className={`transition-all duration-500 ${role ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale-[0.5]'}`}>
                <div className="mb-4">
                  <h2 className="text-[20px] font-bold text-brand-text">Organization Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div>
                    <label className="block text-[13px] font-medium text-brand-text mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      disabled={loading}
                      className={`w-full px-3.5 py-2.5 bg-brand-surface border rounded-[8px] text-[13px] focus:outline-none focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all ${getFieldError('name') ? 'border-red-300' : 'border-brand-border'}`}
                      placeholder="Jane Doe"
                    />
                    {getFieldError('name') && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{getFieldError('name')}</p>}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-brand-text mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      disabled={loading}
                      className={`w-full px-3.5 py-2.5 bg-brand-surface border rounded-[8px] text-[13px] focus:outline-none focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all ${getFieldError('phone') ? 'border-red-300' : 'border-brand-border'}`}
                      placeholder="+91 98765 43210"
                    />
                    {getFieldError('phone') && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{getFieldError('phone')}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-medium text-brand-text mb-1.5">Organization Name</label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => handleChange('organizationName', e.target.value)}
                      onBlur={() => handleBlur('organizationName')}
                      disabled={loading}
                      className={`w-full px-3.5 py-2.5 bg-brand-surface border rounded-[8px] text-[13px] focus:outline-none focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all ${getFieldError('organizationName') ? 'border-red-300' : 'border-brand-border'}`}
                      placeholder="e.g. Green Valley Kitchen"
                    />
                    {getFieldError('organizationName') && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{getFieldError('organizationName')}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-medium text-brand-text mb-1.5">Full Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      disabled={loading}
                      className={`w-full px-3.5 py-2.5 bg-brand-surface border rounded-[8px] text-[13px] focus:outline-none focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all ${getFieldError('address') ? 'border-red-300' : 'border-brand-border'}`}
                      placeholder="Street, area, landmark..."
                    />
                    {getFieldError('address') && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{getFieldError('address')}</p>}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[13px] font-medium text-brand-text mb-1.5">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                      onBlur={() => handleBlur('pincode')}
                      disabled={loading}
                      className={`w-full px-3.5 py-2.5 bg-brand-surface border rounded-[8px] text-[13px] focus:outline-none focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all ${getFieldError('pincode') ? 'border-red-300' : 'border-brand-border'}`}
                      placeholder="e.g. 600001"
                    />
                    {getFieldError('pincode') && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{getFieldError('pincode')}</p>}
                  </div>
                </div>

                {role === 'NGO' && (
                  <div className="mt-6">
                    <label className="block text-[13px] font-medium text-brand-text mb-1.5">Organization Location</label>
                    <div className="rounded-[8px] overflow-hidden border border-brand-border h-[200px]">
                      <LocationPicker
                        value={formData.location}
                        onChange={(loc) => {
                          handleChange('location', loc);
                        }}
                        disabled={loading}
                      />
                    </div>
                    {getFieldError('location') && (
                      <p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {getFieldError('location')}
                      </p>
                    )}
                  </div>
                )}
              </section>

              <div className="pt-8 flex flex-row items-center justify-end border-t border-brand-border">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  disabled={loading}
                  className="px-10 py-2.5 rounded-[8px] text-[14px] font-semibold bg-brand-donor"
                >
                  Create Profile
                </Button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
