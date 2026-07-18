import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  workflowsQueryOption,
  useCreateWorkflow,
  useUpdateWorkflow,
  useDeleteWorkflow,
} from "../hooks/api/use-workflows";
import { WorkflowEditor } from "../components/workflow-editor";
import { RunTriggerButton } from "../components/run-trigger-button";
import { LiveExecutionPanel } from "../components/live-execution-panel";
import { RunHistoryPanel } from "../components/run-history-panel";
import { RunDetailDrawer } from "../components/run-detail-drawer";
import { useWorkflowRunSSE } from "../hooks/api/use-runs-sse";
import type { Workflow, WorkflowDefinition } from "../types";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";
import { ArrowLeft, Plus, Trash2, Calendar, GitBranch, AlertTriangle } from "lucide-react";

const defaultDefinition: WorkflowDefinition = {
  nodes: [
    {
      id: "http-call-start",
      type: "HTTP_CALL",
      config: { method: "GET", url: "https://api.example.com/start" },
    },
  ],
  edges: [],
};

export default function WorkflowsPage() {
  const queryClient = useQueryClient();
  const { data: workflows = [], isLoading, isError } = useQuery(workflowsQueryOption);

  const [editingWorkflow, setEditingWorkflow] = React.useState<Workflow | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");

  // States for Execution, History & Detail Panel
  const [activeRunId, setActiveRunId] = React.useState<string | null>(null);
  const [isLiveOpen, setIsLiveOpen] = React.useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [selectedRunId, setSelectedRunId] = React.useState<string | null>(null);

  // Subscribe to live SSE events for active run
  const { events, workflowStatus, error: sseError } = useWorkflowRunSSE(activeRunId);

  // Invalidate execution history queries once the active run completes (reaches a final state via SSE)
  React.useEffect(() => {
    if ((workflowStatus === "success" || workflowStatus === "failed") && editingWorkflow?.id) {
      queryClient.invalidateQueries({
        queryKey: ["workflows", editingWorkflow.id, "runs"],
      });
    }
  }, [workflowStatus, editingWorkflow?.id, queryClient]);

  // Calculate executionStatus mapping for node canvas highlight
  const executionStatus = React.useMemo(() => {
    const statusMap: Record<string, "running" | "success" | "failed"> = {};
    events.forEach((event) => {
      if (event.nodeId) {
        if (event.type === "step_started") {
          statusMap[event.nodeId] = "running";
        } else if (event.type === "step_completed") {
          statusMap[event.nodeId] = "success";
        } else if (event.type === "step_failed") {
          statusMap[event.nodeId] = "failed";
        }
      }
    });
    return statusMap;
  }, [events]);

  const createWorkflowMutation = useCreateWorkflow();
  const deleteWorkflowMutation = useDeleteWorkflow();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    createWorkflowMutation.mutate(
      {
        name: newName.trim(),
        description: newDescription.trim() || undefined,
        definition: defaultDefinition,
      },
      {
        onSuccess: (newWorkflow) => {
          setIsCreateOpen(false);
          setNewName("");
          setNewDescription("");
          // Automatically open the new workflow for editing
          setEditingWorkflow(newWorkflow);
        },
      }
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the workflow "${name}"?`)) {
      deleteWorkflowMutation.mutate(id);
    }
  };

  // When editing a workflow, we instantiate the update mutation for that specific workflow ID
  const updateWorkflowMutation = useUpdateWorkflow(editingWorkflow?.id || "");

  const handleSaveDefinition = (payload: any) => {
    if (!editingWorkflow) return;

    updateWorkflowMutation.mutate(
      payload,
      {
        onSuccess: (updatedWorkflow) => {
          setEditingWorkflow(updatedWorkflow);
        },
      }
    );
  };

  if (editingWorkflow) {
    return (
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setEditingWorkflow(null);
                setActiveRunId(null);
                setIsLiveOpen(false);
                setIsHistoryOpen(false);
                setSelectedRunId(null);
              }}
              className="h-8 w-8 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{editingWorkflow.name}</h1>
              {editingWorkflow.description && (
                <p className="text-sm text-muted-foreground">{editingWorkflow.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsHistoryOpen(true)}
              className="cursor-pointer"
            >
              Run History
            </Button>
            <RunTriggerButton
              workflowId={editingWorkflow.id}
              onTriggered={(runId) => {
                setActiveRunId(runId);
                setIsLiveOpen(true);
              }}
            />
            <Badge variant={editingWorkflow.status === "active" ? "default" : "secondary"}>
              {editingWorkflow.status}
            </Badge>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <WorkflowEditor
            initialDefinition={editingWorkflow.definition}
            onSave={handleSaveDefinition}
            isSaving={updateWorkflowMutation.isPending}
            executionStatus={executionStatus}
          />
        </div>

        {/* Live Execution Stream Drawer */}
        <Sheet open={isLiveOpen} onOpenChange={setIsLiveOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full border-l border-border">
            <LiveExecutionPanel
              key={activeRunId || ""}
              runId={activeRunId || ""}
              events={events}
              workflowStatus={workflowStatus}
              error={sseError}
              onViewDetails={() => {
                setSelectedRunId(activeRunId);
                setIsLiveOpen(false);
              }}
            />
          </SheetContent>
        </Sheet>

        {/* Execution Run History List Drawer */}
        <RunHistoryPanel
          workflowId={editingWorkflow.id}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelectRun={(runId) => {
            setSelectedRunId(runId);
          }}
          onRunDeleted={(deletedRunId) => {
            if (selectedRunId === deletedRunId) {
              setSelectedRunId(null);
            }
          }}
        />

        {/* Execution Log Details Drawer */}
        <RunDetailDrawer
          runId={selectedRunId}
          isOpen={!!selectedRunId}
          onClose={() => setSelectedRunId(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">
            Create, manage, and design your automation pipelines.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="cursor-pointer gap-2">
          <Plus className="h-4 w-4" /> Create Workflow
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <div className="h-5 w-2/3 bg-muted animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent className="h-12 bg-muted/20 animate-pulse rounded m-6 mt-0" />
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Failed to load workflows. Please try refreshing again.
        </div>
      ) : workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-12 text-center bg-muted/10">
          <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg">No Workflows</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Workflows allow you to automate data flow across systems. Create one to get started.
          </p>
          <Button onClick={() => setIsCreateOpen(true)} className="cursor-pointer">
            Create your first workflow
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1 text-lg">{workflow.name}</CardTitle>
                  <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                    {workflow.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 min-h-10">
                  {workflow.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Created {new Date(workflow.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-3 flex justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingWorkflow(workflow)}
                  className="cursor-pointer"
                >
                  Edit Flow
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(workflow.id, workflow.name)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Create Workflow</DialogTitle>
            <DialogDescription>
              Enter a name and description for your new automation workflow.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Sync CRM Contacts"
                required
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Briefly describe what this workflow automates..."
                rows={3}
              />
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={createWorkflowMutation.isPending}>
                {createWorkflowMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
