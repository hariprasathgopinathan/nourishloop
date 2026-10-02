import { Search, Bell, ChevronDown } from 'lucide-react';

export default function Navbar({ title = "Overview" }) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div className="w-8 md:hidden" /> {/* Mobile menu spacer */}
        <h2 className="text-lg font-medium text-gray-900 hidden sm:block">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-48 transition-colors"
          />
        </div>

        <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full border border-white"></span>
        </button>

        <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>

        <button className="flex items-center gap-2.5 text-left focus:outline-none group">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium text-sm">
            AK
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-none mb-1">Arun Kumar</p>
            <p className="text-xs text-gray-500 leading-none">Donor</p>
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 hidden sm:block ml-1" />
        </button>
      </div>
    </header>
  );
}
