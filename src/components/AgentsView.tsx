import { useState, useEffect } from 'react';
import { Play, Plus, MessageSquare, ChevronLeft, Check } from 'lucide-react';
import { AGENTS } from '../lib/demoData';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { PageHeader } from './ui/PageHeader';
import type { Agent, Message } from '../types';

const AGENT_INTROS: Record<string, string> = {
  'a1': `Ich bin der **Recherche-Assistent**.

Ich analysiere Informationen, vergleiche Optionen und erstelle strukturierte Entscheidungsvorlagen – für jeden Unternehmensbereich.

**Was ich konkret tun kann:**
- Zwei oder mehr Optionen gegenüberstellen und bewerten
- Dokumente auf relevante Punkte analysieren
- Entscheidungsvorlagen mit klarer Empfehlung erstellen
- Vor- und Nachteile strukturiert herausarbeiten

Ich bin branchenunabhängig – egal ob Einkauf, HR, Marketing, Recht oder Finanzen.

**Testen Sie mich:** Nennen Sie mir zwei Optionen die Sie gerade abwägen.`,

  'a2': `Ich bin der **Dokumenten-Assistent**.

Ich lese Dokumente, extrahiere was wichtig ist und bringe es in eine klare Struktur.

**Was ich konkret tun kann:**
- Lange Dokumente in wenigen Punkten zusammenfassen
- Fristen, Zahlen und Termine aus Texten extrahieren
- Verträge auf kritische Klauseln prüfen
- Protokolle und Berichte strukturiert aufbereiten

**Testen Sie mich:** Beschreiben Sie ein Dokument das Sie regelmäßig manuell aufbereiten müssen – ich zeige wie ich dabei helfen kann.`,

  'a3': `Ich bin der **Planungs-Assistent**.

Ich strukturiere Aufgaben, Termine und Ressourcen – für Projekte, Teams und Prozesse jeder Art.

**Was ich konkret tun kann:**
- Projektpläne und Zeitpläne erstellen
- Aufgaben auf Personen und Teams verteilen
- Risiken in Planungen identifizieren
- Checklisten für komplexe Abläufe generieren

**Testen Sie mich:** Beschreiben Sie ein aktuelles Planungsproblem – ich helfe es zu strukturieren.`,

  'a4': `Ich bin der **Prozess-Assistent**.

Ich analysiere wie Dinge ablaufen und finde wo Zeit und Aufwand eingespart werden kann.

**Was ich konkret tun kann:**
- Bestehende Abläufe analysieren und verbessern
- Engpässe und Ineffizienzen identifizieren
- Standard-Prozesse dokumentieren
- Optimierungsvorschläge mit konkreten Schritten

**Testen Sie mich:** Beschreiben Sie einen Prozess in Ihrem Unternehmen den Sie verbessern möchten.`,
};

const EXECUTION_STEPS: Record<string, string[]> = {
  'a1': ['Anfrage analysiert', 'Relevante Quellen gesucht', 'Informationen strukturiert', 'Ergebnis aufbereitet', 'Abgeschlossen'],
  'a2': ['Dokument empfangen', 'Schlüsselinformationen extrahiert', 'Struktur erkannt', 'Zusammenfassung generiert', 'Abgeschlossen'],
  'a3': ['Planungsziel erfasst', 'Ressourcen geprüft', 'Zeitplan berechnet', 'Checkliste erstellt', 'Abgeschlossen'],
  'a4': ['Prozess aufgenommen', 'Schritte analysiert', 'Engpässe identifiziert', 'Optimierung vorgeschlagen', 'Abgeschlossen'],
};

function AgentChatView({ agent, onBack }: { agent: Agent; onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const intro =
      AGENT_INTROS[agent.id] ??
      `Ich bin **${agent.name}**.\n\n${agent.description}\n\nStellen Sie mir eine Frage zu meinem Aufgabenbereich.`;
    setMessages([{ id: 'intro', role: 'assistant', content: intro, timestamp: new Date() }]);
  }, []);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('https://prozessia.vercel.app/api/chat?stream=false', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Tenant-ID': 'demo' },
        body: JSON.stringify({
          messages: newMessages
            .filter((m) => m.id !== 'intro')
            .map((m) => ({ role: m.role, content: m.content })),
          agentId: agent.id,
          enableRAG: false,
        }),
      });
      const data = await response.json();
      setMessages([
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.text || 'Ich bin bereit – stellen Sie mir eine Frage.',
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Verbindungsfehler. Bitte erneut versuchen.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text: string) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-7 py-4 bg-white border-b border-[#E4E4E7]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] text-[#52525B] hover:text-[#09090B]"
        >
          <ChevronLeft size={14} /> Zurück
        </button>
        <div className="w-px h-4 bg-[#E4E4E7]" />
        <div className="w-7 h-7 rounded-[8px] bg-[#18181B] flex items-center justify-center text-white text-[11px] font-semibold">
          {agent.name[0]}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#09090B]">{agent.name}</p>
          <p className="text-[12px] text-[#A1A1AA]">{agent.description}</p>
        </div>
        <Badge
          label={agent.status === 'active' ? 'Aktiv' : 'Pausiert'}
          variant={agent.status === 'active' ? 'active' : 'paused'}
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 bg-[#FAFAFA]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-[8px] bg-[#18181B] flex items-center justify-center text-white text-[11px] font-semibold shrink-0">
                {agent.name[0]}
              </div>
            )}
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-[12px] text-[14px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#18181B] text-white rounded-tr-[4px]'
                  : 'bg-white border border-[#E4E4E7] rounded-tl-[4px] shadow-sm text-[#09090B]'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-[8px] bg-[#18181B] flex items-center justify-center text-white text-[11px] font-semibold">
              {agent.name[0]}
            </div>
            <div className="bg-white border border-[#E4E4E7] rounded-[12px] rounded-tl-[4px] px-4 py-3 flex gap-1.5 shadow-sm">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#A1A1AA] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="px-6 pb-4 pt-2 bg-[#FAFAFA]">
        <div className="flex items-center gap-2 bg-white border border-[#E4E4E7] rounded-[12px] px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={`Nachricht an ${agent.name}...`}
            className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder-[#A1A1AA]"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${
              input.trim() && !loading ? 'bg-[#18181B] text-white' : 'bg-[#F4F4F5] text-[#A1A1AA]'
            }`}
          >
            <MessageSquare size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AgentsView() {
  const [chatAgent, setChatAgent] = useState<Agent | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [runningAgent, setRunningAgent] = useState<{ id: string; step: number } | null>(null);

  const runAgent = (agent: Agent) => {
    const steps = EXECUTION_STEPS[agent.id] ?? EXECUTION_STEPS['a1'];
    setRunningAgent({ id: agent.id, step: 0 });
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= steps.length - 1) {
        clearInterval(interval);
        setRunningAgent({ id: agent.id, step: steps.length - 1 });
        setTimeout(() => setRunningAgent(null), 2500);
      } else {
        setRunningAgent({ id: agent.id, step });
      }
    }, 650);
  };

  const statusVariant = (s: string): 'active' | 'paused' | 'error' | 'draft' =>
    s === 'active' ? 'active' : s === 'paused' ? 'paused' : s === 'error' ? 'error' : 'draft';

  const statusLabel = (s: string) =>
    s === 'active' ? 'Aktiv' : s === 'paused' ? 'Pausiert' : s === 'error' ? 'Fehler' : 'Entwurf';

  if (chatAgent) return <AgentChatView agent={chatAgent} onBack={() => setChatAgent(null)} />;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Agenten"
        subtitle="Spezialisierte KI-Assistenten für wiederkehrende Aufgaben"
        action={
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} />
            Agent hinzufügen
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-7 bg-[#FAFAFA]">
        <div className="grid grid-cols-2 gap-4">
          {AGENTS.map((agent) => {
            const steps = EXECUTION_STEPS[agent.id] ?? EXECUTION_STEPS['a1'];
            const running = runningAgent?.id === agent.id ? runningAgent : null;
            return (
              <Card key={agent.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[#F4F4F5] flex items-center justify-center text-[#52525B] font-semibold text-[13px]">
                    {agent.name[0]}
                  </div>
                  <Badge label={statusLabel(agent.status)} variant={statusVariant(agent.status)} />
                </div>
                <h3 className="text-[14px] font-semibold text-[#09090B] mb-1">{agent.name}</h3>
                <p className="text-[13px] text-[#52525B] leading-relaxed mb-3">{agent.description}</p>
                <div className="flex items-center justify-between text-[11px] text-[#A1A1AA] mb-3">
                  <span>{agent.runCount} Ausführungen</span>
                  <span>{agent.category}</span>
                </div>

                {running ? (
                  <div className="pt-3 border-t border-[#E4E4E7]">
                    <p className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-[0.05em] mb-2.5">
                      Ausführung läuft
                    </p>
                    <div className="flex flex-col gap-2">
                      {steps.map((stepLabel, i) => {
                        const done = i < running.step;
                        const active = i === running.step;
                        const pending = i > running.step;
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-2.5 text-[12px] transition-all duration-300 ${
                              pending ? 'opacity-25' : 'opacity-100'
                            }`}
                          >
                            {done ? (
                              <div className="w-4 h-4 rounded-full bg-[#18181B] flex items-center justify-center shrink-0">
                                <Check size={9} color="white" strokeWidth={3} />
                              </div>
                            ) : active ? (
                              <div className="w-4 h-4 rounded-full border-2 border-[#18181B] border-t-transparent animate-spin shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-[#D4D4D8] shrink-0" />
                            )}
                            <span
                              className={
                                done
                                  ? 'text-[#52525B] line-through decoration-[#A1A1AA]'
                                  : active
                                  ? 'text-[#09090B] font-medium'
                                  : 'text-[#A1A1AA]'
                              }
                            >
                              {stepLabel}
                            </span>
                            {done && (
                              <span className="ml-auto text-[10px] text-[#A1A1AA]">✓</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-1.5 pt-3 border-t border-[#E4E4E7]">
                    <Button size="sm" variant="primary" onClick={() => setChatAgent(agent)}>
                      <MessageSquare size={12} />
                      Chat starten
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => runAgent(agent)}>
                      <Play size={12} />
                      Ausführen
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {showCreate && (
        <Modal title="Agenten – Ihr Team immer mit dem richtigen Kontext" onClose={() => setShowCreate(false)}>
          <div className="flex flex-col gap-5">
            <p className="text-[14px] text-[#52525B] leading-relaxed">
              Agenten sind spezialisierte KI-Assistenten die Sie einmal konfigurieren – und die dann immer wissen was ihre Aufgabe ist. Ihr Team chattet direkt mit dem zuständigen Agenten statt jeden Tag denselben Kontext neu zu erklären.
            </p>

            <div className="flex flex-col gap-2.5">
              {[
                { emoji: '🔍', title: 'Spezialisiert', text: 'Jeder Agent kennt seinen Bereich – und gibt präzisere Antworten als ein generischer Assistent.' },
                { emoji: '💬', title: 'Konversationell', text: 'Ihr Team chattet natürlich mit dem Agenten. Kein Formular, kein System – einfach fragen.' },
                { emoji: '🔗', title: 'Verbunden', text: 'Agenten haben Zugriff auf Ihre Wissensbasis und Ihre Systeme – und liefern fundierte Antworten.' },
                { emoji: '⚡', title: 'Automatisierbar', text: 'Agenten können in Workflows eingebunden werden und Aufgaben vollautomatisch erledigen.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#F7F7F8] rounded-[8px] px-3 py-2.5">
                  <span className="text-[18px] shrink-0">{item.emoji}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#09090B]">{item.title}</p>
                    <p className="text-[12px] text-[#52525B] mt-0.5 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#F0F9FF] border border-blue-100 rounded-[8px] px-4 py-3">
              <p className="text-[13px] text-blue-800 leading-relaxed">
                In der Vollversion konfigurieren Sie eigene Agenten in natürlicher Sprache – ohne Programmierkenntnisse. In einer persönlichen Demo zeigen wir Ihnen wie das für Ihr Unternehmen aussehen kann.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E4E4E7]">
              <p className="text-[12px] text-[#A1A1AA]">Eigene Agenten in der Vollversion</p>
              <a
                href="https://calendly.com/sebastian-spuhler/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#18181B] text-white text-[13px] font-medium rounded-[7px] hover:bg-[#27272A] transition-colors"
              >
                Demo buchen →
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
