import React, { useState } from 'react';
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
import { mockAvailableDonations, mockClaims, mockNgoStats, mockNgoProfile } from '../data/ngoMockData';

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
  
  // For pickup tracking, we would normally select a specific claim.
  // For the design prototype, we'll just show the first active claim if available.
  const activePickupClaim = mockClaims.find(c => c.status === 'CLAIMED' || c.status === 'READY_FOR_PICKUP') || mockClaims[0];

  const handleNavigate = (view) => {
    setActiveView(view);
    setSelectedDonation(null); // Reset detail view state
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDonation = (donation) => {
    setSelectedDonation(donation);
    setActiveView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (activeView === 'detail' && selectedDonation) {
      return (
        <DonationDetail 
          donation={selectedDonation} 
          onBack={() => handleNavigate('find')} 
        />
      );
    }

    switch (activeView) {
      case 'find':
        return <FindDonations donations={mockAvailableDonations} onSelectDonation={handleSelectDonation} />;
      case 'claims':
        return <MyClaims claims={mockClaims} />;
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
            recentAvailable={mockAvailableDonations} 
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
