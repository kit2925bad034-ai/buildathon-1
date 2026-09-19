import React from 'react';
import { 
  X, 
  Play, 
  Flame, 
  Database, 
  ShieldCheck, 
  Terminal, 
  Lock, 
  AlertTriangle,
  Zap,
  Server
} from 'lucide-react';
import { ThreatSeverity } from '../types';

interface SimulationScenario {
  id: string;
  title: string;
  severity: ThreatSeverity;
  category: string;
  targetAsset: string;
  description: string;
  isGenuine: boolean;
  expectedDefense: string;
}

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunScenario: (scenario: SimulationScenario) => void;
  isSimulating: boolean;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  onRunScenario,
  isSimulating
}) => {
  if (!isOpen) return null;

  const scenarios: SimulationScenario[] = [
    {
      id: 'SCEN-01',
      title: 'APT Kerberoasting & Domain Controller Lateral Compromise',
      severity: 'CRITICAL',
      category: 'Credential Access / Lateral Movement',
      targetAsset: 'DC-PRIMARY-01.corp.internal',
      description: 'Adversary extracts service ticket for backup admin account, executes memory injection, and attempts SMB pipe traversal to the Primary Domain Controller.',
      isGenuine: true,
      expectedDefense: 'Autonomous 802.1X Host Quarantine + Kerberos TGT Invalidation (Sub-500ms)'
    },
    {
      id: 'SCEN-02',
      title: 'Covert High-Entropy DNS Over UDP Tunneling Exfiltration',
      severity: 'HIGH',
      category: 'Exfiltration / Command & Control',
      targetAsset: 'PROD-PAYMENT-DB-02',
      description: 'Continuous anomalous Port 53 queries with high Shannon entropy carrying encrypted customer records to rogue external nameserver.',
      isGenuine: true,
      expectedDefense: 'Autonomous DNS Edge Gateway Blackhole + Internal Query Rate Throttling'
    },
    {
      id: 'SCEN-03',
      title: 'Zero-Day Ransomware Canary Trap Trigger',
      severity: 'CRITICAL',
      category: 'Impact / Mass File Encryption',
      targetAsset: 'FILE-CLUSTER-NAS-01',
      description: 'Rapid sequential file rename operations on decoy canary shares with high compression entropy, mimicking LockBit ransomware behavior.',
      isGenuine: true,
      expectedDefense: 'Instant Process Termination (Kill PID) + Immutable Snapshot Freeze + Network Shunt'
    },
    {
      id: 'SCEN-04',
      title: 'Legitimate Nightly Terabyte Database Backup (False Positive Test)',
      severity: 'LOW',
      category: 'System Maintenance / Verified Batch',
      targetAsset: 'SRV-BACKUP-NODE',
      description: 'Massive disk read and network socket burst matching weekly cronjob schedule. Tests whether the AI engine correctly suppresses false alerts.',
      isGenuine: false,
      expectedDefense: 'Suppressed via Adaptive Benign Baseline (No Alert Fatigue)'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Threat Vector Simulation Sandbox</h2>
              <p className="text-xs text-slate-400">
                Inject realistic anomalous cyber attack sequences to observe autonomous detection and mitigation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios list */}
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          {scenarios.map(scen => (
            <div
              key={scen.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    scen.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : scen.severity === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}>
                    {scen.severity}
                  </span>
                  <span className="font-semibold text-white text-xs">
                    {scen.title}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-400">
                  Target: {scen.targetAsset}
                </span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">
                {scen.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono">
                  <Zap className="w-3 h-3" />
                  <span>Expected Defense: {scen.expectedDefense}</span>
                </div>

                <button
                  onClick={() => onRunScenario(scen)}
                  disabled={isSimulating}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulate Injection</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
