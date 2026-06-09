import { useEffect } from 'react';
import { useRunStore } from '../store/runStore';

/**
 * useRunStream hook:
 * Manages the connection to a specific run's SSE stream.
 * Automatically connects on mount/runId change and disconnects on unmount.
 */
export function useRunStream(runId: string | null) {
  const connect = useRunStore((state) => state.connectToStream);
  const disconnect = useRunStore((state) => state.disconnectFromStream);
  const agentStates = useRunStore((state) => state.agentStates);
  const engineData = useRunStore((state) => state.engineData);
  const logs = useRunStore((state) => state.logs);
  const status = useRunStore((state) => state.activeRunStatus);

  useEffect(() => {
    if (runId) {
      connect(runId);
    }
    return () => {
      disconnect();
    };
  }, [runId, connect, disconnect]);

  // Calculate overall progress from agent states
  const totalProgress = Object.values(agentStates).reduce(
    (acc, agent) => Math.max(acc, agent.progress_pct), 0
  );

  return {
    agentStates,
    engineData,
    logs,
    progress: totalProgress,
    isComplete: status === 'completed',
    isFailed: status === 'failed',
    status
  };
}

/**
 * useAgentState hook:
 * Subscribes to the state of a single agent for targeted re-renders.
 */
export function useAgentState(agentId: string) {
  return useRunStore((state) => state.agentStates[agentId] || {
    agent_id: agentId,
    status: 'pending',
    sub_task: null,
    progress_pct: 0,
    confidence_score: null,
    llm_provider_used: null,
    timestamp: new Date().toISOString()
  });
}

/**
 * useRunLogs hook:
 * Retrieves logs, optionally filtered by a specific agent.
 */
export function useRunLogs(agentId?: string) {
  const logs = useRunStore((state) => state.logs);
  
  if (agentId) {
    return logs.filter((log) => log.agent_id === agentId);
  }
  
  return logs;
}
