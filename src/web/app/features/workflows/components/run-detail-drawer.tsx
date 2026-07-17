import * as React from "react";
import { 
  X, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Play, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  AlertCircle,
  Activity
} from "lucide-react";
import { useWorkflowRunDetail } from "../hooks/api/use-runs";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "~/components/ui/sheet";

interface RunDetailDrawerProps {
  runId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RunDetailDrawer({ runId, isOpen, onClose }: RunDetailDrawerProps) {
  const { data: run, isLoading, isError } = useWorkflowRunDetail(runId || "");
  const [expandedSteps, setExpandedSteps] = React.useState<Record<string, boolean>>({});

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "default";
      case "failed":
        return "destructive";
      case "running":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive shrink-0" />;
      case "running":
        return <Loader2 className="h-4 w-4 text-amber-500 animate-spin shrink-0" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground shrink-0" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Set wide side panel */}
      <SheetContent side="right" className="w-full sm:max-w-xl flex flex-col h-full overflow-hidden p-0 border-l border-border">
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between p-4 border-b border-border bg-slate-50/50">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              Execution Detail
              {run && (
                <Badge variant={getStatusColor(run.status)} className="capitalize">
                  {run.status}
                </Badge>
              )}
            </h2>
            {runId && (
              <span className="text-xs text-muted-foreground font-mono truncate">
                ID: {runId}
              </span>
            )}
          </div>
        </SheetHeader>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-3 text-muted-foreground/60" />
              <p className="text-sm font-medium">Loading execution details...</p>
            </div>
          ) : isError || !run ? (
            <div className="p-4 rounded-md bg-destructive/15 text-destructive flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Failed to load run details. It may have been deleted.</span>
            </div>
          ) : (
            <>
              {/* Summary Metadata Card */}
              <div className="grid grid-cols-2 gap-4 bg-muted/30 border rounded-lg p-3.5 text-xs">
                <div>
                  <span className="text-muted-foreground block mb-0.5">Trigger Type</span>
                  <span className="font-semibold capitalize flex items-center gap-1.5">
                    <Play className="h-3 w-3 fill-current text-muted-foreground" />
                    {run.triggerType}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Duration</span>
                  <span className="font-semibold flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {run.totalDurationMs !== undefined ? `${run.totalDurationMs}ms` : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Started At</span>
                  <span className="font-medium text-slate-700">
                    {run.startedAt ? new Date(run.startedAt).toLocaleString() : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Ended At</span>
                  <span className="font-medium text-slate-700">
                    {run.endedAt ? new Date(run.endedAt).toLocaleString() : "-"}
                  </span>
                </div>
              </div>

              {/* Global Error Message (if any) */}
              {run.errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs space-y-1">
                  <span className="font-semibold block text-rose-900">Execution Error:</span>
                  <p className="font-mono bg-white/50 p-2 rounded border border-rose-100 overflow-x-auto whitespace-pre-wrap max-h-32">
                    {run.errorMessage}
                  </p>
                </div>
              )}

              {/* AI Diagnosis Panel (if any) */}
              {run.aiDiagnosis && (
                <div className="p-3.5 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 text-violet-900 rounded-lg text-xs space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 font-bold text-violet-850">
                    <Sparkles className="h-4 w-4 text-violet-650 animate-pulse fill-current" />
                    <span>AI Diagnosis & Remediation</span>
                  </div>
                  <p className="leading-relaxed bg-white/70 border border-violet-100 p-2.5 rounded-md font-sans text-slate-800 select-text whitespace-pre-wrap">
                    {run.aiDiagnosis}
                  </p>
                </div>
              )}

              {/* Step Logs List */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight text-slate-800">Step Execution Logs</h3>
                {!run.stepLogs || run.stepLogs.length === 0 ? (
                  <div className="p-8 border border-dashed rounded-lg text-center text-xs text-muted-foreground bg-muted/10">
                    No step logs recorded for this execution.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {run.stepLogs.map((log) => {
                      const isExpanded = !!expandedSteps[log.id];
                      return (
                        <div 
                          key={log.id} 
                          className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                            log.status === "failed" 
                              ? "border-rose-200 bg-rose-50/20" 
                              : log.status === "running"
                                ? "border-blue-200 bg-blue-50/10"
                                : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          {/* Log Row Header */}
                          <div 
                            onClick={() => toggleStep(log.id)}
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {getStatusIcon(log.status)}
                              <span className="text-xs font-semibold truncate text-slate-800">
                                {log.stepName || log.stepId}
                              </span>
                              <Badge variant="outline" className="text-[9px] px-1 py-0 font-mono border-slate-250 text-slate-500 bg-slate-50">
                                {log.stepType}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground ml-auto">
                              {log.durationMs !== undefined && (
                                <span className="font-mono text-slate-600">{log.durationMs}ms</span>
                              )}
                              {log.retryCount > 0 && (
                                <Badge variant="secondary" className="text-[9px] py-0 px-1">
                                  {log.retryCount} retries
                                </Badge>
                              )}
                              {isExpanded ? (
                                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                              )}
                            </div>
                          </div>

                          {/* Expandable Log Details (Vercel Console Style - Light Theme) */}
                          {isExpanded && (
                            <div className="px-3 pb-3 pt-0 border-t border-slate-100 bg-slate-50/80 font-mono text-[10px] space-y-2.5">
                              {log.errorMessage && (
                                <div className="space-y-1 pt-2.5">
                                  <span className="font-semibold text-rose-700">Execution Fail Exception:</span>
                                  <pre className="bg-rose-50 border border-rose-200 p-2.5 rounded text-rose-700 overflow-x-auto whitespace-pre-wrap leading-relaxed select-text">
                                    {log.errorMessage}
                                  </pre>
                                </div>
                              )}

                              {/* Input Data */}
                              <div className={log.errorMessage ? "space-y-1" : "space-y-1 pt-2.5"}>
                                <span className="font-semibold text-slate-700">Request Object Payload:</span>
                                <pre className="bg-white border border-slate-200 p-2.5 rounded text-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed select-text">
                                  {log.input 
                                    ? JSON.stringify(log.input, null, 2) 
                                    : "null"}
                                </pre>
                              </div>

                              {/* Output Data */}
                              {log.status === "success" && (
                                <div className="space-y-1">
                                  <span className="font-semibold text-slate-700">Response Object Payload:</span>
                                  <pre className="bg-white border border-slate-200 p-2.5 rounded text-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed select-text">
                                    {log.output 
                                      ? (typeof log.output === "string" && (log.output.startsWith("{") || log.output.startsWith("["))
                                        ? JSON.stringify(JSON.parse(log.output), null, 2)
                                        : typeof log.output === "string" 
                                          ? log.output
                                          : JSON.stringify(log.output, null, 2)
                                      ) 
                                      : "null"}
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
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
