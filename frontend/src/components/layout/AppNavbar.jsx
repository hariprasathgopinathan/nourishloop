import { Bell, Search, ChevronDown } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

/**
 * Reusable navbar that accepts user profile info as props.
 * Used by both Donor and NGO dashboards.
 */
export default function AppNavbar({ title = "Overview", userName, userRole, userInitials, onNotificationClick }) {
  const { unreadCount } = useNotification();
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 flex-shrink-0 sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-6 flex-1">
        <h2 className="text-xl font-semibold text-gray-900 hidden md:block tracking-tight">{title}</h2>

        <div className="hidden lg:flex items-center gap-2 bg-gray-50/50 hover:bg-gray-100/50 border border-gray-200/60 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 rounded-full px-4 py-2 w-96 transition-all duration-300">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search food, categories, or locations..."
            className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-5 ml-auto">
        <button
          onClick={onNotificationClick}
          className="relative p-2 text-gray-400 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

        <button className="flex items-center gap-3 group text-left focus:outline-none">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-inner overflow-hidden border border-emerald-200/50">
            {userInitials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">{userName}</p>
            <p className="text-xs text-gray-500 font-medium leading-tight mt-0.5">{userRole}</p>
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 hidden sm:block ml-1 transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>
    </header>
  );
}
