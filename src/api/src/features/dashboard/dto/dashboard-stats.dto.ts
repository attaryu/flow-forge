export class RecentRunDto {
  id!: string;
  workflowId!: string;
  workflowName!: string;
  status!: string;
  triggererName!: string | null;
  totalDurationMs!: number | null;
  createdAt!: Date;
}

export class RunsByDayDto {
  date!: string;
  total!: number;
  failed!: number;
}

export class DashboardStatsDto {
  totalWorkflows!: number;
  totalRuns!: number;
  successRate!: number;
  failedRuns!: number;
  avgDurationMs!: number | null;
  recentRuns!: RecentRunDto[];
  runsByDay!: RunsByDayDto[];
}
