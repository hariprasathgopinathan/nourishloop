import React, { useState, useEffect } from 'react';
import { Shield, Loader2, MapPin, Globe, LayoutTemplate } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SettingsView() {
  const { changePassword, appProfile } = useAuth();
  
  // Search Preferences
  const [defaultRadius, setDefaultRadius] = useState(() => {
    return parseInt(localStorage.getItem('defaultSearchRadius') || '10', 10);
  });
  
  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleRadiusChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setDefaultRadius(value);
    localStorage.setItem('defaultSearchRadius', value.toString());
    window.dispatchEvent(new Event('radius-changed'));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');
    
    try {
      await changePassword(newPassword);
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setTimeout(() => setShowPasswordForm(false), 2000);
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setPasswordError('For security reasons, please log out and log back in to change your password.');
      } else {
        setPasswordError(err.message || 'Failed to update password.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-8">
      <div className="bg-white rounded-[24px] border border-brand-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="p-8 border-b border-brand-border">
          <h2 className="text-2xl font-bold text-brand-text mb-1">Settings</h2>
          <p className="text-brand-text-muted font-medium">Manage your preferences and account settings</p>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Search Preferences (Only relevant for NGOs / those who search for donations) */}
          {appProfile?.role === 'NGO' && (
            <>
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-brand-text">Search Preferences</h3>
                </div>
                
                <div className="space-y-4 ml-13">
                  <div className="p-6 rounded-xl border border-brand-border bg-brand-surface">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold text-brand-text">Default Search Radius</p>
                        <p className="text-[13px] text-brand-text-muted mt-1">Set the default distance to search for nearby donations.</p>
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                        {defaultRadius} km
                      </div>
                    </div>
                    
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      step="1"
                      value={defaultRadius}
                      onChange={handleRadiusChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-brand-text-muted mt-2 font-medium">
                      <span>1 km</span>
                      <span>50 km</span>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-brand-border" />
            </>
          )}

          {/* Privacy & Security */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <Shield size={20} />
              </div>
              <h3 className="text-lg font-bold text-brand-text">Privacy & Security</h3>
            </div>
            
            <div className="space-y-4 ml-13">
              <div className="rounded-xl border border-brand-border bg-brand-surface overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="w-full text-left p-4 hover:bg-brand-neutral transition-colors flex items-center justify-between group"
                >
                  <div>
                    <p className="font-semibold text-brand-text">Change Password</p>
                    <p className="text-[13px] text-brand-text-muted mt-1">Update your login credentials</p>
                  </div>
                  <div className="text-brand-text-muted group-hover:text-brand-text transition-colors">
                    {showPasswordForm ? '↓' : '→'}
                  </div>
                </button>
                
                {showPasswordForm && (
                  <div className="p-4 border-t border-brand-border bg-white animate-in fade-in slide-in-from-top-2">
                    <form onSubmit={handlePasswordSubmit} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input 
                          type="password" 
                          placeholder="Enter new password" 
                          className="w-full h-11 px-4 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-donor/20 focus:border-brand-donor bg-brand-neutral/30 transition-all text-[15px]"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {passwordError && <p className="text-red-500 text-xs mt-2 ml-1">{passwordError}</p>}
                        {passwordSuccess && <p className="text-emerald-500 text-xs mt-2 ml-1">{passwordSuccess}</p>}
                      </div>
                      <button 
                        type="submit" 
                        disabled={passwordLoading}
                        className="h-11 px-6 rounded-xl font-bold bg-brand-donor text-white hover:bg-emerald-600 transition-colors flex items-center justify-center min-w-[100px] shadow-sm disabled:opacity-70"
                      >
                        {passwordLoading ? <Loader2 size={18} className="animate-spin" /> : 'Save'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
