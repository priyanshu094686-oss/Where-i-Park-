import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Bike, 
  ShieldCheck, 
  GraduationCap, 
  RotateCcw, 
  Check, 
  Save, 
  Sparkles, 
  Users, 
  LogOut,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { storageService } from '../services/storageService';
import { TEAM_MEMBERS } from '../data/mockData';
import { VehicleType, UserRole } from '../types';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { profile, role, switchRole } = useStorage();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [regNumber, setRegNumber] = useState(profile.regNumber);
  const [department, setDepartment] = useState(profile.department);
  const [defaultVehicleType, setDefaultVehicleType] = useState<VehicleType>(profile.defaultVehicleType);
  const [defaultVehicleNumber, setDefaultVehicleNumber] = useState(profile.defaultVehicleNumber);
  const [phone, setPhone] = useState(profile.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateUserProfile({
      name,
      email,
      regNumber,
      department,
      defaultVehicleType,
      defaultVehicleNumber: defaultVehicleNumber.toUpperCase(),
      phone,
    });
    setSavedSuccess(true);
    storageService.addNotification({
      title: 'Profile Updated',
      message: 'Your profile and vehicle preferences have been saved.',
      type: 'success',
    });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demonstration data to project defaults?')) {
      storageService.resetToDefaults();
      onNavigate(role === 'admin' ? 'admin-dashboard' : 'dashboard');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-sky-700 text-white font-extrabold text-2xl flex items-center justify-center ring-4 ring-sky-100 shadow-md">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {profile.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  role === 'admin'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-sky-100 text-sky-800 border border-sky-200'
                }`}>
                  {role === 'admin' ? 'Campus Admin' : 'Student / Staff'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                ID / Reg: {profile.regNumber} • {profile.department}
              </p>
            </div>
          </div>

          {/* Quick Demo Switcher */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => switchRole(role === 'admin' ? 'student' : 'admin')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              {role === 'admin' ? <GraduationCap className="w-4 h-4 text-sky-400" /> : <ShieldCheck className="w-4 h-4 text-amber-400" />}
              Switch to {role === 'admin' ? 'Student View' : 'Admin View'}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Personal & Vehicle Information
            </h2>
            <p className="text-xs text-slate-500">
              Update your registered two-wheeler details used for quick parking autofills.
            </p>
          </div>

          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
              <Check className="w-4 h-4" /> Changes Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Student / Staff Registration Number
            </label>
            <input
              type="text"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              School / Academic Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Vehicle Preferences Section */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Default Two-Wheeler Setup
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-medium">
                Default Vehicle Type
              </label>
              <select
                value={defaultVehicleType}
                onChange={(e) => setDefaultVehicleType(e.target.value as VehicleType)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="Motorcycle">Motorcycle (Geared)</option>
                <option value="Scooter">Scooter (Gearless)</option>
                <option value="Electric Bike">Electric Bike (EV)</option>
                <option value="Bicycle">Bicycle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1 font-medium">
                Default Registration Plate Number
              </label>
              <input
                type="text"
                value={defaultVehicleNumber}
                onChange={(e) => setDefaultVehicleNumber(e.target.value.toUpperCase())}
                placeholder="e.g. PB10AB1234"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-sky-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Profile Changes
          </button>
        </div>

      </form>

      {/* University Project Team Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Design Thinking Project Team
              </h3>
              <p className="text-xs text-slate-500">
                Course: INT335 P07 • Lovely Professional University, Punjab, India
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-bold border border-sky-100">
            P07 Team
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.regNo}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{member.name}</h4>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                  {member.regNo}
                </span>
              </div>
              <p className="text-xs text-sky-700 font-medium mt-1">{member.role}</p>
              <p className="text-[11px] text-slate-400 mt-1 font-mono truncate">{member.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prototype Reset / Data Controls */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Prototype Data Management
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Reset demo records back to baseline state for testing or faculty review.
          </p>
        </div>
        <button
          onClick={handleResetData}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          Reset Demo Data
        </button>
      </div>

    </div>
  );
};
