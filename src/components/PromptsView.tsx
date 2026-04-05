import { useState } from 'react';
import { BookOpen, Plus, Trash2, Copy, Check, ArrowRight } from 'lucide-react';
import { DEMO_PROMPTS } from '../lib/demoData';
import type { DemoPrompt } from '../lib/demoData';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { PageHeader } from './ui/PageHeader';
import { EmptyState } from './ui/EmptyState';
import type { NavItem } from '../types';

const categoryLabel = (c: string) =>
  ({ general: 'Allgemein', procurement: 'Beschaffung', quality: 'Qualität', production: 'Produktion', logistics: 'Logistik' }[c] ?? c);

export function PromptsView({
  onUsePrompt,
  onViewChange,
}: {
  onUsePrompt: (content: string) => void;
  onViewChange: (view: NavItem) => void;
}) {
  const [prompts, setPrompts] = useState<DemoPrompt[]>(DEMO_PROMPTS);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string, ms = 3000) => {
    setToast(msg);
    setTimeout(() => setToast(''), ms);
  };

  const deletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const copyContent = async (prompt: DemoPrompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
      showToast('Kopiert – fügen Sie den Prompt direkt im Chat ein');
    } catch {
      // non-fatal
    }
  };

  const usePrompt = (prompt: DemoPrompt) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === prompt.id ? { ...p, usageCount: p.usageCount + 1 } : p))
    );
    onUsePrompt(prompt.content);
    onViewChange('chat');
    showToast('Prompt eingefügt – passen Sie ihn an Ihren konkreten Fall an');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Prompt-Bibliothek"
        subtitle="Wiederverwendbare Prompts für häufige Aufgaben"
        action={
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} />
            Neuer Prompt
          </Button>
        }
      />
      {toast && (
        <div className="mx-7 mt-5 flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[8px] px-3.5 py-2">
          <Check size={13} className="text-[#16A34A] shrink-0" />
          <p className="text-[13px] text-[#15803D]">{toast}</p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-7 bg-[#FAFAFA]">
        {prompts.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={22} />}
            title="Noch keine Prompts"
            description="Erstellen Sie wiederverwendbare Prompts für häufige Aufgaben."
            action={
              <Button variant="primary" onClick={() => setShowCreate(true)}>
                Ersten Prompt erstellen
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {prompts.map((prompt) => (
              <Card key={prompt.id}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[14px] font-semibold text-[#111827]">{prompt.title}</h3>
                  <Badge label={categoryLabel(prompt.category)} variant="default" />
                </div>
                <p className="text-[13px] text-[#4B5563] leading-relaxed mb-1 line-clamp-3">
                  {prompt.content}
                </p>
                {prompt.hint && (
                  <p className="text-[11px] text-[#9CA3AF] mt-1 mb-3 italic">{prompt.hint}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                  <span className="text-[11px] text-[#9CA3AF]">{prompt.usageCount} Verwendungen</span>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="primary" onClick={() => usePrompt(prompt)}>
                      <ArrowRight size={12} />
                      Verwenden
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => copyContent(prompt)}>
                      {copiedId === prompt.id ? <Check size={12} /> : <Copy size={12} />}
                      {copiedId === prompt.id ? 'Kopiert' : 'Kopieren'}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => deletePrompt(prompt.id)}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Prompt-Bibliothek – Wissen geteilt im Team" onClose={() => setShowCreate(false)}>
          <div className="flex flex-col gap-5">
            <p className="text-[14px] text-[#4B5563] leading-relaxed">
              Die Prompt-Bibliothek sammelt bewährte Anweisungen für den Chat – und stellt sie dem ganzen Team zur Verfügung. Einmal gut formuliert, immer wieder nutzbar.
            </p>

            <div className="flex flex-col gap-2">
              {[
                { emoji: '⏱️', text: 'Spart Zeit: Niemand muss denselben Prompt neu schreiben' },
                { emoji: '✅', text: 'Konsistenz: Alle im Team arbeiten mit denselben bewährten Formulierungen' },
                { emoji: '📈', text: 'Qualität: Die besten Prompts werden geteilt und verbessert' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-[#F9FAFB] rounded-[8px] px-3 py-2.5">
                  <span className="text-[16px]">{item.emoji}</span>
                  <p className="text-[13px] text-[#4B5563] leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-[8px] px-4 py-3">
              <p className="text-[13px] text-[#3730A3] leading-relaxed">
                In der Vollversion erstellt Ihr Team eigene Prompts und teilt sie mit Kollegen. Testen Sie jetzt unsere Demo-Prompts – klicken Sie auf „Verwenden".
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
              <p className="text-[12px] text-[#9CA3AF]">Team-Prompts in der Vollversion</p>
              <a
                href="https://calendly.com/sebastian-spuhler/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#4F46E5] text-white text-[13px] font-medium rounded-[7px]"
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
