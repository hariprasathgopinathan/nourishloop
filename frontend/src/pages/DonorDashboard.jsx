import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DonationForm from '../components/DonationForm';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { Clock, Navigation, BarChart, Settings, Bell, User as UserIcon, List } from 'lucide-react';
import { getMyDonations } from '../services/api';

const formatExpiry = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date - now;
  
  if (diffMs <= 0) return 'Expired';
  
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 24) {
    if (diffHours < 1) return `Expires in ${Math.ceil(diffMs / 60000)} minutes`;
    return `Expires in ${Math.floor(diffHours)} hours`;
  }
  
  return `Expires at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}, ${date.toLocaleDateString()}`;
};

function Overview({ onCreateClick, stats, recentDonations, expiringSoon }) {
  const statCards = [
    { label: 'Total Donations', value: stats.total },
    { label: 'Available', value: stats.available },
    { label: 'Claimed', value: stats.claimed },
    { label: 'Picked Up', value: stats.pickedUp },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Good evening, Arun</h2>
          <p className="text-gray-500">Turn today's surplus into meals for your community.</p>
        </div>
        <Button onClick={onCreateClick}>
          + Create Donation
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {recentDonations.length === 0 ? (
        <EmptyState 
          icon={List} 
          title="No donations yet" 
          description="Share your first surplus food donation with your community." 
          actionLabel="Create Donation" 
          onAction={onCreateClick}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Donations</h3>
                <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View all &rarr;</button>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-500">Food</th>
                        <th className="px-4 py-3 font-medium text-gray-500">Quantity</th>
                        <th className="px-4 py-3 font-medium text-gray-500">Expiry</th>
                        <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 font-medium text-gray-500 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentDonations.slice(0, 5).map(don => (
                        <tr key={don._id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium text-gray-900">{don.foodName}</td>
                          <td className="px-4 py-3 text-gray-600">{don.quantity} {don.unit}</td>
                          <td className="px-4 py-3 text-gray-600">{formatExpiry(don.availableUntil)}</td>
                          <td className="px-4 py-3"><StatusBadge status={don.status} /></td>
                          <td className="px-4 py-3 text-right">
                            <button className="text-emerald-600 hover:text-emerald-700 font-medium">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Expiring Soon
              </h3>
              {expiringSoon.length === 0 ? (
                <p className="text-sm text-gray-500">No urgent donations.</p>
              ) : (
                <div className="space-y-3">
                  {expiringSoon.slice(0, 3).map(don => (
                    <div key={don._id} className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{don.foodName}</h4>
                        <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">View</button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{don.quantity} {don.unit}</p>
                      <p className="text-xs font-medium text-amber-700 flex items-center gap-1.5">
                        <Clock size={12} /> {formatExpiry(don.availableUntil)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

function DonationsList({ donations }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">My Donations</h2>
        <p className="text-gray-500">Track and manage the surplus food you've shared.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Search donations..." 
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
          />
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
            <option>All Status</option>
            <option>Available</option>
            <option>Claimed</option>
            <option>Picked Up</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 font-medium text-gray-500">Food</th>
                <th className="px-5 py-3 font-medium text-gray-500">Category</th>
                <th className="px-5 py-3 font-medium text-gray-500">Quantity</th>
                <th className="px-5 py-3 font-medium text-gray-500">Expires</th>
                <th className="px-5 py-3 font-medium text-gray-500">Status</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donations.map((don) => (
                <tr key={don._id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4 font-medium text-gray-900">{don.foodName}</td>
                  <td className="px-5 py-4 text-gray-600">{don.category}</td>
                  <td className="px-5 py-4 text-gray-600">{don.quantity} {don.unit}</td>
                  <td className="px-5 py-4 text-gray-600">{formatExpiry(don.availableUntil)}</td>
                  <td className="px-5 py-4"><StatusBadge status={don.status} /></td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                      <span className="sr-only">Options</span>
                      &hellip;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      );
    }

    if (error) {
      return (
        <EmptyState 
          title="Unable to load your donations." 
          description={error} 
          actionLabel="Try Again" 
          onAction={fetchDashboardData}
        />
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
        return <EmptyState icon={Navigation} title="Pickup Tracking" description="Track the real-time status of food pickups." actionLabel="View Active Pickups" />;
      case 'impact':
        return <EmptyState icon={BarChart} title="Your Impact" description="See the difference you've made in your community." />;
      case 'notifications':
        return <EmptyState icon={Bell} title="Notifications" description="You have no new notifications." />;
      case 'profile':
        return <EmptyState icon={UserIcon} title="Profile" description="Manage your account settings and preferences." />;
      case 'settings':
        return <EmptyState icon={Settings} title="Settings" description="Application settings will appear here." />;
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
    <div className="flex h-screen bg-[#FBFBFA] font-sans text-gray-900">
      <Sidebar activeItem={activeView} onItemClick={setActiveView} />

      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
        <Navbar title={titles[activeView]} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
