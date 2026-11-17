import React, { useState } from 'react';
import { GraduationCap, Users, ShieldAlert, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { TEAM_MEMBERS } from '../../data/mockData';

export const ProjectBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white text-xs border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/30">
            <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
            LPU • INT335 P07
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-slate-300 font-medium">
            Course: <strong className="text-white">Design Thinking</strong>
          </span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-slate-300 hidden md:inline">Lovely Professional University, Punjab</span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase border border-amber-500/30">
            <ShieldAlert className="w-3 h-3" /> Demo Prototype
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md text-[11px]"
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Team Members (4)</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-slate-950/90 border-t border-slate-800/80 px-4 py-3 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-400" />
                Project Team Details – Section P07
              </span>
              <span className="text-[11px] text-slate-400">
                Supervisor: Dept. of Design Thinking & Innovation
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.regNo}
                  className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 hover:border-sky-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-200 text-xs">{member.name}</p>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-sky-300">
                      {member.regNo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{member.role}</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono truncate">{member.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
