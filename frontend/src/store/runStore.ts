import { create } from 'zustand';
import { RunStreamClient, AgentUpdateEvent, StateUpdateEvent, RunCompleteEvent, QualityWarningEvent, RunErrorEvent } from '../lib/runStream';
import { tokenStorage } from '../lib/storage';

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
  streamClient: RunStreamClient | null;

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
  streamClient: null,

  startRun: async (config) => {
    const res = await fetch('/api/v2/runs/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenStorage.getAccessToken() || ''}`
      },
      body: JSON.stringify(config)
    });
    const data = await res.json();
    set({ activeRunId: data.run_id, activeRunStatus: 'queued', pendingApproval: false, currentStage: '', agentStates: {}, engineData: {}, logs: [] });
    return data.run_id;
  },

  connectToStream: (runId) => {
    // Disconnect existing stream first to prevent duplicate connections
    const existingClient = get().streamClient;
    if (existingClient) {
      existingClient.disconnect();
    }
    
    const client = new RunStreamClient(runId);
    
    client.connect({
      onAgentUpdate: (event) => {
        get().updateAgentState(event.agent_id, {
          status: event.status as any,
          sub_task: event.sub_task,
          progress_pct: event.progress_pct,
          confidence_score: event.confidence_score,
          llm_provider_used: event.llm_provider_used,
          timestamp: event.timestamp
        });
        
        get().addLogEntry({
          id: Math.random().toString(36).substr(2, 9),
          agent_id: event.agent_id,
          message: event.sub_task || `Agent ${event.agent_id} is ${event.status}`,
          level: event.status === 'failed' ? 'error' : (event.status === 'done' ? 'success' : 'info'),
          timestamp: event.timestamp
        });
      },
      onStateUpdate: (event) => {
        const prevStage = get().currentStage;
        const newStage = event.current_stage;

        // When the backend says pending_approval=true, that means the current agent
        // has finished its work. Mark that agent as "done" so the frontend shows the report.
        if (event.pending_approval && newStage) {
          get().updateAgentState(newStage, {
            status: 'done',
            progress_pct: 100,
            timestamp: new Date().toISOString()
          });
        }

        // When approval is cleared (pending_approval=false) and status is running,
        // mark the current stage agent as 'running' to transition from report → spinner
        if (!event.pending_approval && event.status === 'running' && newStage) {
          get().updateAgentState(newStage, {
            status: 'running',
            progress_pct: 0,
            sub_task: `Starting ${newStage.replace(/_/g, ' ')}...`,
            timestamp: new Date().toISOString()
          });
        }

        set({ 
          activeRunStatus: event.status,
          pendingApproval: event.pending_approval,
          currentStage: newStage,
          engineData: event.engine_data 
        });
      },
      onRunComplete: (event) => {
        set({ activeRunStatus: 'completed' });
        console.info('Run completed successfully', event);
      },
      onQualityWarning: (event) => {
        console.warn('Quality warnings received', event.issues);
      },
      onError: (event) => {
        set({ activeRunStatus: 'failed' });
        console.error('Run failed', event.error);
      }
    });

    set({ streamClient: client, activeRunId: runId });
  },

  disconnectFromStream: () => {
    const { streamClient } = get();
    if (streamClient) {
      streamClient.disconnect();
      set({ streamClient: null });
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
    await fetch(`/api/v2/runs/${runId}/pause`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenStorage.getAccessToken() || ''}`
      }
    });
  },
  
  approveRun: async (runId) => {
    await fetch(`/api/v2/runs/${runId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenStorage.getAccessToken() || ''}`
      }
    });
    // Immediately clear pendingApproval on the frontend so the UI resets to "running"
    set({ pendingApproval: false });
  },

  cancelRun: async (runId) => {
    await fetch(`/api/v2/runs/${runId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenStorage.getAccessToken() || ''}`
      }
    });
    get().disconnectFromStream();
    set({ activeRunId: null, activeRunStatus: 'cancelled' });
  },
}));
