import { queryOptions, useQuery } from "@tanstack/react-query";
import { http } from "~/shared/utils/http";
import { getToken } from "~/shared/utils/session";

export interface RecentRun {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "pending" | "running" | "success" | "failed";
  triggererName: string | null;
  totalDurationMs: number | null;
  createdAt: string;
}

export interface RunsByDay {
  date: string;
  total: number;
  failed: number;
}

export interface DashboardStats {
  totalWorkflows: number;
  totalRuns: number;
  successRate: number;
  failedRuns: number;
  avgDurationMs: number | null;
  recentRuns: RecentRun[];
  runsByDay: RunsByDay[];
}

export const dashboardStatsQueryOption = () =>
  queryOptions({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const token = getToken();
      if (!token) return null;
      try {
        const res = await http.get("dashboard/stats").json<DashboardStats>();
        return res;
      } catch {
        return null;
      }
    },
  });

export function useDashboardStats() {
  const options = dashboardStatsQueryOption();
  return useQuery({
    ...options,
    refetchInterval: (query) => {
      const stats = query.state.data;
      if (stats && stats.recentRuns) {
        const hasActiveRun = stats.recentRuns.some(
          (run) => run.status === "pending" || run.status === "running"
        );
        return hasActiveRun ? 3000 : 10000; // Poll every 3s if active, 10s otherwise
      }
      return 10000;
    },
  });
}
