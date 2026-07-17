import { queryOptions, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { http } from "~/shared/utils/http";
import { getToken } from "~/shared/utils/session";
import { getActiveOrgId } from "~/shared/utils/active-org";
import type { NodeType } from "../../types";

export interface StepLog {
  id: string;
  runId: string;
  stepId: string;
  stepName: string;
  stepType: NodeType;
  status: "running" | "success" | "failed";
  input?: any;
  output?: string;
  errorMessage?: string;
  durationMs?: number;
  retryCount: number;
  executedAt: string;
  createdAt: string;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  tenantId: string;
  triggeredBy?: string;
  triggerType: "manual" | "scheduled" | "webhook";
  status: "pending" | "running" | "success" | "failed";
  startedAt?: string;
  endedAt?: string;
  totalDurationMs?: number;
  errorMessage?: string;
  aiDiagnosis?: string;
  createdAt: string;
  stepLogs?: StepLog[];
  workflow?: {
    id: string;
    name: string;
  };
  triggerer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TriggerRunResponse {
  runId: string;
  status: "queued";
  createdAt: string;
}

// 1. Hook untuk men-trigger eksekusi workflow secara manual
export function useTriggerWorkflowRun() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workflowId: string) => {
      return http
        .post(`runs/workflows/${workflowId}/trigger`)
        .json<TriggerRunResponse>();
    },
    onSuccess: (_, workflowId) => {
      // Invalidate runs history untuk workflow ini
      queryClient.invalidateQueries({ queryKey: ["workflows", workflowId, "runs"] });
    },
  });
}

// 2. Query option untuk list history run suatu workflow
export const workflowRunsQueryOption = (workflowId: string) =>
  queryOptions({
    queryKey: ["workflows", workflowId, "runs"],
    queryFn: async () => {
      const token = getToken();
      if (!token) return [];
      try {
        const res = await http.get(`runs/workflows/${workflowId}`).json<WorkflowRun[]>();
        return res;
      } catch {
        return [];
      }
    },
    enabled: !!workflowId,
  });

// 3. Query option untuk detail run + step logs
export const runDetailQueryOption = (runId: string) =>
  queryOptions({
    queryKey: ["runs", runId],
    queryFn: async () => {
      const token = getToken();
      if (!token) return null;
      try {
        const res = await http.get(`runs/${runId}`).json<WorkflowRun>();
        return res;
      } catch {
        return null;
      }
    },
    enabled: !!runId,
  });

// 4. Hook untuk list history runs
export function useWorkflowRuns(workflowId: string) {
  const queryOptions = workflowRunsQueryOption(workflowId);
  return useQuery({
    ...queryOptions,
    refetchInterval: (query) => {
      const runs = query.state.data;
      if (Array.isArray(runs)) {
        const hasActiveRun = runs.some(
          (run) => run.status === "pending" || run.status === "running"
        );
        return hasActiveRun ? 3000 : false;
      }
      return false;
    },
  });
}

// 5. Hook untuk detail run + step logs
export function useWorkflowRunDetail(runId: string) {
  const queryOptions = runDetailQueryOption(runId);
  return useQuery({
    ...queryOptions,
    refetchInterval: (query) => {
      const run = query.state.data;
      if (run && (run.status === "pending" || run.status === "running")) {
        return 3000;
      }
      return false;
    },
  });
}
