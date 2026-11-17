import React, { useState, useEffect } from 'react';
import { ProjectBanner } from './components/layout/ProjectBanner';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { Dashboard } from './pages/Dashboard';
import { FindParking } from './pages/FindParking';
import { ParkingMapPage } from './pages/ParkingMap';
import { SaveParking } from './pages/SaveParking';
import { FindVehicle } from './pages/FindVehicle';
import { ParkingHistoryPage } from './pages/ParkingHistory';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageParking } from './pages/ManageParking';
import { AnalyticsPage } from './pages/Analytics';
import { NotificationsPage } from './pages/Notifications';
import { ProfilePage } from './pages/Profile';

import { useStorage } from './hooks/useStorage';

export function App() {
  const { role } = useStorage();
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [pageState, setPageState] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync default page when role changes
  useEffect(() => {
    if (role === 'admin' && activePage === 'dashboard') {
      setActivePage('admin-dashboard');
    } else if (role === 'student' && activePage === 'admin-dashboard') {
      setActivePage('dashboard');
    }
  }, [role]);

  const handleNavigate = (page: string, state?: any) => {
    setPageState(state || null);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans">
      
      {/* Top Academic Banner */}
      <ProjectBanner />

      {/* Main Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Body Layout: Sidebar + Main Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Desktop Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 min-w-0 pb-20 md:pb-8">
          {activePage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {activePage === 'find-parking' && (
            <FindParking
              onNavigate={handleNavigate}
              onSelectLotToSave={(lotId) => handleNavigate('save-parking', { preselectedLotId: lotId })}
            />
          )}
          {activePage === 'parking-map' && <ParkingMapPage onNavigate={handleNavigate} />}
          {activePage === 'save-parking' && (
            <SaveParking
              onNavigate={handleNavigate}
              preselectedLotId={pageState?.preselectedLotId}
            />
          )}
          {activePage === 'find-vehicle' && <FindVehicle onNavigate={handleNavigate} />}
          {activePage === 'parking-history' && <ParkingHistoryPage />}
          {activePage === 'admin-dashboard' && <AdminDashboard onNavigate={handleNavigate} />}
          {activePage === 'manage-parking' && <ManageParking />}
          {activePage === 'analytics' && <AnalyticsPage />}
          {activePage === 'notifications' && <NotificationsPage onNavigate={handleNavigate} />}
          {activePage === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activePage={activePage} onNavigate={handleNavigate} />

    </div>
  );
}

export default App;
