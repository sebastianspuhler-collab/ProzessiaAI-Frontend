export type NavItem = 'chat' | 'agents' | 'workflows' | 'prompts' | 'integrations' | 'skills' | 'notes';

export interface RAGSource {
  title: string;
  excerpt: string;
  score: number;
  documentId?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: RAGSource[];
  suggestions?: string[];
  timestamp: Date;
  attachments?: string[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export interface Document {
  id: string;
  filename: string;
  uploadedAt: string;
  contentType?: string;
  sizeBytes?: number;
  category?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'paused' | 'draft' | 'error';
  runCount: number;
  isTemplate?: boolean;
  instructions?: string;
  estimatedROI?: {
    monthlySavingsEur: number;
    timeSavedHoursPerMonth?: number;
    description?: string;
  };
}

export interface AgentRunResult {
  runId: string;
  status: 'completed' | 'failed' | 'running';
  durationMs?: number;
  steps?: Array<{ id: string; name: string; status: string; output?: string }>;
  nodeResults?: Array<{ nodeId: string; name: string; status: string; output: string }>;
}

export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  config: Record<string, string>;
}

export interface WorkflowTrigger {
  type: 'schedule' | 'webhook' | 'manual';
  schedule?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  nodes: WorkflowNode[];
  status: 'active' | 'paused' | 'draft' | 'error';
  isActive: boolean;
  runCount: number;
  createdAt?: string;
}

export interface WorkflowRunResult {
  runId: string;
  status: string;
  nodeResults: Array<{ nodeId: string; name: string; status: string; output: string }>;
  durationMs: number;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: 'procurement' | 'quality' | 'production' | 'logistics' | 'general';
  tenantId: string;
  createdAt: string;
  usageCount: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  instructions: string;
  isActive: boolean;
  isGlobal: boolean;
  category: string;
  createdAt?: string;
}

export interface AdapterStatusInfo {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'degraded' | 'not_configured' | 'connecting';
  ssl?: boolean;
  capabilities?: string[];
  error?: string;
  lastChecked?: string;
}

export interface ComponentStatus {
  status: 'operational' | 'degraded' | 'offline';
  message?: string;
}

export interface SystemStatus {
  overall: string;
  components: {
    llm: ComponentStatus;
    vectorStore: ComponentStatus;
    adapters: {
      sap: ComponentStatus;
      datev: ComponentStatus;
      sharepoint: ComponentStatus;
    };
  };
}

export interface MentionItem {
  id: string;
  label: string;
  type: 'Agent' | 'Workflow' | 'Dokument';
}

export interface ChatResponse {
  text: string;
  sources: RAGSource[];
  suggestions: string[];
  _error?: string;
}

export interface Attachment {
  name: string;
  base64: string;
  mime: string;
}
