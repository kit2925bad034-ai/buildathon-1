import { SecurityIncident, TelemetryEvent, RecurringPattern, LearningMetric } from '../types';

export const INITIAL_INCIDENTS: SecurityIncident[] = [
  {
    id: 'INC-2026-8801',
    title: 'Anomalous Active Directory Kerberoasting & Lateral Traversal',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    category: 'Credential Access / Lateral Movement',
    detectedAt: '2026-09-18 20:41:15',
    targetAsset: 'DC-PRIMARY-01.corp.internal',
    targetAssetType: 'Domain Controller',
    sourceIp: '198.51.100.187',
    confidence: 97,
    falsePositiveLikelihood: 3,
    blastRadiusScore: 88,
    affectedAccounts: ['svc_backup_admin', 'corp\\j.doe_adm'],
    correlatedEventIds: ['EVT-901', 'EVT-902', 'EVT-904', 'EVT-906'],
    executiveSummary: 'Autonomous detection engine identified a cluster of non-standard Kerberos service ticket requests followed by rapid RPC endpoint mapping and an anomalous SMB session targeting the Primary Domain Controller.',
    mitreTechniques: [
      { id: 'T1558.003', name: 'Steal or Forge Kerberos Tickets: Kerberoasting', phase: 'Credential Access' },
      { id: 'T1021.002', name: 'Remote Services: SMB/Windows Admin Shares', phase: 'Lateral Movement' },
      { id: 'T1078.002', name: 'Valid Accounts: Domain Accounts', phase: 'Defense Evasion' },
      { id: 'T1003.001', name: 'OS Credential Dumping: LSASS Memory', phase: 'Credential Access' }
    ],
    attackSequence: [
      {
        step: 1,
        timestamp: '20:39:42',
        phase: 'Initial Reconnaissance',
        detail: 'Port probe across TCP 88 (Kerberos) and TCP 389 (LDAP) originating from staging subnet workstation WS-FIN-04.',
        evidence: '38 queries in 1.4s targeting high-privilege SPN service accounts.',
        techniqueId: 'T1558.003'
      },
      {
        step: 2,
        timestamp: '20:40:08',
        phase: 'Ticket Extraction',
        detail: 'RC4-HMAC encrypted TGS request for svc_backup_admin ticket without valid Kerberos pre-authentication token.',
        evidence: 'Heuristic entropy score: 7.92 (indicator of hash extraction).',
        techniqueId: 'T1078.002'
      },
      {
        step: 3,
        timestamp: '20:41:00',
        phase: 'Lateral Hop Attempt',
        detail: 'Direct SMB Named Pipe connection to DC-PRIMARY-01 IPC$ share using extracted credential ticket.',
        evidence: 'Session established outside authorized jump host IP range.',
        techniqueId: 'T1021.002'
      },
      {
        step: 4,
        timestamp: '20:41:15',
        phase: 'Autonomous Mitigation Triggered',
        detail: 'Autonomous defense triggered: Host WS-FIN-04 placed in micro-isolation; svc_backup_admin session revoked globally in 410ms.',
        evidence: 'Zero DC registry modifications committed; egress shut down.',
        techniqueId: 'T1003.001'
      }
    ],
    technicalEvidence: [
      { type: 'IP Address', value: '198.51.100.187', description: 'External C2 proxy node mapped to known adversary ASN 49502' },
      { type: 'User Account', value: 'corp\\svc_backup_admin', description: 'Privileged service principal targeted for offline hash cracking' },
      { type: 'SHA-256 Hash', value: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', description: 'In-memory Mimikatz reflection payload' },
      { type: 'File Path', value: '\\\\DC-PRIMARY-01\\admin$\\system32\\cmd.exe', description: 'Attempted administrative share pipe target' }
    ],
    defensiveActions: [
      {
        id: 'ACT-101',
        actionType: 'ISOLATE_HOST',
        target: 'WS-FIN-04 (10.0.12.84)',
        severity: 'CRITICAL',
        triggeredAt: '20:41:15',
        executionTimeMs: 410,
        status: 'EXECUTED',
        isAutonomous: true,
        details: 'Dispatched 802.1X VLAN quarantine and local firewall drop filter.'
      },
      {
        id: 'ACT-102',
        actionType: 'REVOKE_TOKEN',
        target: 'svc_backup_admin',
        severity: 'CRITICAL',
        triggeredAt: '20:41:16',
        executionTimeMs: 180,
        status: 'EXECUTED',
        isAutonomous: true,
        details: 'Invalidated Kerberos Golden/Silver ticket cache across Active Directory.'
      }
    ]
  },
  {
    id: 'INC-2026-8802',
    title: 'High-Entropy DNS Tunneling & Database Exfiltration Probe',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    category: 'Exfiltration / Command & Control',
    detectedAt: '2026-09-18 20:34:02',
    targetAsset: 'PROD-PAYMENT-DB-02',
    targetAssetType: 'Database Server',
    sourceIp: '203.0.113.55',
    confidence: 93,
    falsePositiveLikelihood: 7,
    blastRadiusScore: 72,
    affectedAccounts: ['app_payment_gateway'],
    correlatedEventIds: ['EVT-903', 'EVT-905'],
    executiveSummary: 'Continuous network inspection detected 2,400+ pseudo-random subdomains resolved under an unregistered apex domain via Port 53 UDP, carrying base32 encoded database records.',
    mitreTechniques: [
      { id: 'T1071.004', name: 'Application Layer Protocol: DNS', phase: 'Command and Control' },
      { id: 'T1048.003', name: 'Exfiltration Over Alternative Protocol: DNS Tunneling', phase: 'Exfiltration' },
      { id: 'T1005', name: 'Data from Local System', phase: 'Collection' }
    ],
    attackSequence: [
      {
        step: 1,
        timestamp: '20:31:10',
        phase: 'Data Aggregation',
        detail: 'Anomalous SELECT statement execution on payment schema table exceeding 5x standard row limit.',
        evidence: 'Query triggered from non-business hours background process ID 4419.',
        techniqueId: 'T1005'
      },
      {
        step: 2,
        timestamp: '20:33:45',
        phase: 'Covert Channel Initiation',
        detail: 'Rapid iterative DNS queries with high Shannon entropy (>4.65) to nameserver ns1.sync-cloud-telemetry.org.',
        evidence: 'Payload packets carrying encoded customer profile fragments.',
        techniqueId: 'T1071.004'
      },
      {
        step: 3,
        timestamp: '20:34:02',
        phase: 'Autonomous Perimeter Shunt',
        detail: 'Autonomous defense triggered: Port 53 outbound UDP destination blackholed for the originating container.',
        evidence: 'Prevented ~45MB of credit vault fragments from transmission.',
        techniqueId: 'T1048.003'
      }
    ],
    technicalEvidence: [
      { type: 'Domain', value: '*.sync-cloud-telemetry.org', description: 'Adversary DNS tunneling endpoint registered 14 hours ago' },
      { type: 'IP Address', value: '203.0.113.55', description: 'Rogue nameserver answering recursive queries' },
      { type: 'Port / Protocol', value: 'UDP 53 (High-Entropy TXT records)', description: 'Exfiltration transport layer' }
    ],
    defensiveActions: [
      {
        id: 'ACT-103',
        actionType: 'BLOCK_IP',
        target: '203.0.113.55',
        severity: 'HIGH',
        triggeredAt: '20:34:02',
        executionTimeMs: 290,
        status: 'EXECUTED',
        isAutonomous: true,
        details: 'Egress edge gateway rule updated: blackhole route for adversary NS.'
      },
      {
        id: 'ACT-104',
        actionType: 'RATE_LIMIT',
        target: 'PROD-PAYMENT-DB-02 DNS resolver',
        severity: 'MEDIUM',
        triggeredAt: '20:34:03',
        executionTimeMs: 120,
        status: 'EXECUTED',
        isAutonomous: true,
        details: 'Enforced 10 qps query cap on internal resolver pod.'
      }
    ]
  },
  {
    id: 'INC-2026-8803',
    title: 'Cloud API Key Misuse & Mass S3 Bucket Enumeration',
    severity: 'MEDIUM',
    status: 'CONTAINED',
    category: 'Cloud Security / Credential Abuse',
    detectedAt: '2026-09-18 19:55:20',
    targetAsset: 'API-GATEWAY-EDGE-US-EAST',
    targetAssetType: 'API Gateway',
    sourceIp: '192.0.2.71',
    confidence: 89,
    falsePositiveLikelihood: 11,
    blastRadiusScore: 54,
    affectedAccounts: ['ci_cd_deploy_bot'],
    correlatedEventIds: ['EVT-907'],
    executiveSummary: 'Automated policy engine intercepted high-frequency CloudTrail ListBuckets and GetObject requests from a newly provisioned VPN IP using a CI/CD automation token.',
    mitreTechniques: [
      { id: 'T1580', name: 'Cloud Infrastructure Discovery', phase: 'Discovery' },
      { id: 'T1530', name: 'Data from Cloud Storage Object', phase: 'Collection' }
    ],
    attackSequence: [
      {
        step: 1,
        timestamp: '19:52:10',
        phase: 'Token Access',
        detail: 'CI/CD pipeline secret accessed from unrecognized IP geolocation (Frankfurt datacenter).',
        evidence: 'User-Agent header: python-requests/2.31.0 instead of standard runner agent.',
        techniqueId: 'T1580'
      },
      {
        step: 2,
        timestamp: '19:55:20',
        phase: 'Storage Sweep',
        detail: 'Sequential enumeration of 42 private enterprise storage buckets.',
        evidence: '89 requests per second logged via CloudTrail API.',
        techniqueId: 'T1530'
      }
    ],
    technicalEvidence: [
      { type: 'User Account', value: 'ci_cd_deploy_bot', description: 'Service account with elevated cloud read IAM permissions' },
      { type: 'IP Address', value: '192.0.2.71', description: 'Commercial VPN exit node used for token invocation' }
    ],
    defensiveActions: [
      {
        id: 'ACT-105',
        actionType: 'REVOKE_TOKEN',
        target: 'ci_cd_deploy_bot',
        severity: 'HIGH',
        triggeredAt: '19:55:22',
        executionTimeMs: 340,
        status: 'EXECUTED',
        isAutonomous: true,
        details: 'Deactivated AWS IAM access key ID AKIA... and attached DenyAll policy.'
      }
    ]
  }
];

export const INITIAL_TELEMETRY_EVENTS: TelemetryEvent[] = [
  {
    id: 'EVT-1001',
    timestamp: '20:47:12',
    category: 'NETWORK',
    sourceIp: '10.0.12.84',
    destinationIp: '10.0.4.10',
    sourceAsset: 'WS-FIN-04',
    destinationAsset: 'DC-PRIMARY-01',
    protocol: 'TCP 88',
    action: 'Kerberos TGS_REQ',
    anomalyScore: 94,
    isGenuineThreat: true,
    classificationReason: 'Uncached RC4 Kerberos cipher requested for administrative SPN from workstation',
    rawPayloadSnippet: 'TGS-REQ: realm=CORP.INTERNAL sname=krbtgt/CORP.INTERNAL etype=rc4-hmac',
    flaggedBy: 'ANOMALY_ENGINE'
  },
  {
    id: 'EVT-1002',
    timestamp: '20:47:09',
    category: 'SYSTEM',
    sourceIp: '10.0.8.22',
    destinationIp: '10.0.8.22',
    sourceAsset: 'SRV-BACKUP-NODE',
    destinationAsset: 'SRV-BACKUP-NODE',
    protocol: 'LOCAL IPC',
    action: 'Nightly Snapshot Tarball',
    anomalyScore: 32,
    isGenuineThreat: false,
    classificationReason: 'Elevated disk I/O matches verified weekly maintenance cronjob schedule (Reduced False Positive)',
    rawPayloadSnippet: '/usr/bin/borg create --compression lz4 /mnt/backup::snap-20260918',
    flaggedBy: 'BENIGN_BASELINE'
  },
  {
    id: 'EVT-1003',
    timestamp: '20:46:58',
    category: 'NETWORK',
    sourceIp: '10.0.12.84',
    destinationIp: '198.51.100.187',
    sourceAsset: 'WS-FIN-04',
    destinationAsset: 'EXT-PROXY-NODE',
    protocol: 'TCP 443',
    action: 'Jittered Beacon Handshake',
    anomalyScore: 98,
    isGenuineThreat: true,
    classificationReason: 'Strict 45-second periodicity with cryptographic entropy matching CobaltStrike malleable C2 profile',
    rawPayloadSnippet: 'GET /api/v2/telemetry/heartbeat?session=e3b0c442 HTTP/1.1 (TLS 1.3 JA3: 72a589dc)',
    flaggedBy: 'BEHAVIORAL_HEURISTIC'
  },
  {
    id: 'EVT-1004',
    timestamp: '20:46:45',
    category: 'AUTH',
    sourceIp: '172.16.0.4',
    destinationIp: '10.0.2.1',
    sourceAsset: 'VPN-GATEWAY',
    destinationAsset: 'RADIUS-AUTH-01',
    protocol: 'RADIUS/UDP',
    action: 'MFA Push Approved',
    anomalyScore: 12,
    isGenuineThreat: false,
    classificationReason: 'Standard employee authentication from registered corporate laptop with device certificate',
    rawPayloadSnippet: 'Access-Accept: User=a.chen@corp.com State=Valid FIDO2_CONFIRMED',
    flaggedBy: 'BENIGN_BASELINE'
  },
  {
    id: 'EVT-1005',
    timestamp: '20:46:30',
    category: 'ENDPOINT',
    sourceIp: '10.0.12.84',
    destinationIp: '10.0.12.84',
    sourceAsset: 'WS-FIN-04',
    destinationAsset: 'WS-FIN-04',
    protocol: 'OS HOOK',
    action: 'Process Injection (QueueUserAPC)',
    anomalyScore: 99,
    isGenuineThreat: true,
    classificationReason: 'powershell.exe injected shellcode into unbacked memory region of svchost.exe (PID 844)',
    rawPayloadSnippet: 'VirtualAllocEx: FlAllocationType=0x3000 FlProtect=0x40 (PAGE_EXECUTE_READWRITE)',
    flaggedBy: 'ANOMALY_ENGINE'
  },
  {
    id: 'EVT-1006',
    timestamp: '20:46:15',
    category: 'CLOUD_API',
    sourceIp: '192.0.2.71',
    destinationIp: '169.254.169.254',
    sourceAsset: 'CLOUD-INSTANCE-09',
    destinationAsset: 'AWS IMDSv2',
    protocol: 'HTTP',
    action: 'Token Exfiltration Probe',
    anomalyScore: 88,
    isGenuineThreat: true,
    classificationReason: 'Unauthorized HTTP request to cloud instance metadata service attempting to extract IAM roles',
    rawPayloadSnippet: 'GET /latest/meta-data/iam/security-credentials/ HTTP/1.1 User-Agent: curl/7.88',
    flaggedBy: 'BEHAVIORAL_HEURISTIC'
  },
  {
    id: 'EVT-1007',
    timestamp: '20:45:50',
    category: 'NETWORK',
    sourceIp: '10.0.14.99',
    destinationIp: '10.0.14.1',
    sourceAsset: 'DEV-RUNNER-02',
    destinationAsset: 'K8S-INGRESS',
    protocol: 'TCP 8080',
    action: 'CI Load Stress Test',
    anomalyScore: 45,
    isGenuineThreat: false,
    classificationReason: 'Spike of 5,000 HTTP requests originates from registered Jenkins build agent during pipeline run',
    rawPayloadSnippet: 'POST /v1/test/benchmark X-Automated-Test: true RunID: 99402',
    flaggedBy: 'BENIGN_BASELINE'
  }
];

export const INITIAL_PATTERNS: RecurringPattern[] = [
  {
    id: 'PAT-01',
    pattern: 'Kerberoasting -> LSASS Memory Injection -> SMB Named Pipe Traversal',
    trend: '+38% increase in active APT campaigns targeting Active Directory',
    risk: 'CRITICAL',
    affectedVectors: 'Windows Domain Controllers, Financial Workstations',
    occurrences: 14
  },
  {
    id: 'PAT-02',
    pattern: 'High-Entropy DNS Over UDP Tunneling for Covert Data Exfil',
    trend: 'Emerging tactic bypassing standard perimeter HTTP proxies',
    risk: 'HIGH',
    affectedVectors: 'Core SQL & Payment Database Clusters',
    occurrences: 9
  },
  {
    id: 'PAT-03',
    pattern: 'Compromised Automation API Tokens for Cloud Object Reconnaissance',
    trend: 'Declining (-42%) after autonomous token revocation policy enforcement',
    risk: 'MEDIUM',
    affectedVectors: 'Cloud CI/CD pipelines, IAM Service Principals',
    occurrences: 21
  }
];

export const INITIAL_LEARNING_METRICS: LearningMetric = {
  anomalyPrecisionScore: '98.6%',
  falsePositiveReductionRate: '84.1%',
  modelAdaptationEpochs: 248,
  threatSignaturesGenerated: 62
};
