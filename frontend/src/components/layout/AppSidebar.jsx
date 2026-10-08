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
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isNgo = role.toLowerCase() === 'ngo';
  const activeBg = isNgo ? 'bg-brand-ngo-light' : 'bg-brand-donor-light';
  const activeText = isNgo ? 'text-brand-ngo' : 'text-brand-donor';
  const activeIcon = isNgo ? 'text-brand-ngo' : 'text-brand-donor';
  const hoverBg = isNgo ? 'hover:bg-brand-ngo-light/50 hover:text-brand-ngo' : 'hover:bg-brand-donor-light/50 hover:text-brand-donor';
  const badgeBg = isNgo ? 'bg-brand-ngo' : 'bg-brand-donor';
  const sectionTitleColor = isNgo ? 'text-brand-ngo' : 'text-brand-donor';

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
          w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[14px] font-semibold
          transition-all duration-200 group relative
          ${isActive
            ? `${activeBg} ${activeText}`
            : `text-brand-text ${hoverBg}`
          }
        `}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={`transition-colors duration-200 ${isActive ? activeIcon : `text-brand-text-muted group-${hoverBg}`}`} />
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
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-brand-surface border border-brand-border rounded-[8px] shadow-sm text-brand-text hover:bg-brand-neutral transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-brand-text/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[230px] bg-brand-surface border-r border-brand-border
          z-40 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto lg:flex-shrink-0
        `}
      >
        {/* Branding Area */}
        <div className="px-6 h-[72px] flex items-center justify-start border-b border-brand-border/0">
          <Logo className="h-8 w-auto mix-blend-multiply" />
        </div>

        {/* Navigation Areas */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
          <div>
            <div className={`px-3 mb-4 text-[11px] font-bold ${sectionTitleColor} uppercase tracking-widest`}>
              {isNgo ? 'NGO PORTAL' : 'DONOR PORTAL'}
            </div>
            <nav className="space-y-1">
              {mainNav.map(item => <NavItem key={item.id} item={item} />)}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
