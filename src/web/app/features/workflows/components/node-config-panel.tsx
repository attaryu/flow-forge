import * as React from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { WorkflowNode, NodeType } from "../types";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface NodeConfigPanelProps {
  node: WorkflowNode | null;
  onUpdate: (id: string, updates: Partial<WorkflowNode>) => void;
  onClose: () => void;
}

export function NodeConfigPanel({ node, onUpdate, onClose }: NodeConfigPanelProps) {
  if (!node) return null;

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(node.id, {
      data: { ...node.data, label: e.target.value },
    });
  };

  const handleConfigChange = (key: string, value: any) => {
    onUpdate(node.id, {
      config: {
        ...(node.config || {}),
        [key]: value,
      } as any,
    });
  };

  const renderConfigForm = () => {
    switch (node.type) {
      case "HTTP_CALL": {
        const config = (node.config || {}) as any;
        const headers = config.headers || {};

        const handleHeaderChange = (oldKey: string, newKey: string, val: string) => {
          const updated = { ...headers };
          if (oldKey !== newKey) {
            delete updated[oldKey];
          }
          if (newKey) {
            updated[newKey] = val;
          }
          handleConfigChange("headers", updated);
        };

        const handleAddHeader = () => {
          const updated = { ...headers, "": "" };
          handleConfigChange("headers", updated);
        };

        const handleRemoveHeader = (keyToRemove: string) => {
          const updated = { ...headers };
          delete updated[keyToRemove];
          handleConfigChange("headers", updated);
        };

        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="http-method">Method</Label>
              <Select
                value={config.method || "GET"}
                onValueChange={(val) => handleConfigChange("method", val)}
              >
                <SelectTrigger id="http-method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET (Fetch Data)</SelectItem>
                  <SelectItem value="POST">POST (Send Data)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="http-url">URL</Label>
              <Input
                id="http-url"
                type="url"
                placeholder="https://api.example.com/data"
                value={config.url || ""}
                onChange={(e) => handleConfigChange("url", e.target.value)}
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label>Headers</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddHeader}>
                  <Plus className="h-3 w-3 mr-1" /> Add Header
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(headers).map(([key, val], idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="Key"
                      value={key}
                      onChange={(e) => handleHeaderChange(key, e.target.value, val as string)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={val as string}
                      onChange={(e) => handleHeaderChange(key, key, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveHeader(key)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {config.method === "POST" && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="http-payload">Payload (JSON)</Label>
                <Textarea
                  id="http-payload"
                  placeholder='{ "key": "value" }'
                  rows={4}
                  value={config.payload || ""}
                  onChange={(e) => handleConfigChange("payload", e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            )}
          </div>
        );
      }

      case "DELAY": {
        const config = (node.config || {}) as any;
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delay-seconds">Duration (seconds)</Label>
              <Input
                id="delay-seconds"
                type="number"
                min={1}
                max={86400}
                placeholder="10"
                value={config.seconds || ""}
                onChange={(e) => handleConfigChange("seconds", parseInt(e.target.value) || 0)}
              />
              <span className="text-xs text-muted-foreground block">
                Values allowed: 1s to 86400s (24 hours). Non-blocking operation.
              </span>
            </div>
          </div>
        );
      }

      case "DATA_TRANSFORM": {
        const config = (node.config || {}) as any;
        const mode = config.mode || "simple";

        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transform-mode">Transformation Mode</Label>
              <Select
                value={mode}
                onValueChange={(val) => {
                  handleConfigChange("mode", val);
                  if (val === "simple") {
                    handleConfigChange("expression", undefined);
                  } else {
                    handleConfigChange("operation", undefined);
                  }
                }}
              >
                <SelectTrigger id="transform-mode">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple (Predefined Operations)</SelectItem>
                  <SelectItem value="advanced">Advanced (Expressions)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === "simple" ? (
              <div className="space-y-2">
                <Label htmlFor="transform-op">Operation</Label>
                <Select
                  value={config.operation || ""}
                  onValueChange={(val) => handleConfigChange("operation", val)}
                >
                  <SelectTrigger id="transform-op">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPPERCASE">Uppercase Text</SelectItem>
                    <SelectItem value="LOWERCASE">Lowercase Text</SelectItem>
                    <SelectItem value="TRIM">Trim Whitespaces</SelectItem>
                    <SelectItem value="CONCAT">Concatenate fields</SelectItem>
                    <SelectItem value="ADD">Add Numbers (+)</SelectItem>
                    <SelectItem value="SUBTRACT">Subtract Numbers (-)</SelectItem>
                    <SelectItem value="MULTIPLY">Multiply Numbers (*)</SelectItem>
                    <SelectItem value="DIVIDE">Divide Numbers (/)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="transform-expr">Expression</Label>
                <Textarea
                  id="transform-expr"
                  placeholder='${http-1.status} == 200 ? "Active" : "Error"'
                  rows={4}
                  value={config.expression || ""}
                  onChange={(e) => handleConfigChange("expression", e.target.value)}
                  className="font-mono text-xs"
                />
                <div className="text-xs text-muted-foreground p-3 rounded-md bg-muted border mt-2">
                  <strong className="block mb-1">Guide:</strong>
                  Use variables from other nodes via <code className="bg-background px-1 py-0.5 rounded font-mono">${`{nodeId.field}`}</code>.
                  <br />
                  Example: <code className="bg-background px-1 py-0.5 rounded font-mono">${`{http-1.body.status}`} == "success" ? true : false</code>
                </div>
              </div>
            )}
          </div>
        );
      }

      case "CONDITIONAL_BRANCH": {
        const config = (node.config || {}) as any;

        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cond-field">Check Value (Field reference)</Label>
              <Input
                id="cond-field"
                placeholder="http-1.status or data.users"
                value={config.field || ""}
                onChange={(e) => handleConfigChange("field", e.target.value)}
              />
              <span className="text-xs text-muted-foreground block">
                Reference format: <code className="font-mono">{`nodeId.field`}</code>
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cond-op">Comparison Operator</Label>
              <Select
                value={config.operator || "EQUALS"}
                onValueChange={(val) => handleConfigChange("operator", val)}
              >
                <SelectTrigger id="cond-op">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EQUALS">Equals (==)</SelectItem>
                  <SelectItem value="NOT_EQUALS">Does Not Equal (!=)</SelectItem>
                  <SelectItem value="GREATER_THAN">Greater Than (&gt;)</SelectItem>
                  <SelectItem value="CONTAINS">Contains (Text search)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cond-value">Compare To Value</Label>
              <Input
                id="cond-value"
                placeholder="200"
                value={config.value || ""}
                onChange={(e) => handleConfigChange("value", e.target.value)}
              />
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-80 h-full border-l bg-card text-card-foreground flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Configure Step</h3>
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono">
            {node.type.replace("_", " ")}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="step-name">Step Name</Label>
          <Input id="step-name" value={node.data.label} onChange={handleLabelChange} />
        </div>

        <div className="border-t pt-4">
          {renderConfigForm()}
        </div>
      </div>
    </div>
  );
}
