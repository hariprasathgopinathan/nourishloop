import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

/**
 * Reusable navbar that accepts user profile info as props.
 * Used by both Donor and NGO dashboards.
 */
export default function AppNavbar({ userName, userRole, userInitials, onNotificationClick, onMenuClick, onLogout }) {
  const { unreadCount } = useNotification();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isNgo = userRole?.toLowerCase().includes('ngo');
  const avatarBg = isNgo ? 'bg-brand-ngo' : 'bg-brand-donor';

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[72px] bg-brand-surface border-b border-brand-border flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-30 transition-all">
      <div className="flex-1"></div>

      <div className="flex items-center gap-6 ml-auto">
        <button
          onClick={onNotificationClick}
          className="relative p-2 text-brand-text-muted hover:text-brand-text transition-colors rounded-full hover:bg-brand-neutral"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          )}
        </button>

        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 group text-left focus:outline-none hover:bg-brand-neutral px-3 py-1.5 rounded-[12px] transition-colors"
          >
            <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center font-bold text-[13px] overflow-hidden text-white ${avatarBg}`}>
              {userInitials}
            </div>
            <div className="hidden sm:block">
              <p className="text-[14px] font-bold text-brand-text leading-[1.1]">{userName}</p>
              <p className="text-[11px] font-medium text-brand-text-muted leading-[1.3] mt-[2px]">{userRole}</p>
            </div>
            <ChevronDown size={14} className={`text-brand-text-muted group-hover:text-brand-text hidden sm:block transition-transform ml-1 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-brand-surface rounded-[12px] shadow-[0_4px_20px_rgba(15,23,42,0.1)] border border-brand-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button onClick={() => { onMenuClick('profile'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-[14px] text-brand-text hover:bg-brand-neutral transition-colors">
                <User size={16} className="text-brand-text-muted" />
                Profile
              </button>
              <button onClick={() => { onMenuClick('settings'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-[14px] text-brand-text hover:bg-brand-neutral transition-colors">
                <Settings size={16} className="text-brand-text-muted" />
                Settings
              </button>
              <button onClick={() => { onMenuClick('support'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-[14px] text-brand-text hover:bg-brand-neutral transition-colors">
                <HelpCircle size={16} className="text-brand-text-muted" />
                Help & Support
              </button>
              
              <div className="h-px bg-brand-border my-2"></div>
              
              <div className="px-3">
                <button 
                  onClick={() => { onLogout(); setIsMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
