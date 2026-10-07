import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';

/**
 * Reusable sidebar shell for both Donor and NGO dashboards.
 * Receives navigation config as props so each role can define its own menu items.
 */
export default function AppSidebar({ activeItem, onItemClick, mainNav, role = 'donor' }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isNgo = role.toLowerCase() === 'ngo';
  const activeBg = isNgo ? 'bg-brand-teal/10' : 'bg-brand-green/10';
  const activeText = isNgo ? 'text-brand-darkTeal' : 'text-brand-darkGreen';
  const activeIcon = isNgo ? 'text-brand-teal' : 'text-brand-green';
  const hoverBg = isNgo ? 'hover:bg-brand-teal/5 hover:text-brand-darkTeal' : 'hover:bg-brand-green/5 hover:text-brand-darkGreen';
  const badgeBg = isNgo ? 'bg-brand-teal' : 'bg-brand-green';

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
          w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium
          transition-all duration-200 group relative
          ${isActive
            ? `${activeBg} ${activeText}`
            : `text-gray-600 ${hoverBg}`
          }
        `}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={`transition-colors duration-200 ${isActive ? activeIcon : `text-gray-400 group-${hoverBg}`}`} />
          {item.label}
        </div>
        {item.badge && (
          <span className={`${badgeBg} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none`}>
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
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 hover:text-brand-text transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-brand-text/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[260px] bg-white border-r border-gray-200/60
          z-40 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto md:flex-shrink-0
        `}
      >
        {/* Branding Area */}
        <div className="p-6 pt-7 pb-6 flex items-center justify-center border-b border-gray-100">
          <Logo className="h-24 w-auto" compact />
        </div>

        {/* Navigation Areas */}
        <div className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar">
          <div>
            <div className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{isNgo ? 'NGO PORTAL' : 'DONOR PORTAL'}</div>
            <nav className="space-y-1">
              {mainNav.map(item => <NavItem key={item.id} item={item} />)}
            </nav>
          </div>

        </div>
      </aside>
    </>
  );
}
