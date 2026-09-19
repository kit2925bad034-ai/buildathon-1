import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  AlertOctagon, 
  Lock, 
  Terminal, 
  Sparkles, 
  FileText, 
  ArrowRight,
  Server,
  Zap,
  Clock,
  ExternalLink,
  RefreshCw,
  EyeOff
} from 'lucide-react';
import { SecurityIncident, DefensiveAction, ThreatSeverity } from '../types';

interface ThreatAnalysisViewProps {
  incidents: SecurityIncident[];
  selectedIncidentId: string;
  onSelectIncident: (id: string) => void;
  onExecuteDefenseAction: (incidentId: string, actionType: DefensiveAction['actionType'], target: string) => void;
  onOpenReportModal: (incident: SecurityIncident) => void;
  onOpenCopilot: (incident: SecurityIncident) => void;
  onUpdateIncidentStatus: (incidentId: string, status: SecurityIncident['status']) => void;
}

export const ThreatAnalysisView: React.FC<ThreatAnalysisViewProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  onExecuteDefenseAction,
  onOpenReportModal,
  onOpenCopilot,
  onUpdateIncidentStatus
}) => {
  const currentIncident = incidents.find(inc => inc.id === selectedIncidentId) || incidents[0];
  const [isAnalyzingWithAi, setIsAnalyzingWithAi] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'CONTAINED' | 'RESOLVED'>('ALL');

  const filteredIncidents = incidents.filter(inc => {
    if (statusFilter !== 'ALL' && inc.status !== statusFilter) return false;
    return true;
  });

  const handleRunAiAnalysis = async () => {
    if (!currentIncident) return;
    setIsAnalyzingWithAi(true);
    try {
      const res = await fetch('/api/threat-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident: currentIncident,
          correlatedEvents: currentIncident.correlatedEventIds
        })
      });
      const data = await res.json();
      if (data.analysis) {
        setAiAnalysisResult(data.analysis);
      }
    } catch (err) {
      console.error('Failed to run AI threat analysis:', err);
    } finally {
      setIsAnalyzingWithAi(false);
    }
  };

  const getSeverityBadge = (sev: ThreatSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  if (!currentIncident) {
    return (
      <div className="text-center py-16 text-slate-500">
        No active incidents logged. Simulate a threat to trigger autonomous analysis.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Sidebar: Incident Prioritization Queue */}
      <div className="lg:col-span-4 space-y-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              Prioritized Incidents
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {incidents.length} Detected
            </span>
          </div>

          {/* Status Filter Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-lg text-[11px] font-medium text-slate-400 mb-2">
            {(['ALL', 'ACTIVE', 'CONTAINED', 'RESOLVED'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`py-1 rounded text-center cursor-pointer transition-colors ${
                  statusFilter === tab ? 'bg-slate-800 text-white font-semibold' : 'hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Incident List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredIncidents.map(inc => {
              const isSelected = inc.id === currentIncident.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono text-slate-400">{inc.id}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${getSeverityBadge(inc.severity)}`}>
                      {inc.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-white line-clamp-1 mb-1.5">
                    {inc.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Server className="w-3 h-3 text-cyan-400" />
                      {inc.targetAsset.split('.')[0]}
                    </span>
                    <span className="text-cyan-400">
                      {inc.confidence}% Conf.
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {inc.detectedAt.split(' ')[1]}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded font-mono uppercase ${
                      inc.status === 'ACTIVE' 
                        ? 'bg-rose-500/20 text-rose-300' 
                        : inc.status === 'CONTAINED'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {inc.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Main Area: Deep-Dive Investigation & Reconstructed Attack Sequence */}
      <div className="lg:col-span-8 space-y-4">
        {/* Incident Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-mono text-cyan-400">{currentIncident.id}</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadge(currentIncident.severity)}`}>
                  {currentIncident.severity}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {currentIncident.category}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800 font-mono">
                  FP Risk: {currentIncident.falsePositiveLikelihood}% (Genuine Threat)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {currentIncident.title}
              </h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onOpenCopilot(currentIncident)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Investigate in Copilot</span>
              </button>

              <button
                onClick={() => onOpenReportModal(currentIncident)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-300" />
                <span>Generate Incident Report</span>
              </button>
            </div>
          </div>

          {/* Blast Radius & Affected Assets Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-b border-slate-800/80 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Target Asset</span>
              <span className="text-white font-semibold flex items-center gap-1 mt-0.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                {currentIncident.targetAsset}
              </span>
              <span className="text-[10px] text-slate-500">Tier: {currentIncident.targetAssetType}</span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Adversary Source IP</span>
              <span className="text-rose-400 font-semibold mt-0.5 block">
                {currentIncident.sourceIp}
              </span>
              <span className="text-[10px] text-slate-500">Known Proxy / C2 ASN Node</span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Blast Radius Impact</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full"
                    style={{ width: `${currentIncident.blastRadiusScore}%` }}
                  />
                </div>
                <span className="text-rose-300 font-bold">{currentIncident.blastRadiusScore}/100</span>
              </div>
              <span className="text-[10px] text-slate-500">
                {currentIncident.affectedAccounts.length} privileged account(s) in scope
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
            <span className="font-semibold text-cyan-400 mr-1.5 font-mono text-[11px]">[AI Summary]:</span>
            {currentIncident.executiveSummary}
          </div>
        </div>

        {/* Reconstructed Attack Sequence Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Reconstructed Probable Attack Sequence
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Correlated Multi-Event Kill Chain
            </span>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
            {currentIncident.attackSequence.map((step, idx) => (
              <div key={step.step} className="relative flex items-start gap-3.5 pl-1">
                <div className="w-6 h-6 rounded-full bg-slate-950 border border-cyan-500/50 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold shrink-0 z-10 shadow-sm">
                  {step.step}
                </div>

                <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-white">
                      {step.phase}
                    </span>
                    <div className="flex items-center gap-2">
                      {step.techniqueId && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {step.techniqueId}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {step.timestamp}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-1.5">
                    {step.detail}
                  </p>

                  <div className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800/80">
                    <span className="text-cyan-400 font-semibold">Evidence: </span>
                    {step.evidence}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MITRE ATT&CK Mapping & Observable Evidence Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* MITRE ATT&CK Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              MITRE ATT&CK Techniques
            </h3>
            <div className="space-y-2">
              {currentIncident.mitreTechniques.map(tech => (
                <div key={tech.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-cyan-400 mr-2">{tech.id}</span>
                    <span className="text-slate-200">{tech.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                    {tech.phase}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Observable Technical Evidence & IOCs */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Observable Technical Evidence (IOCs)
            </h3>
            <div className="space-y-2">
              {currentIncident.technicalEvidence.map((ioc, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-0.5 font-mono">
                    <span className="text-[10px] uppercase text-slate-400">{ioc.type}</span>
                    <span className="text-cyan-300 font-semibold truncate max-w-[200px] select-all">{ioc.value}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {ioc.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Explainable AI Reasoning (Deep Breakdown) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                Explainable AI Reasoning & Evidence Breakdown
              </h3>
            </div>
            <button
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzingWithAi}
              className="text-xs px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isAnalyzingWithAi ? 'animate-spin' : ''}`} />
              <span>{isAnalyzingWithAi ? 'Reasoning with Gemini...' : 'Re-Analyze with Gemini AI'}</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {(aiAnalysisResult?.reasoningAndEvidence || [
              'Continuous statistical variance on Kerberos TGS queries exceeded 4.2 standard deviations above asset baseline.',
              'Source IP resolved to known adversary command-and-control infrastructure without valid reverse PTR.',
              'Correlated process injection syscall (VirtualAllocEx with PAGE_EXECUTE_READWRITE) was intercepted on client node prior to DC probe.'
            ]).map((point: string, idx: number) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Autonomous Defensive Response & Containment Control Hub */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                Autonomous Defensive Actions & Remediation Status
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-slate-400">Incident Lifecycle:</span>
              <select
                value={currentIncident.status}
                onChange={e => onUpdateIncidentStatus(currentIncident.id, e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INVESTIGATING">INVESTIGATING</option>
                <option value="CONTAINED">CONTAINED</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>
          </div>

          {/* Triggered Actions Log */}
          <div className="space-y-2 mb-4">
            {currentIncident.defensiveActions.map(act => (
              <div key={act.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono font-bold text-white uppercase">{act.actionType}</span>
                  <span className="text-slate-400 font-mono">Target: {act.target}</span>
                  {act.isAutonomous && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      AUTONOMOUS ({act.executionTimeMs}ms)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  {act.details}
                </div>
              </div>
            ))}
          </div>

          {/* Manual Mitigation Triggers */}
          <div className="pt-3 border-t border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase">
              Immediate Defensive Interventions
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onExecuteDefenseAction(currentIncident.id, 'ISOLATE_HOST', currentIncident.targetAsset)}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Isolate Host from Network</span>
              </button>

              <button
                onClick={() => onExecuteDefenseAction(currentIncident.id, 'REVOKE_TOKEN', currentIncident.affectedAccounts[0] || 'Active Sessions')}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Revoke Kerberos / OAuth Tokens</span>
              </button>

              <button
                onClick={() => onExecuteDefenseAction(currentIncident.id, 'BLOCK_IP', currentIncident.sourceIp)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Blackhole Adversary IP</span>
              </button>

              <button
                onClick={() => onExecuteDefenseAction(currentIncident.id, 'SNAPSHOT_MEMORY', currentIncident.targetAsset)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>Snapshot Volatile Memory</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
