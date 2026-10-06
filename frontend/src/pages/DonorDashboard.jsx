import { useState, useEffect } from 'react';
import AppSidebar from '../components/layout/AppSidebar';
import AppNavbar from '../components/layout/AppNavbar';
import DonationForm from '../components/donations/DonationForm';
import Overview from '../components/dashboard/Overview';
import DonationsList from '../components/donations/DonationsList';
import EmptyState from '../components/ui/EmptyState';
import { LayoutDashboard, List, PlusCircle, MapPin, BarChart2, Bell, User, Settings, HelpCircle, Loader2 } from 'lucide-react';
import { getMyDonations } from '../services/api';
import PickupTracking from '../components/pickup/PickupTracking';
import NotificationsList from '../components/notifications/NotificationsList';
import { useNotification } from '../context/NotificationContext';

const mainNav = [
  { label: 'Overview', icon: LayoutDashboard, id: 'overview' },
  { label: 'Donations', icon: List, id: 'donations' },
  { label: 'Create Donation', icon: PlusCircle, id: 'create' },
  { label: 'Pickup Tracking', icon: MapPin, id: 'tracking' },
  { label: 'Impact', icon: BarChart2, id: 'impact' },
];

const getAccountNav = (unreadCount) => [
  { label: 'Notifications', icon: Bell, id: 'notifications', badge: unreadCount > 0 ? unreadCount : null },
  { label: 'Profile', icon: User, id: 'profile' },
  { label: 'Settings', icon: Settings, id: 'settings' },
  { label: 'Help & Support', icon: HelpCircle, id: 'support' },
];

export default function DonorDashboard({ onLogout }) {
  const [activeView, setActiveView] = useState('overview');
  const [data, setData] = useState({ stats: null, donations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { unreadCount } = useNotification();

  const fetchDashboardData = async () => {
    try {
      const res = await getMyDonations();
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Unable to load your donations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const handleUpdate = () => fetchDashboardData();
    window.addEventListener('donation-updated', handleUpdate);
    return () => window.removeEventListener('donation-updated', handleUpdate);
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <Loader2 className="animate-spin h-10 w-10 text-emerald-500 mb-4" />
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="pt-12">
          <EmptyState 
            title="Unable to load your donations" 
            description={error} 
            actionLabel="Try Again" 
            onAction={fetchDashboardData}
          />
        </div>
      );
    }

    const { stats, donations } = data;
    const now = new Date();
    
    // Sort ascending by expiry date (earliest first), only Available and future expiry
    const expiringSoon = [...donations]
      .filter(d => d.status === 'AVAILABLE' && new Date(d.availableUntil) > now)
      .sort((a, b) => new Date(a.availableUntil) - new Date(b.availableUntil));

    switch (activeView) {
      case 'create':
        return <DonationForm />;
      case 'donations':
        return <DonationsList donations={donations} />;
      case 'tracking':
        return <PickupTracking role="DONOR" initialDonations={donations} onUpdate={fetchDashboardData} />;
      case 'impact':
        return <div className="pt-12"><EmptyState icon={BarChart2} title="Your Impact" description="See the difference you've made in your community." /></div>;
      case 'notifications':
        return <div className="pt-6"><NotificationsList /></div>;
      case 'profile':
        return <div className="pt-12"><EmptyState icon={User} title="Profile" description="Manage your account settings and preferences." /></div>;
      case 'settings':
        return <div className="pt-12"><EmptyState icon={Settings} title="Settings" description="Application settings will appear here." /></div>;
      case 'support':
        return <div className="pt-12"><EmptyState icon={HelpCircle} title="Help & Support" description="Get assistance." /></div>;
      case 'overview':
      default:
        return <Overview 
          onCreateClick={() => setActiveView('create')} 
          stats={stats} 
          recentDonations={donations} 
          expiringSoon={expiringSoon} 
        />;
    }
  };

  const titles = {
    overview: 'Overview',
    donations: 'My Donations',
    create: 'Create Donation',
    tracking: 'Pickup Tracking',
    impact: 'Impact',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    support: 'Help & Support'
  };

  return (
    <div className="flex h-screen bg-[#FDFDFC] font-sans text-gray-900 overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      <AppSidebar 
        activeItem={activeView} 
        onItemClick={setActiveView} 
        mainNav={mainNav}
        accountNav={getAccountNav(unreadCount)}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-[#FBFBFA] relative">
        <AppNavbar 
          title={titles[activeView]} 
          userName="Arun Kumar"
          userRole="Donor"
          userInitials="AK"
          onNotificationClick={() => setActiveView('notifications')}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
