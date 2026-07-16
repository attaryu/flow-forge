import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Globe } from "lucide-react";
import type { HttpCallConfig } from "../../types";

export type HttpCallNodeData = Node<{
  label: string;
  config?: HttpCallConfig;
}, "HTTP_CALL">;

export function HttpCallNode({ data, selected }: NodeProps<HttpCallNodeData>) {
  const method = data.config?.method || "GET";
  const url = data.config?.url || "No URL configured";

  return (
    <div
      className={`min-w-[200px] rounded-lg border bg-card text-card-foreground shadow-sm transition-all ${
        selected ? "ring-2 ring-primary ring-offset-2 border-primary" : "border-muted"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !size-3" />
      <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2 rounded-t-lg">
        <Globe className="h-4 w-4 text-sky-500" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          HTTP Call
        </span>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-sm truncate">{data.label}</h4>
        <div className="mt-1 flex items-center gap-1.5 overflow-hidden">
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
              method === "POST"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            }`}
          >
            {method}
          </span>
          <span className="text-xs text-muted-foreground truncate">{url}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !size-3" />
    </div>
  );
}
