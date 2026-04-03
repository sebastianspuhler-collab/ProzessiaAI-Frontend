import type { Prompt, Skill, AdapterStatusInfo, WorkflowNode, Agent, Workflow } from '../types';

// ── Extended types with demo-only fields ──────────────

export interface DemoPrompt extends Omit<Prompt, 'tenantId'> {
  hint: string;
}

export interface DemoSkill extends Skill {
  example: string;
}

export interface DemoAdapter extends AdapterStatusInfo {
  explanation: string;
  entities: string[];
  demoData: Record<string, Array<Record<string, string>>>;
}

// ── Standard workflow nodes by trigger type ───────────

export const STANDARD_NODES: Record<string, WorkflowNode[]> = {
  manual: [
    { id: 'n1', type: 'trigger', name: 'Manuell starten', config: {} },
    { id: 'n2', type: 'agent', name: 'KI verarbeitet', config: {} },
    { id: 'n3', type: 'notification', name: 'Ausgeben', config: {} },
  ],
  schedule: [
    { id: 'n1', type: 'trigger', name: 'Zeitplan', config: {} },
    { id: 'n2', type: 'adapter', name: 'Daten laden', config: {} },
    { id: 'n3', type: 'agent', name: 'KI analysiert', config: {} },
    { id: 'n4', type: 'notification', name: 'Versenden', config: {} },
  ],
  webhook: [
    { id: 'n1', type: 'trigger', name: 'Ereignis eingeht', config: {} },
    { id: 'n2', type: 'agent', name: 'KI verarbeitet', config: {} },
    { id: 'n3', type: 'notification', name: 'Weiterleiten', config: {} },
  ],
};

// ── Demo Agents (ids match backend AGENT_SYSTEM_PROMPTS) ─

export const AGENTS: Agent[] = [
  {
    id: 'a1',
    name: 'Recherche-Assistent',
    description: 'Analysiert Informationen, vergleicht Optionen und erstellt strukturierte Entscheidungsvorlagen – für jeden Unternehmensbereich',
    category: 'knowledge',
    status: 'active',
    runCount: 0,
    isTemplate: true,
  },
  {
    id: 'a2',
    name: 'Dokumenten-Assistent',
    description: 'Liest, fasst zusammen und strukturiert Dokumente – Verträge, Berichte, Richtlinien, Protokolle',
    category: 'document',
    status: 'active',
    runCount: 0,
    isTemplate: true,
  },
  {
    id: 'a3',
    name: 'Planungs-Assistent',
    description: 'Strukturiert Aufgaben, Termine und Ressourcen – für Projekte, Teams und Prozesse',
    category: 'production',
    status: 'active',
    runCount: 0,
    isTemplate: true,
  },
  {
    id: 'a4',
    name: 'Prozess-Assistent',
    description: 'Analysiert Abläufe, findet Engpässe und macht Verbesserungsvorschläge – branchenunabhängig',
    category: 'logistics',
    status: 'active',
    runCount: 0,
    isTemplate: true,
  },
];

// ── Demo Workflows ────────────────────────────────────

export const DEMO_WORKFLOWS: Workflow[] = [
  {
    id: 'w1',
    name: 'Wöchentlicher Status-Report',
    description: 'Erstellt jeden Montag automatisch einen Überblick über relevante Kennzahlen und versendet ihn ans Team',
    trigger: { type: 'schedule', schedule: '0 7 * * 1' },
    nodes: STANDARD_NODES.schedule,
    status: 'active',
    isActive: true,
    runCount: 12,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'w2',
    name: 'Dokument-Eingang verarbeiten',
    description: 'Verarbeitet neue Dokumente automatisch sobald sie eintreffen, kategorisiert sie und leitet sie an die richtigen Personen weiter',
    trigger: { type: 'webhook' },
    nodes: STANDARD_NODES.webhook,
    status: 'active',
    isActive: true,
    runCount: 34,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'w3',
    name: 'Monatliche Auswertung',
    description: 'Erstellt am ersten des Monats automatisch eine vollständige Auswertung und stellt sie als PDF bereit',
    trigger: { type: 'schedule', schedule: '0 6 1 * *' },
    nodes: STANDARD_NODES.schedule,
    status: 'paused',
    isActive: false,
    runCount: 3,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

// ── Demo Prompts ──────────────────────────────────────

export const DEMO_PROMPTS: DemoPrompt[] = [
  {
    id: 'p-001',
    title: 'Dokument zusammenfassen',
    content:
      'Fasse das folgende Dokument in maximal 5 Stichpunkten zusammen. Hebe die wichtigsten Entscheidungen, Fristen und Handlungsbedarfe hervor. Nutze eine klare, sachliche Sprache.',
    category: 'general',
    createdAt: '2026-01-01T00:00:00Z',
    usageCount: 142,
    hint: 'Spart ~20 Min. pro Dokument – ideal für Berichte, Protokolle, Verträge',
  },
  {
    id: 'p-002',
    title: 'E-Mail professionell formulieren',
    content:
      'Formuliere folgende Nachricht als professionelle E-Mail auf Deutsch. Nutze einen höflichen, sachlichen Ton. Strukturiere sie mit Betreff, Anrede, Inhalt und Schlussformel. Inhalt: [Ihre Notizen hier einfügen]',
    category: 'general',
    createdAt: '2026-01-01T00:00:00Z',
    usageCount: 89,
    hint: 'Spart ~15 Min. pro Nachricht – auch für schwierige oder delikate Korrespondenz',
  },
  {
    id: 'p-003',
    title: 'Daten analysieren & Bericht erstellen',
    content:
      'Analysiere die folgenden Daten und erstelle einen strukturierten Bericht. Identifiziere Trends, Ausreißer und Handlungsempfehlungen. Gliedere den Bericht in: 1. Zusammenfassung 2. Detailanalyse 3. Empfehlungen. Daten: [Daten hier einfügen]',
    category: 'general',
    createdAt: '2026-01-01T00:00:00Z',
    usageCount: 67,
    hint: 'Spart ~45 Min. pro Auswertung – wandelt Rohdaten in entscheidungsreife Berichte um',
  },
  {
    id: 'p-004',
    title: 'Vertrag auf Risiken prüfen',
    content:
      'Prüfe den folgenden Vertragstext auf potenzielle Risiken und ungünstige Klauseln. Achte besonders auf: Haftungsregelungen, Laufzeiten, Kündigungsfristen, automatische Verlängerungen, Preisanpassungsklauseln. Erstelle eine Risikobewertung (Hoch/Mittel/Niedrig). Vertragstext: [Text hier einfügen]',
    category: 'general',
    createdAt: '2026-01-01T00:00:00Z',
    usageCount: 34,
    hint: 'Spart ~60 Min. pro Vertrag – erste Risikoeinschätzung vor dem Anwalt',
  },
  {
    id: 'p-005',
    title: 'Meeting-Protokoll erstellen',
    content:
      'Erstelle ein strukturiertes Meeting-Protokoll auf Basis der folgenden Notizen. Das Protokoll soll enthalten: Datum/Teilnehmer, Tagesordnungspunkte, Beschlüsse, Aufgaben mit Verantwortlichen und Deadlines. Notizen: [Notizen hier einfügen]',
    category: 'general',
    createdAt: '2026-01-01T00:00:00Z',
    usageCount: 58,
    hint: 'Spart ~30 Min. pro Meeting – aus Stichworten wird ein sauberes Protokoll',
  },
];

// ── Demo Skills ───────────────────────────────────────

export const DEMO_SKILLS: DemoSkill[] = [
  {
    id: 's-001',
    name: 'Auf Deutsch antworten',
    description: 'Greift wenn Nutzer auf Englisch oder anderen Sprachen schreibt',
    instructions: 'Antworte immer auf Deutsch, unabhängig von der Sprache der Anfrage. Wenn technische Begriffe auf Englisch üblicher sind, darfst du sie in Klammern ergänzen.',
    isActive: true,
    isGlobal: true,
    category: 'language',
    example: 'Nutzer fragt: "What is the status of my order?" → KI antwortet: "Der aktuelle Status Ihrer Bestellung ist: Offen. Die erwartete Lieferung ist für den 10. April geplant."',
  },
  {
    id: 's-002',
    name: 'Strukturierte Ausgabe',
    description: 'Greift bei Analysen, Berichten und Listen-Anfragen',
    instructions: 'Strukturiere Antworten immer mit klaren Überschriften (fett), nummerierten Listen für Schritte und Spiegelstrichen für Aufzählungen. Nutze keine Fließtexte bei mehr als 3 Punkten.',
    isActive: true,
    isGlobal: true,
    category: 'formatting',
    example: 'Statt: "Es gibt drei Punkte zu beachten: erstens die Frist, zweitens das Budget..." → **Zu beachten:** 1. Frist: 30. April 2026 2. Budget: max. 50.000 € 3. Genehmigung: Vorstand',
  },
  {
    id: 's-003',
    name: 'Kurze präzise Antworten',
    description: 'Greift bei Statusabfragen und einfachen Fragen',
    instructions: 'Halte Antworten auf maximal 3-4 Sätze. Nenne zuerst das Ergebnis, dann die Begründung. Vermeide Einleitungen wie "Selbstverständlich" oder "Natürlich". Keine redundanten Wiederholungen der Frage.',
    isActive: false,
    isGlobal: false,
    category: 'style',
    example: 'Frage: "Wie viele offene Bestellungen gibt es?" → "3 offene Bestellungen (Gesamtwert: 16.540 €). Davon ist 1 überfällig: PO-2026-0040 seit 5 Tagen."',
  },
  {
    id: 's-004',
    name: 'Professioneller Ton',
    description: 'Greift bei externer Kommunikation und formellen Anfragen',
    instructions: 'Verwende ausschließlich förmliche Ansprache (Sie). Vermeide Umgangssprache, Abkürzungen und Emojis. Schreibe vollständige Sätze. Nutze Fachbegriffe korrekt.',
    isActive: false,
    isGlobal: false,
    category: 'style',
    example: 'Statt: "Ok, mach ich schnell" → "Selbstverständlich. Ich werde die angeforderten Unterlagen aufbereiten und Ihnen bis Ende des Tages zur Verfügung stellen."',
  },
];

// ── Demo Adapters with entity data ────────────────────

export const DEMO_ADAPTERS: DemoAdapter[] = [
  {
    id: 'adapter-hubspot',
    name: 'HubSpot CRM',
    type: 'hubspot',
    status: 'online',
    ssl: true,
    capabilities: ['read', 'write', 'events'],
    explanation:
      'Verbinden Sie Ihr CRM direkt mit dem Chat. Fragen Sie nach Kontakten, Deals oder Aktivitäten – ohne HubSpot zu öffnen.',
    entities: ['Contacts', 'Deals', 'Activities', 'Companies'],
    demoData: {
      Contacts: [
        { Name: 'Anna Berger', Unternehmen: 'Berger Logistics GmbH', Status: 'Kunde', 'Letzte Aktivität': '01.04.2026', E-Mail: 'a.berger@berger-log.de' },
        { Name: 'Stefan Koch', Unternehmen: 'Koch & Partner KG', Status: 'Lead', 'Letzte Aktivität': '29.03.2026', E-Mail: 's.koch@kochpartner.de' },
        { Name: 'Julia Meier', Unternehmen: 'Meier Technik AG', Status: 'Interessent', 'Letzte Aktivität': '25.03.2026', E-Mail: 'j.meier@meier-technik.de' },
      ],
      Deals: [
        { Titel: 'Jahresvertrag Berger Logistics', Wert: '24.000 €', Phase: 'Angebot versendet', Abschluss: '30.04.2026', Verantwortlich: 'M. Schmidt' },
        { Titel: 'Pilotprojekt Koch & Partner', Wert: '8.500 €', Phase: 'Verhandlung', Abschluss: '15.04.2026', Verantwortlich: 'T. Müller' },
        { Titel: 'Software-Lizenz Meier Technik', Wert: '5.200 €', Phase: 'Erstgespräch', Abschluss: '31.05.2026', Verantwortlich: 'A. Weber' },
      ],
      Activities: [
        { Typ: 'Anruf', Kontakt: 'Anna Berger', Notiz: 'Vertragsverlängerung besprochen', Datum: '01.04.2026', Ergebnis: 'Positiv' },
        { Typ: 'E-Mail', Kontakt: 'Stefan Koch', Notiz: 'Angebot nachgefasst', Datum: '29.03.2026', Ergebnis: 'Ausstehend' },
        { Typ: 'Meeting', Kontakt: 'Julia Meier', Notiz: 'Produktdemo durchgeführt', Datum: '25.03.2026', Ergebnis: 'Follow-up geplant' },
      ],
      Companies: [
        { Name: 'Berger Logistics GmbH', Branche: 'Logistik', Mitarbeiter: '85', Umsatz: '12 Mio. €', Status: 'Kunde' },
        { Name: 'Koch & Partner KG', Branche: 'Beratung', Mitarbeiter: '22', Umsatz: '3,5 Mio. €', Status: 'Lead' },
        { Name: 'Meier Technik AG', Branche: 'Maschinenbau', Mitarbeiter: '140', Umsatz: '28 Mio. €', Status: 'Interessent' },
      ],
    },
  },
  {
    id: 'adapter-datev',
    name: 'DATEV',
    type: 'datev',
    status: 'online',
    ssl: true,
    capabilities: ['read'],
    explanation:
      'Stellen Sie Fragen zu Finanzdaten direkt im Chat. Prozessia holt die Antwort aus DATEV – keine Exporte, kein manuelles Suchen.',
    entities: ['AccountingDocuments', 'OpenItems', 'CostCenterAnalysis'],
    demoData: {
      AccountingDocuments: [
        { 'Belegnr.': 'BU-2026-0892', Typ: 'Eingangsrechnung', Betrag: '5.250 €', Konto: '1600', Datum: '01.04.2026' },
        { 'Belegnr.': 'BU-2026-0891', Typ: 'Ausgangsrechnung', Betrag: '18.700 €', Konto: '8400', Datum: '31.03.2026' },
        { 'Belegnr.': 'BU-2026-0890', Typ: 'Gutschrift', Betrag: '-1.200 €', Konto: '1600', Datum: '30.03.2026' },
      ],
      OpenItems: [
        { Debitor: 'Kunde A GmbH', Betrag: '18.700 €', Fälligkeit: '30.04.2026', 'Tage überfällig': '0', Status: 'Offen' },
        { Debitor: 'Kunde B KG', Betrag: '4.350 €', Fälligkeit: '15.04.2026', 'Tage überfällig': '0', Status: 'Offen' },
        { Kreditor: 'Lieferant X AG', Betrag: '5.250 €', Fälligkeit: '15.04.2026', 'Tage überfällig': '0', Status: 'Offen' },
      ],
      CostCenterAnalysis: [
        { Kostenstelle: 'KST-100 Verwaltung', Budget: '50.000 €', Ist: '32.450 €', Abweichung: '-17.550 €', Periode: 'Q1 2026' },
        { Kostenstelle: 'KST-200 IT', Budget: '80.000 €', Ist: '71.200 €', Abweichung: '-8.800 €', Periode: 'Q1 2026' },
        { Kostenstelle: 'KST-300 Vertrieb', Budget: '120.000 €', Ist: '118.600 €', Abweichung: '-1.400 €', Periode: 'Q1 2026' },
      ],
    },
  },
  {
    id: 'adapter-sharepoint',
    name: 'SharePoint Online',
    type: 'sharepoint',
    status: 'online',
    ssl: true,
    capabilities: ['read', 'write'],
    explanation:
      'Dokumente in SharePoint werden automatisch Teil der Wissensbasis. Der Chat kennt ihren Inhalt und kann gezielt danach suchen.',
    entities: ['Documents', 'ListItems', 'Contracts'],
    demoData: {
      Documents: [
        { Dateiname: 'Rahmenvertrag_2026.pdf', Typ: 'Vertrag', Geändert: '15.03.2026', 'Geändert von': 'M. Schmidt', Größe: '2,3 MB' },
        { Dateiname: 'QM-Handbuch_v4.docx', Typ: 'Handbuch', Geändert: '01.03.2026', 'Geändert von': 'T. Müller', Größe: '8,1 MB' },
        { Dateiname: 'Organigramm_2026.pptx', Typ: 'Präsentation', Geändert: '20.02.2026', 'Geändert von': 'A. Weber', Größe: '4,5 MB' },
      ],
      ListItems: [
        { ID: '1042', Titel: 'Q1 Review vorbereiten', Zugewiesen: 'M. Schmidt', Status: 'In Bearbeitung', Fälligkeit: '05.04.2026' },
        { ID: '1041', Titel: 'Lieferantenbewertung', Zugewiesen: 'T. Müller', Status: 'Offen', Fälligkeit: '10.04.2026' },
        { ID: '1040', Titel: 'Jahresabschluss prüfen', Zugewiesen: 'A. Weber', Status: 'Abgeschlossen', Fälligkeit: '31.03.2026' },
      ],
      Contracts: [
        { 'Vertrags-Nr.': 'VTR-2026-012', Partner: 'Mustermann GmbH', Typ: 'Liefervertrag', Laufzeit: 'bis 31.12.2026', Wert: '150.000 €' },
        { 'Vertrags-Nr.': 'VTR-2025-089', Partner: 'Tech Supplies AG', Typ: 'Rahmenvertrag', Laufzeit: 'bis 30.06.2026', Wert: '80.000 €' },
        { 'Vertrags-Nr.': 'VTR-2025-067', Partner: 'Office Direct', Typ: 'Wartungsvertrag', Laufzeit: 'bis 31.12.2026', Wert: '12.000 €' },
      ],
    },
  },
];
