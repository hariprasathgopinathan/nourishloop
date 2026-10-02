import { useState } from 'react';
import { 
  LayoutDashboard, 
  List, 
  PlusCircle, 
  MapPin, 
  BarChart2, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Leaf 
} from 'lucide-react';

const mainNav = [
  { label: 'Overview', icon: LayoutDashboard, id: 'overview' },
  { label: 'Donations', icon: List, id: 'donations' },
  { label: 'Create Donation', icon: PlusCircle, id: 'create' },
  { label: 'Pickup Tracking', icon: MapPin, id: 'tracking' },
  { label: 'Impact', icon: BarChart2, id: 'impact' },
];

const accountNav = [
  { label: 'Notifications', icon: Bell, id: 'notifications' },
  { label: 'Profile', icon: User, id: 'profile' },
  { label: 'Settings', icon: Settings, id: 'settings' },
];

export default function Sidebar({ activeItem, onItemClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;
    return (
      <button
        onClick={() => {
          onItemClick(item.id);
          setMobileOpen(false);
        }}
        className={`
          w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
          transition-colors duration-150
          ${isActive 
            ? 'bg-emerald-50 text-emerald-700' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
      >
        <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-gray-400'} />
        {item.label}
      </button>
    );
  };

  return (
    <>
      <button
        className="fixed top-3 left-4 z-50 md:hidden p-2 bg-white border border-gray-200 rounded-md shadow-sm text-gray-600"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/20 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#FBFBFA] border-r border-gray-200
          z-40 transition-transform duration-200 flex flex-col
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        <div className="p-5 flex items-center gap-2">
          <div className="bg-emerald-600 p-1.5 rounded text-white">
            <Leaf size={20} strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold text-gray-900">Surplus Food</h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Donation Network</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-6">
          <div>
            <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</div>
            <nav className="space-y-1">
              {mainNav.map(item => <NavItem key={item.id} item={item} />)}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</div>
            <nav className="space-y-1">
              {accountNav.map(item => <NavItem key={item.id} item={item} />)}
            </nav>
          </div>
        </div>

        <div className="p-4">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <LogOut size={18} className="text-gray-400" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
