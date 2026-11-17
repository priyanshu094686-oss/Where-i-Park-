import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  MapPin, 
  BookmarkCheck, 
  Navigation, 
  History, 
  User, 
  BarChart3, 
  Settings2, 
  Bell, 
  GraduationCap, 
  ShieldCheck, 
  Info
} from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface SidebarNavItem {
  id: string;
  label: string;
  icon: any;
  highlight?: boolean;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { role, savedParking, notifications, switchRole } = useStorage();

  const studentNavItems: SidebarNavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'find-parking', label: 'Find Parking', icon: Search, badge: 'Smart' },
    { id: 'parking-map', label: 'Parking Map', icon: MapPin },
    { id: 'save-parking', label: 'Save My Parking', icon: BookmarkCheck },
    { 
      id: 'find-vehicle', 
      label: 'Find My Vehicle', 
      icon: Navigation, 
      highlight: Boolean(savedParking?.isActive),
      badge: savedParking?.isActive ? 'Active' : undefined 
    },
    { id: 'parking-history', label: 'Parking History', icon: History },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const adminNavItems: SidebarNavItem[] = [
    { id: 'admin-dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { id: 'manage-parking', label: 'Manage Parking Lots', icon: Settings2, badge: 'CRUD' },
    { id: 'analytics', label: 'Parking Analytics', icon: BarChart3 },
    { id: 'parking-map', label: 'Campus Map View', icon: MapPin },
    { 
      id: 'notifications', 
      label: 'System Alerts', 
      icon: Bell,
      badge: notifications.filter(n => !n.isRead).length > 0 
        ? `${notifications.filter(n => !n.isRead).length}` 
        : undefined 
    },
    { id: 'profile', label: 'Admin Profile', icon: User },
  ];

  const navItems = role === 'admin' ? adminNavItems : studentNavItems;

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 z-40 h-full md:h-[calc(100vh-4rem)] w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 md:hidden flex items-center justify-between border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-bold text-white text-sm">Where Did I Park?</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Current Active Role Badge */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  role === 'admin'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                }`}
              >
                {role === 'admin' ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <GraduationCap className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Current View
                </p>
                <p className="text-xs font-bold text-white capitalize">
                  {role === 'admin' ? 'Campus Admin' : 'Student / Staff'}
                </p>
              </div>
            </div>

            <button
              onClick={() => switchRole(role === 'admin' ? 'student' : 'admin')}
              className="text-[11px] text-sky-400 hover:text-sky-300 underline font-medium"
              title="Toggle role"
            >
              Switch
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            {role === 'admin' ? 'Management Controls' : 'Smart Parking Portal'}
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 font-bold'
                    : item.highlight
                    ? 'bg-slate-800/90 text-sky-300 hover:bg-slate-800 border border-sky-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : item.highlight ? 'text-sky-400' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.highlight
                        ? 'bg-sky-400 text-slate-950 font-mono animate-pulse'
                        : isActive
                        ? 'bg-sky-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Card: Saved Vehicle Quick Status */}
        {savedParking && savedParking.isActive && role === 'student' && (
          <div className="p-3 mx-3 mb-3 bg-gradient-to-br from-slate-800 to-sky-950/60 rounded-xl border border-sky-500/30 text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-sky-400 mb-1">
              <span className="flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 animate-pulse" />
                Active Vehicle Pin
              </span>
              <span className="font-mono text-[10px] bg-sky-500/20 px-1.5 py-0.2 rounded text-sky-300">
                {savedParking.slot}
              </span>
            </div>
            <p className="text-white font-semibold truncate text-[11px]">{savedParking.lotName}</p>
            <p className="text-slate-400 text-[10px] mt-0.5 truncate font-mono">
              Reg: {savedParking.regNumber}
            </p>
            <button
              onClick={() => handleItemClick('find-vehicle')}
              className="mt-2 w-full py-1 text-center bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold rounded-lg transition-colors"
            >
              Track Location →
            </button>
          </div>
        )}

        {/* Footer: Project Info & Reset */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/70 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              INT335 P07
            </span>
            <span className="text-[10px] text-slate-500 font-mono">v1.0 Demo</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Simulated campus dataset for Design Thinking presentation.
          </p>
        </div>
      </aside>
    </>
  );
};
