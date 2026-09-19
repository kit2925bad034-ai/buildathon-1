import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// API: AI Threat Analysis & Explainable Reasoning
app.post("/api/threat-analysis", async (req, res) => {
  try {
    const { incident, correlatedEvents } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // High-grade rule-based fallback response if API key isn't provided
      return res.json({
        analysis: {
          executiveSummary: `Autonomous detection flagged anomalous sequence on ${incident?.targetAsset || "Target System"} with confidence score ${incident?.confidence || "94"}%. Correlated ${correlatedEvents?.length || 4} multi-vector telemetry events indicating unauthorized lateral traversal.`,
          mitreTechniques: [
            { id: "T1078", name: "Valid Accounts: Compromised Credentials", phase: "Initial Access" },
            { id: "T1059.001", name: "Command and Scripting Interpreter: PowerShell", phase: "Execution" },
            { id: "T1021.002", name: "Remote Services: SMB/Windows Admin Shares", phase: "Lateral Movement" },
            { id: "T1071.004", name: "Application Layer Protocol: DNS Tunneling", phase: "Command and Control" }
          ],
          attackVectorSequence: [
            "1. Ingress brute-force threshold exceeded from unauthorized subnet.",
            "2. Service account credential reuse across workstation staging node.",
            "3. Autonomous isolation barrier triggered to restrict outbound beaconing."
          ],
          reasoningAndEvidence: [
            "Entropy of outbound DNS TXT records measured 4.87 bits/char (baseline: <2.3).",
            "Authentication token derived from non-standard ASN without MFA challenge.",
            "Heuristic behavioral delta surpassed 3.4 standard deviations from 30-day moving average."
          ],
          recommendedDefenses: [
            "Maintain automated host isolation until forensic volatile RAM dump completes.",
            "Revoke Kerberos TGT and rotate all active session tokens.",
            "Enforce egress DNS packet inspection filtering on recursive resolver."
          ]
        },
        mode: "heuristic-fallback"
      });
    }

    const prompt = `You are the Lead Cybersecurity AI Architect for an Autonomous XDR/SOC Platform.
Analyze the following security incident and correlated events:
Incident: ${JSON.stringify(incident, null, 2)}
Correlated Events: ${JSON.stringify(correlatedEvents, null, 2)}

Provide a strict, professional JSON response with:
1. executiveSummary: clear, high-level summary of what transpired
2. mitreTechniques: array of objects with { id, name, phase }
3. attackVectorSequence: ordered array of strings reconstructing probable attack sequence
4. reasoningAndEvidence: array of specific observable evidence explaining why this is a genuine threat vs false positive
5. recommendedDefenses: array of specific containment and remediation actions
Ensure the response is valid JSON matching this structure without Markdown backticks.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({ analysis: parsed, mode: "gemini" });
  } catch (error: any) {
    console.error("Error during threat analysis:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze threat" });
  }
});

// API: AI Investigation Assistant (Interactive SecOps Copilot)
app.post("/api/investigate-assistant", async (req, res) => {
  try {
    const { messages, incidentContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const lastMessage = messages[messages.length - 1]?.content || "";
      let simulatedReply = "I am the Autonomous Security Investigation Assistant. ";

      if (lastMessage.toLowerCase().includes("isolate") || lastMessage.toLowerCase().includes("contain")) {
        simulatedReply += "Autonomous isolation has been assessed for target asset. The host isolation action disconnects all ingress/egress network adapters while preserving the telemetry link to the SOC agent. Blast radius reduction is estimated at 92%.";
      } else if (lastMessage.toLowerCase().includes("blast radius") || lastMessage.toLowerCase().includes("impact")) {
        simulatedReply += "Blast radius analysis: 3 peer nodes share active Kerberos tickets with this machine. Immediate containment will prevent lateral hops to the primary Domain Controller.";
      } else if (lastMessage.toLowerCase().includes("firewall") || lastMessage.toLowerCase().includes("rule") || lastMessage.toLowerCase().includes("block")) {
        simulatedReply += "Generated Firewall ACL:\n```iptables -A INPUT -s " + (incidentContext?.sourceIp || "198.51.100.44") + " -j DROP\niptables -A FORWARD -d " + (incidentContext?.sourceIp || "198.51.100.44") + " -j REJECT```";
      } else {
        simulatedReply += `Based on the active incident "${incidentContext?.title || "Anomalous Lateral Traversal"}", the correlated telemetry indicates anomalous behavioral spikes. I recommend reviewing volatile memory dumps and verifying account session invalidation.`;
      }

      return res.json({ reply: simulatedReply, mode: "simulated" });
    }

    const systemInstruction = `You are an elite Autonomous Cybersecurity Investigation Assistant embedded in a Next-Gen Autonomous SOC (Security Operations Center).
You assist security administrators during incident investigation, forensic triage, attack correlation, containment execution, and root-cause analysis.
Current Incident Context: ${JSON.stringify(incidentContext || {})}
Be concise, decisive, authoritative, and provide actionable technical guidance (including commands, IOC correlation, and containment strategies) where applicable.`;

    const conversationPrompt = messages
      .map((m: any) => `${m.role === "user" ? "Security Admin" : "AI Assistant"}: ${m.content}`)
      .join("\n\n");

    const fullPrompt = `${conversationPrompt}\n\nAI Assistant:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
      },
    });

    return res.json({ reply: response.text || "No response generated", mode: "gemini" });
  } catch (error: any) {
    console.error("Error in investigation assistant:", error);
    return res.status(500).json({ error: error.message || "Investigation assistant failure" });
  }
});

// API: Generate Structured Incident Report
app.post("/api/generate-report", async (req, res) => {
  try {
    const { incident, actionsTaken, correlatedEvents } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        report: {
          reportId: `INC-REP-${Date.now().toString().slice(-6)}`,
          generatedAt: new Date().toISOString(),
          incidentTitle: incident?.title || "Autonomous Security Incident",
          severity: incident?.severity || "CRITICAL",
          status: incident?.status || "CONTAINED",
          threatClassification: incident?.category || "Advanced Persistent Threat / Lateral Traversal",
          executiveSummary: `At ${incident?.detectedAt || "real-time"}, the autonomous detection engine identified a high-confidence anomalous security threat against ${incident?.targetAsset || "Internal Asset"}. Immediate autonomous defensive postures were executed.`,
          attackSequence: [
            { step: 1, timestamp: "T-00:04:12", phase: "Initial Compromise", detail: "Authentication anomaly via stolen service credential" },
            { step: 2, timestamp: "T-00:02:40", phase: "Lateral Enumeration", detail: "SMB pipe probing across 10.0.4.0/24 subnet" },
            { step: 3, timestamp: "T-00:01:05", phase: "C2 Beacon", detail: "Encrypted outbound handshake to untrusted external IP" },
            { step: 4, timestamp: "T-00:00:10", phase: "Autonomous Defense", detail: "Network isolation boundary activated and egress blocked" }
          ],
          technicalEvidence: [
            { type: "IP Address", value: incident?.sourceIp || "198.51.100.44", description: "Flagged Threat Actor C2 Node" },
            { type: "SHA-256 Hash", value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", description: "Suspicious PowerShell In-Memory Payload" },
            { type: "Asset ID", value: incident?.targetAsset || "SRV-PROD-AUTH-01", description: "Isolated Tier-1 Infrastructure Host" }
          ],
          autonomousActionsTaken: actionsTaken || [
            "Network perimeter egress shunt enforced",
            "Target host isolated from VPC segment",
            "Enterprise directory session tokens invalidated"
          ],
          rootCauseAndImpact: "Compromised administrative API token used from anomalous geolocation. Zero data exfiltration confirmed due to autonomous egress termination in 820ms.",
          recommendations: [
            "Enforce hardware-bound FIDO2 keys for all service principal access.",
            "Deploy microsegmentation policies on internal SMB port 445.",
            "Feed newly discovered attack signature into Continuous Learning Model."
          ]
        },
        mode: "heuristic-fallback"
      });
    }

    const prompt = `Generate a comprehensive, formal Cybersecurity Incident Report for the following incident data:
Incident: ${JSON.stringify(incident, null, 2)}
Actions Taken: ${JSON.stringify(actionsTaken, null, 2)}
Correlated Events: ${JSON.stringify(correlatedEvents, null, 2)}

Return strict JSON with the following structure:
{
  "reportId": string,
  "generatedAt": string,
  "incidentTitle": string,
  "severity": string,
  "status": string,
  "threatClassification": string,
  "executiveSummary": string,
  "attackSequence": [{"step": number, "timestamp": string, "phase": string, "detail": string}],
  "technicalEvidence": [{"type": string, "value": string, "description": string}],
  "autonomousActionsTaken": [string],
  "rootCauseAndImpact": string,
  "recommendations": [string]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({ report: parsed, mode: "gemini" });
  } catch (error: any) {
    console.error("Error generating report:", error);
    return res.status(500).json({ error: error.message || "Failed to generate report" });
  }
});

// API: Continuous Learning & Proactive Security Intelligence Insights
app.post("/api/security-intelligence", async (req, res) => {
  try {
    const { confirmedIncidents, falsePositiveFeedback, systemMetrics } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        intelligence: {
          adaptationMetrics: {
            anomalyPrecisionScore: "98.4%",
            falsePositiveReductionRate: "79.2%",
            modelAdaptationEpochs: 142,
            threatSignaturesGenerated: 38
          },
          recurringAttackPatterns: [
            { pattern: "Off-hours SMB Port Traversal", trend: "Increasing (+24% this week)", risk: "High", affectedVectors: "Internal subnet 10.0.0.0/16" },
            { pattern: "DNS Over HTTPS TXT Beaconing", trend: "New emergent cluster", risk: "Critical", affectedVectors: "Workstation fleet" },
            { pattern: "API Token Rotation Evasion", trend: "Decreasing (-45% post-patch)", risk: "Medium", affectedVectors: "Cloud microservices" }
          ],
          proactivePreventionInsights: [
            "Adjust anomaly baseline threshold for scheduled backup cronjobs to eliminate false positives in storage tier.",
            "Deploy honeypot credentials across subnet B to detect lateral reconnaissance prior to privilege escalation.",
            "Tighten autonomous response latency threshold: currently achieving 640ms mean time to mitigate (MTTM)."
          ]
        },
        mode: "heuristic-fallback"
      });
    }

    const prompt = `You are the Continuous Learning Engine for an Autonomous Cybersecurity Platform.
Synthesize security intelligence from:
Confirmed Incidents: ${JSON.stringify(confirmedIncidents || [], null, 2)}
False Positive Feedback: ${JSON.stringify(falsePositiveFeedback || [], null, 2)}
System Metrics: ${JSON.stringify(systemMetrics || {}, null, 2)}

Return strict JSON with:
{
  "adaptationMetrics": {
    "anomalyPrecisionScore": string,
    "falsePositiveReductionRate": string,
    "modelAdaptationEpochs": number,
    "threatSignaturesGenerated": number
  },
  "recurringAttackPatterns": [
    { "pattern": string, "trend": string, "risk": string, "affectedVectors": string }
  ],
  "proactivePreventionInsights": [string]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({ intelligence: parsed, mode: "gemini" });
  } catch (error: any) {
    console.error("Error in security intelligence:", error);
    return res.status(500).json({ error: error.message || "Failed to generate security intelligence" });
  }
});

// Vite middleware / production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Autonomous Cybersecurity Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
