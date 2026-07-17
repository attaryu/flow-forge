import * as React from "react";
import { Play, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTriggerWorkflowRun } from "../hooks/api/use-runs";
import { toast } from "sonner";

interface RunTriggerButtonProps {
  workflowId: string;
  onTriggered?: (runId: string) => void;
  disabled?: boolean;
}

export function RunTriggerButton({
  workflowId,
  onTriggered,
  disabled = false,
}: RunTriggerButtonProps) {
  const triggerMutation = useTriggerWorkflowRun();

  const handleTrigger = () => {
    if (disabled || triggerMutation.isPending) return;

    triggerMutation.mutate(workflowId, {
      onSuccess: (data) => {
        toast.success("Workflow run triggered successfully!");
        if (onTriggered && data.runId) {
          onTriggered(data.runId);
        }
      },
      onError: (err: any) => {
        const errMsg = err.message || "Failed to trigger workflow execution.";
        toast.error(errMsg);
      },
    });
  };

  return (
    <Button
      onClick={handleTrigger}
      disabled={disabled || triggerMutation.isPending}
      className="cursor-pointer gap-2"
      size="sm"
    >
      {triggerMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Play className="h-4 w-4 fill-current" />
      )}
      {triggerMutation.isPending ? "Starting..." : "Run Flow"}
    </Button>
  );
}
