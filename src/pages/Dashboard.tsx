import React from 'react';
import { 
  Search, 
  BookmarkCheck, 
  Navigation, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Bike, 
  Layers, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Compass
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { profile, academicBlocks, selectedBlockId, selectedBlock, selectBlock, parkingLots, savedParking } = useStorage();

  // Calculated Metrics
  const totalCapacity = parkingLots.reduce((acc, lot) => acc + lot.totalCapacity, 0);
  const totalOccupied = parkingLots.reduce((acc, lot) => acc + lot.occupiedSpaces, 0);
  const totalAvailable = parkingLots.reduce((acc, lot) => acc + lot.availableSpaces, 0);
  const campusOccupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  // Format Elapsed Time if vehicle is parked
  const getElapsedString = (parkedAtIso: string) => {
    const minutes = Math.max(1, Math.round((Date.now() - new Date(parkedAtIso).getTime()) / (1000 * 60)));
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    const remMins = minutes % 60;
    return `${hours}h ${remMins}m ago`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Block Selector Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-navy-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-3 border border-sky-400/30">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              LPU Design Thinking Prototype • INT335 P07
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Find two-wheeler parking spots near your lecture halls, reduce campus congestion, and effortlessly track your parked motorcycle or scooter.
            </p>
          </div>

          {/* Academic Block Quick Dropdown Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shrink-0 w-full lg:w-80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Target Destination
              </span>
              <span className="text-[10px] text-slate-300 font-mono">Academic Block</span>
            </div>
            <select
              value={selectedBlockId}
              onChange={(e) => selectBlock(e.target.value)}
              className="w-full bg-slate-900 text-white rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 border border-slate-700 cursor-pointer"
            >
              {academicBlocks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-300 mt-2 truncate">
              {selectedBlock.description}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Lots */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Campus Lots</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{parkingLots.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Designated 2-Wheeler Bays</p>
        </div>

        {/* Available Spaces */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Available Spaces</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">{totalAvailable}</p>
          <p className="text-[11px] text-emerald-600/80 mt-1 font-medium">Ready for immediate parking</p>
        </div>

        {/* Occupied Spaces */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Occupied Spaces</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">{totalOccupied}</p>
          <p className="text-[11px] text-slate-400 mt-1">Out of {totalCapacity} total capacity</p>
        </div>

        {/* Campus Occupancy Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-600 uppercase tracking-wide">Campus Occupancy</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{campusOccupancyRate}%</p>
            <span className="text-xs font-semibold text-slate-500">Occupied</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                campusOccupancyRate > 85 ? 'bg-red-500' : campusOccupancyRate > 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${campusOccupancyRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid (The 4 core features) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-sky-600" />
            Smart Parking Quick Actions
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">INT335 Student Features</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1: Find Parking */}
          <button
            onClick={() => onNavigate('find-parking')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-sky-500/50 transition-all text-left group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-600 transition-colors">
                1. Find Parking
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Discover vacant two-wheeler bays near {selectedBlock.code} with live distance and occupancy.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-sky-600 mt-4">
              Explore Available Lots <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 2: Save My Parking */}
          <button
            onClick={() => onNavigate('save-parking')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-emerald-500/50 transition-all text-left group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
                2. Save My Parking
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Record your bike or scooter registration, lot bay, section, slot, and quick visual notes.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-4">
              Record New Spot <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 3: Find My Vehicle */}
          <button
            onClick={() => onNavigate('find-vehicle')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-sky-500/50 transition-all text-left group flex flex-col justify-between relative overflow-hidden"
          >
            {savedParking && savedParking.isActive && (
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold animate-pulse">
                Active Pin
              </span>
            )}
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                3. Find My Vehicle
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Recall where you parked, view walking directions, share details, or release the slot.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 mt-4">
              Track Saved Location <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 4: View Parking Map */}
          <button
            onClick={() => onNavigate('parking-map')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-slate-800/50 transition-all text-left group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-slate-900 transition-colors">
                4. View Parking Map
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Full-screen campus map with color-coded markers (Green, Orange, Red) and navigation pins.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 mt-4">
              Open Interactive Map <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>
      </div>

      {/* Active Saved Vehicle Highlight Card (if user has active saved location) */}
      {savedParking && savedParking.isActive ? (
        <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50 rounded-2xl p-5 border border-sky-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-600/30">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-sky-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Active Vehicle Location
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {savedParking.regNumber}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Parked {getElapsedString(savedParking.parkedAt)}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {savedParking.lotName}
              </h3>
              <p className="text-xs text-slate-600">
                Section: <strong>{savedParking.section}</strong> • Slot: <strong className="text-sky-700 font-mono">{savedParking.slot}</strong> • {savedParking.floorZone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('find-vehicle')}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              View Location Details
            </button>
            <button
              onClick={() => onNavigate('parking-map')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              Show on Map
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-5 border border-dashed border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">No vehicle location currently recorded</p>
              <p className="text-[11px] text-slate-500">Parked your two-wheeler on campus today? Save your spot in 10 seconds.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('save-parking')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shrink-0 flex items-center justify-center gap-1"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-sky-400" />
            Save My Parking
          </button>
        </div>
      )}

      {/* Parking Availability Snapshot by Lot */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Parking Lots Proximity to {selectedBlock.name}
            </h3>
            <p className="text-xs text-slate-500">
              Live status and walking distance from your selected academic block.
            </p>
          </div>
          <button
            onClick={() => onNavigate('find-parking')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 self-start sm:self-auto"
          >
            View All Lots <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {parkingLots.slice(0, 6).map((lot) => {
            const distanceInfo = lot.distanceFromBlocks?.[selectedBlock.id] || { distanceMeters: 240, walkTimeMins: 3 };
            const occupancyPct = Math.round((lot.occupiedSpaces / lot.totalCapacity) * 100);

            return (
              <div
                key={lot.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-bold text-slate-800 text-xs truncate max-w-[170px]" title={lot.name}>
                      {lot.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lot.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : lot.status === 'Limited'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {lot.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-2 flex items-center gap-1 font-mono">
                    📍 {distanceInfo.distanceMeters}m (~{distanceInfo.walkTimeMins} min walk)
                  </p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Available:</span>
                      <strong className={`font-mono ${
                        lot.status === 'Available' ? 'text-emerald-700' : lot.status === 'Limited' ? 'text-amber-700' : 'text-red-700'
                      }`}>
                        {lot.availableSpaces} / {lot.totalCapacity}
                      </strong>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          lot.status === 'Available' ? 'bg-emerald-500' : lot.status === 'Limited' ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">{lot.code}</span>
                  <button
                    onClick={() => onNavigate('find-parking')}
                    className="text-[11px] text-sky-600 hover:text-sky-800 font-bold"
                  >
                    Select →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
