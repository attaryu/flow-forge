import type { WorkflowNode, DbEdge } from "../types";

export interface NodePosition {
  id: string;
  x: number;
  y: number;
}

export function calculateLayout(nodes: WorkflowNode[], edges: DbEdge[]): NodePosition[] {
  if (nodes.length === 0) return [];

  // Build adjacency maps
  const outgoingMap = new Map<string, string[]>();
  const incomingMap = new Map<string, string[]>();

  nodes.forEach((node) => {
    outgoingMap.set(node.id, []);
    incomingMap.set(node.id, []);
  });

  edges.forEach((edge) => {
    if (outgoingMap.has(edge.from) && incomingMap.has(edge.to)) {
      outgoingMap.get(edge.from)!.push(edge.to);
      incomingMap.get(edge.to)!.push(edge.from);
    }
  });

  // 1. Identify roots (nodes with no incoming edges)
  const roots = nodes.filter((node) => (incomingMap.get(node.id) || []).length === 0);

  // If no root node found (e.g. all nodes are part of cycles, though validation should catch this)
  // use the first node as root.
  const startNodes = roots.length > 0 ? roots : [nodes[0]];

  // 2. Assign depth/column using BFS
  const depthMap = new Map<string, number>();
  const visited = new Set<string>();
  const queue: string[] = [];

  startNodes.forEach((node) => {
    depthMap.set(node.id, 0);
    visited.add(node.id);
    queue.push(node.id);
  });

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentDepth = depthMap.get(currentId) || 0;

    const neighbors = outgoingMap.get(currentId) || [];
    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        // Depth is max of current path or previous path
        depthMap.set(neighbor, Math.max(depthMap.get(neighbor) || 0, currentDepth + 1));
        queue.push(neighbor);
      } else {
        // If already visited, update depth if we found a longer path
        const existingDepth = depthMap.get(neighbor) || 0;
        if (currentDepth + 1 > existingDepth) {
          depthMap.set(neighbor, currentDepth + 1);
        }
      }
    });
  }

  // Assign any nodes not reachable from roots (unconnected nodes) to depth 0
  nodes.forEach((node) => {
    if (!depthMap.has(node.id)) {
      depthMap.set(node.id, 0);
    }
  });

  // Group nodes by depth/column
  const columnMap = new Map<number, string[]>();
  nodes.forEach((node) => {
    const col = depthMap.get(node.id) || 0;
    if (!columnMap.has(col)) {
      columnMap.set(col, []);
    }
    columnMap.get(col)!.push(node.id);
  });

  // Layout parameters
  const colWidth = 240;  // Horizontal distance between columns
  const rowHeight = 120; // Vertical distance between nodes in a column
  const startX = 60;     // Initial offset
  const startY = 60;     // Initial offset

  // Find max nodes in any single column to help center columns vertically
  let maxColumnSize = 0;
  columnMap.forEach((ids) => {
    if (ids.length > maxColumnSize) {
      maxColumnSize = ids.length;
    }
  });

  const positions: NodePosition[] = [];

  // Calculate coordinates
  columnMap.forEach((ids, col) => {
    const colSize = ids.length;
    // Offset vertically to center this column relative to the largest column
    const colOffset = ((maxColumnSize - colSize) * rowHeight) / 2;

    ids.forEach((id, row) => {
      positions.push({
        id,
        x: startX + col * colWidth,
        y: startY + row * rowHeight + colOffset,
      });
    });
  });

  return positions;
}