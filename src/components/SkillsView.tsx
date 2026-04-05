import { useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { DEMO_SKILLS } from '../lib/demoData';
import type { DemoSkill } from '../lib/demoData';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { PageHeader } from './ui/PageHeader';

export function SkillsView() {
  const [skills, setSkills] = useState<DemoSkill[]>(DEMO_SKILLS);
  const [showCreate, setShowCreate] = useState(false);

  const toggleActive = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Skills"
        subtitle="Einmal einstellen – immer aktiv in jedem Chat"
        action={
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} />
            Skill hinzufügen
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-7 bg-[#FAFAFA]">
        <div className="flex flex-col gap-3">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} onToggle={() => toggleActive(skill.id)} />
          ))}
        </div>
      </div>

      {showCreate && (
        <Modal title="Skills – die KI genau auf Ihr Unternehmen abstimmen" onClose={() => setShowCreate(false)}>
          <div className="flex flex-col gap-5">
            <p className="text-[14px] text-[#4B5563] leading-relaxed">
              Ein Skill ist eine Regel die Sie der KI einmal geben – und die dann in jedem Chat automatisch gilt. Kein Wiederholen, kein Erklären. Die KI verhält sich einfach immer so wie Sie es wollen.
            </p>

            <div className="flex flex-col gap-2.5">
              {[
                { emoji: '⚙️', title: 'Einmal konfiguriert', text: 'Sie legen den Skill fest – danach gilt er automatisch für alle Chats in Ihrem Unternehmen.' },
                { emoji: '🎯', title: 'Präzises Verhalten', text: 'Sprache, Tonalität, Ausgabeformat, Branchenkonventionen – die KI verhält sich genau wie gewünscht.' },
                { emoji: '🔀', title: 'Kombinierbar', text: 'Mehrere Skills können gleichzeitig aktiv sein und sich gegenseitig ergänzen.' },
                { emoji: '🏢', title: 'Für Ihr Unternehmen', text: 'In der Vollversion erstellen Sie eigene Skills für Ihre spezifischen Anforderungen – ohne Programmierung.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#F9FAFB] rounded-[8px] px-3 py-2.5">
                  <span className="text-[18px] shrink-0">{item.emoji}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111827]">{item.title}</p>
                    <p className="text-[12px] text-[#4B5563] mt-0.5 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-[8px] px-4 py-3">
              <p className="text-[13px] text-[#3730A3] leading-relaxed">
                In der Vollversion definieren Sie eigene Skills in natürlicher Sprache. In einer persönlichen Demo zeigen wir Ihnen wie das für Ihr Team aussehen kann.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
              <p className="text-[12px] text-[#9CA3AF]">Eigene Skills in der Vollversion</p>
              <a
                href="https://calendly.com/sebastian-spuhler/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#4F46E5] text-white text-[13px] font-medium rounded-[7px] hover:bg-[#4338CA] transition-colors"
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

function SkillCard({ skill, onToggle }: { skill: DemoSkill; onToggle: () => void }) {
  const categoryLabel: Record<string, string> = {
    language: 'Sprache',
    formatting: 'Format',
    style: 'Stil',
    general: 'Allgemein',
  };

  return (
    <div className={`bg-white border rounded-[10px] px-4 py-3.5 transition-all shadow-[0.25px_1px_3px_0px_rgba(79,70,229,0.07)] ${skill.isActive ? 'border-[#C7D2FE]' : 'border-[#E5E7EB] opacity-60'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5 ${skill.isActive ? 'bg-[#4F46E5] text-white' : 'bg-[#F3F4F6] text-[#9CA3AF]'}`}>
            <Sparkles size={14} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h3 className="text-[14px] font-semibold text-[#111827]">{skill.name}</h3>
              <Badge label={categoryLabel[skill.category] ?? skill.category} variant="demo" />
              {skill.isGlobal && <Badge label="Global" variant="paused" />}
            </div>
            <p className="text-[13px] text-[#4B5563] leading-relaxed">{skill.description}</p>
            {skill.example && (
              <p className="text-[12px] text-[#6B7280] mt-2 bg-[#F9FAFB] rounded-[6px] px-3 py-2 leading-relaxed">
                {skill.example.length > 120 ? skill.example.slice(0, 120) + '…' : skill.example}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onToggle}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 mt-1 ${skill.isActive ? 'bg-[#4F46E5]' : 'bg-[#D1D5DB]'}`}
          title={skill.isActive ? 'Deaktivieren' : 'Aktivieren'}
        >
          <span
            style={{ top: '2px', left: '2px' }}
            className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${skill.isActive ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>
    </div>
  );
}
