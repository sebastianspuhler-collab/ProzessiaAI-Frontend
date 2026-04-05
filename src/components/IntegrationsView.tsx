import { useState } from 'react';
import { Plug, AlertTriangle, Plus } from 'lucide-react';
import { DEMO_ADAPTERS } from '../lib/demoData';
import type { DemoAdapter } from '../lib/demoData';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { PageHeader } from './ui/PageHeader';

export function IntegrationsView() {
  const [adapters] = useState<DemoAdapter[]>(DEMO_ADAPTERS);
  const [showAddIntegration, setShowAddIntegration] = useState(false);

  const statusVariant = (s: DemoAdapter['status']): 'active' | 'paused' | 'error' | 'draft' =>
    s === 'online' ? 'active' : s === 'degraded' ? 'paused' : s === 'not_configured' ? 'draft' : 'error';

  const statusLabel = (s: DemoAdapter['status']) =>
    s === 'online' ? 'Online' : s === 'offline' ? 'Offline' : s === 'degraded' ? 'Eingeschränkt' : s === 'connecting' ? 'Verbindet…' : 'Nicht konfiguriert';

  const typeLabel: Record<string, string> = {
    hubspot: 'HubSpot CRM',
    datev: 'DATEV',
    sharepoint: 'SharePoint Online',
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Integrationen"
        subtitle="ERP-Adapter und Datenquellen"
        action={
          <Button variant="primary" onClick={() => setShowAddIntegration(true)}>
            <Plus size={14} />
            Integration hinzufügen
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-7 bg-[#FAFAFA]">
        <div className="flex flex-col gap-3">
          {adapters.map((adapter) => (
            <Card key={adapter.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-[8px] bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] shrink-0">
                    <Plug size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[14px] font-semibold text-[#111827] truncate">{adapter.name}</h3>
                      <Badge label={statusLabel(adapter.status)} variant={statusVariant(adapter.status)} />
                    </div>
                    <p className="text-[12px] text-[#9CA3AF]">
                      {typeLabel[adapter.type] ?? adapter.type}
                      {adapter.ssl && ' · SSL'}
                      {adapter.capabilities && adapter.capabilities.length > 0
                        ? ` · ${adapter.capabilities.join(', ')}`
                        : ''}
                    </p>
                    {adapter.error && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1 mt-0.5">
                        <AlertTriangle size={10} />
                        {adapter.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">
                {adapter.explanation}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {showAddIntegration && (
        <Modal title="Integrationen – Ihre Daten direkt im Chat" onClose={() => setShowAddIntegration(false)}>
          <div className="flex flex-col gap-5">
            <p className="text-[14px] text-[#4B5563] leading-relaxed">
              Prozessia verbindet sich mit den Systemen die Sie bereits nutzen – ohne dass Sie etwas umstellen müssen. Ihre Daten bleiben wo sie sind und werden direkt im Chat zugänglich.
            </p>

            <div className="flex flex-col gap-2.5">
              {[
                { emoji: '🔌', title: 'Kein Systemwechsel', text: 'Keine Datenmigration, keine Umstellung. Prozessia liest direkt aus Ihren bestehenden Systemen.' },
                { emoji: '💬', title: 'Chat mit Ihren Daten', text: 'Fragen Sie nach Bestellungen, Belegen oder Dokumenten – die Antwort kommt aus Ihrem System.' },
                { emoji: '⚡', title: 'Teil Ihrer Workflows', text: 'Integrationen werden in Workflows eingebunden – Daten laden, mit KI verarbeiten, zurückschreiben.' },
                { emoji: '🔒', title: 'Sicher & DSGVO-konform', text: 'Alle Verbindungen sind verschlüsselt. EU-Hosting. Ihre Daten verlassen nie Ihren Tenant.' },
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
                In der Vollversion verbinden Sie Ihre Systeme in wenigen Minuten. In einer persönlichen Demo zeigen wir Ihnen wie die Integration mit Ihren Daten in der Praxis aussieht.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
              <p className="text-[12px] text-[#9CA3AF]">Integrationen in der Vollversion einrichten</p>
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
