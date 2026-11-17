import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  Bell, 
  MapPin, 
  User, 
  RotateCcw, 
  CheckCheck, 
  ExternalLink, 
  X, 
  Sparkles,
  Menu,
  Shield,
  GraduationCap
} from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';
import { storageService } from '../../services/storageService';

interface NavbarProps {
  onNavigate: (page: string) => void;
  activePage: string;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onToggleMobileMenu }) => {
  const { role, profile, academicBlocks, selectedBlockId, selectBlock, notifications, switchRole } = useStorage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetData = () => {
    if (window.confirm('Reset prototype to original demonstration data?')) {
      storageService.resetToDefaults();
      onNavigate(role === 'admin' ? 'admin-dashboard' : 'dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Mobile hamburger + Brand Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate(role === 'admin' ? 'admin-dashboard' : 'dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-sky-900 to-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight leading-none">
                    Where Did I Park?
                  </span>
                  <span className="hidden xl:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                    Smart 2-Wheeler
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Campus Parking System • LPU
                </p>
              </div>
            </button>
          </div>

          {/* Middle: Academic Block Quick Selector */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/80">
            <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Block:</span>
            <select
              value={selectedBlockId}
              onChange={(e) => selectBlock(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              {academicBlocks.map((b) => (
                <option key={b.id} value={b.id} className="text-slate-800 bg-white">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Right: Role Switcher, Notifications, Reset & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Role Switcher Pill */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium">
              <button
                onClick={() => switchRole('student')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  role === 'student'
                    ? 'bg-sky-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Student view"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Student</span>
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  role === 'admin'
                    ? 'bg-slate-900 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Admin view"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Flyout Menu */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-sky-600" />
                      <span className="text-sm font-bold text-slate-800">In-App Notifications</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-semibold">
                        {notifications.length}
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => storageService.markAllNotificationsAsRead()}
                        className="text-xs text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 transition-colors ${
                            !n.isRead ? 'bg-sky-50/50' : 'bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                                {n.title}
                                {!n.isRead && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block" />
                                )}
                              </p>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {n.actionUrl && (
                                  <button
                                    onClick={() => {
                                      setShowNotifications(false);
                                      storageService.markNotificationAsRead(n.id);
                                      onNavigate(n.actionUrl!.replace('/', ''));
                                    }}
                                    className="text-[11px] text-sky-600 hover:text-sky-800 font-semibold inline-flex items-center gap-1"
                                  >
                                    View <ExternalLink className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => storageService.deleteNotification(n.id)}
                              className="text-slate-300 hover:text-slate-500 p-0.5"
                              title="Dismiss"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <span className="text-[11px] text-slate-500">
                      Live smart parking event notifications
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Demo Data quick icon button */}
            <button
              onClick={handleResetData}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors hidden sm:flex items-center"
              title="Reset Demo Data (Faculty Review)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* User Profile Button & Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-sky-500/30">
                  {profile.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[120px]">
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase">
                    {profile.regNumber}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{profile.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{profile.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono font-medium text-slate-700">
                        {role === 'admin' ? 'Campus Admin' : `Reg: ${profile.regNumber}`}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 text-[10px] font-semibold text-sky-700">
                        {profile.defaultVehicleNumber}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('profile');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      View Profile & Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleResetData();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-400" />
                      Reset Demo Data
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 px-4 pb-1">
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-sky-500" />
                      INT335 P07 Prototype
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
