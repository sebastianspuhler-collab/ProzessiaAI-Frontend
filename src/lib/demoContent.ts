export const DEMO_CONTENT = {
  chatSuggestions: [
    'Was kann Prozessia AI für mich tun?',
    'Wie funktioniert die Wissensbasis?',
    'Zeig mir einen Beispiel-Workflow',
    'Welche Integrationen sind verfügbar?',
  ],

  agentWelcome: {
    'template-procurement-optimizer':
      'Hallo! Ich bin Ihr Recherche-Assistent. Ich analysiere Datenquellen, vergleiche Optionen und erstelle strukturierte Berichte – vollautomatisch. Fragen Sie mich z.B. nach einer Datenauswertung oder einem Optimierungsvorschlag.',
    'template-quality-8d':
      'Hallo! Ich bin Ihr Dokumenten-Assistent. Ich analysiere Dokumente, extrahiere relevante Informationen und erstelle strukturierte Reports. Laden Sie ein Dokument hoch oder beschreiben Sie, was analysiert werden soll.',
    'template-production-capacity':
      'Hallo! Ich bin Ihr Planungs-Assistent. Ich helfe bei der Ressourcenplanung, Priorisierung und Engpass-Erkennung. Beschreiben Sie Ihren Planungsbedarf – ich erstelle einen strukturierten Überblick.',
    'template-logistics-tracking':
      'Hallo! Ich bin Ihr Prozess-Assistent. Ich überwache laufende Prozesse, erkenne Abweichungen frühzeitig und sende proaktive Hinweise. Was soll ich für Sie überwachen?',
  } as Record<string, string>,

  workflowResultExplanation:
    'Dieser Workflow hat alle konfigurierten Schritte ausgeführt. In einer produktiven Umgebung würden echte Daten aus Ihren angebundenen Systemen verarbeitet werden. Die Schritt-Ergebnisse zeigen, welche Daten gelesen, analysiert und welche Aktionen ausgelöst wurden.',

  adapterInfo: {
    sap: 'SAP S/4HANA ist eines der führenden ERP-Systeme im Mittelstand. Prozessia verbindet sich bidirektional über RFC und OData APIs – liest Stammdaten, Transaktionen und kann Vorschläge zurückschreiben.',
    datev: 'DATEV ist die führende Softwarelösung für deutsche Steuerberater und KMU. Prozessia liest Belege, Buchungen und Stammdaten und macht diese per KI-Analyse nutzbar.',
    sharepoint: 'SharePoint ist die zentrale Dokumentenplattform vieler Unternehmen. Prozessia indiziert Dokumente automatisch und macht sie per semantischer Suche in Echtzeit zugänglich.',
  } as Record<string, string>,

  onboardingHints: {
    chat: 'Stellen Sie Fragen in natürlicher Sprache. Mit @Agent oder @Dokument können Sie gezielt auf Ressourcen zugreifen.',
    agents: 'Agenten führen Aufgaben vollautomatisch aus. Klicken Sie "Chat" um direkt mit einem Agenten zu sprechen, oder "Ausführen" für eine Demo.',
    workflows: 'Workflows verbinden mehrere Schritte zu einem automatisierten Prozess. Klicken Sie "Ausführen" für eine Live-Demo mit animierter Schrittausführung.',
    prompts: 'Speichern Sie häufig genutzte Prompts hier. Per Klick auf "Kopieren" landen Sie direkt im Clipboard und können ihn sofort im Chat verwenden.',
    skills: 'Skills steuern das globale Verhalten der KI in Ihrem Tenant. Ein aktiver Skill gilt für alle Chats und Agenten.',
    integrations: 'Hier sehen Sie den Status Ihrer Datenschnittstellen. "Online" bedeutet: Prozessia kann Daten lesen und schreiben.',
  } as Record<string, string>,

  promptHints: {
    general: 'Spart Zeit bei: Routinekommunikation und wiederkehrenden Texten',
    procurement: 'Spart Zeit bei: Lieferantenanfragen, Angebotsvergleichen und Einkaufsberichten',
    quality: 'Spart Zeit bei: Fehleranalysen, Prüfdokumentationen und Auditberichten',
    production: 'Spart Zeit bei: Kapazitätsplanung, Schichtprotokollen und Statusberichten',
    logistics: 'Spart Zeit bei: Lieferverfolgung, Disposition und Versandkommunikation',
  } as Record<string, string>,
};
