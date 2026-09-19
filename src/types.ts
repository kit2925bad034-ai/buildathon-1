export type ThreatSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type IncidentStatus = 'ACTIVE' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'FALSE_POSITIVE';

export type EventCategory = 'NETWORK' | 'AUTH' | 'SYSTEM' | 'ENDPOINT' | 'CLOUD_API';

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  category: EventCategory;
  sourceIp: string;
  destinationIp: string;
  sourceAsset?: string;
  destinationAsset: string;
  protocol: string;
  action: string;
  anomalyScore: number; // 0 to 100
  isGenuineThreat: boolean;
  classificationReason: string;
  rawPayloadSnippet?: string;
  flaggedBy: 'ANOMALY_ENGINE' | 'BEHAVIORAL_HEURISTIC' | 'REPUTATION_INTEL' | 'BENIGN_BASELINE';
}

export interface MitreTechnique {
  id: string;
  name: string;
  phase: string;
}

export interface AttackStep {
  step: number;
  timestamp: string;
  phase: string;
  detail: string;
  evidence: string;
  techniqueId?: string;
}

export interface TechnicalEvidence {
  type: 'IP Address' | 'Domain' | 'SHA-256 Hash' | 'User Account' | 'File Path' | 'Port / Protocol' | 'Asset ID' | 'Process ID';
  value: string;
  description: string;
}

export interface DefensiveAction {
  id: string;
  actionType: 'ISOLATE_HOST' | 'BLOCK_IP' | 'REVOKE_TOKEN' | 'KILL_PROCESS' | 'RATE_LIMIT' | 'SNAPSHOT_MEMORY';
  target: string;
  severity: ThreatSeverity;
  triggeredAt: string;
  executionTimeMs: number;
  status: 'EXECUTED' | 'PENDING_APPROVAL' | 'REVERTED';
  isAutonomous: boolean;
  details: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  severity: ThreatSeverity;
  status: IncidentStatus;
  category: string;
  detectedAt: string;
  targetAsset: string;
  targetAssetType: 'Domain Controller' | 'Database Server' | 'API Gateway' | 'Workstation' | 'Cloud Storage';
  sourceIp: string;
  confidence: number; // 0-100
  falsePositiveLikelihood: number; // 0-100
  correlatedEventIds: string[];
  executiveSummary: string;
  mitreTechniques: MitreTechnique[];
  attackSequence: AttackStep[];
  technicalEvidence: TechnicalEvidence[];
  defensiveActions: DefensiveAction[];
  analystFeedback?: 'CONFIRMED_GENUINE' | 'CONFIRMED_FALSE_POSITIVE' | 'NEEDS_TUNING';
  analystNotes?: string;
  blastRadiusScore: number; // 0-100
  affectedAccounts: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: string;
    payload: string;
  };
}

export interface IncidentReport {
  reportId: string;
  generatedAt: string;
  incidentTitle: string;
  severity: ThreatSeverity;
  status: IncidentStatus;
  threatClassification: string;
  executiveSummary: string;
  attackSequence: AttackStep[];
  technicalEvidence: TechnicalEvidence[];
  autonomousActionsTaken: string[];
  rootCauseAndImpact: string;
  recommendations: string[];
}

export interface LearningMetric {
  anomalyPrecisionScore: string;
  falsePositiveReductionRate: string;
  modelAdaptationEpochs: number;
  threatSignaturesGenerated: number;
}

export interface RecurringPattern {
  id: string;
  pattern: string;
  trend: string;
  risk: ThreatSeverity;
  affectedVectors: string;
  occurrences: number;
}
