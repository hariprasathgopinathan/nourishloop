import React, { useState } from 'react';
import { Store, HeartHandshake, AlertCircle, CheckCircle2, Building, MapPin, Hash, User, Phone, Mail } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

import { createProfile } from '../services/api';

export default function OnboardingPage({ onSuccess, onLogout }) {
  const { user, fetchProfile } = useAuth();
  const [role, setRole] = useState(null); // 'DONOR' or 'NGO'
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    organizationName: '',
    address: '',
    pincode: ''
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
    if (!value.trim()) return 'This field is required';
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
      !getFieldError('pincode');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true, phone: true, organizationName: true, address: true, pincode: true
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
      pincode: formData.pincode.trim()
    };

    try {
      await createProfile(payload);
      
      // Update AuthContext application profile
      await fetchProfile();
      
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess(role);
      }, 1500);
    } catch (err) {
      if (err.status === 409) {
        // Handle race condition / already existing profile
        try {
          const fetchedProfile = await fetchProfile();
          if (fetchedProfile) {
            setSuccess(true);
            setTimeout(() => {
              if (onSuccess) onSuccess(fetchedProfile.role);
            }, 1500);
            return;
          }
        } catch (refreshErr) {
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
      <div className="min-h-screen bg-[#FDFDFC] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-50">
          <CheckCircle2 size={48} className="text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Profile Created!</h2>
        <p className="text-gray-500 max-w-sm text-lg">Your organization is ready to start making an impact.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFC] flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10 flex justify-between items-center">
        <Logo compact />
        <button 
          onClick={onLogout}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 lg:p-12 mb-12">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Complete your profile</h1>
          <p className="text-gray-500 text-base sm:text-lg">
            We need a few details about you and your organization to get started on the platform.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1: Basic Info */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Personal Details</h2>
              <p className="text-sm text-gray-500">Your primary contact information.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    disabled 
                    value={user?.email || "you@example.com"} 
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">Linked to your secure Firebase account.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    disabled={loading}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${getFieldError('name') ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'}`}
                    placeholder="Jane Doe"
                  />
                </div>
                {getFieldError('name') && <p className="mt-1.5 text-xs text-red-500 font-medium animate-in fade-in">{getFieldError('name')}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    disabled={loading}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${getFieldError('phone') ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'}`}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {getFieldError('phone') && <p className="mt-1.5 text-xs text-red-500 font-medium animate-in fade-in">{getFieldError('phone')}</p>}
              </div>
            </div>
          </section>

          {/* Section 2: Role Selection */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Organization Type</h2>
              <p className="text-sm text-gray-500">How will you participate in the network?</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('DONOR')}
                disabled={loading}
                className={`relative flex flex-col p-6 rounded-3xl border-2 text-left transition-all duration-200 ${
                  role === 'DONOR' 
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100' 
                    : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-gray-50 shadow-sm'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${role === 'DONOR' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
                  <Store size={24} />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${role === 'DONOR' ? 'text-emerald-900' : 'text-gray-900'}`}>Donor</h3>
                <p className={`text-sm leading-relaxed ${role === 'DONOR' ? 'text-emerald-700/80' : 'text-gray-500'}`}>
                  Restaurants, grocery stores, hotels, bakeries, caterers, and other food providers.
                </p>
                {role === 'DONOR' && (
                  <div className="absolute top-5 right-5 text-emerald-500 animate-in zoom-in duration-200">
                    <CheckCircle2 size={24} className="fill-emerald-100" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setRole('NGO')}
                disabled={loading}
                className={`relative flex flex-col p-6 rounded-3xl border-2 text-left transition-all duration-200 ${
                  role === 'NGO' 
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100' 
                    : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-gray-50 shadow-sm'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${role === 'NGO' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
                  <HeartHandshake size={24} />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${role === 'NGO' ? 'text-emerald-900' : 'text-gray-900'}`}>NGO</h3>
                <p className={`text-sm leading-relaxed ${role === 'NGO' ? 'text-emerald-700/80' : 'text-gray-500'}`}>
                  NGOs, shelters, community organizations, and other food recipients.
                </p>
                {role === 'NGO' && (
                  <div className="absolute top-5 right-5 text-emerald-500 animate-in zoom-in duration-200">
                    <CheckCircle2 size={24} className="fill-emerald-100" />
                  </div>
                )}
              </button>
            </div>
            
            {role && (
              <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600 animate-in fade-in slide-in-from-top-2 flex items-start gap-3">
                <AlertCircle size={18} className="flex-shrink-0 text-gray-400 mt-0.5" />
                <p>
                  {role === 'DONOR' 
                    ? "Your profile will represent the organization providing surplus food." 
                    : "Your profile will represent the organization receiving and distributing food."}
                </p>
              </div>
            )}
          </section>

          {/* Section 3: Org Details */}
          <section className={`transition-all duration-500 ${role ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale-[0.5]'} bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm`}>
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Building size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Organization Details</h2>
                <p className="text-sm text-gray-500">
                  {role === 'DONOR' ? 'Where will pickups happen?' : role === 'NGO' ? 'Where is your primary location?' : 'Location and identity.'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Building size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={formData.organizationName}
                    onChange={(e) => handleChange('organizationName', e.target.value)}
                    onBlur={() => handleBlur('organizationName')}
                    disabled={loading}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${getFieldError('organizationName') ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'}`}
                    placeholder={role === 'DONOR' ? "e.g. Bella's Bakery" : "e.g. City Hope Shelter"}
                  />
                </div>
                {getFieldError('organizationName') && <p className="mt-1.5 text-xs text-red-500 font-medium animate-in fade-in">{getFieldError('organizationName')}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address</label>
                <div className="relative">
                  <div className="absolute top-3 left-4 pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <textarea 
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    disabled={loading}
                    rows={3}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none ${getFieldError('address') ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'}`}
                    placeholder="Street address, building, unit..."
                  />
                </div>
                {getFieldError('address') && <p className="mt-1.5 text-xs text-red-500 font-medium animate-in fade-in">{getFieldError('address')}</p>}
              </div>

              <div className="sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode / Postal Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Hash size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    onBlur={() => handleBlur('pincode')}
                    disabled={loading}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${getFieldError('pincode') ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'}`}
                    placeholder="12345"
                  />
                </div>
                {getFieldError('pincode') && <p className="mt-1.5 text-xs text-red-500 font-medium animate-in fade-in">{getFieldError('pincode')}</p>}
              </div>
            </div>
          </section>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              By creating this profile, you agree to our platform guidelines.
            </p>
            <Button 
              type="submit" 
              isLoading={loading} 
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 shadow-emerald-500/20 shadow-lg text-base"
            >
              Create Profile
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
