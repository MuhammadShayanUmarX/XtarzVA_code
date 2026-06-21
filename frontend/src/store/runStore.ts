import { create } from 'zustand';
import api from '../lib/api';

export interface AgentState {
  agent_id: string;
  status: 'pending' | 'running' | 'done' | 'failed' | 'low_confidence';
  sub_task: string | null;
  progress_pct: number;
  confidence_score: number | null;
  llm_provider_used: string | null;
  timestamp: string;
  output_preview?: any;
}

export interface LogEntry {
  id: string;
  agent_id: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

interface RunStore {
  activeRunId: string | null;
  activeRunStatus: string;
  pendingApproval: boolean;
  currentStage: string;
  agentStates: Record<string, AgentState>;
  engineData: Record<string, any>;
  logs: LogEntry[];

  // Actions
  startRun: (config: any) => Promise<string>;
  connectToStream: (runId: string) => void;
  disconnectFromStream: () => void;
  updateAgentState: (agentId: string, update: Partial<AgentState>) => void;
  addLogEntry: (entry: LogEntry) => void;
  
  // Controls
  pauseRun: (runId: string) => Promise<void>;
  approveRun: (runId: string) => Promise<void>;
  cancelRun: (runId: string) => Promise<void>;
}

export const useRunStore = create<RunStore>((set, get) => ({
  activeRunId: null,
  activeRunStatus: 'idle',
  pendingApproval: false,
  currentStage: '',
  agentStates: {},
  engineData: {},
  logs: [],

  startRun: async (config) => {
    const res = await api.post('/v2/runs/', config);
    const data = res.data;
    set({ activeRunId: data.run_id, activeRunStatus: 'queued', pendingApproval: false, currentStage: '', agentStates: {}, engineData: {}, logs: [] });
    return data.run_id;
  },

  connectToStream: (runId) => {
    // Disconnect existing poll first
    get().disconnectFromStream();
    
    let lastLogCount = 0;
    
    // Initial fetch
    const poll = async () => {
      try {
        const res = await api.get(`/v2/runs/${runId}/poll`);
        const data = res.data;
        
        // Process logs — only update if new logs arrived
        if (data.logs && data.logs.length > 0 && data.logs.length !== lastLogCount) {
          lastLogCount = data.logs.length;
          const logs = data.logs;
          
          // Update agent states from the latest log entries
          logs.forEach((log: any) => {
            get().updateAgentState(log.agent_id, {
              status: log.status,
              sub_task: log.message,
              progress_pct: log.progress_pct,
              confidence_score: log.confidence_score,
              llm_provider_used: log.llm_provider_used,
              timestamp: log.timestamp
            });
          });
          
          set({ logs: logs.map((l: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            agent_id: l.agent_id,
            message: l.message,
            level: l.level,
            timestamp: l.timestamp
          })).reverse() });
        }
        
        // Process state
        const state = data.state;
        const newStage = state.current_stage;
        
        if (state.status === 'completed' && newStage) {
          get().updateAgentState(newStage, { status: 'done', progress_pct: 100, timestamp: new Date().toISOString() });
        }
        if (state.pending_approval && newStage) {
          get().updateAgentState(newStage, { status: 'done', progress_pct: 100, timestamp: new Date().toISOString() });
        }
        if (!state.pending_approval && state.status === 'running' && newStage) {
          get().updateAgentState(newStage, {
            status: 'running',
            progress_pct: 0,
            sub_task: `Starting ${newStage.replace(/_/g, ' ')}...`,
            timestamp: new Date().toISOString()
          });
        }
        if (state.status === 'failed' && newStage) {
          get().updateAgentState(newStage, {
            status: 'failed',
            sub_task: state.engine_data?.last_error || 'Agent run failed',
            timestamp: new Date().toISOString()
          });
        }

        set({ 
          activeRunStatus: state.status,
          pendingApproval: state.pending_approval,
          currentStage: newStage,
          engineData: state.engine_data 
        });

        if (state.status === 'completed' || state.status === 'failed' || state.status === 'cancelled') {
          get().disconnectFromStream();
        }
      } catch (err) {
        console.warn('Poll error:', err);
      }
    };
    
    poll();
    // Use interval in global window so we can clear it
    (window as any).runPollInterval = setInterval(poll, 2000);
    set({ activeRunId: runId });
  },

  disconnectFromStream: () => {
    if ((window as any).runPollInterval) {
      clearInterval((window as any).runPollInterval);
      (window as any).runPollInterval = null;
    }
  },

  updateAgentState: (agentId, update) => {
    set((state) => ({
      agentStates: {
        ...state.agentStates,
        [agentId]: {
          ...(state.agentStates[agentId] || {
            agent_id: agentId,
            status: 'pending',
            sub_task: null,
            progress_pct: 0,
            confidence_score: null,
            llm_provider_used: null,
            timestamp: new Date().toISOString()
          }),
          ...update
        }
      }
    }));
  },

  addLogEntry: (entry) => {
    set((state) => ({
      logs: [entry, ...state.logs].slice(0, 500) // Keep last 500
    }));
  },

  pauseRun: async (runId) => {
    await api.post(`/v2/runs/${runId}/pause`);
  },
  
  approveRun: async (runId) => {
    await api.post(`/v2/runs/${runId}/approve`);
    // Immediately clear pendingApproval on the frontend so the UI resets to "running"
    set({ pendingApproval: false });
  },

  cancelRun: async (runId) => {
    await api.post(`/v2/runs/${runId}/cancel`);
    get().disconnectFromStream();
    set({ activeRunId: null, activeRunStatus: 'cancelled' });
  },
}));
