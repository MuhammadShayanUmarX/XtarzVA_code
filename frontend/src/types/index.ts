export type RunStatus = 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
export type AgentStatus = 'pending' | 'running' | 'done' | 'failed' | 'low_confidence' | 'warning';

export interface AgentState {
  agent_id: string;
  status: AgentStatus;
  sub_task: string | null;
  progress_pct: number;
  confidence_score: number | null;
  llm_provider_used: string | null;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  status: string;
  gross_margin_pct: number;
  composite_score: number;
  label: 'Winner' | 'Strong' | 'Risky' | 'Kill';
  image_urls: string[];
}

export interface Run {
  id: string;
  number: number;
  name: string;
  status: RunStatus;
  progress_pct: number;
  products_found: number;
  created_at: string;
}
