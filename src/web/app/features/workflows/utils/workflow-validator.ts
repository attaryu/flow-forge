import type { WorkflowNode, DbEdge } from "../types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateWorkflow(workflowJson: any): ValidationResult {
  const errors: string[] = [];

  // 1. Check top-level JSON structure
  if (!workflowJson || typeof workflowJson !== "object" || Array.isArray(workflowJson)) {
    return {
      valid: false,
      errors: ["Workflow must be a valid JSON object."],
    };
  }

  const { name, description, definition } = workflowJson;

  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("Workflow 'name' is required and must be a non-empty string.");
  }

  if (description !== undefined && typeof description !== "string") {
    errors.push("Workflow 'description' must be a string.");
  }

  if (!definition || typeof definition !== "object" || Array.isArray(definition)) {
    return {
      valid: false,
      errors: [...errors, "Workflow 'definition' is required and must be an object."],
    };
  }

  const { nodes, edges } = definition;

  if (!Array.isArray(nodes)) {
    errors.push("Workflow definition 'nodes' is required and must be an array.");
  }

  if (!Array.isArray(edges)) {
    errors.push("Workflow definition 'edges' is required and must be an array.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Helper for tracking existing node IDs
  const nodeIds = new Set<string>();
  const nodesList = nodes as WorkflowNode[];
  const edgesList = edges as DbEdge[];

  // 2. Validate Nodes
  nodesList.forEach((node, index) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) {
      errors.push(`Node at index ${index} must be an object.`);
      return;
    }

    if (!node.id || typeof node.id !== "string" || node.id.trim() === "") {
      errors.push(`Node at index ${index} is missing a valid 'id'.`);
    } else {
      if (nodeIds.has(node.id)) {
        errors.push(`Duplicate node ID found: '${node.id}'.`);
      }
      nodeIds.add(node.id);
    }

    const validTypes = ["HTTP_CALL", "DELAY", "DATA_TRANSFORM", "CONDITIONAL_BRANCH"];
    if (!node.type || !validTypes.includes(node.type)) {
      errors.push(`Node '${node.id || index}' has an invalid or missing type. Must be one of: ${validTypes.join(", ")}`);
      return;
    }

    if (!node.config || typeof node.config !== "object" || Array.isArray(node.config)) {
      errors.push(`Node '${node.id}' config must be an object.`);
      return;
    }

    // Validate config fields per type
    const config = node.config;
    if (node.type === "HTTP_CALL") {
      if (!config.url || typeof config.url !== "string" || config.url.trim() === "") {
        errors.push(`Node '${node.id}' (HTTP_CALL) requires a 'url' string.`);
      }
      if (!config.method || !["GET", "POST"].includes(config.method)) {
        errors.push(`Node '${node.id}' (HTTP_CALL) 'method' must be either 'GET' or 'POST'.`);
      }
    } else if (node.type === "DELAY") {
      const seconds = config.seconds;
      if (seconds === undefined || typeof seconds !== "number" || isNaN(seconds) || seconds < 1 || seconds > 86400) {
        errors.push(`Node '${node.id}' (DELAY) 'seconds' must be a number between 1 and 86400.`);
      }
    } else if (node.type === "CONDITIONAL_BRANCH") {
      const { operator, left, right } = config;
      const validOperators = ["EQUALS", "NOT_EQUALS", "GREATER_THAN", "CONTAINS"];
      if (!operator || !validOperators.includes(operator)) {
        errors.push(`Node '${node.id}' (CONDITIONAL_BRANCH) 'operator' must be one of: ${validOperators.join(", ")}.`);
      }
      if (left === undefined || left === null || String(left).trim() === "") {
        errors.push(`Node '${node.id}' (CONDITIONAL_BRANCH) 'left' operand is required.`);
      }
      if (right === undefined || right === null || String(right).trim() === "") {
        errors.push(`Node '${node.id}' (CONDITIONAL_BRANCH) 'right' operand is required.`);
      }
    } else if (node.type === "DATA_TRANSFORM") {
      if (!config.mode || !["simple", "advanced"].includes(config.mode)) {
        errors.push(`Node '${node.id}' (DATA_TRANSFORM) 'mode' must be 'simple' or 'advanced'.`);
      } else {
        if (config.mode === "simple") {
          if (!config.operation || typeof config.operation !== "string") {
            errors.push(`Node '${node.id}' (DATA_TRANSFORM) simple mode requires an 'operation' string.`);
          }
          if (!Array.isArray(config.inputs)) {
            errors.push(`Node '${node.id}' (DATA_TRANSFORM) simple mode requires an 'inputs' array.`);
          }
        } else if (config.mode === "advanced") {
          if (!config.expression || typeof config.expression !== "string" || config.expression.trim() === "") {
            errors.push(`Node '${node.id}' (DATA_TRANSFORM) advanced mode requires an 'expression' string.`);
          }
        }
      }
    }
  });

  // 3. Validate Edges
  edgesList.forEach((edge, index) => {
    if (!edge || typeof edge !== "object" || Array.isArray(edge)) {
      errors.push(`Edge at index ${index} must be an object.`);
      return;
    }

    if (!edge.from || typeof edge.from !== "string") {
      errors.push(`Edge at index ${index} is missing 'from' property.`);
    } else if (!nodeIds.has(edge.from)) {
      errors.push(`Edge at index ${index} references non-existent source node: '${edge.from}'.`);
    }

    if (!edge.to || typeof edge.to !== "string") {
      errors.push(`Edge at index ${index} is missing 'to' property.`);
    } else if (!nodeIds.has(edge.to)) {
      errors.push(`Edge at index ${index} references non-existent target node: '${edge.to}'.`);
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 4. Validate CONDITIONAL_BRANCH and outgoing edge limits
  const outgoingEdgesMap = new Map<string, DbEdge[]>();
  nodeIds.forEach(id => outgoingEdgesMap.set(id, []));
  edgesList.forEach(edge => outgoingEdgesMap.get(edge.from)?.push(edge));

  nodesList.forEach(node => {
    const outgoing = outgoingEdgesMap.get(node.id) || [];
    if (node.type === "CONDITIONAL_BRANCH") {
      const hasTrue = outgoing.some(e => e.sourceHandle === "true");
      const hasFalse = outgoing.some(e => e.sourceHandle === "false");
      if (outgoing.length !== 2 || !hasTrue || !hasFalse) {
        errors.push(`Conditional branch node '${node.id}' must have exactly 2 outgoing edges labeled 'true' and 'false'.`);
      }
    } else {
      if (outgoing.length > 1) {
        errors.push(`Non-conditional node '${node.id}' can have at most 1 outgoing edge.`);
      }
    }
  });

  // 5. Cycle detection
  if (hasCycle(nodesList, edgesList)) {
    errors.push("Workflow cannot contain cycles (must be a Directed Acyclic Graph).");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function hasCycle(nodes: WorkflowNode[], edges: DbEdge[]): boolean {
  const graph = new Map<string, string[]>();
  nodes.forEach(n => graph.set(n.id, []));
  edges.forEach(e => graph.get(e.from)?.push(e.to));

  const visited = new Set<string>();
  const inStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    inStack.add(nodeId);

    for (const neighbor of graph.get(nodeId) || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (inStack.has(neighbor)) {
        return true; // cycle found
      }
    }

    inStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}