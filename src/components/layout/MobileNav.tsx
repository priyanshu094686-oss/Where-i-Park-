import React from 'react';
import { LayoutDashboard, Search, MapPin, Navigation, User, Settings2 } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

interface MobileNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

interface NavTabItem {
  id: string;
  label: string;
  icon: any;
  hasDot?: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activePage, onNavigate }) => {
  const { role, savedParking } = useStorage();

  const studentTabs: NavTabItem[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'find-parking', label: 'Find', icon: Search },
    { id: 'parking-map', label: 'Map', icon: MapPin },
    { 
      id: 'find-vehicle', 
      label: 'Vehicle', 
      icon: Navigation, 
      hasDot: Boolean(savedParking?.isActive) 
    },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminTabs: NavTabItem[] = [
    { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'manage-parking', label: 'Manage', icon: Settings2 },
    { id: 'parking-map', label: 'Map', icon: MapPin },
    { id: 'analytics', label: 'Stats', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const tabs = role === 'admin' ? adminTabs : studentTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center py-1 px-3 relative transition-colors ${
                isActive ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600 scale-110' : 'text-slate-500'}`} />
                {tab.hasDot && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-2 ring-white animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
