import * as React from "react";
import { Loader2, CheckCircle2, XCircle, AlertCircle, Play, Eye } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import type { SSEEvent } from "../../hooks/api/use-runs-sse";

interface LiveExecutionPanelProps {
  runId: string;
  events: SSEEvent[];
  workflowStatus: "pending" | "running" | "success" | "failed";
  error: string | null;
  onViewDetails: () => void;
}

export function LiveExecutionPanel({
  runId,
  events,
  workflowStatus,
  error,
  onViewDetails,
}: LiveExecutionPanelProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new events arrive
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "default"; // emerald/green in custom variants or standard default
      case "failed":
        return "destructive";
      case "running":
        return "secondary"; // amber/blue
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold tracking-tight">Live Execution</h2>
          <span className="text-xs text-muted-foreground font-mono">Run ID: {runId.slice(0, 8)}...</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor(workflowStatus)} className="capitalize animate-pulse">
            {workflowStatus}
          </Badge>
        </div>
      </div>

      {/* Connection / Status Banner */}
      {error && (
        <div className="p-3 bg-destructive/15 text-destructive text-xs flex items-center gap-2 border-b border-destructive/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Event Stream list */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
            <Loader2 className="h-8 w-8 animate-spin mb-3 text-muted-foreground/60" />
            <p className="text-sm font-medium">Waiting for execution events...</p>
            <p className="text-xs text-muted-foreground/75 mt-1">
              Connecting to the server for live updates.
            </p>
          </div>
        ) : (
          <div className="relative border-l border-muted pl-4 ml-2 space-y-4">
            {events.map((event, idx) => {
              const timestamp = event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : "";
              
              switch (event.type) {
                case "step_started":
                  return (
                    <div key={`event-${idx}`} className="relative group">
                      {/* Timeline dot */}
                      <span className="absolute -left-[25px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">
                            Step Started: {event.nodeId}
                          </span>
                          {event.stepType && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                              {event.stepType}
                            </Badge>
                          )}
                          {timestamp && <span className="text-[10px] text-muted-foreground ml-auto">{timestamp}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Node execution initialized. Resolving inputs...
                        </p>
                      </div>
                    </div>
                  );

                case "step_completed":
                  return (
                    <div key={`event-${idx}`} className="relative group">
                      {/* Timeline dot */}
                      <span className="absolute -left-[25px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-emerald-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-emerald-700">
                            Step Succeeded: {event.nodeId}
                          </span>
                          {timestamp && <span className="text-[10px] text-muted-foreground ml-auto">{timestamp}</span>}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Completed in {event.durationMs ?? 0}ms.</p>
                          {event.output && (
                            <details className="mt-1 bg-muted/30 border border-muted rounded p-1.5 cursor-pointer">
                              <summary className="text-[10px] font-semibold text-slate-600 select-none">
                                View Output
                              </summary>
                              <pre className="text-[10px] font-mono mt-1 overflow-x-auto whitespace-pre-wrap max-h-32 bg-slate-50 border p-1 rounded">
                                {typeof event.output === "string" 
                                  ? event.output 
                                  : JSON.stringify(event.output, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  );

                case "step_failed":
                  return (
                    <div key={`event-${idx}`} className="relative group">
                      {/* Timeline dot */}
                      <span className="absolute -left-[25px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-destructive">
                        <XCircle className="h-3.5 w-3.5 text-destructive" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-destructive">
                            Step Failed: {event.nodeId}
                          </span>
                          {timestamp && <span className="text-[10px] text-muted-foreground ml-auto">{timestamp}</span>}
                        </div>
                        <p className="text-xs text-destructive/90 bg-destructive/10 border border-destructive/20 rounded p-2 mt-1 font-mono">
                          {event.error || "Unknown execution error."}
                        </p>
                      </div>
                    </div>
                  );

                case "workflow_done":
                  const isSuccess = event.status === "success";
                  return (
                    <div key={`event-${idx}`} className="relative mt-6 border-t pt-4">
                      {/* Final status banner */}
                      <div className={`p-3 rounded-lg border flex flex-col gap-1 ${
                        isSuccess 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                          : "bg-destructive/10 border-destructive/20 text-destructive"
                      }`}>
                        <div className="flex items-center gap-2 font-semibold text-sm">
                          {isSuccess ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                          <span>Workflow execution {event.status === "success" ? "Finished" : "Failed"}</span>
                        </div>
                        <p className="text-xs opacity-90">
                          {isSuccess 
                            ? `Workflow completed successfully in ${event.totalDurationMs ?? 0}ms.` 
                            : `Workflow run aborted: ${event.error || "Step execution failed."}`}
                        </p>
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-border bg-slate-50 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewDetails}
          disabled={!events.some(e => e.type === "workflow_done")}
          className="w-full gap-1.5 cursor-pointer font-medium"
        >
          <Eye className="h-4 w-4" />
          View Full Details
        </Button>
      </div>
    </div>
  );
}
