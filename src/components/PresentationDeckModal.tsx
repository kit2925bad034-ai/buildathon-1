import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  ShieldAlert, 
  Cpu, 
  Layers, 
  Zap, 
  Sparkles, 
  FileText, 
  TrendingUp, 
  Lock, 
  Terminal, 
  Radio, 
  AlertTriangle,
  Server,
  Download
} from 'lucide-react';

interface Slide {
  page: number;
  badge: string;
  title: string;
  subtitle: string;
  highlights: { title: string; desc: string; icon: any }[];
  technicalMetrics?: { label: string; value: string; detail: string }[];
  speakerNotes: string;
}

const SLIDES: Slide[] = [
  {
    page: 1,
    badge: "EXECUTIVE SUMMARY",
    title: "AI-Powered Autonomous Cybersecurity",
    subtitle: "Real-Time Anomaly Detection, Sub-Second Autonomous Defense & Explainable Threat Intelligence",
    highlights: [
      {
        title: "Autonomous SOC Transformation",
        desc: "Replacing manual, reactive alert triage with continuous self-defending autonomous infrastructure.",
        icon: ShieldAlert
      },
      {
        title: "Heuristic Anomaly Scoring",
        desc: "Detecting previously unseen, zero-day threat behaviors across multi-vector telemetry streams.",
        icon: Radio
      },
      {
        title: "Sub-Second Containment",
        desc: "Executing automated micro-isolation and credential invalidation in under 500ms without human latency.",
        icon: Zap
      },
      {
        title: "Closed-Loop Learning",
        desc: "Continuous model recalibration from confirmed incidents and analyst feedback to eliminate alert fatigue.",
        icon: Cpu
      }
    ],
    technicalMetrics: [
      { label: "Target MTTM", value: "< 500ms", detail: "Mean Time To Mitigate" },
      { label: "False-Positive Reduction", value: "84.1%", detail: "Legitimate Baseline Filter" },
      { label: "Correlated Vectors", value: "5 Streams", detail: "Net, Auth, Sys, Ep, Cloud" }
    ],
    speakerNotes: "Welcome stakeholders. Today we present our solution for AI-Powered Autonomous Cybersecurity. Traditional SOCs are struggling under the weight of alert fatigue, with human analysts taking hours to correlate attacks. Our platform continuously ingests multi-vector telemetry, filters benign baseline spikes, and triggers sub-second autonomous defensive containment before damage can occur."
  },
  {
    page: 2,
    badge: "THE PROBLEM STATEMENT",
    title: "The Crisis in Modern Security Operations (SOC)",
    subtitle: "Why Traditional Rule-Based SIEMs & Manual Human Workflows Are Failing",
    highlights: [
      {
        title: "Crushing Alert Fatigue",
        desc: "SOC teams receive 10,000+ alerts daily; over 70% are benign false positives, resulting in critical blind spots.",
        icon: AlertTriangle
      },
      {
        title: "The Dwell-Time Asymmetry",
        desc: "Adversaries traverse lateral networks in minutes, while manual investigation and approvals take an average of 21 days.",
        icon: Terminal
      },
      {
        title: "Siloed Telemetry Blindness",
        desc: "Network packets, auth logs, and endpoint traces remain disconnected, obscuring distributed stealth campaigns.",
        icon: Layers
      },
      {
        title: "Unseen Zero-Day Vulnerabilities",
        desc: "Signature-based defenses fail completely against novel evasion techniques, memory injection, and DNS tunneling.",
        icon: Lock
      }
    ],
    technicalMetrics: [
      { label: "Industry Avg Dwell Time", value: "16-21 Days", detail: "Adversary Freedom in Network" },
      { label: "SOC Analyst Burnout", value: "62%", detail: "Alert Fatigue Churn Rate" },
      { label: "Avg Cost of Breach", value: "$4.45M", detail: "Financial Exposure per Incident" }
    ],
    speakerNotes: "To understand why autonomous cybersecurity is an urgent imperative, we must look at the status quo. The modern threat environment has outpaced human cognitive speed. Attackers automate reconnaissance and lateral hops, while security teams sift through noisy, disconnected alerts. When a breach occurs, the adversary has typically dwell-time for weeks before detection."
  },
  {
    page: 3,
    badge: "SYSTEM ARCHITECTURE",
    title: "Autonomous Cybersecurity Platform Architecture",
    subtitle: "A High-Throughput, Self-Healing, Closed-Loop Defensive Ecosystem",
    highlights: [
      {
        title: "1. Real-Time Telemetry Ingest",
        desc: "High-throughput asynchronous stream processing of Network, Kerberos/RADIUS auth, system calls, and Cloud API.",
        icon: Radio
      },
      {
        title: "2. Behavioral Anomaly Engine",
        desc: "Statistical entropy scoring + dynamic baseline comparisons distinguishing genuine threats from legitimate spikes.",
        icon: Cpu
      },
      {
        title: "3. Kill-Chain Correlation Engine",
        desc: "Multi-event correlation graph linking discrete alerts into unified probable attack sequences with MITRE ATT&CK mapping.",
        icon: Layers
      },
      {
        title: "4. Autonomous Policy Enforcement",
        desc: "Event-driven sub-second mitigation hub (VLAN isolation, Kerberos TGT invalidation, edge BGP blackholing).",
        icon: Zap
      }
    ],
    technicalMetrics: [
      { label: "Ingest Capacity", value: "100k+ eps", detail: "Zero-loss event throughput" },
      { label: "AI Engine", value: "Gemini 3.8", detail: "Server-side reasoning & triage" },
      { label: "Architecture", value: "Zero-Trust", detail: "Automated boundary shunts" }
    ],
    speakerNotes: "Here is the architectural blueprint of the AegisSOC platform. Telemetry flows into the Ingest Layer, where the Anomaly Engine evaluates behavioral deviation. If classified as a genuine threat, events are synthesized into an attack sequence, triggering the Autonomous Defense Hub to execute containment in milliseconds, while the continuous learning loop updates detection weights."
  },
  {
    page: 4,
    badge: "CORE PILLAR 1",
    title: "Real-Time Anomaly Detection & False-Positive Filtering",
    subtitle: "Catching Previously Unseen Threats While Eradicating Alert Noise",
    highlights: [
      {
        title: "Unseen Behavior Detection",
        desc: "Statistical baseline deviations detect non-signature threats such as DNS Shannon entropy spikes and in-memory process injection.",
        icon: Radio
      },
      {
        title: "Intelligent FP Suppression",
        desc: "Correlates high-volume traffic with verified schedule baselines (backup jobs, ETL batches, CI/CD) to prevent false alerts.",
        icon: ShieldAlert
      },
      {
        title: "Multi-Vector Categorization",
        desc: "Simultaneous categorization across Network packets, Auth logs, System syscalls, Endpoints, and Cloud APIs.",
        icon: Layers
      },
      {
        title: "Dynamic Confidence Scoring",
        desc: "Calculates an explicit 0-100% confidence rating alongside false-positive risk probability for transparent prioritization.",
        icon: TrendingUp
      }
    ],
    technicalMetrics: [
      { label: "Anomaly Precision", value: "98.6%", detail: "Zero-day detection accuracy" },
      { label: "FP Suppression Rate", value: "84.1%", detail: "Benign events auto-cleared" },
      { label: "Evaluation Latency", value: "< 12ms", detail: "Per-packet heuristic score" }
    ],
    speakerNotes: "Pillar 1 addresses the root cause of SOC failure: false positives and zero-day blindness. Our heuristic engine measures packet entropy, non-standard cipher suites, and abnormal RPC calls. Simultaneously, our baseline engine learns recurring enterprise schedules—like nightly backup tarballs or CI/CD stress tests—suppressing them automatically so analysts only see genuine threats."
  },
  {
    page: 5,
    badge: "CORE PILLAR 2",
    title: "AI Investigation & Attack Sequence Reconstruction",
    subtitle: "From Disconnected Logs to Unified, Explainable Kill-Chain Timelines",
    highlights: [
      {
        title: "Multi-Event Kill-Chain Graphs",
        desc: "Correlates disparate events (Kerberos TGS probe -> LSASS injection -> SMB named pipe) into a chronological attack path.",
        icon: Layers
      },
      {
        title: "MITRE ATT&CK Alignment",
        desc: "Automatically maps observable tactics and techniques (T1558 Kerberoasting, T1021 SMB, T1071 DNS Tunneling) in real time.",
        icon: Terminal
      },
      {
        title: "Blast Radius & Asset Impact",
        desc: "Computes affected systems, user principals, and lateral propagation risk across Domain Controllers and Databases.",
        icon: Server
      },
      {
        title: "Explainable AI Reasoning",
        desc: "Provides understandable, evidence-backed narrative justifications explaining why an anomaly is a genuine attack.",
        icon: Sparkles
      }
    ],
    technicalMetrics: [
      { label: "Correlation Speed", value: "85ms", detail: "Multi-vector graph synthesis" },
      { label: "MITRE Coverage", value: "92%", detail: "Enterprise matrix mapped" },
      { label: "Blast Radius Metric", value: "0-100", detail: "Automated impact scoring" }
    ],
    speakerNotes: "Pillar 2 converts raw logs into actionable intelligence. When an adversary strikes, they leave disjointed footprints across multiple servers. Our AI correlates these events into a step-by-step attack sequence mapped directly to the MITRE ATT&CK framework. Security leaders receive an explainable reasoning breakdown showing the observable evidence, affected accounts, and predicted blast radius."
  },
  {
    page: 6,
    badge: "CORE PILLAR 3",
    title: "Autonomous Response & Incident Management",
    subtitle: "Sub-Second Automated Defenses to Neutralize Threats in Mid-Flight",
    highlights: [
      {
        title: "802.1X Host Micro-Isolation",
        desc: "Instantly severs compromised workstations or servers into a quarantine VLAN, stopping lateral hops within 400ms.",
        icon: Lock
      },
      {
        title: "Global Credential Revocation",
        desc: "Invalidates Kerberos TGT tickets and rotates cloud IAM session tokens to neutralize stolen administrator credentials.",
        icon: Zap
      },
      {
        title: "Perimeter BGP/DNS Blackhole",
        desc: "Shunts rogue command-and-control (C2) IP addresses and sinks malicious DNS tunneling endpoints dynamically.",
        icon: ShieldAlert
      },
      {
        title: "Volatile Memory Forensic Snapshot",
        desc: "Captures complete RAM dumps and process trees for evidentiary integrity before terminating malicious PIDs.",
        icon: Terminal
      }
    ],
    technicalMetrics: [
      { label: "Mean Time to Contain", value: "380ms", detail: "Autonomous execution speed" },
      { label: "Dual Control Mode", value: "Auto / Manual", detail: "Configurable governance" },
      { label: "Zero-Downtime Shunt", value: "100%", detail: "Scoped asset microsegmentation" }
    ],
    speakerNotes: "Pillar 3 is where the platform shifts from passive detection to active defense. Rather than waiting for an analyst to wake up or respond to a ticket, our autonomous engine acts within milliseconds. It places the infected host in micro-isolation, invalidates Kerberos tokens, and blackholes C2 IPs—all while capturing forensic volatile RAM snapshots for compliance."
  },
  {
    page: 7,
    badge: "CORE PILLAR 4",
    title: "AI Investigation Assistant (SecOps Copilot)",
    subtitle: "Interactive, Natural-Language SecOps Copilot Powered by Gemini",
    highlights: [
      {
        title: "Live Incident Context Injection",
        desc: "The assistant automatically indexes the selected incident, affected telemetry, source IPs, and asset criticality.",
        icon: Sparkles
      },
      {
        title: "Ad-Hoc Forensic Inquiries",
        desc: "Analysts query packet entropy, evaluate blast radiuses, and cross-examine anomalous heuristics using natural language.",
        icon: Terminal
      },
      {
        title: "Automated Script & ACL Generation",
        desc: "Generates production-ready iptables rules, AWS Security Group policies, and PowerShell forensic scripts on demand.",
        icon: FileText
      },
      {
        title: "Decisive Containment Guidance",
        desc: "Recommends tailored remediation strategies based on active compliance standards and organizational risk tolerances.",
        icon: ShieldAlert
      }
    ],
    technicalMetrics: [
      { label: "Model Architecture", value: "Gemini 3.8 Flash", detail: "Server-side zero-leakage proxy" },
      { label: "Inquiry Response Time", value: "< 1.2s", detail: "Real-time interactive triage" },
      { label: "Code/ACL Syntax Support", value: "12+ Formats", detail: "iptables, AWS, Azure, PS1, Bash" }
    ],
    speakerNotes: "Pillar 4 provides security administrators with an elite AI co-pilot. Built directly upon Gemini 3.8 Flash, this assistant has instant access to live incident telemetry. Security teams can ask questions like 'Evaluate blast radius if we isolate this host' or 'Generate firewall rules for this C2 IP', receiving precise, actionable technical answers and executable scripts in seconds."
  },
  {
    page: 8,
    badge: "CORE PILLAR 5",
    title: "Continuous Learning & Proactive Intelligence",
    subtitle: "A Closed-Loop Feedback Engine That Grows Smarter With Every Attack",
    highlights: [
      {
        title: "Human-in-the-Loop Feedback Loop",
        desc: "Security analysts confirm genuine threats or flag false positives, instantly updating the anomaly scoring model.",
        icon: TrendingUp
      },
      {
        title: "Adaptive Baseline Whitelisting",
        desc: "Automatically synthesizes suppression rules for verified internal jobs to eliminate future alert noise.",
        icon: ShieldAlert
      },
      {
        title: "Behavioral Trend Discovery",
        desc: "Identifies emergent campaigns across the enterprise (e.g., +38% rise in Kerberoasting, new DoH beacon clusters).",
        icon: Layers
      },
      {
        title: "Proactive Prevention Insights",
        desc: "Autonomous AI recommendations to harden attack surfaces, configure honeypots, and close zero-day avenues.",
        icon: Cpu
      }
    ],
    technicalMetrics: [
      { label: "Model Adaptation Epochs", value: "248+", detail: "Continuous learning cycles" },
      { label: "Signatures Synthesized", value: "62 Threat Rules", detail: "Autonomous IOC generation" },
      { label: "Precision Improvement", value: "+2.4% / wk", detail: "Post-feedback reinforcement" }
    ],
    speakerNotes: "Pillar 5 closes the security loop. Most cybersecurity tools are static—once deployed, they decay. AegisSOC continuously learns. Every time an analyst confirms a threat or tunes a false positive, our model updates its weights. It synthesizes new detection signatures and generates proactive recommendations to harden infrastructure before adversaries can strike again."
  },
  {
    page: 9,
    badge: "VALIDATION & PROOF",
    title: "Real-World Threat Simulation & Performance Validation",
    subtitle: "Empirical Results from Live Adversarial Scenarios in the Platform Sandbox",
    highlights: [
      {
        title: "Scenario A: APT Kerberoasting",
        desc: "Adversary requested unauthenticated RC4 TGS ticket for Domain Controller. Platform isolated workstation WS-FIN-04 in 410ms.",
        icon: Lock
      },
      {
        title: "Scenario B: DNS Tunneling Exfiltration",
        desc: "2,400 pseudo-random Port 53 subdomains carrying base32 database records. Autonomous perimeter blackhole triggered in 290ms.",
        icon: Radio
      },
      {
        title: "Scenario C: Ransomware Canary Trigger",
        desc: "Mass file rename operations intercepted on NAS decoy canary. Process killed and snapshot frozen in 380ms.",
        icon: Zap
      },
      {
        title: "Scenario D: Benign Terabyte DB Backup",
        desc: "Massive disk I/O burst matched weekly maintenance cronjob. Engine recognized baseline and suppressed alert with 0 false flags.",
        icon: ShieldAlert
      }
    ],
    technicalMetrics: [
      { label: "Ransomware Containment", value: "380ms", detail: "Zero encrypted user files" },
      { label: "Exfiltration Blocked", value: "45 MB Vault", detail: "Data loss fully prevented" },
      { label: "FP Test Accuracy", value: "100%", detail: "Legitimate burst correctly cleared" }
    ],
    speakerNotes: "These are not theoretical promises—they are validated in our live simulation sandbox. When we simulate an APT Kerberoasting attack, the platform correlates the anomaly and isolates the target host in 410ms. When an adversary attempts DNS exfiltration, the egress route is blackholed in 290ms. And when tested against a heavy DB backup job, it generates zero false alerts."
  },
  {
    page: 10,
    badge: "BUSINESS IMPACT & ROI",
    title: "Measurable Business Value & Operational ROI",
    subtitle: "Slashing Dwell Time, Preventing Ransomware Catastrophes, and Empowering SecOps",
    highlights: [
      {
        title: "99% Reduction in Containment Time",
        desc: "Down from industry average of 16-21 days to sub-second autonomous micro-isolation.",
        icon: Zap
      },
      {
        title: "84% Reduction in Alert Fatigue",
        desc: "Filtering legitimate operational noise frees senior analysts to focus on high-impact strategic architecture.",
        icon: ShieldAlert
      },
      {
        title: "100% Audit & Compliance Readiness",
        desc: "Instant one-click structured incident reports in JSON and Markdown with complete chain of custody evidence.",
        icon: FileText
      },
      {
        title: "Future Roadmap",
        desc: "Zero-Trust Service Mesh integration, decentralized honey-token traps, and autonomous multi-agent defense swarms.",
        icon: TrendingUp
      }
    ],
    technicalMetrics: [
      { label: "Estimated ROI", value: "340%", detail: "Based on avoided breach costs" },
      { label: "Analyst Time Saved", value: "18 hrs / wk", detail: "Per tier-1/tier-2 SOC analyst" },
      { label: "Regulatory Readiness", value: "SOC 2, ISO, HIPAA", detail: "Immutable audit trail export" }
    ],
    speakerNotes: "In conclusion, AI-Powered Autonomous Cybersecurity transforms enterprise defense from an uphill human battle into an automated, sub-second protective fortress. We eliminate dwell time, relieve analyst burnout, ensure total audit compliance, and deliver proven ROI by stopping catastrophic data breaches before they can unfold. Thank you, and we welcome your questions."
  }
];

interface PresentationDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationDeckModal: React.FC<PresentationDeckModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide(prev => Math.min(prev + 1, SLIDES.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const slide = SLIDES[currentSlide];

  const handleCopyDeckMarkdown = () => {
    const md = SLIDES.map(s => `---
# Slide ${s.page}: ${s.title}
**[${s.badge}]** ${s.subtitle}

### Key Highlights:
${s.highlights.map(h => `- **${h.title}**: ${h.desc}`).join('\n')}

${s.technicalMetrics ? `### Performance Metrics:\n${s.technicalMetrics.map(m => `- **${m.label}**: ${m.value} (${m.detail})`).join('\n')}\n` : ''}
### Speaker Notes:
> ${s.speakerNotes}
`).join('\n\n');

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className={`bg-slate-900 border border-slate-800 rounded-2xl w-full flex flex-col overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'h-full max-w-full' : 'max-w-5xl h-[92vh]'
      }`}>
        {/* Top Control Bar */}
        <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Executive Presentation Deck (10 Slides)</span>
              <span className="text-[10px] text-slate-400 ml-2 font-mono">
                Slide {currentSlide + 1} of {SLIDES.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowNotes(prev => !prev)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                showNotes 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              Speaker Notes: {showNotes ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={handleCopyDeckMarkdown}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Deck' : 'Copy All 10 Slides'}</span>
            </button>

            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Canvas Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 font-sans">
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            {/* Slide Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {slide.badge}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  PAGE 0{slide.page} / 10
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                {slide.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {slide.subtitle}
              </p>
            </div>

            {/* Slide 4-Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {slide.highlights.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-all space-y-1.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-semibold text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-9">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Technical Metrics Banner */}
            {slide.technicalMetrics && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 grid grid-cols-3 gap-3 font-mono text-center">
                {slide.technicalMetrics.map((met, i) => (
                  <div key={i}>
                    <div className="text-[10px] text-slate-500 uppercase">{met.label}</div>
                    <div className="text-base sm:text-xl font-bold text-cyan-400 my-0.5">{met.value}</div>
                    <div className="text-[10px] text-slate-400 truncate">{met.detail}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Presenter Notes */}
            {showNotes && (
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/60 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-cyan-400 font-bold mb-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Presenter Notes & Speaking Transcript:</span>
                </div>
                <p className="italic leading-relaxed text-slate-300">
                  "{slide.speakerNotes}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Slide Navigation Bar */}
        <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Slide Indicator Dots / Jumpers */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {SLIDES.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-6 h-6 rounded-md font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {s.page}
              </button>
            ))}
          </div>

          {/* Prev / Next Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Use ← → arrow keys to navigate
            </span>

            <button
              onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 border border-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentSlide(prev => Math.min(prev + 1, SLIDES.length - 1))}
              disabled={currentSlide === SLIDES.length - 1}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
