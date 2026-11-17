import React, { useState, useEffect } from 'react';
import { 
  BookmarkCheck, 
  Bike, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  Compass
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { storageService } from '../services/storageService';
import { VehicleType, ParkingLot } from '../types';

interface SaveParkingProps {
  onNavigate: (page: string, state?: any) => void;
  preselectedLotId?: string | null;
}

export const SaveParking: React.FC<SaveParkingProps> = ({ onNavigate, preselectedLotId }) => {
  const { profile, parkingLots, savedParking } = useStorage();

  // Form State
  const [vehicleType, setVehicleType] = useState<VehicleType>(profile.defaultVehicleType || 'Motorcycle');
  const [regNumber, setRegNumber] = useState<string>(profile.defaultVehicleNumber || 'PB10AB1234');
  const [lotId, setLotId] = useState<string>(preselectedLotId || parkingLots[0]?.id || 'lot-a');
  const [section, setSection] = useState<string>('B');
  const [floorZone, setFloorZone] = useState<string>('Ground Level');
  const [slot, setSlot] = useState<string>('B-12');
  const [notes, setNotes] = useState<string>('Parked beside pillar B12 near the water cooler and helmet locker.');
  
  // Validation and Status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Selected Parking Lot Object
  const selectedLot = parkingLots.find(l => l.id === lotId) || parkingLots[0];

  // Update sections when lot changes
  useEffect(() => {
    if (selectedLot) {
      if (selectedLot.sections && selectedLot.sections.length > 0) {
        setSection(selectedLot.sections[0]);
      }
      if (selectedLot.floorOrZones && selectedLot.floorOrZones.length > 0) {
        setFloorZone(selectedLot.floorOrZones[0]);
      }
    }
  }, [lotId]);

  // Update default slot suggestion when section changes
  useEffect(() => {
    const randomNum = Math.floor(Math.random() * 25) + 1;
    const formattedNum = randomNum < 10 ? `0${randomNum}` : `${randomNum}`;
    setSlot(`${section}-${formattedNum}`);
  }, [section]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!regNumber.trim()) {
      newErrors.regNumber = 'Vehicle registration number is required (e.g. PB10AB1234)';
    } else if (regNumber.trim().length < 4) {
      newErrors.regNumber = 'Please enter a valid registration number';
    }

    if (!lotId) {
      newErrors.lotId = 'Please select a parking lot';
    }

    if (!section.trim()) {
      newErrors.section = 'Parking section is required';
    }

    if (!slot.trim()) {
      newErrors.slot = 'Slot identifier is required (e.g. B-12)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const savedRecord = storageService.saveParkingLocation({
        userId: profile.id,
        vehicleType,
        regNumber: regNumber.toUpperCase().trim(),
        lotId: selectedLot.id,
        lotName: selectedLot.name,
        section: section.toUpperCase(),
        slot: slot.toUpperCase().trim(),
        floorZone,
        notes: notes.trim(),
        parkedAt: new Date().toISOString(),
        coordinates: selectedLot.coordinates,
      });

      setIsSubmitting(false);
      setSaveSuccess(true);

      // Auto redirect to Find Vehicle page after 1.5s
      setTimeout(() => {
        onNavigate('find-vehicle');
      }, 1400);
    }, 400);
  };

  const handleUsePreset = (reg: string, type: VehicleType) => {
    setRegNumber(reg);
    setVehicleType(type);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
            Spot Recording Form
          </span>
          <span className="text-xs text-slate-400 font-mono">Student & Staff Feature</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Save My Parking Location
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          Record your two-wheeler parking spot immediately upon arrival at LPU campus. You can recall the location anytime from &ldquo;Find My Vehicle&rdquo;.
        </p>
      </div>

      {/* Success Alert Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-emerald-800 flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Parking Spot Successfully Saved!</h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                Vehicle {regNumber} registered at {selectedLot.name}, Slot {slot}. Redirecting to vehicle locator...
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('find-vehicle')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            Find My Vehicle →
          </button>
        </div>
      )}

      {/* Main Save Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        
        {/* Step 1: Vehicle Type Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            1. Select Two-Wheeler Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['Motorcycle', 'Scooter', 'Electric Bike', 'Bicycle'] as VehicleType[]).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setVehicleType(type)}
                className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  vehicleType === type
                    ? 'border-sky-500 bg-sky-50/80 text-sky-800 ring-2 ring-sky-500/20 font-bold shadow-sm'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white text-slate-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  vehicleType === type ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  <Bike className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Vehicle Registration Number */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Vehicle Registration Number
            </label>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>Quick Presets:</span>
              <button
                type="button"
                onClick={() => handleUsePreset('PB10AB1234', 'Motorcycle')}
                className="text-sky-600 hover:underline font-mono"
              >
                PB10AB1234
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleUsePreset('PB08CD5678', 'Scooter')}
                className="text-sky-600 hover:underline font-mono"
              >
                PB08CD5678
              </button>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. PB10AB1234"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm font-mono font-bold uppercase tracking-wider text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all ${
                errors.regNumber ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
              }`}
            />
            <div className="absolute right-3 top-3 text-xs text-slate-400 font-medium">
              IND 🇮🇳
            </div>
          </div>
          {errors.regNumber && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.regNumber}
            </p>
          )}
        </div>

        {/* Step 3: Parking Lot Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            3. Select Parking Lot Bay
          </label>
          <select
            value={lotId}
            onChange={(e) => setLotId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500 shadow-sm cursor-pointer"
          >
            {parkingLots.map((lot) => (
              <option key={lot.id} value={lot.id}>
                {lot.name} ({lot.code}) — {lot.availableSpaces} available spots ({lot.status})
              </option>
            ))}
          </select>
          {selectedLot && (
            <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                {selectedLot.description}
              </span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                selectedLot.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {selectedLot.status}
              </span>
            </div>
          )}
        </div>

        {/* Step 4: Section, Floor/Zone and Slot Number Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              4. Section
            </label>
            <div className="flex gap-2">
              {(selectedLot.sections || ['A', 'B', 'C', 'D']).map((sec) => (
                <button
                  type="button"
                  key={sec}
                  onClick={() => setSection(sec)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    section === sec
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Sec {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Floor / Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              5. Floor / Zone
            </label>
            <select
              value={floorZone}
              onChange={(e) => setFloorZone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {(selectedLot.floorOrZones || ['Ground Level', 'Upper Deck', 'Zone 1']).map((fz) => (
                <option key={fz} value={fz}>{fz}</option>
              ))}
            </select>
          </div>

          {/* Slot Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              6. Slot Identifier
            </label>
            <input
              type="text"
              placeholder="e.g. B-12"
              value={slot}
              onChange={(e) => setSlot(e.target.value.toUpperCase())}
              className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono font-bold uppercase text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500 ${
                errors.slot ? 'border-red-400' : 'border-slate-200'
              }`}
            />
          </div>

        </div>

        {/* Step 5: Visual Slot Helper Buttons */}
        <div>
          <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
            Quick Slot Picker (Section {section}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 5, 8, 12, 14, 18, 22, 25].map((num) => {
              const formatted = `${section}-${num < 10 ? '0' + num : num}`;
              return (
                <button
                  type="button"
                  key={formatted}
                  onClick={() => setSlot(formatted)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors ${
                    slot === formatted
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {formatted}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 6: Parking Note / Landmark */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              7. Parking Note or Nearby Landmark (Optional)
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Helps you spot your bike</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Parked near tree #3, adjacent to the staircase pillar B-12, black helmet kept in side basket."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all"
          />
        </div>

        {/* Summary Preview Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
              Summary Preview
            </span>
            <h4 className="text-sm font-bold mt-0.5">
              {regNumber || 'VEHICLE'} • {vehicleType}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {selectedLot.name} | Sec <strong>{section}</strong> • Slot <strong>{slot}</strong>
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <BookmarkCheck className="w-4 h-4" />
            {isSubmitting ? 'Recording Spot...' : 'Save My Parking'}
          </button>
        </div>

      </form>

    </div>
  );
};
