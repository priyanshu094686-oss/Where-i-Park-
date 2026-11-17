import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Calendar, 
  Clock, 
  Bike, 
  MapPin, 
  FileText, 
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { storageService } from '../services/storageService';

export const ParkingHistoryPage: React.FC = () => {
  const { parkingHistory } = useStorage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredHistory = useMemo(() => {
    return parkingHistory.filter((item) => {
      const matchesSearch = 
        item.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slot.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = filterType === 'all' || item.vehicleType === filterType;

      return matchesSearch && matchesType;
    });
  }, [parkingHistory, searchQuery, filterType]);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this parking record from history?')) {
      storageService.deleteHistoryItem(id);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all your past parking records? This cannot be undone.')) {
      storageService.clearAllHistory();
    }
  };

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} mins`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hrs}h ${rem > 0 ? rem + 'm' : ''}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-slate-600" />
                Activity Archive
              </span>
              <span className="text-xs text-slate-400 font-mono">Personal Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Parking Activity History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Review and manage your past campus two-wheeler parking sessions, locations, and durations.
            </p>
          </div>

          {parkingHistory.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors border border-red-200 self-start sm:self-auto flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All History
            </button>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by vehicle reg, lot, slot, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            {['all', 'Motorcycle', 'Scooter', 'Electric Bike', 'Bicycle'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                  filterType === type
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'All Vehicles' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-card">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No parking history records found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery ? 'No records match your active search filters.' : 'When you park your vehicle and release the spot, your records will appear here.'}
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold shrink-0">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {item.regNumber}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {item.vehicleType}
                    </span>
                    <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      Slot {item.slot} (Sec {item.section})
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    {item.lotName}
                  </h3>

                  {item.notes && (
                    <p className="text-xs text-slate-500 mt-1 italic">
                      &ldquo;{item.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Timestamp & Duration and Delete */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <p className="text-xs font-semibold text-slate-800 flex items-center md:justify-end gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {new Date(item.parkedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center md:justify-end gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(item.parkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Duration: <strong className="text-slate-700">{formatDuration(item.durationMinutes)}</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
