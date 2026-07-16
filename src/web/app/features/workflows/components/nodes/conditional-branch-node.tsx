import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { GitFork } from "lucide-react";
import type { ConditionalConfig } from "../../types";

export type ConditionalBranchNodeData = Node<{
  label: string;
  config?: ConditionalConfig;
}, "CONDITIONAL_BRANCH">;

export function ConditionalBranchNode({ data, selected }: NodeProps<ConditionalBranchNodeData>) {
  const field = data.config?.field || "No field configured";
  const op = data.config?.operator || "EQUALS";
  const val = data.config?.value || "";

  return (
    <div
      className={`min-w-[200px] rounded-lg border bg-card text-card-foreground shadow-sm transition-all ${
        selected ? "ring-2 ring-primary ring-offset-2 border-primary" : "border-muted"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !size-3" />
      <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2 rounded-t-lg">
        <GitFork className="h-4 w-4 text-rose-500" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Branch
        </span>
      </div>
      <div className="p-3 pb-6">
        <h4 className="font-semibold text-sm truncate">{data.label}</h4>
        <div className="mt-1 flex flex-col gap-0.5 text-xs text-muted-foreground">
          <div className="truncate">
            If: <span className="font-semibold text-foreground">{field}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase font-mono">
              {op}
            </span>
            <span className="truncate font-semibold text-foreground">"{val}"</span>
          </div>
        </div>
      </div>

      {/* Two outputs for logical branches */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 pb-1">
        <div className="relative flex flex-col items-center">
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="!bg-emerald-500 !size-3"
            style={{ left: "auto" }}
          />
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 absolute -top-4">
            TRUE
          </span>
        </div>
        <div className="relative flex flex-col items-center">
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="!bg-rose-500 !size-3"
            style={{ left: "auto" }}
          />
          <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 absolute -top-4">
            FALSE
          </span>
        </div>
      </div>
    </div>
  );
}
