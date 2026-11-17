import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Settings2, 
  PlusCircle, 
  BarChart3, 
  MapPin, 
  ArrowUpRight,
  Sparkles,
  Bike
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { useStorage } from '../hooks/useStorage';
import { 
  HOURLY_OCCUPANCY_DATA, 
  VEHICLE_DISTRIBUTION_DATA, 
  DAILY_USAGE_DATA 
} from '../data/mockData';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { parkingLots, profile, switchRole } = useStorage();

  const totalLots = parkingLots.length;
  const totalCapacity = parkingLots.reduce((acc, lot) => acc + lot.totalCapacity, 0);
  const totalOccupied = parkingLots.reduce((acc, lot) => acc + lot.occupiedSpaces, 0);
  const totalAvailable = parkingLots.reduce((acc, lot) => acc + lot.availableSpaces, 0);
  const overallOccupancyPct = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  // Comparison data for bar chart
  const lotComparisonData = parkingLots.map(lot => ({
    name: lot.code,
    fullName: lot.name,
    occupied: lot.occupiedSpaces,
    available: lot.availableSpaces,
    capacity: lot.totalCapacity,
  }));

  return (
    <div className="space-y-6">
      
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Campus Security & Traffic Control • Admin Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Two-Wheeler Parking Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Real-time monitoring of campus parking bay capacities, lot statuses, live vehicle turnover, and IoT occupancy simulations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('manage-parking')}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <Settings2 className="w-4 h-4" />
              Manage Parking Lots
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4 text-sky-400" />
              Detailed Analytics
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Lots */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Lots</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalLots}</p>
          <p className="text-[11px] text-slate-400 mt-1">Campus 2-Wheeler Bays</p>
        </div>

        {/* Total Capacity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Capacity</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalCapacity}</p>
          <p className="text-[11px] text-slate-400 mt-1">Total Dedicated Slots</p>
        </div>

        {/* Total Occupied */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Occupied Spaces</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">{totalOccupied}</p>
          <p className="text-[11px] text-amber-700/80 mt-1">Vehicles Currently Parked</p>
        </div>

        {/* Total Available */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Available Spaces</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">{totalAvailable}</p>
          <p className="text-[11px] text-emerald-700/80 mt-1">Vacant Parking Spots</p>
        </div>

        {/* Overall Occupancy Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card col-span-2 lg:col-span-1">
          <span className="text-xs font-semibold text-sky-600 uppercase tracking-wide">Campus Occupancy</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-sky-700 mt-2">{overallOccupancyPct}%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                overallOccupancyPct > 85 ? 'bg-red-500' : overallOccupancyPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${overallOccupancyPct}%` }}
            />
          </div>
        </div>

      </div>

      {/* Charts Section: Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Trend (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Campus Two-Wheeler Occupancy Trends (Hourly)
              </h3>
              <p className="text-xs text-slate-500">
                Simulated peak parking curve across morning and afternoon lecture shifts.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Simulated Data
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_OCCUPANCY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOccupied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '0.75rem',
                    border: 'none',
                    color: 'white',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="occupied" name="Occupied Slots" stroke="#0284C7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOccupied)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Distribution Pie Chart (1 col) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Vehicle Type Distribution
              </h3>
              <span className="text-[10px] font-mono bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-semibold">
                Campus Fleet
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown of registered student & staff two-wheelers.
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={VEHICLE_DISTRIBUTION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {VEHICLE_DISTRIBUTION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '0.5rem',
                      border: 'none',
                      color: 'white',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {VEHICLE_DISTRIBUTION_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold font-mono text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Parking Lot Comparison Chart */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Parking Bay Comparison (Available vs Occupied)
            </h3>
            <p className="text-xs text-slate-500">
              Live capacity breakdown per parking facility.
            </p>
          </div>
          <button
            onClick={() => onNavigate('manage-parking')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
          >
            Manage Lots <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lotComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '0.75rem',
                  border: 'none',
                  color: 'white',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="occupied" name="Occupied Slots" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="available" name="Available Slots" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Access to Lot Management Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-base">
            Parking Lot Administration Controls
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Create new campus lots, calibrate occupancy sensor feeds, adjust capacities, or re-assign zones to academic blocks.
          </p>
        </div>
        <button
          onClick={() => onNavigate('manage-parking')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0 flex items-center justify-center gap-2"
        >
          <Settings2 className="w-4 h-4 text-sky-400" />
          Open Full CRUD Manager
        </button>
      </div>

    </div>
  );
};
