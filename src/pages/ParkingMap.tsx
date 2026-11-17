import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Compass, 
  Navigation, 
  BookmarkCheck, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Bike
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { CampusMap } from '../components/map/CampusMap';
import { ParkingLot } from '../types';

interface ParkingMapPageProps {
  onNavigate: (page: string, state?: any) => void;
}

export const ParkingMapPage: React.FC<ParkingMapPageProps> = ({ onNavigate }) => {
  const { academicBlocks, selectedBlockId, selectedBlock, selectBlock, parkingLots, savedParking } = useStorage();
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);

  const handleSelectLot = (lot: ParkingLot) => {
    setSelectedLot(lot);
  };

  const handleSaveParkingAtLot = (lot: ParkingLot) => {
    onNavigate('save-parking', { preselectedLotId: lot.id });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Block Switcher */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                Leaflet & OpenStreetMap
              </span>
              <span className="text-xs text-slate-400 font-mono">Interactive GIS Prototype</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Interactive Campus Parking Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Explore real-time two-wheeler parking lot occupancies across Lovely Professional University. Click any marker to view capacity, distance from your academic block, and walking routes.
            </p>
          </div>

          {/* Academic Block Quick Selector */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shrink-0 w-full sm:w-80">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Reference Academic Block:
            </label>
            <select
              value={selectedBlockId}
              onChange={(e) => {
                selectBlock(e.target.value);
                setSelectedLot(null);
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              {academicBlocks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Map Component */}
      <div className="relative">
        <CampusMap
          lots={parkingLots}
          selectedBlock={selectedBlock}
          savedParking={savedParking}
          selectedLotId={selectedLot?.id}
          onSelectLot={handleSelectLot}
          height="620px"
        />
      </div>

      {/* Selected Lot Detail Card (when user clicks a marker) */}
      {selectedLot && (
        <div className="bg-white rounded-3xl p-6 border border-sky-500/30 shadow-card animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {selectedLot.code}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    selectedLot.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedLot.status === 'Limited'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedLot.status}
                </span>
                <span className="text-xs text-slate-500">
                  📍 {selectedLot.distanceFromBlocks?.[selectedBlockId]?.distanceMeters || 220}m from {selectedBlock.code}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {selectedLot.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                {selectedLot.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleSaveParkingAtLot(selectedLot)}
                disabled={selectedLot.status === 'Full'}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                  selectedLot.status === 'Full'
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                Save My Parking Here
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLot.coordinates[0]},${selectedLot.coordinates[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                Navigate in Google Maps
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend & Prototype Info */}
      <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600">
        <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          University Project Notice • INT335 Design Thinking
        </h4>
        <p className="leading-relaxed">
          The coordinates above represent simulated campus demonstration markers for Lovely Professional University, Phagwara, Punjab. In production deployment, these marker anchors can be bound directly to verified GPS coordinates and physical IoT magnetic loop / ultrasonic sensors installed at each two-wheeler bay.
        </p>
      </div>

    </div>
  );
};
