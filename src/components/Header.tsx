import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Zap, 
  Cpu, 
  Radio, 
  FileText, 
  Sparkles, 
  Play, 
  RotateCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'telemetry' | 'incidents' | 'assistant' | 'learning';
  setActiveTab: (tab: 'telemetry' | 'incidents' | 'assistant' | 'learning') => void;
  autonomousMode: boolean;
  setAutonomousMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenSimulation: () => void;
  activeIncidentsCount: number;
  autonomousActionsCount: number;
  isSimulating: boolean;
  onResetData: () => void;
  onOpenPresentation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  autonomousMode,
  setAutonomousMode,
  onOpenSimulation,
  activeIncidentsCount,
  autonomousActionsCount,
  isSimulating,
  onResetData,
  onOpenPresentation
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top operational bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & System Ident */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <ShieldAlert className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-cyan-400 uppercase">Aegis AI Core</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">v4.2-AUTO</span>
            </div>
            <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              Autonomous Cybersecurity Operations
            </h1>
          </div>
        </div>

        {/* Global Security Posture Indicators & Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Autonomous Mode Toggle */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Zap className={`w-3.5 h-3.5 ${autonomousMode ? 'text-amber-400' : 'text-slate-500'}`} />
              Auto-Response:
            </span>
            <button
              onClick={() => setAutonomousMode(prev => !prev)}
              className={`text-xs font-mono font-medium px-2 py-0.5 rounded transition-colors flex items-center gap-1.5 ${
                autonomousMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${autonomousMode ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {autonomousMode ? 'ARMED (FULL AUTO)' : 'HUMAN APPROVAL'}
            </button>
          </div>

          {/* Incident Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono">
            <span className="text-slate-400">Threat Alerts:</span>
            <span className="text-rose-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              {activeIncidentsCount} Active
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-cyan-400">{autonomousActionsCount} Defended</span>
          </div>

          {/* Presentation Deck Button */}
          <button
            onClick={onOpenPresentation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Executive PPT</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">10 Slides</span>
          </button>

          {/* Attack Simulator Button */}
          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer shadow-sm"
          >
            <Play className={`w-3.5 h-3.5 text-cyan-400 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Simulate Threat</span>
          </button>

          {/* Reset Stream */}
          <button
            onClick={onResetData}
            title="Reset telemetry baseline"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-1 border-t border-slate-800/80 pt-1">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'telemetry'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Real-Time Anomaly & Telemetry</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'incidents'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Threat Analysis & Response</span>
          {activeIncidentsCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {activeIncidentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'assistant'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI Investigation Copilot</span>
          <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            Gemini Flash
          </span>
        </button>

        <button
          onClick={() => setActiveTab('learning')}
          className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'learning'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Continuous Intelligence & Learning</span>
        </button>
      </div>
    </header>
  );
};
