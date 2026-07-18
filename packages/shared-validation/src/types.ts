export type NodeType = "HTTP_CALL" | "DELAY" | "DATA_TRANSFORM" | "CONDITIONAL_BRANCH";

export interface HttpCallConfig {
  url: string;
  method: "GET" | "POST";
  headers?: Record<string, string>;
  payload?: string;
}

export interface DelayConfig {
  seconds: number;
}

export interface DataTransformConfig {
  mode: "simple" | "advanced";
  operation?: string;
  expression?: string;
}

export interface ConditionalConfig {
  operator: "EQUALS" | "NOT_EQUALS" | "GREATER_THAN" | "CONTAINS";
  left: string;
  right: string;
  field?: string;
  value?: string;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  config: any;
  data?: {
    label?: string;
  };
}

export interface DbEdge {
  from: string;
  to: string;
  sourceHandle?: string;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: DbEdge[];
}

export interface WorkflowInput {
  name: string;
  description?: string;
  definition: WorkflowDefinition;
}
