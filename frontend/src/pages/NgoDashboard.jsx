import React, { useState, useEffect, useCallback } from 'react';
import AppSidebar from '../components/layout/AppSidebar';
import AppNavbar from '../components/layout/AppNavbar';
import NgoOverview from '../components/dashboard/NgoOverview';
import FindDonations from '../components/donations/FindDonations';
import DonationDetail from '../components/donations/DonationDetail';
import MyClaims from '../components/claims/MyClaims';
import PickupTracking from '../components/pickup/PickupTracking';
import NgoImpact from '../components/impact/NgoImpact';
import EmptyState from '../components/ui/EmptyState';
import { LayoutDashboard, Search, HandHeart, MapPin, BarChart2, Bell, User, Settings, HelpCircle, Loader2 } from 'lucide-react';
import { mockClaims, mockNgoStats, mockNgoProfile } from '../data/ngoMockData';
import { getNearbyDonations, updateProfileLocation } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LocationPicker from '../components/map/LocationPicker';
import Button from '../components/ui/Button';
import NotificationsList from '../components/notifications/NotificationsList';
import { useNotification } from '../context/NotificationContext';

const mainNav = [
  { label: 'Overview', icon: LayoutDashboard, id: 'overview' },
  { label: 'Find Donations', icon: Search, id: 'find' },
  { label: 'My Claims', icon: HandHeart, id: 'claims' },
  { label: 'Pickup Tracking', icon: MapPin, id: 'tracking' },
  { label: 'Impact', icon: BarChart2, id: 'impact' },
];



const titles = {
  overview: 'Overview',
  find: 'Find Donations',
  detail: 'Donation Details',
  claims: 'My Claims',
  tracking: 'Pickup Tracking',
  impact: 'Community Impact',
  notifications: 'Notifications',
  profile: 'Profile',
  settings: 'Settings',
  support: 'Help & Support'
};

export default function NgoDashboard({ onLogout }) {
  const { appProfile, fetchProfile } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const { unreadCount } = useNotification();

  const [availableDonations, setAvailableDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [radiusKm, setRadiusKm] = useState(10);
  const [locationUpdating, setLocationUpdating] = useState(false);
  const [tempLocation, setTempLocation] = useState(null);

  const fetchAvailableDonations = useCallback(async () => {
    if (!appProfile?.latitude || !appProfile?.longitude) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    try {
      const res = await getNearbyDonations(radiusKm);
      // Map explicit donor names
      const mappedDonations = res.data.map(d => ({
        ...d,
        donorName: d.donorOrganizationName || d.donorName || 'Anonymous Donor',
        distance: d.distanceKm,
      }));
      setAvailableDonations(mappedDonations);
    } catch (err) {
      setError(err.message || 'Unable to load nearby donations.');
    } finally {
      setLoading(false);
    }
  }, [appProfile?.latitude, appProfile?.longitude, radiusKm]);

  useEffect(() => {
    fetchAvailableDonations();

    const handleUpdate = () => fetchAvailableDonations();
    window.addEventListener('donation-updated', handleUpdate);
    return () => window.removeEventListener('donation-updated', handleUpdate);
  }, [fetchAvailableDonations]);

  const handleUpdateLocation = async () => {
    if (!tempLocation) return;
    setLocationUpdating(true);
    try {
      await updateProfileLocation(tempLocation.latitude, tempLocation.longitude);
      await fetchProfile();
      setTempLocation(null);
    } catch (err) {
      setError(err.message || 'Failed to update location.');
    } finally {
      setLocationUpdating(false);
    }
  };



  const handleNavigate = (view) => {
    setActiveView(view);
    setSelectedDonation(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDonation = (donation) => {
    setSelectedDonation(donation);
    setActiveView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClaimSuccess = (updatedDonation) => {
    setSelectedDonation(updatedDonation);
    setAvailableDonations(prev => prev.filter(d => d._id !== updatedDonation._id));
  };

  const renderContent = () => {
    if (activeView === 'detail' && selectedDonation) {
      return (
        <DonationDetail
          donation={selectedDonation}
          onBack={() => handleNavigate('find')}
          onClaimSuccess={handleClaimSuccess}
        />
      );
    }

    if (activeView === 'find' || activeView === 'overview') {
      if (!appProfile?.latitude || !appProfile?.longitude) {
        return (
          <div className="max-w-2xl mx-auto pt-12">
            <div className="bg-white p-8 rounded-3xl border border-brand-teal/20 shadow-sm text-center">
              <div className="w-16 h-16 bg-brand-teal/10 text-brand-teal rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Set your organization location</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Set your organization location to discover nearby food donations.
              </p>

              <div className="mb-6 text-left">
                <LocationPicker
                  value={tempLocation}
                  onChange={setTempLocation}
                  disabled={locationUpdating}
                />
              </div>

              <Button
                onClick={handleUpdateLocation}
                disabled={!tempLocation || locationUpdating}
                isLoading={locationUpdating}
                className="w-full sm:w-auto px-8"
              >
                Save Location
              </Button>
            </div>
          </div>
        );
      }

      if (loading) {
        return (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <Loader2 className="animate-spin h-10 w-10 text-brand-teal mb-4" />
            <p className="text-gray-500 font-medium">Loading nearby donations...</p>
          </div>
        );
      }
      if (error) {
        return (
          <div className="pt-12">
            <EmptyState
              title="Unable to load donations"
              description={error}
              actionLabel="Try Again"
              onAction={fetchAvailableDonations}
            />
          </div>
        );
      }
    }

    switch (activeView) {
      case 'find':
        return <FindDonations donations={availableDonations} onSelectDonation={handleSelectDonation} radiusKm={radiusKm} onRadiusChange={setRadiusKm} />;
      case 'claims':
        return <MyClaims onSelectClaim={handleSelectDonation} />;
      case 'tracking':
        return <PickupTracking role="NGO" />;
      case 'impact':
        return <NgoImpact />;
      case 'notifications':
        return <div className="pt-6"><NotificationsList /></div>;
      case 'profile':
        return <div className="pt-12"><EmptyState icon={User} title="NGO Profile" description="Manage organization details." /></div>;
      case 'settings':
        return <div className="pt-12"><EmptyState icon={Settings} title="Settings" description="Application settings." /></div>;
      case 'support':
        return <div className="pt-12"><EmptyState icon={HelpCircle} title="Help & Support" description="Get assistance." /></div>;
      case 'overview':
      default:
        const activeClaims = mockClaims.filter(c => c.status === 'CLAIMED' || c.status === 'READY_FOR_PICKUP');
        return (
          <NgoOverview
            stats={mockNgoStats}
            recentAvailable={availableDonations}
            activeClaims={activeClaims}
            onFindDonations={() => handleNavigate('find')}
            onViewClaims={() => handleNavigate('claims')}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-brand-neutral font-sans text-brand-text overflow-hidden selection:bg-brand-teal/20 selection:text-brand-darkTeal">
      <AppSidebar
        activeItem={activeView === 'detail' ? 'find' : activeView}
        onItemClick={handleNavigate}
        mainNav={mainNav}
        role="ngo"
      />

      <div className="flex-1 flex flex-col min-w-0 bg-brand-neutral relative">
        <AppNavbar
          userName={appProfile?.name || mockNgoProfile.name}
          userRole="NGO Partner"
          userInitials={appProfile?.name ? appProfile.name.charAt(0).toUpperCase() : mockNgoProfile.initials}
          onNotificationClick={() => handleNavigate('notifications')}
          onMenuClick={handleNavigate}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
