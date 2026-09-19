import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Pause, 
  Play, 
  ShieldCheck, 
  AlertTriangle, 
  Filter, 
  Zap, 
  ExternalLink,
  ChevronDown,
  Terminal,
  Clock,
  Flame,
  Search
} from 'lucide-react';
import { TelemetryEvent, EventCategory } from '../types';

interface LiveTelemetryFeedProps {
  events: TelemetryEvent[];
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onSelectEventForInvestigation: (event: TelemetryEvent) => void;
  autonomousMode: boolean;
}

export const LiveTelemetryFeed: React.FC<LiveTelemetryFeedProps> = ({
  events,
  isStreaming,
  onToggleStreaming,
  onSelectEventForInvestigation,
  autonomousMode
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'ALL'>('ALL');
  const [filterThreatsOnly, setFilterThreatsOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const feedEndRef = useRef<HTMLDivElement>(null);

  const filteredEvents = events.filter(evt => {
    if (selectedCategory !== 'ALL' && evt.category !== selectedCategory) return false;
    if (filterThreatsOnly && !evt.isGenuineThreat) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        evt.action.toLowerCase().includes(q) ||
        evt.sourceIp.toLowerCase().includes(q) ||
        evt.destinationAsset.toLowerCase().includes(q) ||
        evt.classificationReason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories: { label: string; value: EventCategory | 'ALL' }[] = [
    { label: 'All Ingest', value: 'ALL' },
    { label: 'Network', value: 'NETWORK' },
    { label: 'Auth Logs', value: 'AUTH' },
    { label: 'System', value: 'SYSTEM' },
    { label: 'Endpoints', value: 'ENDPOINT' },
    { label: 'Cloud API', value: 'CLOUD_API' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner & Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Detection Engine</div>
            <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Real-Time Active
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Unseen anomaly heuristic active</div>
          </div>
          <Radio className="w-8 h-8 text-emerald-500/20" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Ingest Rate</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">1,840 evt/sec</div>
            <div className="text-xs text-slate-500 mt-0.5">Network, Auth & Syscall streaming</div>
          </div>
          <Zap className="w-8 h-8 text-cyan-500/20" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">False-Positive Filter</div>
            <div className="text-lg font-bold text-indigo-400 mt-0.5">84.1% Suppressed</div>
            <div className="text-xs text-slate-500 mt-0.5">Legitimate spikes auto-verified</div>
          </div>
          <ShieldCheck className="w-8 h-8 text-indigo-500/20" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Autonomous Defenses</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">
              {autonomousMode ? 'Armed (Sub-second)' : 'Human-in-the-Loop'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Auto-quarantine on critical severity</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500/20" />
        </div>
      </div>

      {/* Controls and Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search and Toggles */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md justify-end">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search IP, asset, payload..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <button
            onClick={() => setFilterThreatsOnly(prev => !prev)}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterThreatsOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Threats Only</span>
          </button>

          <button
            onClick={onToggleStreaming}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isStreaming
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Feed</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>Paused</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Event Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
              Continuous Telemetry Ingestion Stream
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {filteredEvents.length} events logged
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Real-time Anomaly Engine: Unseen Behavior Analysis
          </div>
        </div>

        <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto font-mono text-xs">
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No telemetry events match the current filter criteria.
            </div>
          ) : (
            filteredEvents.map(evt => {
              const isThreat = evt.isGenuineThreat;
              const isExpanded = expandedEventId === evt.id;

              return (
                <div 
                  key={evt.id} 
                  className={`p-3 transition-colors ${
                    isThreat 
                      ? 'bg-rose-950/10 hover:bg-rose-950/20' 
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Time, Type, Category */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className="text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-600" />
                        {evt.timestamp}
                      </span>

                      {/* Anomaly Score Badge */}
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border flex items-center gap-1 ${
                        evt.anomalyScore >= 80 
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : evt.anomalyScore >= 50
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}>
                        Anomaly {evt.anomalyScore}%
                      </span>

                      {/* Genuine vs False-Positive Classifier Tag */}
                      {isThreat ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-900/40 text-rose-300 border border-rose-600/40 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-rose-400" />
                          Genuine Threat
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Legitimate (FP Filtered)
                        </span>
                      )}

                      {/* Category Tag */}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {evt.category}
                      </span>
                    </div>

                    {/* Source & Destination */}
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-400">{evt.sourceAsset || evt.sourceIp}</span>
                      <span className="text-cyan-500">→</span>
                      <span className="text-slate-200 font-semibold">{evt.destinationAsset}</span>
                      <span className="text-[10px] text-slate-500">({evt.protocol})</span>
                    </div>
                  </div>

                  {/* Action Description & Classification Reason */}
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex-1 min-w-[280px]">
                      <span className="font-semibold text-white mr-2">{evt.action}</span>
                      <span className="text-slate-400 text-[11px]">{evt.classificationReason}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isThreat && (
                        <button
                          onClick={() => onSelectEventForInvestigation(evt)}
                          className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-sans flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Correlate & Investigate</span>
                          <ExternalLink className="w-3 h-3 text-cyan-400" />
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                        className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
                        title="View payload"
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Payload & Behavioral Vector */}
                  {isExpanded && evt.rawPayloadSnippet && (
                    <div className="mt-2.5 p-2.5 rounded bg-slate-950 border border-slate-800/90 text-[11px]">
                      <div className="flex items-center justify-between text-slate-500 text-[10px] mb-1">
                        <span className="flex items-center gap-1">
                          <Terminal className="w-3 h-3 text-cyan-400" />
                          Raw Telemetry Payload Snapshot
                        </span>
                        <span>Flagged by: {evt.flaggedBy}</span>
                      </div>
                      <pre className="text-cyan-300 font-mono overflow-x-auto whitespace-pre-wrap select-all">
                        {evt.rawPayloadSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={feedEndRef} />
        </div>
      </div>
    </div>
  );
};
