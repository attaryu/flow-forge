import * as React from "react";
import { 
  X, 
  Loader2, 
  Play, 
  Clock, 
  Calendar, 
  ChevronRight, 
  AlertCircle,
  GitBranch,
  Trash2
} from "lucide-react";
import { useWorkflowRuns, useDeleteRun } from "../hooks/api/use-runs";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "~/components/ui/sheet";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "~/components/ui/dialog";

interface RunHistoryPanelProps {
  workflowId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectRun: (runId: string) => void;
  onRunDeleted?: (runId: string) => void;
}

export function RunHistoryPanel({
  workflowId,
  isOpen,
  onClose,
  onSelectRun,
  onRunDeleted,
}: RunHistoryPanelProps) {
  const { data: runs = [], isLoading, isError } = useWorkflowRuns(workflowId);
  const deleteRun = useDeleteRun(workflowId);
  const [runIdToDelete, setRunIdToDelete] = React.useState<string | null>(null);

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

  const handleDelete = (e: React.MouseEvent, runId: string) => {
    e.stopPropagation();
    setRunIdToDelete(runId);
  };

  const confirmDelete = () => {
    if (!runIdToDelete) return;
    deleteRun.mutate(runIdToDelete, {
      onSuccess: () => {
        if (onRunDeleted) {
          onRunDeleted(runIdToDelete);
        }
        setRunIdToDelete(null);
      },
      onError: () => {
        setRunIdToDelete(null);
      }
    });
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        {/* Set sheet size style */}
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full overflow-hidden p-0 border-l border-border">
          {/* Header */}
          <SheetHeader className="flex flex-row items-center justify-between p-4 border-b border-border bg-slate-50/50">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg font-bold tracking-tight">Execution History</h2>
              <p className="text-xs text-muted-foreground">Recent runs for this workflow</p>
            </div>
          </SheetHeader>

          {/* Content list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2 p-3 border rounded-lg animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-1/3 bg-muted rounded" />
                      <div className="h-4 w-16 bg-muted rounded" />
                    </div>
                    <div className="h-3 w-1/2 bg-muted/60 rounded" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="p-4 rounded-md bg-destructive/15 text-destructive flex items-center gap-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Failed to load execution history. Please try again.</span>
              </div>
            ) : runs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 border border-dashed rounded-lg p-6 text-center text-muted-foreground bg-muted/5">
                <GitBranch className="h-10 w-10 text-muted-foreground/45 mb-2" />
                <p className="text-sm font-semibold">No execution history</p>
                <p className="text-xs text-muted-foreground/75 mt-1">
                  Trigger this workflow to see its execution records.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {runs.map((run) => {
                  const triggerTime = run.startedAt 
                    ? new Date(run.startedAt).toLocaleString() 
                    : new Date(run.createdAt).toLocaleString();

                  return (
                    <div
                      key={run.id}
                      onClick={() => onSelectRun(run.id)}
                      className="group border border-border rounded-lg p-3 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between select-none"
                    >
                      <div className="space-y-1.5 min-w-0 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={getStatusColor(run.status)} className="capitalize font-medium text-[10px] py-0 px-1.5">
                            {run.status}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            ID: {run.id.slice(0, 8)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Play className="h-3 w-3 fill-current" />
                            <span className="capitalize">{run.triggerType}</span>
                          </span>
                          {run.totalDurationMs !== undefined && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{run.totalDurationMs}ms</span>
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{triggerTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {(run.status === "success" || run.status === "failed") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deleteRun.isPending}
                            onClick={(e) => handleDelete(e, run.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                          >
                            {deleteRun.isPending && deleteRun.variables === run.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={runIdToDelete !== null} onOpenChange={(open) => !open && setRunIdToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Execution Run</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this execution run and all its step logs? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRunIdToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteRun.isPending}
            >
              {deleteRun.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
