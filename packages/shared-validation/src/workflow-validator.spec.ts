import { describe, it, expect } from "vitest";
import { validateWorkflow } from "./workflow-validator";

function baseValidNode(overrides: Record<string, unknown> = {}) {
  return {
    id: "1",
    type: "HTTP_CALL",
    config: { url: "https://api.example.com", method: "GET" },
    ...overrides,
  };
}

function baseWorkflow(overrides: Record<string, unknown> = {}) {
  return {
    name: "Test Workflow",
    description: "A test workflow",
    definition: {
      nodes: [baseValidNode()],
      edges: [],
    },
    ...overrides,
  };
}

describe("validateWorkflow - top-level structure", () => {
  it("rejects null/undefined input", () => {
    expect(validateWorkflow(null).valid).toBe(false);
    expect(validateWorkflow(undefined).valid).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(validateWorkflow("string").valid).toBe(false);
    expect(validateWorkflow(42).valid).toBe(false);
    expect(validateWorkflow([]).valid).toBe(false);
  });

  it("rejects missing name", () => {
    const { name, ...rest } = baseWorkflow();
    const result = validateWorkflow(rest);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/name/);
  });

  it("rejects empty name", () => {
    const result = validateWorkflow(baseWorkflow({ name: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/name/);
  });

  it("rejects non-string description", () => {
    const result = validateWorkflow(baseWorkflow({ description: 123 }));
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/description/);
  });

  it("accepts missing description", () => {
    const { description, ...rest } = baseWorkflow();
    const result = validateWorkflow(rest);
    expect(result.valid).toBe(true);
  });

  it("rejects missing definition", () => {
    const { definition, ...rest } = baseWorkflow();
    const result = validateWorkflow(rest);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/definition/);
  });

  it("rejects non-array nodes", () => {
    const result = validateWorkflow(
      baseWorkflow({ definition: { nodes: "not-array", edges: [] } })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/nodes/);
  });

  it("rejects non-array edges", () => {
    const result = validateWorkflow(
      baseWorkflow({ definition: { nodes: [baseValidNode()], edges: "not-array" } })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/edges/);
  });
});

describe("validateWorkflow - nodes", () => {
  it("rejects node missing id", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [{ type: "HTTP_CALL", config: { url: "https://x.com", method: "GET" } }],
          edges: [],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/id/);
  });

  it("rejects duplicate node ids", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            baseValidNode({ id: "dup" }),
            baseValidNode({ id: "dup" }),
          ],
          edges: [],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/duplicate/i);
  });

  it("rejects invalid node type", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [{ id: "1", type: "INVALID", config: {} }],
          edges: [],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/invalid.*type/i);
  });

  it("rejects node with non-object config", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [{ id: "1", type: "HTTP_CALL", config: "string" }],
          edges: [],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/config/);
  });

  describe("HTTP_CALL config", () => {
    it("requires url string", () => {
      const result = validateWorkflow(
        baseWorkflow({
          definition: {
            nodes: [{ id: "1", type: "HTTP_CALL", config: { method: "GET" } }],
            edges: [],
          },
        })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.join(" ")).toMatch(/url/);
    });

    it("requires method GET or POST", () => {
      const result = validateWorkflow(
        baseWorkflow({
          definition: {
            nodes: [
              { id: "1", type: "HTTP_CALL", config: { url: "https://x.com", method: "DELETE" } },
            ],
            edges: [],
          },
        })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.join(" ")).toMatch(/method/);
    });
  });

  describe("DELAY config", () => {
    it("requires seconds between 1 and 86400", () => {
      const result = validateWorkflow(
        baseWorkflow({
          definition: {
            nodes: [{ id: "1", type: "DELAY", config: { seconds: 0 } }],
            edges: [],
          },
        })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.join(" ")).toMatch(/seconds/);
    });

    it("rejects negative seconds", () => {
      const result = validateWorkflow(
        baseWorkflow({
          definition: {
            nodes: [{ id: "1", type: "DELAY", config: { seconds: -5 } }],
            edges: [],
          },
        })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.join(" ")).toMatch(/seconds/);
    });

    it("accepts valid seconds", () => {
      const result = validateWorkflow(
        baseWorkflow({
          definition: {
            nodes: [{ id: "1", type: "DELAY", config: { seconds: 30 } }],
            edges: [],
          },
        })
      );
      expect(result.valid).toBe(true);
    });
  });

  describe("DATA_TRANSFORM config", () => {
    it("requires mode simple or advanced", () => {
      const result = validateWorkflow(
        baseWorkflow({
          definition: {
            nodes: [{ id: "1", type: "DATA_TRANSFORM", config: {} }],
            edges: [],
          },
        })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.join(" ")).toMatch(/mode/);
    });

    it("simple mode requires operation and inputs", () => {
      const result = validateWorkflow(
        baseWorkflow({
          definition: {
            nodes: [
              { id: "1", type: "DATA_TRANSFORM", config: { mode: "simple" } },
            ],
            edges: [],
          },
        })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.join(" ")).toMatch(/operation/);
    });

    it("advanced mode requires expression", () => {
      const result = validateWorkflow(
        baseWorkflow({
          definition: {
            nodes: [
              { id: "1", type: "DATA_TRANSFORM", config: { mode: "advanced" } },
            ],
            edges: [],
          },
        })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.join(" ")).toMatch(/expression/);
    });
  });

  describe("CONDITIONAL_BRANCH config", () => {
    it("requires valid operator", () => {
      const result = validateWorkflow(
        baseWorkflow({
          definition: {
            nodes: [
              {
                id: "1",
                type: "CONDITIONAL_BRANCH",
                config: { operator: "INVALID", left: "a", right: "b" },
              },
            ],
            edges: [],
          },
        })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.join(" ")).toMatch(/operator/);
    });

    it("requires left operand", () => {
      const result = validateWorkflow(
        baseWorkflow({
          definition: {
            nodes: [
              {
                id: "1",
                type: "CONDITIONAL_BRANCH",
                config: { operator: "EQUALS", right: "b" },
              },
            ],
            edges: [],
          },
        })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.join(" ")).toMatch(/left/);
    });

    it("requires right operand", () => {
      const result = validateWorkflow(
        baseWorkflow({
          definition: {
            nodes: [
              {
                id: "1",
                type: "CONDITIONAL_BRANCH",
                config: { operator: "EQUALS", left: "a" },
              },
            ],
            edges: [],
          },
        })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.join(" ")).toMatch(/right/);
    });
  });
});

describe("validateWorkflow - edges", () => {
  it("rejects edge referencing non-existent source", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [baseValidNode({ id: "1" })],
          edges: [{ from: "nonexistent", to: "1" }],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/non-existent.*source/i);
  });

  it("rejects edge referencing non-existent target", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [baseValidNode({ id: "1" })],
          edges: [{ from: "1", to: "nonexistent" }],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/non-existent.*target/i);
  });
});

describe("validateWorkflow - DAG cycle detection", () => {
  it("passes for single node with no edges", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [baseValidNode({ id: "1" })],
          edges: [],
        },
      })
    );
    expect(result.valid).toBe(true);
  });

  it("passes for linear path A -> B -> C", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            baseValidNode({ id: "a" }),
            baseValidNode({ id: "b" }),
            baseValidNode({ id: "c" }),
          ],
          edges: [
            { from: "a", to: "b" },
            { from: "b", to: "c" },
          ],
        },
      })
    );
    expect(result.valid).toBe(true);
  });

  it("rejects branching (fork) A -> B, A -> C (HTTP_CALL can only have 1 outgoing edge)", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            baseValidNode({ id: "a" }),
            baseValidNode({ id: "b" }),
            baseValidNode({ id: "c" }),
          ],
          edges: [
            { from: "a", to: "b" },
            { from: "a", to: "c" },
          ],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/at most 1 outgoing edge/i);
  });

  it("rejects diamond DAG A->B, A->C, B->D, C->D (branch node can only have 1 outgoing edge)", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            baseValidNode({ id: "a" }),
            baseValidNode({ id: "b" }),
            baseValidNode({ id: "c" }),
            baseValidNode({ id: "d" }),
          ],
          edges: [
            { from: "a", to: "b" },
            { from: "a", to: "c" },
            { from: "b", to: "d" },
            { from: "c", to: "d" },
          ],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/at most 1 outgoing edge/i);
  });

  it("passes for disconnected valid DAGs (A->B, C->D)", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            baseValidNode({ id: "a" }),
            baseValidNode({ id: "b" }),
            baseValidNode({ id: "c" }),
            baseValidNode({ id: "d" }),
          ],
          edges: [
            { from: "a", to: "b" },
            { from: "c", to: "d" },
          ],
        },
      })
    );
    expect(result.valid).toBe(true);
  });

  it("detects self-loop (A -> A)", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [baseValidNode({ id: "a" })],
          edges: [{ from: "a", to: "a" }],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/cycle/i);
  });

  it("detects simple 2-node cycle A -> B -> A", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            baseValidNode({ id: "a" }),
            baseValidNode({ id: "b" }),
          ],
          edges: [
            { from: "a", to: "b" },
            { from: "b", to: "a" },
          ],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/cycle/i);
  });

  it("detects multi-node indirect cycle A -> B -> C -> D -> B", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            baseValidNode({ id: "a" }),
            baseValidNode({ id: "b" }),
            baseValidNode({ id: "c" }),
            baseValidNode({ id: "d" }),
          ],
          edges: [
            { from: "a", to: "b" },
            { from: "b", to: "c" },
            { from: "c", to: "d" },
            { from: "d", to: "b" },
          ],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/cycle/i);
  });

  it("detects cycle in disconnected subgraph", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            baseValidNode({ id: "a" }),
            baseValidNode({ id: "b" }),
            baseValidNode({ id: "c" }),
            baseValidNode({ id: "d" }),
          ],
          edges: [
            { from: "a", to: "b" },
            { from: "c", to: "d" },
            { from: "d", to: "c" },
          ],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/cycle/i);
  });

  it("passes for diamond DAG with CONDITIONAL_BRANCH as fork", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            baseValidNode({ id: "a" }),
            { id: "branch", type: "CONDITIONAL_BRANCH", config: { operator: "EQUALS", left: "x", right: "y" } },
            baseValidNode({ id: "b" }),
            baseValidNode({ id: "c" }),
            baseValidNode({ id: "d" }),
          ],
          edges: [
            { from: "a", to: "branch" },
            { from: "branch", to: "b", sourceHandle: "true" },
            { from: "branch", to: "c", sourceHandle: "false" },
            { from: "b", to: "d" },
            { from: "c", to: "d" },
          ],
        },
      })
    );
    expect(result.valid).toBe(true);
  });

  it("detects tail-to-head cycle A -> B -> C, C -> A", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            baseValidNode({ id: "a" }),
            baseValidNode({ id: "b" }),
            baseValidNode({ id: "c" }),
          ],
          edges: [
            { from: "a", to: "b" },
            { from: "b", to: "c" },
            { from: "c", to: "a" },
          ],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/cycle/i);
  });
});

describe("validateWorkflow - conditional branch edge rules", () => {
  it("requires CONDITIONAL_BRANCH to have exactly 2 outgoing edges (true/false)", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            { id: "cond", type: "CONDITIONAL_BRANCH", config: { operator: "EQUALS", left: "a", right: "b" } },
            baseValidNode({ id: "then" }),
            baseValidNode({ id: "else" }),
          ],
          edges: [
            { from: "cond", to: "then", sourceHandle: "true" },
            { from: "cond", to: "else", sourceHandle: "false" },
          ],
        },
      })
    );
    expect(result.valid).toBe(true);
  });

  it("rejects CONDITIONAL_BRANCH with only 1 outgoing edge", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            { id: "cond", type: "CONDITIONAL_BRANCH", config: { operator: "EQUALS", left: "a", right: "b" } },
            baseValidNode({ id: "then" }),
          ],
          edges: [
            { from: "cond", to: "then", sourceHandle: "true" },
          ],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/conditional.*branch/i);
  });

  it("rejects CONDITIONAL_BRANCH with both edges having same sourceHandle", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            { id: "cond", type: "CONDITIONAL_BRANCH", config: { operator: "EQUALS", left: "a", right: "b" } },
            baseValidNode({ id: "then" }),
            baseValidNode({ id: "else" }),
          ],
          edges: [
            { from: "cond", to: "then", sourceHandle: "true" },
            { from: "cond", to: "else", sourceHandle: "true" },
          ],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/conditional.*branch/i);
  });

  it("rejects non-conditional node with more than 1 outgoing edge", () => {
    const result = validateWorkflow(
      baseWorkflow({
        definition: {
          nodes: [
            baseValidNode({ id: "a" }),
            baseValidNode({ id: "b" }),
            baseValidNode({ id: "c" }),
          ],
          edges: [
            { from: "a", to: "b" },
            { from: "a", to: "c" },
          ],
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/at most 1 outgoing edge/i);
  });
});

describe("validateWorkflow - happy path", () => {
  it("passes a full valid DAG workflow", () => {
    const result = validateWorkflow({
      name: "My Workflow",
      description: "A complete valid workflow",
      definition: {
        nodes: [
          { id: "http1", type: "HTTP_CALL", config: { url: "https://api.example.com", method: "GET" } },
          { id: "transform", type: "DATA_TRANSFORM", config: { mode: "simple", operation: "uppercase", inputs: ["data"] } },
          { id: "delay1", type: "DELAY", config: { seconds: 5 } },
          { id: "branch", type: "CONDITIONAL_BRANCH", config: { operator: "EQUALS", left: "status", right: "ok" } },
          { id: "http2", type: "HTTP_CALL", config: { url: "https://api.example.com/ok", method: "POST", payload: "{}" } },
          { id: "http3", type: "HTTP_CALL", config: { url: "https://api.example.com/retry", method: "GET" } },
          { id: "delay2", type: "DELAY", config: { seconds: 60 } },
          { id: "end", type: "HTTP_CALL", config: { url: "https://api.example.com/done", method: "GET" } },
        ],
        edges: [
          { from: "http1", to: "transform" },
          { from: "transform", to: "delay1" },
          { from: "delay1", to: "branch" },
          { from: "branch", to: "http2", sourceHandle: "true" },
          { from: "branch", to: "http3", sourceHandle: "false" },
          { from: "http2", to: "end" },
          { from: "http3", to: "delay2" },
          { from: "delay2", to: "end" },
        ],
      },
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
