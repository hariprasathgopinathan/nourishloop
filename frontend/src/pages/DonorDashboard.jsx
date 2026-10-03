import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import DonationForm from '../components/donations/DonationForm';
import Overview from '../components/dashboard/Overview';
import DonationsList from '../components/donations/DonationsList';
import EmptyState from '../components/ui/EmptyState';
import { Navigation, BarChart, Settings, Bell, User as UserIcon, Loader2 } from 'lucide-react';
import { getMyDonations } from '../services/api';

export default function DonorDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [data, setData] = useState({ stats: null, donations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const donorId = import.meta.env.VITE_DEV_DONOR_ID;
      const res = await getMyDonations(donorId);
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Unable to load your donations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
        return <div className="pt-12"><EmptyState icon={Navigation} title="Pickup Tracking" description="Track the real-time status of food pickups." actionLabel="View Active Pickups" /></div>;
      case 'impact':
        return <div className="pt-12"><EmptyState icon={BarChart} title="Your Impact" description="See the difference you've made in your community." /></div>;
      case 'notifications':
        return <div className="pt-12"><EmptyState icon={Bell} title="Notifications" description="You have no new notifications." /></div>;
      case 'profile':
        return <div className="pt-12"><EmptyState icon={UserIcon} title="Profile" description="Manage your account settings and preferences." /></div>;
      case 'settings':
        return <div className="pt-12"><EmptyState icon={Settings} title="Settings" description="Application settings will appear here." /></div>;
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
    settings: 'Settings'
  };

  return (
    <div className="flex h-screen bg-[#FDFDFC] font-sans text-gray-900 overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      <Sidebar activeItem={activeView} onItemClick={setActiveView} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#FBFBFA] relative">
        <Navbar title={titles[activeView]} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
