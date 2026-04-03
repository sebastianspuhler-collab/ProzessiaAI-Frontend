import { useState } from 'react';
import { StickyNote, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { PageHeader } from './ui/PageHeader';
import { EmptyState } from './ui/EmptyState';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  tag: string;
  createdAt: Date;
}

const COLORS = [
  { bg: '#F0F9FF', border: '#BAE6FD', label: 'Blau' },
  { bg: '#F0FDF4', border: '#BBF7D0', label: 'Grün' },
  { bg: '#FFFBEB', border: '#FDE68A', label: 'Gelb' },
  { bg: '#FDF4FF', border: '#E9D5FF', label: 'Lila' },
  { bg: '#FFF1F2', border: '#FECDD3', label: 'Rot' },
];

const DEMO_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Lieferanten-Vergleich Q2',
    content: '- ABC GmbH: Lieferzeit 3 Wochen, gute Qualität\n- XYZ AG: Preis 12% günstiger, unsichere Liefertreue\n- DEF KG: Neu, noch kein Track Record\n\nNächster Schritt: Angebote einholen und mit KI vergleichen lassen',
    color: '#F0F9FF',
    tag: 'Einkauf',
    createdAt: new Date('2026-03-28'),
  },
  {
    id: 'n2',
    title: 'Prozessoptimierung – Ideen',
    content: '1. Rechnungsfreigabe automatisieren\n2. Lieferantenbewertung quartalsweise\n3. Lagerbestand täglich prüfen lassen\n4. Eskalationsregel bei Verzug >3 Tage\n5. Onboarding-Checkliste für neue MA',
    color: '#F0FDF4',
    tag: 'Prozesse',
    createdAt: new Date('2026-04-01'),
  },
  {
    id: 'n3',
    title: 'KI-Anwendungsfälle für unser Team',
    content: 'Besonders relevant:\n- Angebote vergleichen und zusammenfassen\n- Protokolle aus Stichpunkten erstellen\n- Lieferantendaten direkt abfragen\n- Verträge auf kritische Klauseln prüfen',
    color: '#FFFBEB',
    tag: 'KI',
    createdAt: new Date('2026-04-02'),
  },
];

export function NotesView() {
  const [notes, setNotes] = useState<Note[]>(DEMO_NOTES);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedNote, setExpandedNote] = useState<Note | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Notizen"
        subtitle="Strukturiertes Wissen und Ideen festhalten"
        action={
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} />
            Neue Notiz
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-7 bg-[#FAFAFA]">
        {/* Quick-Add Form */}
        {showForm && (
          <div className="mb-5 bg-white border border-[#E4E4E7] rounded-[10px] p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-[0.05em] mb-3">
              Neue Notiz
            </p>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Titel..."
              className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-[7px] px-3 py-2 text-[14px] font-medium outline-none focus:border-[#D1D1D6] mb-2"
              autoFocus
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Inhalt... (Zeilenumbrüche werden übernommen)"
              rows={4}
              className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-[7px] px-3 py-2 text-[13px] outline-none focus:border-[#D1D1D6] resize-none mb-2"
            />
            <div className="flex items-center gap-3">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Tag (z.B. Einkauf, HR...)"
                className="flex-1 bg-[#F7F7F8] border border-[#E4E4E7] rounded-[7px] px-3 py-2 text-[13px] outline-none focus:border-[#D1D1D6]"
              />
              <div className="flex gap-1.5 shrink-0">
                {COLORS.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setNewColor(c)}
                    title={c.label}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${
                      newColor.label === c.label ? 'border-[#18181B] scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.bg, boxShadow: `0 0 0 1px ${c.border}` }}
                  />
                ))}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
                  Abbrechen
                </Button>
                <a
                  href="https://calendly.com/sebastian-spuhler/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#18181B] text-white text-[13px] font-medium rounded-[7px] hover:bg-[#27272A] transition-colors whitespace-nowrap"
                >
                  Demo buchen →
                </a>
              </div>
            </div>
          </div>
        )}

        {notes.length === 0 && !showForm ? (
          <EmptyState
            icon={<StickyNote size={22} />}
            title="Noch keine Notizen"
            description="Halten Sie Ideen, Entscheidungen und Wissen strukturiert fest."
            action={
              <Button variant="primary" onClick={() => setShowForm(true)}>
                <Plus size={14} />
                Erste Notiz erstellen
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-3 py-2.5 bg-white border border-dashed border-[#D4D4D8] rounded-[10px] text-[13px] text-[#A1A1AA] hover:border-[#18181B] hover:text-[#52525B] transition-all w-full text-left"
              >
                <Plus size={14} />
                Notiz hinzufügen...
              </button>
            )}

            {notes.map((note) => {
              const isExpanded = expandedId === note.id;
              const lines = note.content.split('\n');
              return (
                <div
                  key={note.id}
                  className="bg-white border border-[#E4E4E7] rounded-[10px] overflow-hidden group transition-all"
                  style={{ borderLeftWidth: 3, borderLeftColor: COLORS.find(c => c.bg === note.color)?.border ?? '#E4E4E7' }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : note.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS.find(c => c.bg === note.color)?.border ?? '#D4D4D8' }}
                      />
                      <span className="text-[14px] font-semibold text-[#09090B] truncate">{note.title}</span>
                      <span className="text-[11px] text-[#A1A1AA] bg-[#F4F4F5] px-2 py-0.5 rounded-full shrink-0">
                        {note.tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <span className="text-[11px] text-[#A1A1AA]">{formatDate(note.createdAt)}</span>
                      <button
                        onClick={(e) => deleteNote(note.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-[#A1A1AA] hover:text-[#52525B] transition-all p-1"
                      >
                        <X size={13} />
                      </button>
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-[#A1A1AA]" />
                      ) : (
                        <ChevronDown size={14} className="text-[#A1A1AA]" />
                      )}
                    </div>
                  </div>

                  {!isExpanded && (
                    <div className="px-4 pb-3">
                      <p className="text-[12px] text-[#71717A] leading-relaxed line-clamp-1">
                        {lines[0]}
                        {lines.length > 1 && <span className="text-[#A1A1AA]"> · {lines.length - 1} weitere Zeilen</span>}
                      </p>
                    </div>
                  )}

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-[#F4F4F5]" style={{ backgroundColor: note.color }}>
                      <div className="pt-3">
                        {lines.map((line, i) => (
                          <p key={i} className="text-[13px] text-[#09090B] leading-relaxed">
                            {line || <span className="block h-2" />}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Notizen – Wissen strukturiert festhalten" onClose={() => setShowCreate(false)}>
          <div className="flex flex-col gap-5">
            <p className="text-[14px] text-[#52525B] leading-relaxed">
              Notizen in Prozessia sind mehr als ein Textfeld. Sie sind der Ort wo Erkenntnisse, Entscheidungen und Ideen aus Ihren Chats und Workflows festgehalten und für das ganze Team zugänglich gemacht werden.
            </p>

            <div className="flex flex-col gap-2.5">
              {[
                { emoji: '📝', title: 'Strukturiert', text: 'Notizen mit Titel, Inhalt und Tags – übersichtlich organisiert statt in langen Chat-Verläufen vergraben.' },
                { emoji: '🔗', title: 'Mit KI verknüpft', text: 'In der Vollversion können Notizen direkt in Chats zitiert werden und als Kontext für KI-Antworten dienen.' },
                { emoji: '👥', title: 'Für das Team', text: 'Freigegebene Notizen sind für alle Teammitglieder sichtbar – Wissen bleibt nicht in Einzelköpfen.' },
                { emoji: '⚡', title: 'Teil der Wissensbasis', text: 'Notizen können der Wissensbasis hinzugefügt werden und machen Ihr KI-System jeden Tag klüger.' },
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
                In der Vollversion werden Notizen mit Ihren Chats, Workflows und der Wissensbasis verknüpft. In einer persönlichen Demo zeigen wir Ihnen wie das in der Praxis aussieht.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E4E4E7]">
              <p className="text-[12px] text-[#A1A1AA]">Notizen in der Vollversion</p>
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

      {expandedNote && (
        <Modal title={expandedNote.title} onClose={() => setExpandedNote(null)}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#A1A1AA] bg-[#F4F4F5] px-2 py-0.5 rounded-full">
                {expandedNote.tag}
              </span>
              <span className="text-[11px] text-[#A1A1AA]">{formatDate(expandedNote.createdAt)}</span>
            </div>
            <div
              className="rounded-[8px] px-4 py-3 text-[14px] text-[#09090B] leading-relaxed"
              style={{ backgroundColor: expandedNote.color }}
            >
              {expandedNote.content.split('\n').map((line, i) => (
                <p key={i} className="leading-relaxed">
                  {line || <span className="block h-2" />}
                </p>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
