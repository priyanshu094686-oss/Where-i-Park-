import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Copy, 
  Check, 
  Trash2, 
  Clock, 
  Bike, 
  BookmarkCheck, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Footprints
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { storageService } from '../services/storageService';

interface FindVehicleProps {
  onNavigate: (page: string, state?: any) => void;
}

export const FindVehicle: React.FC<FindVehicleProps> = ({ onNavigate }) => {
  const { savedParking, parkingLots, selectedBlock } = useStorage();
  const [copied, setCopied] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Time calculations
  const getElapsedString = (parkedAtIso: string) => {
    const minutes = Math.max(1, Math.round((Date.now() - new Date(parkedAtIso).getTime()) / (1000 * 60)));
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remMins = minutes % 60;
    return `${hours} hr ${remMins} min`;
  };

  const handleCopyDetails = () => {
    if (!savedParking) return;
    const text = `Where Did I Park? (LPU INT335 P07)
Vehicle: ${savedParking.vehicleType} (${savedParking.regNumber})
Location: ${savedParking.lotName}
Section: ${savedParking.section} | Slot: ${savedParking.slot}
Floor/Zone: ${savedParking.floorZone}
Parked at: ${new Date(savedParking.parkedAt).toLocaleString()}
Notes: ${savedParking.notes || 'None'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    storageService.addNotification({
      title: 'Details Copied to Clipboard',
      message: `Parking details for ${savedParking.regNumber} copied.`,
      type: 'info',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDeleteLocation = () => {
    if (!savedParking) return;
    if (window.confirm('Do you want to release this parking spot and archive it to your parking history?')) {
      setIsDeleting(true);
      storageService.clearSavedParking(true);
      setIsDeleting(false);
    }
  };

  // If no vehicle is currently parked, show friendly empty state
  if (!savedParking || !savedParking.isActive) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-inner border border-sky-100">
          <Navigation className="w-12 h-12 text-sky-500" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
            Vehicle Locator
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
            No Saved Vehicle Location Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            You haven&apos;t marked where your motorcycle or scooter is parked yet. Save your spot now so you never lose your bike on campus!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('save-parking')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
          >
            <BookmarkCheck className="w-4 h-4" />
            Save My Parking Spot
          </button>
          <button
            onClick={() => onNavigate('find-parking')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 text-slate-500" />
            Find Available Parking
          </button>
        </div>

        <div className="pt-6 border-t border-slate-200/80 text-left bg-white rounded-2xl p-5 border shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Design Thinking Student Insight (LPU INT335 P07)
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Students waste an average of 8 to 15 minutes trying to locate their two-wheelers in crowded multi-level lots behind Block 25, 26, and 28. Saving your spot takes only 10 seconds and eliminates post-lecture parking stress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                Active Vehicle Pin
              </span>
              <span className="text-xs text-slate-400 font-mono">Live Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Find My Vehicle
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your registered two-wheeler location and walking navigation back to your parking bay.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteLocation}
              disabled={isDeleting}
              className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors flex items-center gap-1.5"
              title="Release parking spot"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              Release Spot
            </button>
          </div>
        </div>
      </div>

      {/* Main Vehicle Spot Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-lg shadow-sky-500/30 shrink-0">
              <Bike className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-wider bg-white/10 px-3 py-1 rounded-xl border border-white/20">
                  {savedParking.regNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-400/30">
                  {savedParking.vehicleType}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Parked on {new Date(savedParking.parkedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(savedParking.parkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({getElapsedString(savedParking.parkedAt)} ago)
              </p>
            </div>
          </div>

          {/* Slot Highlight Pill */}
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-sky-300 tracking-wider block">
              Assigned Slot
            </span>
            <span className="text-3xl font-extrabold font-mono text-white mt-0.5 block">
              {savedParking.slot}
            </span>
            <span className="text-xs text-slate-300 mt-0.5 block font-medium">
              Section {savedParking.section} • {savedParking.floorZone}
            </span>
          </div>
        </div>

        {/* Location Details & Landmark Note */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Parking Bay Location
            </span>
            <h4 className="text-base font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-400" />
              {savedParking.lotName}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Section <strong>{savedParking.section}</strong> • Level: <strong>{savedParking.floorZone}</strong>
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Landmark & Nearby Notes
            </span>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              &ldquo;{savedParking.notes || 'No specific notes entered. Check assigned section and slot number.'}&rdquo;
            </p>
          </div>
        </div>

        {/* Quick Action Bar inside Hero */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDetails}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/10"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
              {copied ? 'Copied Details!' : 'Copy Parking Details'}
            </button>

            <button
              onClick={() => setShowDirections(!showDirections)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Footprints className="w-4 h-4" />
              {showDirections ? 'Hide Walking Steps' : 'Navigate Back (Directions)'}
            </button>
          </div>

          <button
            onClick={() => onNavigate('parking-map')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-sky-600" />
            View Pin on Campus Map
          </button>
        </div>
      </div>

      {/* Simulated Turn-by-Turn Walking Directions */}
      {showDirections && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-sky-600" />
                Walking Route to Your Two-Wheeler
              </h3>
              <p className="text-xs text-slate-500">
                Starting from <strong>{selectedBlock.name}</strong> to <strong>{savedParking.lotName}</strong> (~180m • 2.5 mins walk)
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${savedParking.coordinates ? savedParking.coordinates.join(',') : '31.2530,75.7041'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              Open Live Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Exit your academic block towards the primary pedestrian corridor leading to the two-wheeler lot.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Follow the shaded pathway past the central water point towards <strong>{savedParking.lotName}</strong>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Enter via Gate A, proceed to <strong>Section {savedParking.section}</strong> on <strong>{savedParking.floorZone}</strong>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </div>
              <p className="text-xs text-emerald-800 font-semibold leading-relaxed">
                Arrived! Your vehicle is parked at <strong>Slot {savedParking.slot}</strong> ({savedParking.notes || 'beside pillar marker'}).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Campus Security Notice */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-800">Campus Security & Vehicle Safety Reminder</p>
          <p className="mt-0.5 leading-relaxed">
            Ensure your handle is locked and helmet is securely stowed in the rack or top box before leaving your spot. In case of any parking queries, contact LPU Security Control at ext. 7000.
          </p>
        </div>
      </div>

    </div>
  );
};
