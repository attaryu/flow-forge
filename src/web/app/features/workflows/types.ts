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
  field: string;
  operator: "EQUALS" | "NOT_EQUALS" | "GREATER_THAN" | "CONTAINS";
  value: string;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  config: HttpCallConfig | DelayConfig | DataTransformConfig | ConditionalConfig;
  data: {
    label: string;
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

export interface Workflow {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  definition: WorkflowDefinition;
  version: number;
  status: "active" | "archived";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateWorkflowInput {
  name: string;
  description?: string;
  definition: WorkflowDefinition;
}

export interface UpdateWorkflowInput {
  name?: string;
  description?: string;
  definition?: WorkflowDefinition;
}
