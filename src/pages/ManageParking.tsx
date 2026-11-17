import React, { useState } from 'react';
import { 
  Settings2, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  MapPin, 
  Search, 
  PlusCircle, 
  MinusCircle,
  X,
  Save,
  Umbrella,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { storageService } from '../services/storageService';
import { ParkingLot, ParkingStatus } from '../types';

export const ManageParking: React.FC = () => {
  const { parkingLots, academicBlocks } = useStorage();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<ParkingLot | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [totalCapacity, setTotalCapacity] = useState(100);
  const [occupiedSpaces, setOccupiedSpaces] = useState(25);
  const [assignedBlocks, setAssignedBlocks] = useState<string[]>(['block-25']);
  const [sectionsStr, setSectionsStr] = useState('A, B, C, D');
  const [floorsStr, setFloorsStr] = useState('Ground Level, Upper Deck');
  const [isCovered, setIsCovered] = useState(true);
  const [hasCCTV, setHasCCTV] = useState(true);
  const [hasEVCharging, setHasEVCharging] = useState(false);
  const [description, setDescription] = useState('');

  const [formError, setFormError] = useState('');

  // Open Modal for New Lot
  const handleOpenAddModal = () => {
    setEditingLot(null);
    setName('');
    setCode(`TWB-${String.fromCharCode(65 + parkingLots.length)}`);
    setTotalCapacity(100);
    setOccupiedSpaces(10);
    setAssignedBlocks(['block-25']);
    setSectionsStr('A, B, C, D');
    setFloorsStr('Ground Level');
    setIsCovered(true);
    setHasCCTV(true);
    setHasEVCharging(false);
    setDescription('Two-wheeler parking bay for campus commuters.');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Modal for Editing Lot
  const handleOpenEditModal = (lot: ParkingLot) => {
    setEditingLot(lot);
    setName(lot.name);
    setCode(lot.code);
    setTotalCapacity(lot.totalCapacity);
    setOccupiedSpaces(lot.occupiedSpaces);
    setAssignedBlocks(lot.assignedBlocks || ['block-25']);
    setSectionsStr(lot.sections.join(', '));
    setFloorsStr(lot.floorOrZones.join(', '));
    setIsCovered(Boolean(lot.isCovered));
    setHasCCTV(Boolean(lot.hasCCTV));
    setHasEVCharging(Boolean(lot.hasEVCharging));
    setDescription(lot.description || '');
    setFormError('');
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Parking lot name is required.');
      return;
    }
    if (!code.trim()) {
      setFormError('Lot identifier code is required.');
      return;
    }
    if (totalCapacity < 1) {
      setFormError('Total capacity must be at least 1.');
      return;
    }
    if (occupiedSpaces > totalCapacity) {
      setFormError('Occupied spaces cannot exceed total capacity.');
      return;
    }

    const sections = sectionsStr.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    const floorOrZones = floorsStr.split(',').map(f => f.trim()).filter(Boolean);

    if (editingLot) {
      // Update existing
      storageService.updateParkingLot(editingLot.id, {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        totalCapacity,
        occupiedSpaces,
        assignedBlocks,
        sections: sections.length > 0 ? sections : ['A'],
        floorOrZones: floorOrZones.length > 0 ? floorOrZones : ['Ground Level'],
        isCovered,
        hasCCTV,
        hasEVCharging,
        description: description.trim(),
      });
    } else {
      // Create new lot
      storageService.addParkingLot({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        coordinates: [31.2530 + (Math.random() - 0.5) * 0.003, 75.7035 + (Math.random() - 0.5) * 0.003],
        totalCapacity,
        occupiedSpaces,
        availableSpaces: totalCapacity - occupiedSpaces,
        status: occupiedSpaces >= totalCapacity ? 'Full' : (occupiedSpaces / totalCapacity) >= 0.8 ? 'Limited' : 'Available',
        assignedBlocks,
        sections: sections.length > 0 ? sections : ['A'],
        floorOrZones: floorOrZones.length > 0 ? floorOrZones : ['Ground Level'],
        isCovered,
        hasCCTV,
        hasEVCharging,
        description: description.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, lotName: string) => {
    if (window.confirm(`Are you sure you want to delete parking lot "${lotName}"?`)) {
      storageService.deleteParkingLot(id);
    }
  };

  const handleAdjustOccupancy = (lotId: string, delta: number) => {
    storageService.adjustLotOccupancy(lotId, delta);
  };

  // Filter lots by search
  const filteredLots = parkingLots.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center gap-1">
                <Settings2 className="w-3.5 h-3.5 text-sky-400" />
                Admin CRUD Controls
              </span>
              <span className="text-xs text-slate-400 font-mono">Lot Inventory Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manage Parking Lots
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Add new two-wheeler bays, edit capacities, update occupied slots, and assign parking locations to academic blocks.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-md shadow-sky-600/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Parking Lot
          </button>
        </div>

        {/* Search */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter lots by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Total Facilities: {parkingLots.length}
          </span>
        </div>
      </div>

      {/* Parking Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 sm:px-6">Parking Lot</th>
                <th className="py-3.5 px-4 text-center">Capacity</th>
                <th className="py-3.5 px-4 text-center">Occupied</th>
                <th className="py-3.5 px-4 text-center">Available</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLots.map((lot) => {
                const occupancyPct = Math.round((lot.occupiedSpaces / lot.totalCapacity) * 100);

                return (
                  <tr key={lot.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Parking Lot Name & Code */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {lot.code.split('-')[1] || 'P'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {lot.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                              {lot.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-xs">
                            {lot.description}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                            <span>Sec: {lot.sections.join(', ')}</span>
                            <span>•</span>
                            <span>{lot.floorOrZones.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Total Capacity */}
                    <td className="py-4 px-4 text-center font-bold font-mono text-slate-800">
                      {lot.totalCapacity}
                    </td>

                    {/* Occupied with Quick +/- adjusters */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => handleAdjustOccupancy(lot.id, -1)}
                          disabled={lot.occupiedSpaces <= 0}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                          title="Free up 1 spot"
                        >
                          <MinusCircle className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold font-mono text-amber-700 text-xs w-8 text-center">
                          {lot.occupiedSpaces}
                        </span>
                        <button
                          onClick={() => handleAdjustOccupancy(lot.id, 1)}
                          disabled={lot.occupiedSpaces >= lot.totalCapacity}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                          title="Occupy 1 spot"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        {occupancyPct}% full
                      </div>
                    </td>

                    {/* Available Spaces */}
                    <td className="py-4 px-4 text-center font-bold font-mono text-emerald-600 text-sm">
                      {lot.availableSpaces}
                    </td>

                    {/* Current Status Badge */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          lot.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : lot.status === 'Limited'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {lot.status === 'Available' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {lot.status === 'Limited' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {lot.status === 'Full' && <XCircle className="w-3 h-3 text-red-600" />}
                        {lot.status}
                      </span>
                    </td>

                    {/* Actions: Edit, Delete */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(lot)}
                          className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="Edit parking lot details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lot.id, lot.name)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete parking lot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Parking Lot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingLot ? `Edit Parking Lot: ${editingLot.name}` : 'Add New Campus Parking Lot'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure capacity, zone sections, and assigned university academic blocks.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lot Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Block 28 Two-Wheeler Bay"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lot Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. TWB-G"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Total Capacity (Slots)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={totalCapacity}
                    onChange={(e) => setTotalCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Occupied Slots
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={totalCapacity}
                    value={occupiedSpaces}
                    onChange={(e) => setOccupiedSpaces(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Academic Blocks
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {academicBlocks.map((block) => {
                    const isChecked = assignedBlocks.includes(block.id);
                    return (
                      <label key={block.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignedBlocks([...assignedBlocks, block.id]);
                            } else {
                              setAssignedBlocks(assignedBlocks.filter(id => id !== block.id));
                            }
                          }}
                          className="rounded text-sky-600 focus:ring-sky-500"
                        />
                        <span className="truncate">{block.code} ({block.name.split(' ')[0]})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sections (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={sectionsStr}
                    onChange={(e) => setSectionsStr(e.target.value)}
                    placeholder="A, B, C, D"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Floors / Zones (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={floorsStr}
                    onChange={(e) => setFloorsStr(e.target.value)}
                    placeholder="Ground Level, Upper Deck"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Amenity Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Amenities & Facilities
                </label>
                <div className="flex flex-wrap gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={isCovered}
                      onChange={(e) => setIsCovered(e.target.checked)}
                      className="rounded text-sky-600"
                    />
                    <span>Covered Roofing</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={hasCCTV}
                      onChange={(e) => setHasCCTV(e.target.checked)}
                      className="rounded text-sky-600"
                    />
                    <span>24/7 CCTV Surveillance</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={hasEVCharging}
                      onChange={(e) => setHasEVCharging(e.target.checked)}
                      className="rounded text-sky-600"
                    />
                    <span>EV Fast Charging</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description & Directions
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Shaded bays near the university lawn with direct access to Block 28."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {editingLot ? 'Save Changes' : 'Create Parking Lot'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
