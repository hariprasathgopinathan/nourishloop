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

  const isNgo = userRole?.toLowerCase() === 'ngo' || userRole?.toLowerCase() === 'ngo partner';
  const roleColor = isNgo ? 'text-brand-teal' : 'text-brand-green';
  const avatarBg = isNgo ? 'bg-brand-teal/10' : 'bg-brand-green/10';
  const avatarBorder = isNgo ? 'border-brand-teal/20' : 'border-brand-green/20';

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
    <header className="h-16 bg-white border-b border-gray-200/60 flex items-center justify-between px-6 lg:px-8 flex-shrink-0 sticky top-0 z-30 transition-all">
      <div className="flex-1"></div>

      <div className="flex items-center gap-4 ml-auto">
        <button
          onClick={onNotificationClick}
          className="relative p-2 text-gray-400 hover:text-brand-text transition-colors rounded-lg hover:bg-gray-50"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] text-white font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>

        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 group text-left focus:outline-none hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-colors"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden border ${avatarBg} ${roleColor} ${avatarBorder}`}>
              {userInitials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-brand-text leading-tight">{userName}</p>
              <p className={`text-xs font-medium leading-tight mt-0.5 ${roleColor}`}>{userRole}</p>
            </div>
            <ChevronDown size={14} className={`text-gray-400 group-hover:text-gray-600 hidden sm:block transition-transform ${isMenuOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button onClick={() => { onMenuClick('profile'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-text transition-colors">
                <User size={16} className="text-gray-400" />
                Profile
              </button>
              <button onClick={() => { onMenuClick('settings'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-text transition-colors">
                <Settings size={16} className="text-gray-400" />
                Settings
              </button>
              <button onClick={() => { onMenuClick('support'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-text transition-colors">
                <HelpCircle size={16} className="text-gray-400" />
                Help & Support
              </button>
              
              <div className="h-px bg-gray-100 my-2"></div>
              
              <div className="px-3">
                <button 
                  onClick={() => { onLogout(); setIsMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={16} />
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
