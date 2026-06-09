export interface AgentUpdateEvent {
  run_id: string;
  agent_id: string;
  status: 'queued' | 'running' | 'done' | 'failed' | 'low_confidence';
  sub_task: string | null;
  progress_pct: number;
  confidence_score: number | null;
  llm_provider_used: string | null;
  timestamp: string;
}

export interface StateUpdateEvent {
  run_id: string;
  status: string;
  current_stage: string;
  pending_approval: boolean;
  engine_data: any;
  updated_at: string;
}

export interface RunCompleteEvent {
  run_id: string;
  result: any;
}

export interface QualityWarningEvent {
  run_id: string;
  issues: any[];
}

export interface RunErrorEvent {
  run_id: string;
  agent_id?: string;
  error: string;
}

export interface StreamCallbacks {
  onAgentUpdate: (event: AgentUpdateEvent) => void;
  onStateUpdate: (event: StateUpdateEvent) => void;
  onRunComplete: (event: RunCompleteEvent) => void;
  onQualityWarning: (event: QualityWarningEvent) => void;
  onError: (event: RunErrorEvent) => void;
}

export class RunStreamClient {
  private eventSource: EventSource | null = null;
  private runId: string;
  private retryCount: number = 0;
  private maxRetries: number = 5;

  constructor(runId: string) {
    this.runId = runId;
  }

  connect(callbacks: StreamCallbacks): void {
    // Close any existing connection first to prevent duplicates
    this.disconnect();
    
    const url = `/api/v2/runs/${this.runId}/stream`;
    this.eventSource = new EventSource(url);

    this.eventSource.addEventListener('agent_update', (e) => {
      try {
        const data = JSON.parse(e.data) as AgentUpdateEvent;
        callbacks.onAgentUpdate(data);
      } catch (err) {
        console.error('Failed to parse agent_update event', err);
      }
    });

    this.eventSource.addEventListener('state_update', (e) => {
      try {
        const data = JSON.parse(e.data) as StateUpdateEvent;
        callbacks.onStateUpdate(data);
      } catch (err) {
        console.error('Failed to parse state_update event', err);
      }
    });

    this.eventSource.addEventListener('run_complete', (e) => {
      try {
        const data = JSON.parse(e.data) as RunCompleteEvent;
        callbacks.onRunComplete(data);
        this.disconnect();
      } catch (err) {
        console.error('Failed to parse run_complete event', err);
      }
    });

    this.eventSource.addEventListener('quality_warning', (e) => {
      try {
        const data = JSON.parse(e.data) as QualityWarningEvent;
        callbacks.onQualityWarning(data);
      } catch (err) {
        console.error('Failed to parse quality_warning event', err);
      }
    });

    this.eventSource.addEventListener('run_error', (e) => {
      try {
        const data = JSON.parse(e.data) as RunErrorEvent;
        callbacks.onError(data);
        this.disconnect();
      } catch (err) {
        console.error('Failed to parse run_error event', err);
      }
    });

    this.eventSource.onerror = () => {
      console.warn(`SSE Connection lost for run ${this.runId}. Attempting reconnect...`);
      this.disconnect();
      if (this.retryCount < this.maxRetries) {
        const delay = Math.pow(2, this.retryCount) * 1000;
        this.retryCount++;
        setTimeout(() => this.connect(callbacks), delay);
      } else {
        callbacks.onError({ run_id: this.runId, error: 'Max reconnection attempts reached.' });
      }
    };

    // Reset retry count on successful connection
    this.eventSource.onopen = () => {
      this.retryCount = 0;
      console.info(`SSE Connected for run ${this.runId}`);
    };
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
