import { useState, useEffect } from 'react';
import { MessageSquare, Bot, Zap, BookOpen, Plug, Sparkles, StickyNote } from 'lucide-react';
import { api } from '../lib/api';
import type { NavItem, SystemStatus } from '../types';

export function AppSidebar({
  activeView,
  onViewChange,
}: {
  activeView: NavItem;
  onViewChange: (v: NavItem) => void;
}) {
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.get<SystemStatus>('/api/system/status');
        setStatus(data);
      } catch {
        // non-fatal
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const navGroups: { label: string; items: { id: NavItem; label: string; icon: React.ReactElement }[] }[] = [
    {
      label: 'KI-Assistent',
      items: [
        { id: 'chat', label: 'Chat', icon: <MessageSquare size={14} /> },
        { id: 'agents', label: 'Agenten', icon: <Bot size={14} /> },
        { id: 'workflows', label: 'Workflows', icon: <Zap size={14} /> },
      ],
    },
    {
      label: 'Bibliothek',
      items: [
        { id: 'prompts', label: 'Prompts', icon: <BookOpen size={14} /> },
        { id: 'skills', label: 'Skills', icon: <Sparkles size={14} /> },
        { id: 'notes', label: 'Notizen', icon: <StickyNote size={14} /> },
      ],
    },
    {
      label: 'Daten',
      items: [
        { id: 'integrations', label: 'Integrationen', icon: <Plug size={14} /> },
      ],
    },
  ];

  const dotColor = (s?: string) =>
    s === 'operational' ? 'bg-emerald-500' : s === 'degraded' ? 'bg-yellow-400' : 'bg-[#D1D5DB]';

  const isOperational = status?.overall === 'operational';

  return (
    <aside className="w-[220px] shrink-0 h-screen flex flex-col bg-white border-r border-[#E5E7EB] overflow-hidden">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <span className="text-[17px] font-bold tracking-[-0.04em] text-[#111827] leading-none block">
          Prozessia.
        </span>
        <span className="text-[8px] font-semibold tracking-[0.2em] text-[#9CA3AF] uppercase mt-[4px] block">
          AI Agency
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9.5px] font-semibold tracking-[0.12em] text-[#9CA3AF] uppercase px-2 mb-1">
              {group.label}
            </p>
            <nav className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13px] font-medium transition-all duration-100 w-full text-left ${
                    activeView === item.id
                      ? 'bg-[#EEF2FF] text-[#4F46E5]'
                      : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                  }`}
                >
                  <span className={activeView === item.id ? 'text-[#4F46E5]' : 'text-[#9CA3AF]'}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Demo-Modus Hinweis */}
      <div className="mx-3 mb-3 rounded-[8px] border border-[#C7D2FE] bg-[#EEF2FF] px-3 py-2.5">
        <p className="text-[11px] font-semibold text-[#3730A3] mb-0.5">Demo-Modus</p>
        <p className="text-[10.5px] text-[#6B7280] leading-relaxed">
          Vollversion inkl. eigener Daten & Agenten
        </p>
        <a
          href="https://calendly.com/sebastian-spuhler/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-[10.5px] font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
        >
          Demo buchen →
        </a>
      </div>

      {/* System-Status */}
      <div className="px-4 py-3 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${dotColor(status?.components?.llm?.status)}`} />
          <span className="text-[11px] text-[#9CA3AF]">
            {isOperational ? 'Alle Systeme aktiv' : 'System-Status prüfen'}
          </span>
        </div>
      </div>
    </aside>
  );
}
