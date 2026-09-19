import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Terminal, 
  ShieldAlert, 
  Zap, 
  Cpu, 
  Check, 
  Copy, 
  User, 
  CornerDownLeft,
  Server,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { ChatMessage, SecurityIncident } from '../types';

interface AiAssistantViewProps {
  activeIncident: SecurityIncident | null;
  allIncidents: SecurityIncident[];
  onSelectIncident: (id: string) => void;
  onExecuteSuggestedAction?: (actionType: string, payload: string) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  activeIncident,
  allIncidents,
  onSelectIncident,
  onExecuteSuggestedAction
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'assistant',
      content: `Hello, Security Administrator. I am your autonomous AI Investigation Assistant. I have indexed the active telemetry stream and correlated incident graphs.
I am currently monitoring **${activeIncident?.title || 'Global SOC Telemetry'}**. You can ask me to reconstruct attack vectors, evaluate blast radius, generate firewall rules, or explain anomalous heuristics.`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    {
      label: 'Evaluate Blast Radius',
      prompt: `Evaluate the potential blast radius and affected peer systems if ${activeIncident?.targetAsset || 'the target asset'} is fully compromised.`
    },
    {
      label: 'Generate Firewall ACL',
      prompt: `Generate immediate perimeter firewall blocking rules (iptables and AWS Security Group syntax) for adversary IP ${activeIncident?.sourceIp || '198.51.100.187'}.`
    },
    {
      label: 'Explain Genuine vs FP',
      prompt: `Explain why this incident was classified as a genuine security threat rather than a false-positive baseline spike.`
    },
    {
      label: 'Containment Strategy',
      prompt: `What are the step-by-step autonomous and manual containment actions recommended for this attack profile?`
    }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/investigate-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          incidentContext: activeIncident
        })
      });
      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Analysis completed with no additional telemetry flags.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error contacting investigation assistant:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          content: 'Autonomous investigation assistant encountered a network exception. Please verify backend connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'm-init',
        role: 'assistant',
        content: `Investigation session reset. Context loaded for **${activeIncident?.title || 'Global Telemetry'}**. How can I assist with your triage?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-140px)] min-h-[600px]">
      {/* Left Sidebar: Active Context Selector */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              Investigation Scope
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Injected Context
            </span>
          </div>

          <div className="mb-3">
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Active Security Incident:
            </label>
            <select
              value={activeIncident?.id || ''}
              onChange={e => onSelectIncident(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              {allIncidents.map(inc => (
                <option key={inc.id} value={inc.id}>
                  [{inc.severity}] {inc.id}: {inc.title.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>

          {activeIncident && (
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs font-mono mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Asset:</span>
                <span className="text-cyan-300 font-semibold truncate max-w-[170px]">{activeIncident.targetAsset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Source:</span>
                <span className="text-rose-400">{activeIncident.sourceIp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Confidence:</span>
                <span className="text-emerald-400">{activeIncident.confidence}% Genuine</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Blast Radius:</span>
                <span className="text-amber-400">{activeIncident.blastRadiusScore}/100</span>
              </div>
            </div>
          )}

          {/* Forensic Quick Prompts */}
          <div className="space-y-1.5 flex-1">
            <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase">
              Triage Forensic Prompts
            </div>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                disabled={isLoading}
                className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-between group cursor-pointer disabled:opacity-50"
              >
                <span className="truncate pr-2">{qp.label}</span>
                <CornerDownLeft className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
              </button>
            ))}
          </div>

          <button
            onClick={handleResetChat}
            className="mt-3 w-full py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Conversation History</span>
          </button>
        </div>
      </div>

      {/* Right Main Chat Area */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-semibold text-white">AI Security Investigation Assistant</h2>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounding: Server-side Gemini 3.8 Flash • Live Incident Correlated
              </p>
            </div>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map(msg => {
            const isAsst = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAsst ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono ${
                    isAsst
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {isAsst ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                    isAsst
                      ? 'bg-slate-950 border border-slate-800 text-slate-200'
                      : 'bg-cyan-600 text-white font-medium shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70 font-mono">
                    <span>{isAsst ? 'AI SecOps Copilot' : 'Security Administrator'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {isAsst && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-end">
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="text-[10px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy response</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Correlating telemetry heuristics and generating forensic response...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI assistant to investigate telemetry, correlate IOCs, or draft mitigation commands..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
