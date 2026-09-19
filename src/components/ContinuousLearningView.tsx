import React, { useState } from 'react';
import { 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Plus,
  Zap,
  Layers,
  FileCheck
} from 'lucide-react';
import { SecurityIncident, RecurringPattern, LearningMetric } from '../types';

interface ContinuousLearningViewProps {
  incidents: SecurityIncident[];
  patterns: RecurringPattern[];
  metrics: LearningMetric;
  onUpdateFeedback: (incidentId: string, feedback: SecurityIncident['analystFeedback']) => void;
  onRefreshIntelligence?: () => void;
}

export const ContinuousLearningView: React.FC<ContinuousLearningViewProps> = ({
  incidents,
  patterns,
  metrics,
  onUpdateFeedback
}) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'patterns' | 'insights'>('feedback');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [proactiveInsights, setProactiveInsights] = useState<string[]>([
    'Automated baseline calibrated: Storage snapshot tasks on subnet 10.0.8.0/24 suppressed from anomaly flagging (-82% false alerts).',
    'Emerging cluster detected: 3 distinct external subnets probed Kerberos TCP 88 within 4 hours. Recommend hardening SPN encryption to AES-256 only.',
    'Proactive zero-day defense: Egress DNS Shannon entropy threshold tightened from 4.8 to 4.2 to preempt covert data exfiltration.',
    'Workstation fleet quarantine trigger reduced from 3 anomalous hops to 2 hops, decreasing mean-time-to-contain (MTTC) by 410ms.'
  ]);

  const [customRules, setCustomRules] = useState<string[]>([
    'RULE-2026-01: Auto-whitelist backup snapshots matching cron syntax 0 3 * * * on SRV-BACKUP-NODE',
    'RULE-2026-02: Auto-isolate on CobaltStrike JA3 TLS 1.3 fingerprint: 72a589dc',
    'RULE-2026-03: Flag outbound UDP 53 packets with entropy > 4.2 as instant high-severity exfil'
  ]);
  const [newRuleInput, setNewRuleInput] = useState('');

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleInput.trim()) return;
    setCustomRules(prev => [...prev, `RULE-${Date.now().toString().slice(-4)}: ${newRuleInput.trim()}`]);
    setNewRuleInput('');
  };

  const handleFetchAiInsights = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/security-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmedIncidents: incidents.filter(i => i.analystFeedback === 'CONFIRMED_GENUINE'),
          falsePositiveFeedback: incidents.filter(i => i.analystFeedback === 'CONFIRMED_FALSE_POSITIVE'),
          systemMetrics: metrics
        })
      });
      const data = await res.json();
      if (data.intelligence?.proactivePreventionInsights) {
        setProactiveInsights(data.intelligence.proactivePreventionInsights);
      }
    } catch (err) {
      console.error('Failed to fetch security intelligence:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Continuous Learning KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Anomaly Precision</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics.anomalyPrecisionScore}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-400">+2.4%</span> this week post-incident feedback
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">False Positive Reduction</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{metrics.falsePositiveReductionRate}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Baseline adapted to legitimate spikes
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Model Adaptation Epochs</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{metrics.modelAdaptationEpochs}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Continuous online weight updates
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Autonomous Signatures</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{metrics.threatSignaturesGenerated}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Synthesized from confirmed attacks
          </div>
        </div>
      </div>

      {/* Main Grid: Feedback Loop & Proactive Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Analyst Feedback & Model Tuning */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Security Team Feedback & Classification Tuning
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Confirm genuine detections or mark false positives to recalibrate the anomaly detection model.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {incidents.map(inc => (
                <div key={inc.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-semibold">{inc.id}</span>
                      <span className="font-semibold text-white truncate max-w-[240px]">{inc.title}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {inc.targetAsset}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Engine Confidence: {inc.confidence}%</span>
                    <span>False Positive Est: {inc.falsePositiveLikelihood}%</span>
                  </div>

                  {/* Feedback Action Buttons */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] font-mono">
                      Feedback Status:{' '}
                      <span className={`font-semibold ${
                        inc.analystFeedback === 'CONFIRMED_GENUINE'
                          ? 'text-emerald-400'
                          : inc.analystFeedback === 'CONFIRMED_FALSE_POSITIVE'
                          ? 'text-amber-400'
                          : 'text-slate-500'
                      }`}>
                        {inc.analystFeedback || 'Awaiting Analyst Validation'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateFeedback(inc.id, 'CONFIRMED_GENUINE')}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                          inc.analystFeedback === 'CONFIRMED_GENUINE'
                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3 text-emerald-400" />
                        <span>Confirm Genuine Threat</span>
                      </button>

                      <button
                        onClick={() => onUpdateFeedback(inc.id, 'CONFIRMED_FALSE_POSITIVE')}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                          inc.analystFeedback === 'CONFIRMED_FALSE_POSITIVE'
                            ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3 text-amber-400" />
                        <span>Flag False Positive</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adaptive Rule & Baseline Whitelist Manager */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
              Active Adaptive Baseline & Suppression Rules
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Synthesized by the continuous learning engine to eliminate alert fatigue.
            </p>

            <div className="space-y-1.5 mb-3">
              {customRules.map((rule, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  {rule}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddRule} className="flex gap-2">
              <input
                type="text"
                placeholder="Add new baseline suppression or signature rule..."
                value={newRuleInput}
                onChange={e => setNewRuleInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Deploy Rule</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right 5 Cols: Recurring Attack Patterns & Proactive AI Insights */}
        <div className="lg:col-span-5 space-y-4">
          {/* Recurring Attack Patterns & Behavioral Trends */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Recurring Attack Patterns & Emerging Trends
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Behavioral clusters identified across historical telemetry and incident timelines.
            </p>

            <div className="space-y-2.5">
              {patterns.map(pat => (
                <div key={pat.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold">{pat.id}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                      pat.risk === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : pat.risk === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                    }`}>
                      {pat.risk}
                    </span>
                  </div>

                  <div className="font-semibold text-white">
                    {pat.pattern}
                  </div>

                  <div className="text-[11px] text-emerald-400 font-mono">
                    Trend: {pat.trend}
                  </div>

                  <div className="text-[10px] text-slate-500">
                    Scope: {pat.affectedVectors} • {pat.occurrences} incidents detected
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proactive Prevention Insights (AI-Driven) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Proactive AI Prevention Insights
              </h3>
              <button
                onClick={handleFetchAiInsights}
                disabled={isRefreshing}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Re-synthesize</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Autonomous recommendations to harden defenses before zero-day vectors propagate.
            </p>

            <div className="space-y-2">
              {proactiveInsights.map((insight, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
