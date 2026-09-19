import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  Server,
  Layers,
  Lock,
  RefreshCw
} from 'lucide-react';
import { SecurityIncident, IncidentReport } from '../types';

interface StructuredReportModalProps {
  incident: SecurityIncident | null;
  onClose: () => void;
}

export const StructuredReportModal: React.FC<StructuredReportModalProps> = ({
  incident,
  onClose
}) => {
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!incident) return;
    fetchReport();
  }, [incident]);

  const fetchReport = async () => {
    if (!incident) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident,
          actionsTaken: incident.defensiveActions.map(a => `${a.actionType} on ${a.target} (${a.details})`),
          correlatedEvents: incident.correlatedEventIds
        })
      });
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
      }
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!report) return;
    const md = `# AUTONOMOUS INCIDENT REPORT: ${report.reportId}
**Incident:** ${report.incidentTitle}
**Severity:** ${report.severity} | **Status:** ${report.status}
**Classification:** ${report.threatClassification}
**Timestamp:** ${report.generatedAt}

## Executive Summary
${report.executiveSummary}

## Reconstructed Attack Sequence
${report.attackSequence.map(s => `- **Step ${s.step}** [${s.timestamp}] (${s.phase}): ${s.detail}`).join('\n')}

## Technical Evidence & IOCs
${report.technicalEvidence.map(e => `- **${e.type}**: \`${e.value}\` - ${e.description}`).join('\n')}

## Autonomous Defensive Actions Taken
${report.autonomousActionsTaken.map(a => `- [x] ${a}`).join('\n')}

## Root Cause & Impact Assessment
${report.rootCauseAndImpact}

## Hardening & Prevention Recommendations
${report.recommendations.map(r => `- ${r}`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!report) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${report.reportId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">Structured Incident Report</h2>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Gemini Verified
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {incident.id} • {incident.targetAsset}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchReport}
              disabled={isLoading}
              title="Regenerate report"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleCopyMarkdown}
              disabled={isLoading || !report}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              disabled={isLoading || !report}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans">
          {isLoading ? (
            <div className="py-24 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <div className="text-sm font-medium text-white">Synthesizing Comprehensive Incident Report...</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Reconstructing attack sequence, correlating multi-event IOCs, and calculating blast radius impact.
              </p>
            </div>
          ) : report ? (
            <div className="space-y-6 text-xs text-slate-300">
              {/* Metadata Banner */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Report ID</span>
                  <span className="text-cyan-400 font-bold">{report.reportId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Severity / Status</span>
                  <span className="text-rose-400 font-bold">{report.severity} / {report.status}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Threat Category</span>
                  <span className="text-white truncate block">{report.threatClassification}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Generated At</span>
                  <span className="text-slate-400 truncate block">{report.generatedAt}</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
                  1. Executive Summary
                </h3>
                <p className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl leading-relaxed text-slate-200">
                  {report.executiveSummary}
                </p>
              </div>

              {/* Reconstructed Attack Sequence */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
                  2. Reconstructed Attack Sequence
                </h3>
                <div className="space-y-2">
                  {report.attackSequence.map((step, i) => (
                    <div key={i} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono font-bold shrink-0">
                        {step.step}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-white">{step.phase}</span>
                          <span className="font-mono text-[10px] text-slate-500">[{step.timestamp}]</span>
                        </div>
                        <p className="text-slate-300">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Evidence & IOCs */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
                  3. Technical Evidence & Indicators of Compromise (IOCs)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {report.technicalEvidence.map((ioc, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl font-mono">
                      <div className="text-[10px] text-slate-400 uppercase">{ioc.type}</div>
                      <div className="text-cyan-300 font-semibold truncate my-0.5">{ioc.value}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{ioc.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Autonomous Response Actions Taken */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
                  4. Autonomous Defensive Actions Executed
                </h3>
                <div className="space-y-1.5">
                  {report.autonomousActionsTaken.map((act, i) => (
                    <div key={i} className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-200">{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Root Cause and Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <h4 className="font-mono text-[11px] uppercase font-bold text-amber-400 mb-1">
                    5. Root Cause & Impact Analysis
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {report.rootCauseAndImpact}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <h4 className="font-mono text-[11px] uppercase font-bold text-emerald-400 mb-1">
                    6. Hardening Recommendations
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {report.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
