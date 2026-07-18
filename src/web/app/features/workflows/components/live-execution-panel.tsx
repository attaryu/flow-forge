import * as React from "react";
import { Loader2, CheckCircle2, XCircle, ChevronDown, ChevronRight, Eye, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import type { SSEEvent } from "../hooks/api/use-runs-sse";

interface LiveExecutionPanelProps {
  runId: string;
  events: SSEEvent[];
  workflowStatus: "pending" | "running" | "success" | "failed";
  error: string | null;
  onViewDetails: () => void;
}

interface StepState {
  nodeId: string;
  stepType?: string;
  status: "running" | "success" | "failed" | "pending";
  durationMs?: number;
  output?: any;
  error?: string;
  retryCount?: number;
  timestamp?: string;
}

export function LiveExecutionPanel({
  runId,
  events,
  workflowStatus,
  error,
  onViewDetails,
}: LiveExecutionPanelProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [expandedSteps, setExpandedSteps] = React.useState<Record<string, boolean>>({});

  // Auto-scroll ke bawah saat ada event baru
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events]);

  // Reduksi event stream menjadi State per Step (seperti GitHub Actions / Vercel)
  const steps = React.useMemo(() => {
    const stepMap: Record<string, StepState> = {};

    for (const event of events) {
      if (!event.nodeId) continue;
      const id = event.nodeId;

      if (event.type === "step_started") {
        stepMap[id] = {
          nodeId: id,
          stepType: event.stepType || stepMap[id]?.stepType,
          status: "running",
          timestamp: event.timestamp,
        };
      } else if (event.type === "step_completed") {
        stepMap[id] = {
          ...(stepMap[id] || { nodeId: id, status: "success" }),
          status: "success",
          output: event.output,
          durationMs: event.durationMs,
        };
      } else if (event.type === "step_failed") {
        stepMap[id] = {
          ...(stepMap[id] || { nodeId: id, status: "failed" }),
          status: "failed",
          error: event.error,
          retryCount: event.retryCount,
        };
      }
    }

    return Object.values(stepMap);
  }, [events]);

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const getWorkflowStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 font-medium">Success</Badge>;
      case "failed":
        return <Badge variant="destructive" className="font-medium">Failed</Badge>;
      case "running":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0 font-medium flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Running
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-muted-foreground font-medium">Pending</Badge>;
    }
  };

  const getStepStatusIcon = (status: StepState["status"]) => {
    switch (status) {
      case "running":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin shrink-0" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-rose-500 shrink-0" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted shrink-0" />;
    }
  };

  const isWorkflowFinished = events.some((e) => e.type === "workflow_done");

  return (
    <div className="flex flex-col h-full bg-background text-foreground font-sans">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50/50">
        <div className="flex flex-col">
          <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Live Console</h2>
          <span className="text-xs text-muted-foreground font-mono mt-0.5">Run: {runId.slice(0, 8)}</span>
        </div>
        <div>
          {getWorkflowStatusBadge(workflowStatus)}
        </div>
      </div>

      {/* Banner Error SSE */}
      {error && (
        <div className="p-3 bg-rose-50 text-rose-800 text-xs flex items-center gap-2 border-b border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Console Area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
            <Loader2 className="h-6 w-6 animate-spin mb-3 text-muted-foreground" />
            <p className="text-xs font-semibold tracking-wide">Initializing secure console stream...</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Establishing pipeline connection.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {steps.map((step) => {
              const isExpanded = !!expandedSteps[step.nodeId];
              const displayTime = step.timestamp ? new Date(step.timestamp).toLocaleTimeString() : "";

              return (
                <div 
                  key={step.nodeId} 
                  className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                    step.status === "failed" 
                      ? "border-rose-200 bg-rose-50/30" 
                      : step.status === "running"
                        ? "border-blue-200 bg-blue-50/20"
                        : "border-slate-200 bg-card hover:border-slate-300"
                  }`}
                >
                  {/* Step Card Header Row */}
                  <div 
                    onClick={() => toggleStep(step.nodeId)}
                    className="flex items-center justify-between p-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getStepStatusIcon(step.status)}
                      <span className="text-xs font-semibold truncate text-slate-800">
                        {step.nodeId}
                      </span>
                      {step.stepType && (
                        <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono border-slate-200 text-slate-500 bg-slate-50">
                          {step.stepType}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 ml-auto">
                      {step.durationMs !== undefined && (
                        <span className="font-mono text-slate-500">{step.durationMs}ms</span>
                      )}
                      {step.retryCount !== undefined && step.retryCount > 0 && (
                        <Badge className="bg-amber-50 border border-amber-200 text-amber-600 text-[8px] py-0 px-1">
                          {step.retryCount} retries
                        </Badge>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Collapsible Details Area (Vercel Console Style - Light Theme) */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0 border-t border-slate-100 bg-slate-50/80 font-mono text-[10px] space-y-2.5">
                      {step.status === "running" && (
                        <div className="text-slate-500 italic py-1">
                          Executing handler... Waiting for output log.
                        </div>
                      )}

                      {step.error && (
                        <div className="space-y-1 pt-2.5">
                          <span className="font-semibold text-rose-700">Execution Fail Exception:</span>
                          <pre className="bg-rose-50 border border-rose-250 p-2.5 rounded text-rose-700 overflow-x-auto whitespace-pre-wrap leading-relaxed select-text">
                            {step.error}
                          </pre>
                        </div>
                      )}

                      {step.output !== undefined && (
                        <div className={step.error ? "space-y-1" : "space-y-1 pt-2.5"}>
                          <span className="font-semibold text-slate-700">Response Object Payload:</span>
                          <pre className="bg-white border border-slate-200 p-2.5 rounded text-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed select-text">
                            {typeof step.output === "string" 
                              ? step.output 
                              : JSON.stringify(step.output, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Global Success / Failure Banner at bottom inside console list */}
        {isWorkflowFinished && (
          <div className="pt-2">
            {workflowStatus === "success" ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-emerald-800">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-emerald-800">Execution Successful</span>
                  <span className="text-[10px] text-emerald-600/80">Pipeline run fully executed and finished safely.</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-rose-800">
                <XCircle className="h-4.5 w-4.5 text-rose-600 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-rose-800">Execution Aborted</span>
                  <span className="text-[10px] text-rose-600/80">One or more steps failed or global timeout exceeded.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-border bg-slate-50/50 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewDetails}
          disabled={!isWorkflowFinished}
          className="w-full gap-1.5 cursor-pointer font-semibold border-border text-slate-700 bg-background hover:bg-slate-50"
        >
          <Eye className="h-4 w-4" />
          View Full Run Details
        </Button>
      </div>
    </div>
  );
}
