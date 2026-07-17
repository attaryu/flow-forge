import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { userQueryOption } from "~/features/auth/hooks/api/use-user";
import { useDashboardStats } from "~/features/dashboard/hooks/api/use-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { LayoutDashboard, Play, CheckCircle, AlertCircle, RefreshCw, Settings, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const iconMap: Record<string, any> = {
  "Total Workflows": LayoutDashboard,
  "Workflow Runs": Play,
  "Success Rate": CheckCircle,
  "Failed Runs": AlertCircle,
};

export default function DashboardIndex() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery(userQueryOption);
  const { data, isLoading, isError, refetch, isFetching } = useDashboardStats();

  const stats = [
    {
      title: "Total Workflows",
      value: data?.totalWorkflows?.toString() || "0",
      description: "Active workflows",
      color: "text-blue-500",
    },
    {
      title: "Workflow Runs",
      value: data?.totalRuns?.toLocaleString() || "0",
      description: "Last 30 days",
      color: "text-green-500",
    },
    {
      title: "Success Rate",
      value: data?.successRate !== undefined ? `${data.successRate}%` : "0%",
      description: "Of all runs (30 days)",
      color: "text-emerald-500",
    },
    {
      title: "Failed Runs",
      value: data?.failedRuns?.toString() || "0",
      description: "Requires diagnosis",
      color: "text-destructive",
    },
  ];

  const chartData = data?.runsByDay.map((day) => ({
    date: day.date,
    success: day.total - day.failed,
    failed: day.failed,
  })) || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || "User"}!</h1>
          <p className="text-muted-foreground">
            Here is what is happening with your automation workflows today.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50 gap-2 cursor-pointer text-foreground"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-36" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          Failed to load dashboard statistics. Please try refreshing again.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const IconComponent = iconMap[stat.title] || LayoutDashboard;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Workflow Runs (Last 30 Days)</CardTitle>
            <CardDescription>Daily execution counts, showing successful vs failed runs.</CardDescription>
          </CardHeader>
          <CardContent className="h-75 w-full">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : isError ? (
              <div className="h-full w-full flex items-center justify-center text-sm text-destructive">
                Could not retrieve run statistics chart.
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                No run history found for the last 30 days.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(str) => {
                      try {
                        const date = new Date(str);
                        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
                      } catch {
                        return str;
                      }
                    }}
                    stroke="currentColor"
                    className="text-muted-foreground"
                    fontSize={11}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="currentColor"
                    className="text-muted-foreground"
                    fontSize={11}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                    labelFormatter={(label) => {
                      try {
                        const date = new Date(label);
                        return date.toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });
                      } catch {
                        return label;
                      }
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="success" name="Success" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used automation shortcuts.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link
              to="/dashboard/workflows"
              className="flex w-full items-center gap-3 rounded-lg border p-3 hover:bg-accent text-left text-sm font-medium transition-colors text-foreground"
            >
              <Play className="h-4 w-4 text-blue-500" />
              <div>
                <p>Manage Workflows</p>
                <p className="text-xs text-muted-foreground">View, edit, or create new automation flows</p>
              </div>
            </Link>
            <Link
              to="/dashboard/settings"
              className="flex w-full items-center gap-3 rounded-lg border p-3 hover:bg-accent text-left text-sm font-medium transition-colors text-foreground"
            >
              <Settings className="h-4 w-4 text-zinc-500" />
              <div>
                <p>Account Settings</p>
                <p className="text-xs text-muted-foreground">Manage your profile and preferences</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recent execution runs from your automation pipeline.</CardDescription>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <p className="text-sm text-destructive">Could not retrieve recent execution activities.</p>
            ) : data?.recentRuns.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No recent runs found.</p>
            ) : (
              <div className="space-y-4">
                {data?.recentRuns.map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <Link
                        to={`/dashboard/workflows/${run.workflowId}`}
                        className="text-sm font-medium hover:underline text-foreground block"
                      >
                        {run.workflowName}
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                          ID: {run.id.slice(0, 8)}
                        </span>
                        <span>•</span>
                        <span>{run.triggererName ? `by ${run.triggererName}` : "manual"}</span>
                        <span>•</span>
                        <span>
                          {(() => {
                            try {
                              return new Date(run.createdAt).toLocaleString("id-ID");
                            } catch {
                              return run.createdAt;
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {run.totalDurationMs !== null && run.totalDurationMs !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          {run.totalDurationMs >= 1000
                            ? `${(run.totalDurationMs / 1000).toFixed(2)}s`
                            : `${run.totalDurationMs}ms`}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                          run.status === "success"
                            ? "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20"
                            : run.status === "failed"
                            ? "bg-destructive/10 text-destructive ring-destructive/20"
                            : run.status === "running"
                            ? "bg-yellow-500/10 text-yellow-500 ring-yellow-500/20"
                            : "bg-blue-500/10 text-blue-500 ring-blue-500/20"
                        }`}
                      >
                        {run.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
