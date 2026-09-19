import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LiveTelemetryFeed } from './components/LiveTelemetryFeed';
import { ThreatAnalysisView } from './components/ThreatAnalysisView';
import { AiAssistantView } from './components/AiAssistantView';
import { ContinuousLearningView } from './components/ContinuousLearningView';
import { StructuredReportModal } from './components/StructuredReportModal';
import { SimulationModal } from './components/SimulationModal';
import { PresentationDeckModal } from './components/PresentationDeckModal';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_TELEMETRY_EVENTS, 
  INITIAL_PATTERNS, 
  INITIAL_LEARNING_METRICS 
} from './data/mockData';
import { 
  SecurityIncident, 
  TelemetryEvent, 
  DefensiveAction, 
  RecurringPattern, 
  LearningMetric 
} from './types';
import { Zap, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'incidents' | 'assistant' | 'learning'>('telemetry');
  const [autonomousMode, setAutonomousMode] = useState<boolean>(true);
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_INCIDENTS);
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>(INITIAL_TELEMETRY_EVENTS);
  const [patterns, setPatterns] = useState<RecurringPattern[]>(INITIAL_PATTERNS);
  const [metrics, setMetrics] = useState<LearningMetric>(INITIAL_LEARNING_METRICS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(INITIAL_INCIDENTS[0].id);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [reportModalIncident, setReportModalIncident] = useState<SecurityIncident | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'alert' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Background Telemetry Ingestion Simulator
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const randomSeed = Math.random();

      let newEvent: TelemetryEvent;

      if (randomSeed > 0.85) {
        // High anomaly telemetry event
        newEvent = {
          id: `EVT-${Date.now().toString().slice(-4)}`,
          timestamp: timeStr,
          category: 'NETWORK',
          sourceIp: `198.51.100.${Math.floor(Math.random() * 200) + 10}`,
          destinationIp: '10.0.4.10',
          sourceAsset: 'UNKNOWN-EXTERNAL',
          destinationAsset: 'DC-PRIMARY-01',
          protocol: 'TCP 445',
          action: 'Anomalous SMB Session TreeConnect',
          anomalyScore: Math.floor(Math.random() * 15) + 85,
          isGenuineThreat: true,
          classificationReason: 'Unauthenticated administrative share access request from non-whitelisted IP subnet',
          rawPayloadSnippet: 'SMB2 TreeConnect: Path=\\\\DC-PRIMARY-01\\IPC$ Dialect=0x0311 Security=None',
          flaggedBy: 'ANOMALY_ENGINE'
        };

        // If autonomous mode is armed, auto trigger defense
        if (autonomousMode) {
          showNotification(`Autonomous Defense Triggered: Host isolation & boundary shunt executed in 390ms for ${newEvent.sourceIp}`, 'alert');
        }
      } else if (randomSeed > 0.5) {
        // Legitimate high-volume system activity (false positive suppression)
        newEvent = {
          id: `EVT-${Date.now().toString().slice(-4)}`,
          timestamp: timeStr,
          category: 'SYSTEM',
          sourceIp: '10.0.8.15',
          destinationIp: '10.0.8.15',
          sourceAsset: 'SRV-PROD-APP-03',
          destinationAsset: 'SRV-PROD-APP-03',
          protocol: 'INTERNAL MEMORY',
          action: 'JVM Garbage Collection & Cache Purge',
          anomalyScore: Math.floor(Math.random() * 25) + 20,
          isGenuineThreat: false,
          classificationReason: 'CPU burst corresponds to verified Redis key eviction routine (False-Positive Filtered)',
          rawPayloadSnippet: 'JVM GC: [Pause Young (Normal) 24M->8M(128M) 3.82ms]',
          flaggedBy: 'BENIGN_BASELINE'
        };
      } else {
        // Standard normal auth
        newEvent = {
          id: `EVT-${Date.now().toString().slice(-4)}`,
          timestamp: timeStr,
          category: 'AUTH',
          sourceIp: '10.0.12.50',
          destinationIp: '10.0.2.1',
          sourceAsset: 'WS-ENG-12',
          destinationAsset: 'RADIUS-AUTH-01',
          protocol: 'RADIUS',
          action: 'Kerberos Pre-Auth Succeeded',
          anomalyScore: Math.floor(Math.random() * 10) + 5,
          isGenuineThreat: false,
          classificationReason: 'Standard employee single-sign-on token verification',
          rawPayloadSnippet: 'AS-REP: cname=e.wong@corp.com ticket=krbtgt/CORP.INTERNAL (AES-256)',
          flaggedBy: 'BENIGN_BASELINE'
        };
      }

      setTelemetryEvents(prev => [newEvent, ...prev.slice(0, 99)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming, autonomousMode]);

  // Execute manual or autonomous defensive action
  const handleExecuteDefenseAction = (
    incidentId: string, 
    actionType: DefensiveAction['actionType'], 
    target: string
  ) => {
    const actionId = `ACT-${Date.now().toString().slice(-4)}`;
    const execTime = Math.floor(Math.random() * 250) + 120;
    const now = new Date().toTimeString().split(' ')[0];

    let actionDetails = '';
    switch (actionType) {
      case 'ISOLATE_HOST':
        actionDetails = `Network microsegmentation enforced via 802.1X quarantine VLAN on ${target}.`;
        break;
      case 'REVOKE_TOKEN':
        actionDetails = `Revoked all active Kerberos TGT tickets and invalidated cloud session tokens for ${target}.`;
        break;
      case 'BLOCK_IP':
        actionDetails = `Dispatched edge router ACL blackhole rule for adversary address ${target}.`;
        break;
      case 'SNAPSHOT_MEMORY':
        actionDetails = `Completed volatile memory dump (RAM) for ${target} into secure forensic sandbox.`;
        break;
      default:
        actionDetails = `Defensive enforcement applied to ${target}.`;
    }

    const newAction: DefensiveAction = {
      id: actionId,
      actionType,
      target,
      severity: 'CRITICAL',
      triggeredAt: now,
      executionTimeMs: execTime,
      status: 'EXECUTED',
      isAutonomous: autonomousMode,
      details: actionDetails
    };

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'CONTAINED',
          defensiveActions: [newAction, ...inc.defensiveActions]
        };
      }
      return inc;
    }));

    showNotification(`Defensive Action Executed: ${actionType} on ${target} (${execTime}ms latency)`);
  };

  // Update Incident Status
  const handleUpdateIncidentStatus = (incidentId: string, status: SecurityIncident['status']) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, status };
      }
      return inc;
    }));
    showNotification(`Incident ${incidentId} marked as ${status}`);
  };

  // Update Security Team Feedback
  const handleUpdateFeedback = (incidentId: string, feedback: SecurityIncident['analystFeedback']) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, analystFeedback: feedback };
      }
      return inc;
    }));

    // Update metrics dynamically
    setMetrics(prev => ({
      ...prev,
      modelAdaptationEpochs: prev.modelAdaptationEpochs + 1,
      anomalyPrecisionScore: '98.9%',
      falsePositiveReductionRate: '86.4%'
    }));

    showNotification(`Feedback registered: Incident ${incidentId} confirmed as ${feedback}. Model weights updated.`);
  };

  // Run attack simulation
  const handleRunSimulation = (scenario: any) => {
    setIsSimulating(true);
    setIsSimulationOpen(false);

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newIncId = `INC-2026-${Math.floor(Math.random() * 8000) + 1000}`;

    // Step 1: Inject telemetry event
    const injectedTelemetry: TelemetryEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      category: scenario.isGenuine ? 'NETWORK' : 'SYSTEM',
      sourceIp: scenario.isGenuine ? '198.51.100.99' : '10.0.8.22',
      destinationIp: '10.0.4.10',
      sourceAsset: scenario.isGenuine ? 'THREAT-NODE' : 'SRV-BACKUP-NODE',
      destinationAsset: scenario.targetAsset,
      protocol: scenario.isGenuine ? 'TCP 88/445' : 'CRON IPC',
      action: scenario.title,
      anomalyScore: scenario.isGenuine ? 96 : 38,
      isGenuineThreat: scenario.isGenuine,
      classificationReason: scenario.description,
      rawPayloadSnippet: scenario.isGenuine 
        ? 'MALICIOUS INJECTION DETECTED: Mimikatz TGS extract token hash + RPC sweep'
        : 'VERIFIED CRON: backup tarball gzip -c /var/data',
      flaggedBy: scenario.isGenuine ? 'ANOMALY_ENGINE' : 'BENIGN_BASELINE'
    };

    setTelemetryEvents(prev => [injectedTelemetry, ...prev]);

    if (scenario.isGenuine) {
      // Step 2: Create new incident
      const newIncident: SecurityIncident = {
        id: newIncId,
        title: scenario.title,
        severity: scenario.severity,
        status: autonomousMode ? 'CONTAINED' : 'ACTIVE',
        category: scenario.category,
        detectedAt: `${now.toISOString().split('T')[0]} ${timeStr}`,
        targetAsset: scenario.targetAsset,
        targetAssetType: scenario.targetAsset.includes('DB') ? 'Database Server' : 'Domain Controller',
        sourceIp: '198.51.100.99',
        confidence: 96,
        falsePositiveLikelihood: 4,
        blastRadiusScore: 84,
        affectedAccounts: ['svc_admin_emergency', 'admin_corp'],
        correlatedEventIds: [injectedTelemetry.id],
        executiveSummary: `Real-time autonomous anomaly engine intercepted attack simulation: ${scenario.description}`,
        mitreTechniques: [
          { id: 'T1558', name: 'Steal or Forge Kerberos Tickets', phase: 'Credential Access' },
          { id: 'T1021', name: 'Remote Services', phase: 'Lateral Movement' },
          { id: 'T1071', name: 'Standard Application Layer Protocol', phase: 'Command and Control' }
        ],
        attackSequence: [
          {
            step: 1,
            timestamp: timeStr,
            phase: 'Simulation Trigger',
            detail: scenario.description,
            evidence: 'Synthesized zero-day telemetry vector matching APT behavioral profile.'
          },
          {
            step: 2,
            timestamp: timeStr,
            phase: 'Autonomous Mitigation Triggered',
            detail: scenario.expectedDefense,
            evidence: 'Autonomous defense policy rule 0xAF executed in 380ms.'
          }
        ],
        technicalEvidence: [
          { type: 'IP Address', value: '198.51.100.99', description: 'Simulated adversary entry point' },
          { type: 'Asset ID', value: scenario.targetAsset, description: 'Defended target host' }
        ],
        defensiveActions: autonomousMode ? [
          {
            id: `ACT-${Date.now().toString().slice(-4)}`,
            actionType: 'ISOLATE_HOST',
            target: scenario.targetAsset,
            severity: scenario.severity,
            triggeredAt: timeStr,
            executionTimeMs: 380,
            status: 'EXECUTED',
            isAutonomous: true,
            details: scenario.expectedDefense
          }
        ] : []
      };

      setIncidents(prev => [newIncident, ...prev]);
      setSelectedIncidentId(newIncId);
      setActiveTab('incidents');
      showNotification(`Simulation Injected: ${scenario.title}. ${autonomousMode ? 'Autonomous mitigation applied in 380ms!' : 'Incident opened for investigation.'}`, 'alert');
    } else {
      showNotification(`False-Positive Test: High volume baseline traffic correctly recognized as legitimate and filtered. Zero false alerts generated!`, 'success');
    }

    setIsSimulating(false);
  };

  const handleSelectEventForInvestigation = (evt: TelemetryEvent) => {
    // Find or create an incident
    const matched = incidents.find(i => i.sourceIp === evt.sourceIp || i.targetAsset === evt.destinationAsset);
    if (matched) {
      setSelectedIncidentId(matched.id);
    }
    setActiveTab('incidents');
  };

  const handleResetData = () => {
    setIncidents(INITIAL_INCIDENTS);
    setTelemetryEvents(INITIAL_TELEMETRY_EVENTS);
    setSelectedIncidentId(INITIAL_INCIDENTS[0].id);
    showNotification('Telemetry baseline and incident queue reset to default.');
  };

  const activeIncidents = incidents.filter(i => i.status === 'ACTIVE' || i.status === 'INVESTIGATING');
  const totalAutonomousActions = incidents.reduce((acc, curr) => acc + curr.defensiveActions.filter(a => a.isAutonomous).length, 0);

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 max-w-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className={`p-3.5 rounded-xl border shadow-xl flex items-start gap-2.5 text-xs font-mono backdrop-blur-md ${
            notification.type === 'alert'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
          }`}>
            {notification.type === 'alert' ? (
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-sans">{notification.message}</div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        autonomousMode={autonomousMode}
        setAutonomousMode={setAutonomousMode}
        onOpenSimulation={() => setIsSimulationOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        activeIncidentsCount={activeIncidents.length}
        autonomousActionsCount={totalAutonomousActions}
        isSimulating={isSimulating}
        onResetData={handleResetData}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'telemetry' && (
          <LiveTelemetryFeed
            events={telemetryEvents}
            isStreaming={isStreaming}
            onToggleStreaming={() => setIsStreaming(prev => !prev)}
            onSelectEventForInvestigation={handleSelectEventForInvestigation}
            autonomousMode={autonomousMode}
          />
        )}

        {activeTab === 'incidents' && (
          <ThreatAnalysisView
            incidents={incidents}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={setSelectedIncidentId}
            onExecuteDefenseAction={handleExecuteDefenseAction}
            onOpenReportModal={setReportModalIncident}
            onOpenCopilot={inc => {
              setSelectedIncidentId(inc.id);
              setActiveTab('assistant');
            }}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
          />
        )}

        {activeTab === 'assistant' && (
          <AiAssistantView
            activeIncident={selectedIncident}
            allIncidents={incidents}
            onSelectIncident={setSelectedIncidentId}
            onExecuteSuggestedAction={(actionType, payload) => {
              handleExecuteDefenseAction(selectedIncident.id, actionType as any, payload);
            }}
          />
        )}

        {activeTab === 'learning' && (
          <ContinuousLearningView
            incidents={incidents}
            patterns={patterns}
            metrics={metrics}
            onUpdateFeedback={handleUpdateFeedback}
          />
        )}
      </main>

      {/* Structured Incident Report Modal */}
      {reportModalIncident && (
        <StructuredReportModal
          incident={reportModalIncident}
          onClose={() => setReportModalIncident(null)}
        />
      )}

      {/* Threat Scenario Simulation Modal */}
      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        onRunScenario={handleRunSimulation}
        isSimulating={isSimulating}
      />

      {/* Executive 10-Slide Presentation Deck Modal */}
      <PresentationDeckModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
}
