import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Clock } from "lucide-react";
import type { DelayConfig } from "../../types";

export type DelayNodeData = Node<{
  label: string;
  config?: DelayConfig;
}, "DELAY">;

export function DelayNode({ data, selected }: NodeProps<DelayNodeData>) {
  const seconds = data.config?.seconds || 0;

  return (
    <div
      className={`min-w-[180px] rounded-lg border bg-card text-card-foreground shadow-sm transition-all ${
        selected ? "ring-2 ring-primary ring-offset-2 border-primary" : "border-muted"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !size-3" />
      <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2 rounded-t-lg">
        <Clock className="h-4 w-4 text-amber-500" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Delay
        </span>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-sm truncate">{data.label}</h4>
        <p className="mt-1 text-xs text-muted-foreground">
          Duration: <span className="font-semibold">{seconds}s</span>
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !size-3" />
    </div>
  );
}
