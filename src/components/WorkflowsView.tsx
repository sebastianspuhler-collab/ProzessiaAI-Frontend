import { useState, useEffect } from 'react';
import { Zap, Play, Plus, Trash2, Clock, ChevronDown, ChevronUp, Bot, Bell, Database, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import { DEMO_CONTENT } from '../lib/demoContent';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { PageHeader } from './ui/PageHeader';
import { EmptyState } from './ui/EmptyState';
import type { Workflow, WorkflowRunResult, WorkflowNode } from '../types';

function nodeIcon(type: string) {
  if (type === 'agent') return <Bot size={11} />;
  if (type === 'notification') return <Bell size={11} />;
  if (type === 'adapter') return <Database size={11} />;
  return <Zap size={11} />;
}

export function WorkflowsView() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<WorkflowRunResult | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [nodeStates, setNodeStates] = useState<Record<string, 'active' | 'done'>>({});
  const [successBanner] = useState(false);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await api.get<{ workflows: Workflow[] }>('/api/workflows');
      setWorkflows(data.workflows ?? []);
    } catch {
      // non-fatal
    } finally {
      setLoading(false);
    }
  };

  const runWorkflow = async (wf: Workflow) => {
    setRunningId(wf.id);
    setExpandedId(wf.id);
    setNodeStates({});
    const nodes = wf.nodes ?? [];
    const animateNodes = async () => {
      for (const node of nodes) {
        setNodeStates((prev) => ({ ...prev, [node.id]: 'active' }));
        await new Promise((r) => setTimeout(r, 600));
        setNodeStates((prev) => ({ ...prev, [node.id]: 'done' }));
      }
    };
    try {
      const [data] = await Promise.all([
        api.post<WorkflowRunResult>('/api/workflows', { action: 'run', workflowId: wf.id }),
        animateNodes(),
      ]);
      setRunResult(data);
    } catch {
      // Fallback mock result for locally-created workflows
      setRunResult({
        runId: crypto.randomUUID(),
        status: 'completed',
        nodeResults: nodes.map((n) => ({
          nodeId: n.id,
          name: n.name,
          status: 'success',
          output: 'Schritt erfolgreich ausgeführt (Demo)',
        })),
        durationMs: nodes.length * 620,
      });
    } finally {
      setRunningId(null);
      setWorkflows((prev) =>
        prev.map((w) => (w.id === wf.id ? { ...w, runCount: w.runCount + 1 } : w))
      );
    }
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows((prev) => prev.filter((wf) => wf.id !== id));
  };

  const statusVariant = (s: string): 'active' | 'paused' | 'error' | 'draft' =>
    s === 'active' ? 'active' : s === 'paused' ? 'paused' : s === 'error' ? 'error' : 'draft';

  const statusLabel = (s: string) =>
    s === 'active' ? 'Aktiv' : s === 'paused' ? 'Pausiert' : s === 'error' ? 'Fehler' : 'Entwurf';

  const triggerLabel = (wf: Workflow) => {
    if (wf.trigger.type === 'schedule') return 'Zeitplan';
    if (wf.trigger.type === 'webhook') return 'Webhook';
    return 'Manuell';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Workflows"
        subtitle="Automatisierte Prozesse die im Hintergrund laufen"
        action={
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} />
            Neuer Workflow
          </Button>
        }
      />
      {successBanner && (
        <div className="mx-7 mt-5 flex items-center gap-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[8px] px-3.5 py-2.5">
          <CheckCircle size={14} className="text-[#16A34A] shrink-0" />
          <p className="text-[13px] text-[#15803D]">
            ✓ Workflow erstellt. Klicken Sie auf „Ausführen" um ihn zu testen.
          </p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-7 bg-[#FAFAFA]">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-white border border-[#E4E4E7] rounded-[10px] animate-pulse" />
            ))}
          </div>
        ) : workflows.length === 0 ? (
          <EmptyState
            icon={<Zap size={22} />}
            title="Noch keine Workflows"
            description="Erstellen Sie Ihren ersten automatisierten Workflow in natürlicher Sprache."
            action={
              <Button variant="primary" onClick={() => setShowCreate(true)}>
                Ersten Workflow erstellen
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {workflows.map((wf) => (
              <Card key={wf.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-semibold text-[#09090B] truncate">{wf.name}</h3>
                      <Badge label={statusLabel(wf.status)} variant={statusVariant(wf.status)} />
                    </div>
                    <p className="text-[13px] text-[#52525B] mb-2 line-clamp-1">{wf.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-[#A1A1AA]">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {triggerLabel(wf)}
                      </span>
                      <span>{wf.nodes?.length ?? 0} Schritte</span>
                      <span>{wf.runCount} Ausführungen</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 ml-4 shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => runWorkflow(wf)}
                      loading={runningId === wf.id}
                    >
                      <Play size={12} />
                      Ausführen
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedId(expandedId === wf.id ? null : wf.id)}
                    >
                      {expandedId === wf.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => deleteWorkflow(wf.id)}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>

                {expandedId === wf.id && wf.nodes && wf.nodes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#E4E4E7]">
                    <p className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-[0.05em] mb-2">
                      Schritte
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {wf.nodes.map((node: WorkflowNode, idx: number) => {
                        const ns = nodeStates[node.id];
                        return (
                          <div
                            key={node.id}
                            className={`flex items-center gap-2 rounded-[6px] px-3 py-2 transition-all ${
                              ns === 'active'
                                ? 'bg-[#FFF7ED] border border-[#FED7AA]'
                                : ns === 'done'
                                ? 'bg-[#F0FDF4] border border-[#BBF7D0]'
                                : 'bg-[#F7F7F8]'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                ns === 'active'
                                  ? 'bg-[#FB923C] text-white'
                                  : ns === 'done'
                                  ? 'bg-[#22C55E] text-white'
                                  : 'bg-[#E4E4E7] text-[#52525B]'
                              }`}
                            >
                              {ns === 'done' ? <CheckCircle size={11} /> : nodeIcon(node.type)}
                            </span>
                            <span className="text-[12px] font-medium text-[#09090B]">{node.name}</span>
                            {ns === 'active' && (
                              <span className="text-[11px] text-[#EA580C] ml-auto animate-pulse">läuft…</span>
                            )}
                            {ns === 'done' && (
                              <span className="text-[11px] text-[#16A34A] ml-auto">✓</span>
                            )}
                            {!ns && <span className="text-[11px] text-[#A1A1AA] ml-auto">{idx + 1}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Workflows – Automatisierung ohne Code" onClose={() => setShowCreate(false)}>
          <div className="flex flex-col gap-5">
            <p className="text-[14px] text-[#52525B] leading-relaxed">
              Workflows automatisieren mehrstufige Prozesse die heute manuell oder halbautomatisch ablaufen. Sie definieren was passieren soll – Prozessia führt es aus, zuverlässig und ohne Eingriff.
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-semibold text-[#09090B]">Was Workflows erledigen können:</p>
              {[
                { emoji: '⏰', title: 'Zeitgesteuert', text: 'Jeden Montag automatisch einen Report erstellen und versenden' },
                { emoji: '📥', title: 'Ereignisgesteuert', text: 'Sobald ein neues Dokument eingeht wird es verarbeitet und weitergeleitet' },
                { emoji: '🔗', title: 'Systemübergreifend', text: 'Daten aus System A laden, mit KI verarbeiten, in System B speichern' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#F7F7F8] rounded-[8px] px-3 py-2.5">
                  <span className="text-[18px] shrink-0">{item.emoji}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#09090B]">{item.title}</p>
                    <p className="text-[12px] text-[#52525B] mt-0.5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#F0F9FF] border border-blue-100 rounded-[8px] px-4 py-3">
              <p className="text-[13px] text-blue-800 leading-relaxed">
                In der Vollversion beschreiben Sie Workflows in natürlicher Sprache – Prozessia erstellt die Automatisierung. Testen Sie unsere Demo-Workflows mit dem „Ausführen"-Button.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E4E4E7]">
              <p className="text-[12px] text-[#A1A1AA]">Eigene Workflows in der Vollversion</p>
              <a
                href="https://calendly.com/sebastian-spuhler/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#18181B] text-white text-[13px] font-medium rounded-[7px]"
              >
                Demo buchen →
              </a>
            </div>
          </div>
        </Modal>
      )}

      {runResult && (
        <Modal title="Ausführungsergebnis" onClose={() => setRunResult(null)}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge
                label={runResult.status === 'completed' ? 'Abgeschlossen' : runResult.status}
                variant={runResult.status === 'completed' ? 'active' : 'error'}
              />
              <span className="text-[12px] text-[#A1A1AA]">{runResult.durationMs}ms</span>
            </div>
            {runResult.nodeResults?.map((n, i) => (
              <div key={i} className="bg-[#F7F7F8] rounded-[8px] px-3 py-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[12px] font-semibold text-[#52525B]">{n.name}</p>
                  <Badge
                    label={n.status === 'success' ? '✓' : '✗'}
                    variant={n.status === 'success' ? 'active' : 'error'}
                  />
                </div>
                <p className="text-[12px] text-[#A1A1AA]">{String(n.output).slice(0, 200)}</p>
              </div>
            ))}
            <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-[8px] px-3.5 py-2.5 mt-1">
              <p className="text-[11px] font-semibold text-[#0284C7] uppercase tracking-[0.05em] mb-1">
                Was bedeutet das?
              </p>
              <p className="text-[12px] text-[#0369A1] leading-relaxed">
                {DEMO_CONTENT.workflowResultExplanation}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
