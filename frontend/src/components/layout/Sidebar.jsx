import { useState, useEffect } from 'react';
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
  HelpCircle
} from 'lucide-react';
import Logo from '../ui/Logo';

const mainNav = [
  { label: 'Overview', icon: LayoutDashboard, id: 'overview' },
  { label: 'Donations', icon: List, id: 'donations' },
  { label: 'Create Donation', icon: PlusCircle, id: 'create' },
  { label: 'Pickup Tracking', icon: MapPin, id: 'tracking' },
  { label: 'Impact', icon: BarChart2, id: 'impact' },
];

const accountNav = [
  { label: 'Notifications', icon: Bell, id: 'notifications', badge: 2 },
  { label: 'Profile', icon: User, id: 'profile' },
  { label: 'Settings', icon: Settings, id: 'settings' },
  { label: 'Help & Support', icon: HelpCircle, id: 'support' },
];

export default function Sidebar({ activeItem, onItemClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium
          transition-all duration-200 group relative
          ${isActive
            ? 'bg-emerald-50 text-emerald-700'
            : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-gray-900'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={`transition-colors duration-200 ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-600'}`} />
          {item.label}
        </div>
        {item.badge && (
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-700 hover:text-emerald-600 transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[280px] bg-[#FDFDFC] border-r border-gray-100/80
          z-40 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto md:flex-shrink-0
        `}
      >
        {/* Branding Area */}
        <div className="p-6 pt-7 pb-6 flex items-center justify-center border-b border-gray-100">
          <Logo compact className="h-16 w-auto" />
        </div>

        {/* Navigation Areas */}
        <div className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar">
          <div>
            <div className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</div>
            <nav className="space-y-1">
              {mainNav.map(item => <NavItem key={item.id} item={item} />)}
            </nav>
          </div>

          <div>
            <div className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</div>
            <nav className="space-y-1">
              {accountNav.map(item => <NavItem key={item.id} item={item} />)}
            </nav>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="p-6 border-t border-gray-100/80 bg-gradient-to-t from-gray-50/50 to-transparent">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-[14px] font-bold bg-red-700 text-white hover:bg-red-800 hover:shadow-md transition-all duration-200">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
