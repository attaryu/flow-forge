import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Binary } from "lucide-react";
import type { DataTransformConfig } from "../../types";

export type DataTransformNodeData = Node<{
  label: string;
  config?: DataTransformConfig;
}, "DATA_TRANSFORM">;

export function DataTransformNode({ data, selected }: NodeProps<DataTransformNodeData>) {
  const mode = data.config?.mode || "simple";
  const op = data.config?.operation || "";
  const expr = data.config?.expression || "";

  return (
    <div
      className={`min-w-[180px] rounded-lg border bg-card text-card-foreground shadow-sm transition-all ${
        selected ? "ring-2 ring-primary ring-offset-2 border-primary" : "border-muted"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !size-3" />
      <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2 rounded-t-lg">
        <Binary className="h-4 w-4 text-indigo-500" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Transform
        </span>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-sm truncate">{data.label}</h4>
        <div className="mt-1 flex flex-col gap-0.5 text-xs text-muted-foreground">
          <div>
            Mode: <span className="font-semibold capitalize text-foreground">{mode}</span>
          </div>
          {mode === "simple" && op && (
            <div className="truncate">
              Op: <span className="font-medium text-foreground">{op}</span>
            </div>
          )}
          {mode === "advanced" && expr && (
            <div className="truncate font-mono text-[10px] bg-muted/40 p-1 rounded mt-1 border">
              {expr}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !size-3" />
    </div>
  );
}
