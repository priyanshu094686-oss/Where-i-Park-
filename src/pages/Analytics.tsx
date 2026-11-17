import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
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

export const AnalyticsPage: React.FC = () => {
  const { parkingLots } = useStorage();

  const totalCapacity = parkingLots.reduce((acc, lot) => acc + lot.totalCapacity, 0);
  const totalOccupied = parkingLots.reduce((acc, lot) => acc + lot.occupiedSpaces, 0);

  const lotBreakdownData = parkingLots.map(lot => ({
    name: lot.code,
    fullName: lot.name,
    capacity: lot.totalCapacity,
    occupied: lot.occupiedSpaces,
    occupancyPct: Math.round((lot.occupiedSpaces / lot.totalCapacity) * 100),
  }));

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            Statistical Intelligence
          </span>
          <span className="text-xs text-slate-400 font-mono">Recharts Campus Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Campus Parking Analytics & Congestion Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Comprehensive simulated telemetry on peak student arrival curves, lot turnover rates, block-wise congestion hotspots, and two-wheeler fleet compositions.
        </p>
      </div>

      {/* Simulated Analytics Disclaimer Notice */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Demonstration Analytics Data:</span> All occupancy numbers, hourly curves, and weekly turnover graphs shown here are simulated data created for Lovely Professional University INT335 Design Thinking academic evaluation.
        </div>
      </div>

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Peak Rush Hour</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">10:30 AM - 1:00 PM</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Morning lecture start period</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Avg Search Time</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">~2.8 mins</p>
          <p className="text-[11px] text-emerald-700/80 mt-0.5">Reduced from 12 mins without app</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Daily Check-ins</span>
          <p className="text-2xl font-extrabold text-sky-600 mt-1">~875 / day</p>
          <p className="text-[11px] text-sky-700/80 mt-0.5">Estimated campus commuters</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Highest Demand Block</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">Block 25 & 26</p>
          <p className="text-[11px] text-amber-700/80 mt-0.5">Computer Science & Engg Bay</p>
        </div>
      </div>

      {/* Chart Row 1: Hourly Occupancy Trend & Daily Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hourly Occupancy Area Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Hourly Occupancy Curve (Campus-Wide)
              </h3>
              <p className="text-xs text-slate-500">
                Number of two-wheelers parked throughout the day.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold">
              Live Simulation
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_OCCUPANCY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="occupied" name="Occupied Slots" stroke="#0284C7" strokeWidth={2.5} fill="url(#areaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Turnover Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Daily Vehicle Traffic Volume (Mon - Sat)
              </h3>
              <p className="text-xs text-slate-500">
                Total two-wheeler entries and departures per day.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
              Weekly Aggregate
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_USAGE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
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
                <Bar dataKey="entries" name="Daily Check-ins" fill="#0F172A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Chart Row 2: Lot Occupancy Rates & Fleet Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lot Occupancy Percentage (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Current Lot Congestion Pressure (%)
              </h3>
              <p className="text-xs text-slate-500">
                Comparison of occupancy load percentage across individual campus facilities.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lotBreakdownData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} unit="%" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#0F172A', fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '0.75rem',
                    border: 'none',
                    color: 'white',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Occupancy Rate']}
                />
                <Bar dataKey="occupancyPct" name="Occupancy %" fill="#0284C7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Composition Pie (1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Commuter Two-Wheeler Categories
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Vehicle technology distribution.
            </p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={VEHICLE_DISTRIBUTION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
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
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold font-mono text-slate-800">{item.value} units</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
