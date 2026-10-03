import React, { useState, useEffect } from 'react';
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
import { getAvailableDonations } from '../services/api';

const mainNav = [
  { label: 'Overview', icon: LayoutDashboard, id: 'overview' },
  { label: 'Find Donations', icon: Search, id: 'find' },
  { label: 'My Claims', icon: HandHeart, id: 'claims' },
  { label: 'Pickup Tracking', icon: MapPin, id: 'tracking' },
  { label: 'Impact', icon: BarChart2, id: 'impact' },
];

const accountNav = [
  { label: 'Notifications', icon: Bell, id: 'notifications', badge: 3 },
  { label: 'Profile', icon: User, id: 'profile' },
  { label: 'Settings', icon: Settings, id: 'settings' },
  { label: 'Help & Support', icon: HelpCircle, id: 'support' },
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
  const [activeView, setActiveView] = useState('overview');
  const [selectedDonation, setSelectedDonation] = useState(null);
  
  const [availableDonations, setAvailableDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvailableDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAvailableDonations();
      // Map explicit donor names
      const mappedDonations = res.data.map(d => ({
        ...d,
        donorName: d.donorOrganizationName || d.donorName || 'Anonymous Donor',
        distance: 'N/A', // Distance calculation not implemented yet
      }));
      setAvailableDonations(mappedDonations);
    } catch (err) {
      setError(err.message || 'Unable to load available donations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableDonations();
  }, []);

  const activePickupClaim = mockClaims.find(c => c.status === 'CLAIMED' || c.status === 'READY_FOR_PICKUP') || mockClaims[0];

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
      if (loading) {
        return (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <Loader2 className="animate-spin h-10 w-10 text-emerald-500 mb-4" />
            <p className="text-gray-500 font-medium">Loading available donations...</p>
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
        return <FindDonations donations={availableDonations} onSelectDonation={handleSelectDonation} />;
      case 'claims':
        return <MyClaims onSelectClaim={handleSelectDonation} />;
      case 'tracking':
        return <PickupTracking claim={activePickupClaim} onBack={() => handleNavigate('claims')} />;
      case 'impact':
        return <NgoImpact />;
      case 'notifications':
        return <div className="pt-12"><EmptyState icon={Bell} title="Notifications" description="View and manage alerts." /></div>;
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
    <div className="flex h-screen bg-[#FDFDFC] font-sans text-gray-900 overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      <AppSidebar 
        activeItem={activeView === 'detail' ? 'find' : activeView} 
        onItemClick={handleNavigate} 
        mainNav={mainNav}
        accountNav={accountNav}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-[#FBFBFA] relative">
        <AppNavbar 
          title={titles[activeView]} 
          userName={mockNgoProfile.name}
          userRole="NGO Partner"
          userInitials={mockNgoProfile.initials}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
