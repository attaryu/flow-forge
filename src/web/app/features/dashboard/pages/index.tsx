import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { userQueryOption } from "~/features/auth/hooks/api/use-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { LayoutDashboard, Play, CheckCircle, AlertCircle, RefreshCw, Settings } from "lucide-react";

interface StatItem {
  title: string;
  value: string;
  description: string;
  color: string;
}

interface ActivityItem {
  name: string;
  status: string;
  time: string;
  duration: string;
}

interface DashboardData {
  stats: StatItem[];
  activities: ActivityItem[];
}

const iconMap: Record<string, any> = {
  "Total Workflows": LayoutDashboard,
  "Workflow Runs": Play,
  "Success Rate": CheckCircle,
  "Failed Runs": AlertCircle,
};

export default function DashboardIndex() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery(userQueryOption);

  // Query dashboard statistics and recent activity (mocked client-side)
  const { data, isLoading, isError, refetch, isFetching } = useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        stats: [
          {
            title: "Total Workflows",
            value: "12",
            description: "+2 from last week",
            color: "text-blue-500",
          },
          {
            title: "Workflow Runs",
            value: "1,248",
            description: "Last 30 days",
            color: "text-green-500",
          },
          {
            title: "Success Rate",
            value: "99.2%",
            description: "+0.3% improvement",
            color: "text-emerald-500",
          },
          {
            title: "Failed Runs",
            value: "10",
            description: "Requires diagnosis",
            color: "text-destructive",
          },
        ],
        activities: [
          { name: "Sync CRM Contacts",        status: "success", time: "2 minutes ago",  duration: "450ms"  },
          { name: "Process Stripe Invoices",   status: "success", time: "15 minutes ago", duration: "1.2s"   },
          { name: "Slack Alert Dispatcher",    status: "failed",  time: "1 hour ago",     duration: "250ms"  },
          { name: "Database Backup Pipeline",  status: "success", time: "4 hours ago",    duration: "45.1s"  },
        ],
      };
    },
  });

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
          {data?.stats.map((stat) => {
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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Recent execution runs from your automation pipeline.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
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
            ) : (
              <div className="space-y-8">
                {data?.activities.map((activity, i) => (
                  <div key={i} className="flex items-center">
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">{activity.duration}</span>
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        activity.status === "success"
                          ? "bg-green-500/10 text-green-500 ring-green-500/20"
                          : "bg-destructive/10 text-destructive ring-destructive/20"
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used automation shortcuts.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <button className="flex w-full items-center gap-3 rounded-lg border p-3 hover:bg-accent text-left text-sm font-medium transition-colors cursor-pointer text-foreground">
              <Play className="h-4 w-4 text-blue-500" />
              <div>
                <p>Create a New Workflow</p>
                <p className="text-xs text-muted-foreground">Start building from scratch or templates</p>
              </div>
            </button>
            <Link to="/dashboard/settings" className="flex w-full items-center gap-3 rounded-lg border p-3 hover:bg-accent text-left text-sm font-medium transition-colors text-foreground">
              <Settings className="h-4 w-4 text-zinc-500" />
              <div>
                <p>Account Settings</p>
                <p className="text-xs text-muted-foreground">Manage your profile and preferences</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
