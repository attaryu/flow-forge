import { Injectable } from '@nestjs/common';
import { PrismaProvider } from '../../../shared/providers/prisma/prisma.provider';
import { DashboardStatsDto, RecentRunDto, RunsByDayDto } from '../dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaProvider) {}

  async getStats(tenantId: string): Promise<DashboardStatsDto> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalWorkflows,
      totalRuns,
      successRuns,
      failedRuns,
      avgDurationResult,
      recentRunsRaw,
      runsForChartRaw,
    ] = await Promise.all([
      this.prisma.workflow.count({
        where: { tenantId, status: 'active' },
      }),
      this.prisma.workflowRun.count({
        where: {
          tenantId,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.workflowRun.count({
        where: {
          tenantId,
          status: 'success',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.workflowRun.count({
        where: {
          tenantId,
          status: 'failed',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.workflowRun.aggregate({
        where: {
          tenantId,
          status: 'success',
          createdAt: { gte: thirtyDaysAgo },
        },
        _avg: {
          totalDurationMs: true,
        },
      }),
      this.prisma.workflowRun.findMany({
        where: { tenantId },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          workflow: {
            select: {
              name: true,
            },
          },
          triggerer: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.workflowRun.findMany({
        where: {
          tenantId,
          createdAt: { gte: thirtyDaysAgo },
        },
        select: {
          createdAt: true,
          status: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
    ]);

    const successRate = totalRuns > 0 ? Math.round((successRuns / totalRuns) * 1000) / 10 : 0;

    const recentRuns: RecentRunDto[] = recentRunsRaw.map((run) => ({
      id: run.id,
      workflowId: run.workflowId,
      workflowName: run.workflow.name,
      status: run.status,
      triggererName: run.triggerer?.name || null,
      totalDurationMs: run.totalDurationMs,
      createdAt: run.createdAt,
    }));

    const runsByDayMap = new Map<string, { total: number; failed: number }>();
    
    const tempDate = new Date(thirtyDaysAgo);
    const today = new Date();
    while (tempDate <= today) {
      const dateStr = tempDate.toISOString().split('T')[0];
      runsByDayMap.set(dateStr, { total: 0, failed: 0 });
      tempDate.setDate(tempDate.getDate() + 1);
    }

    for (const run of runsForChartRaw) {
      const dateStr = run.createdAt.toISOString().split('T')[0];
      const existing = runsByDayMap.get(dateStr);
      if (existing) {
        existing.total += 1;
        if (run.status === 'failed') {
          existing.failed += 1;
        }
      } else {
        runsByDayMap.set(dateStr, {
          total: 1,
          failed: run.status === 'failed' ? 1 : 0,
        });
      }
    }

    const runsByDay: RunsByDayDto[] = Array.from(runsByDayMap.entries()).map(
      ([date, stats]) => ({
        date,
        total: stats.total,
        failed: stats.failed,
      }),
    );

    return {
      totalWorkflows,
      totalRuns,
      successRate,
      failedRuns,
      avgDurationMs: avgDurationResult._avg.totalDurationMs || 0,
      recentRuns,
      runsByDay,
    };
  }
}
