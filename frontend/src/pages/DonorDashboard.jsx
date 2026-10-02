import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DonationForm from '../components/DonationForm';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { Clock, Navigation, BarChart, Settings, Bell, User as UserIcon } from 'lucide-react';

// Mock Data
const stats = [
  { label: 'Total Donations', value: '124' },
  { label: 'Available', value: '12' },
  { label: 'Claimed', value: '45' },
  { label: 'Picked Up', value: '67' },
];

const expiringSoon = [
  { id: 1, food: 'Vegetable Rice', quantity: '30 plates', expiry: 'Expires in 42 minutes', status: 'AVAILABLE' },
  { id: 2, food: 'Fresh Bananas', quantity: '15 kg', expiry: 'Expires in 2 hours', status: 'AVAILABLE' },
];

const recentDonations = [
  { id: 1, food: 'Vegetable Rice', quantity: '30 plates', expiry: '8:45 PM', status: 'AVAILABLE' },
  { id: 2, food: 'Whole Wheat Bread', quantity: '20 packets', expiry: '7:30 PM', status: 'CLAIMED' },
  { id: 3, food: 'Cooked Lentils', quantity: '10 Litres', expiry: 'Yesterday', status: 'PICKED_UP' },
];

function Overview({ onCreateClick }) {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Good evening, Arun</h2>
          <p className="text-gray-500">Turn today's surplus into meals for your community.</p>
        </div>
        <Button onClick={onCreateClick}>
          + Create Donation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
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
                    {recentDonations.map(don => (
                      <tr key={don.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">{don.food}</td>
                        <td className="px-4 py-3 text-gray-600">{don.quantity}</td>
                        <td className="px-4 py-3 text-gray-600">{don.expiry}</td>
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

        {/* Sidebar Column */}
        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Expiring Soon
            </h3>
            <div className="space-y-3">
              {expiringSoon.map(don => (
                <div key={don.id} className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{don.food}</h4>
                    <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">View</button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{don.quantity}</p>
                  <p className="text-xs font-medium text-amber-700 flex items-center gap-1.5">
                    <Clock size={12} /> {don.expiry}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DonationsList() {
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
              {recentDonations.map((don, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4 font-medium text-gray-900">{don.food}</td>
                  <td className="px-5 py-4 text-gray-600">Prepared Meals</td>
                  <td className="px-5 py-4 text-gray-600">{don.quantity}</td>
                  <td className="px-5 py-4 text-gray-600">{don.expiry}</td>
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

  const renderContent = () => {
    switch (activeView) {
      case 'create':
        return <DonationForm />;
      case 'donations':
        return <DonationsList />;
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
        return <Overview onCreateClick={() => setActiveView('create')} />;
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
