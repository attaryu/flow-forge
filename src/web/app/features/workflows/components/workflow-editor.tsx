import * as React from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus, Check, Play, Save, AlertTriangle } from "lucide-react";
import { nodeTypes } from "./nodes/node-types";
import { NodeConfigPanel } from "./node-config-panel";
import type { WorkflowNode, NodeType, DbEdge, WorkflowDefinition } from "../types";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

interface WorkflowEditorProps {
  initialDefinition?: WorkflowDefinition;
  onSave: (definition: WorkflowDefinition) => void;
  isSaving?: boolean;
}

export function WorkflowEditor({ initialDefinition, onSave, isSaving }: WorkflowEditorProps) {
  // Map initial edges database-format (from/to) to React Flow (source/target/id)
  const initialNodes = React.useMemo(() => {
    return (initialDefinition?.nodes || []).map((node) => ({
      ...node,
      data: { ...node.data, label: node.data.label || node.id },
    })) as Node[];
  }, [initialDefinition]);

  const initialEdges = React.useMemo(() => {
    return (initialDefinition?.edges || []).map((edge) => ({
      id: `${edge.from}-${edge.to}-${edge.sourceHandle || "default"}`,
      source: edge.from,
      target: edge.to,
      sourceHandle: edge.sourceHandle,
    })) as Edge[];
  }, [initialDefinition]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = React.useState<WorkflowNode | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  // Sync selected node with any updates from state changes
  React.useEffect(() => {
    if (selectedNode) {
      const current = nodes.find((n) => n.id === selectedNode.id);
      if (current) {
        setSelectedNode(current as any);
      }
    }
  }, [nodes, selectedNode?.id]);

  const onConnect = React.useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const isConditional = sourceNode?.type === "CONDITIONAL_BRANCH";
      const edgeId = `${params.source}-${params.target}-${params.sourceHandle || "default"}`;
      
      const newEdge = {
        ...params,
        id: edgeId,
        sourceHandle: isConditional ? params.sourceHandle : undefined,
      };

      setEdges((eds) => addEdge(newEdge as any, eds as any) as any);
    },
    [nodes, setEdges]
  );

  const addNode = (type: NodeType) => {
    const id = `${type.toLowerCase()}-${Date.now().toString().slice(-6)}`;
    let defaultLabel = "";
    let defaultConfig = {};

    switch (type) {
      case "HTTP_CALL":
        defaultLabel = "HTTP Call";
        defaultConfig = { method: "GET", url: "" };
        break;
      case "DELAY":
        defaultLabel = "Delay Step";
        defaultConfig = { seconds: 10 };
        break;
      case "DATA_TRANSFORM":
        defaultLabel = "Data Transform";
        defaultConfig = { mode: "simple", operation: "UPPERCASE" };
        break;
      case "CONDITIONAL_BRANCH":
        defaultLabel = "Condition Branch";
        defaultConfig = { field: "", operator: "EQUALS", value: "" };
        break;
    }

    const newNode: Node = {
      id,
      type,
      position: { x: Math.random() * 150 + 100, y: Math.random() * 150 + 100 },
      data: { label: defaultLabel },
      config: defaultConfig,
    } as any;

    setNodes((nds) => [...nds, newNode]);
  };

  const handleUpdateNode = (id: string, updates: Partial<WorkflowNode>) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          const updated = { ...n, ...updates };
          if (updates.data) {
            updated.data = { ...n.data, ...updates.data };
          }
          if (updates.config) {
            updated.config = { ...((n as any).config || {}), ...updates.config } as any;
          }
          return updated;
        }
        return n;
      })
    );
  };

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as any);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  // DAG validation: DFS cycle check
  const validateDefinition = (currentNodes: Node[], currentEdges: Edge[]): boolean => {
    setValidationError(null);

    // 1. Check for cycles
    const adjList = new Map<string, string[]>();
    for (const node of currentNodes) {
      adjList.set(node.id, []);
    }
    for (const edge of currentEdges) {
      const list = adjList.get(edge.source);
      if (list) {
        list.push(edge.target);
      }
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recStack.add(nodeId);

      const neighbors = adjList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (hasCycle(neighbor)) return true;
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const node of currentNodes) {
      if (hasCycle(node.id)) {
        setValidationError("Cycle detected in the workflow! Flows must be Directed Acyclic Graphs (DAG).");
        return false;
      }
    }

    // 2. Check conditional branches
    for (const node of currentNodes) {
      if (node.type === "CONDITIONAL_BRANCH") {
        const outEdges = currentEdges.filter((e) => e.source === node.id);
        const hasTrue = outEdges.some((e) => e.sourceHandle === "true");
        const hasFalse = outEdges.some((e) => e.sourceHandle === "false");
        
        if (!hasTrue || !hasFalse) {
          setValidationError(
            `Conditional step "${node.data.label || node.id}" must have both a TRUE and a FALSE branch connected.`
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleSave = () => {
    const isValid = validateDefinition(nodes, edges);
    if (!isValid) return;

    // Map React Flow edges back to Database schema format (from/to/sourceHandle)
    const dbEdges: DbEdge[] = edges.map((edge) => ({
      from: edge.source,
      to: edge.target,
      sourceHandle: edge.sourceHandle || undefined,
    }));

    // Map React Flow nodes back to Db schema format
    const dbNodes: WorkflowNode[] = nodes.map((node) => ({
      id: node.id,
      type: node.type as NodeType,
      position: node.position,
      config: (node as any).config || {},
      data: {
        label: (node.data.label as string) || node.id,
      },
    }));

    onSave({
      nodes: dbNodes,
      edges: dbEdges,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg bg-background overflow-hidden relative">
      {/* Top action bar */}
      <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/30">
        <div className="flex gap-2">
          <Button onClick={() => addNode("HTTP_CALL")} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1 text-sky-500" /> HTTP Call
          </Button>
          <Button onClick={() => addNode("DELAY")} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1 text-amber-500" /> Delay
          </Button>
          <Button onClick={() => addNode("DATA_TRANSFORM")} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1 text-indigo-500" /> Transform
          </Button>
          <Button onClick={() => addNode("CONDITIONAL_BRANCH")} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1 text-rose-500" /> Branch
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => validateDefinition(nodes, edges) && alert("Workflow is valid!")}
          >
            <Check className="h-4 w-4 mr-1 text-emerald-500" /> Validate
          </Button>
          <Button onClick={handleSave} size="sm" disabled={isSaving}>
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? "Saving..." : "Save Workflow"}
          </Button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex flex-1 relative overflow-hidden">
        {validationError && (
          <div className="absolute top-4 left-4 right-4 z-10">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Validation Error</AlertTitle>
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>

        {selectedNode && (
          <div className="h-full z-10 bg-card">
            <NodeConfigPanel
              node={selectedNode}
              onUpdate={handleUpdateNode}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
