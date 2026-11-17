import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  BookmarkCheck, 
  SlidersHorizontal, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Zap, 
  ShieldCheck, 
  Umbrella, 
  Clock, 
  ExternalLink,
  Compass,
  ChevronRight,
  Info
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { ParkingLot, FilterOption, SortOption } from '../types';
import { CampusMap } from '../components/map/CampusMap';

interface FindParkingProps {
  onNavigate: (page: string, state?: any) => void;
  onSelectLotToSave?: (lotId: string) => void;
}

export const FindParking: React.FC<FindParkingProps> = ({ onNavigate, onSelectLotToSave }) => {
  const { academicBlocks, selectedBlockId, selectedBlock, selectBlock, parkingLots, savedParking } = useStorage();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [sortOption, setSortOption] = useState<SortOption>('distance');
  const [selectedLotForGuidance, setSelectedLotForGuidance] = useState<ParkingLot | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  // Filter & Sort Logic
  const processedLots = useMemo(() => {
    let result = [...parkingLots];

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        lot => lot.name.toLowerCase().includes(q) || 
               lot.code.toLowerCase().includes(q) || 
               lot.description?.toLowerCase().includes(q)
      );
    }

    // 2. Status / Feature Filtering
    if (filterOption === 'available') {
      result = result.filter(l => l.status === 'Available');
    } else if (filterOption === 'limited') {
      result = result.filter(l => l.status === 'Limited');
    } else if (filterOption === 'full') {
      result = result.filter(l => l.status === 'Full');
    } else if (filterOption === 'nearest') {
      result = result.filter(l => {
        const d = l.distanceFromBlocks?.[selectedBlockId]?.distanceMeters || 999;
        return d <= 250;
      });
    } else if (filterOption === 'less_crowded') {
      result = result.filter(l => (l.occupiedSpaces / l.totalCapacity) < 0.6);
    }

    // 3. Sorting
    result.sort((a, b) => {
      const distA = a.distanceFromBlocks?.[selectedBlockId]?.distanceMeters ?? 999;
      const distB = b.distanceFromBlocks?.[selectedBlockId]?.distanceMeters ?? 999;
      const occRateA = (a.occupiedSpaces / a.totalCapacity);
      const occRateB = (b.occupiedSpaces / b.totalCapacity);

      if (sortOption === 'distance') {
        return distA - distB;
      } else if (sortOption === 'available_desc') {
        return b.availableSpaces - a.availableSpaces;
      } else if (sortOption === 'occupancy_asc') {
        return occRateA - occRateB;
      } else if (sortOption === 'capacity_desc') {
        return b.totalCapacity - a.totalCapacity;
      }
      return 0;
    });

    return result;
  }, [parkingLots, searchQuery, filterOption, sortOption, selectedBlockId]);

  const handleSelectLot = (lot: ParkingLot) => {
    setSelectedLotForGuidance(lot);
  };

  const handleSaveThisParking = (lot: ParkingLot) => {
    if (onSelectLotToSave) {
      onSelectLotToSave(lot.id);
    }
    onNavigate('save-parking', { preselectedLotId: lot.id });
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Destination Academic Block Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200">
                Core Feature
              </span>
              <span className="text-xs text-slate-500 font-mono">INT335 Design Thinking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Find Two-Wheeler Parking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Select your academic block destination to find the closest available motorcycle or scooter bays, real-time vacancies, and walking distances.
            </p>
          </div>

          {/* Academic Block Dropdown Selector */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0 w-full lg:w-96">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-600" />
                Select Academic Block
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Demo Location</span>
            </label>
            <select
              value={selectedBlockId}
              onChange={(e) => {
                selectBlock(e.target.value);
                setSelectedLotForGuidance(null);
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm cursor-pointer"
            >
              {academicBlocks.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1 truncate">
              <Info className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              {selectedBlock.description}
            </p>
          </div>
        </div>

        {/* Search, Filter Tabs and Sort Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search parking lots by name, bay code, or amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
            <button
              onClick={() => setFilterOption('all')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterOption === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({parkingLots.length})
            </button>
            <button
              onClick={() => setFilterOption('available')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterOption === 'available'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setFilterOption('limited')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterOption === 'limited'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Limited
            </button>
            <button
              onClick={() => setFilterOption('nearest')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterOption === 'nearest'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
              }`}
            >
              Nearest (&lt;250m)
            </button>
            <button
              onClick={() => setFilterOption('less_crowded')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterOption === 'less_crowded'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Low Occupancy
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="distance">Sort: Nearest Distance</option>
              <option value="available_desc">Sort: Most Available Spaces</option>
              <option value="occupancy_asc">Sort: Lowest Occupancy %</option>
              <option value="capacity_desc">Sort: Highest Capacity</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Grid: Parking Lot Cards & Selected Guidance Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lots List (2 cols on large screens) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing <strong>{processedLots.length}</strong> matching parking locations</span>
            <span className="font-mono">Reference Block: {selectedBlock.code}</span>
          </div>

          {processedLots.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-card">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No matching parking bays found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try loosening your filters or selecting a different academic block.
              </p>
              <button
                onClick={() => {
                  setFilterOption('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            processedLots.map((lot) => {
              const distanceInfo = lot.distanceFromBlocks?.[selectedBlockId] || { distanceMeters: 300, walkTimeMins: 4 };
              const occupancyPct = Math.round((lot.occupiedSpaces / lot.totalCapacity) * 100);
              const isSelected = selectedLotForGuidance?.id === lot.id;

              return (
                <div
                  key={lot.id}
                  className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-card ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-card-hover'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-card-hover'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-base">
                          {lot.name}
                        </span>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {lot.code}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            lot.status === 'Available'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : lot.status === 'Limited'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {lot.status === 'Available' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {lot.status === 'Limited' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                          {lot.status === 'Full' && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                          {lot.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-sky-600" />
                          {distanceInfo.distanceMeters} meters away
                        </span>
                        <span>•</span>
                        <span className="text-slate-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          ~{distanceInfo.walkTimeMins} min walk from {selectedBlock.code}
                        </span>
                      </p>
                    </div>

                    {/* Quick Capacity Numbers */}
                    <div className="sm:text-right shrink-0">
                      <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-2">
                        <span className="text-xs text-slate-500">Available:</span>
                        <span className={`text-xl font-extrabold font-mono ${
                          lot.status === 'Available' ? 'text-emerald-600' : lot.status === 'Limited' ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {lot.availableSpaces} <span className="text-xs font-normal text-slate-400">/ {lot.totalCapacity}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="mt-3.5">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500 font-medium">Occupancy Rate: {occupancyPct}%</span>
                      <span className="text-slate-500 font-mono">{lot.occupiedSpaces} parked</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          lot.status === 'Available'
                            ? 'bg-emerald-500'
                            : lot.status === 'Limited'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Amenities and Details */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11px]">
                    {lot.isCovered && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        <Umbrella className="w-3 h-3 text-sky-600" /> Covered Roofing
                      </span>
                    )}
                    {lot.hasCCTV && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> 24/7 CCTV
                      </span>
                    )}
                    {lot.hasEVCharging && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Zap className="w-3 h-3 text-emerald-600" /> EV Charging Bay
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-500">
                      Sections: {lot.sections.join(', ')}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => handleSelectLot(lot)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5 text-sky-600" />
                      {isSelected ? 'Guidance Active' : 'Select Lot Guidance'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedLotForGuidance(lot);
                          setShowMapModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-sky-600" />
                        Map View
                      </button>

                      <button
                        onClick={() => handleSaveThisParking(lot)}
                        disabled={lot.status === 'Full'}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-sm ${
                          lot.status === 'Full'
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                        }`}
                      >
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        Save This Parking
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Sidebar: Active Parking Guidance Box */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-sky-600" />
                Selected Lot Guidance
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-mono font-semibold">
                Interactive
              </span>
            </div>

            {selectedLotForGuidance ? (
              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">{selectedLotForGuidance.code}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedLotForGuidance.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedLotForGuidance.status === 'Limited'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedLotForGuidance.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedLotForGuidance.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {selectedLotForGuidance.description}
                  </p>
                </div>

                {/* Walking Metric Card */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Destination:</span>
                    <strong className="text-slate-800">{selectedBlock.name}</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Walking Distance:</span>
                    <strong className="text-sky-700 font-mono">
                      {selectedLotForGuidance.distanceFromBlocks?.[selectedBlockId]?.distanceMeters || 220} meters
                    </strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Estimated Walking Time:</span>
                    <strong className="text-slate-800">
                      ~{selectedLotForGuidance.distanceFromBlocks?.[selectedBlockId]?.walkTimeMins || 2.5} mins
                    </strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Vacant Slots:</span>
                    <strong className="text-emerald-700 font-mono">
                      {selectedLotForGuidance.availableSpaces} open spots
                    </strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleSaveThisParking(selectedLotForGuidance)}
                    disabled={selectedLotForGuidance.status === 'Full'}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                      selectedLotForGuidance.status === 'Full'
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                    }`}
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    Save Spot at {selectedLotForGuidance.code}
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLotForGuidance.coordinates[0]},${selectedLotForGuidance.coordinates[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    Open Route in Google Maps
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
                  <Compass className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">No lot selected yet</h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto">
                  Click &ldquo;Select Lot Guidance&rdquo; on any parking card to view walking metrics and guidance.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Map Modal */}
      {showMapModal && selectedLotForGuidance && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {selectedLotForGuidance.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Proximity view from {selectedBlock.name}
                </p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <CampusMap
                lots={parkingLots}
                selectedBlock={selectedBlock}
                savedParking={savedParking}
                selectedLotId={selectedLotForGuidance.id}
                height="450px"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
