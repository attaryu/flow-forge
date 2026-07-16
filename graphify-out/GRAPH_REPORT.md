# Graph Report - .  (2026-07-16)

## Corpus Check
- Corpus is ~12,443 words - fits in a single context window. You may not need a graph.

## Summary
- 277 nodes · 236 edges · 47 communities (17 shown, 30 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- ESLint Configuration
- Web TypeScript Configuration
- Worker TypeScript Configuration
- Web Package Dependencies
- Worker Package Dependencies
- Web Dev Dependencies
- Worker Jest Configuration
- Worker Scripts
- Root Package Configuration
- API Build Configuration
- Worker Build Configuration
- Architecture & Infrastructure
- Business Logic & Data
- API Nest CLI Configuration
- Worker Nest CLI Configuration
- OpenCode Plugin
- React Router Modes
- Data Mode Router
- Declarative Mode Router
- Framework Mode Routes
- RSC Mode
- Multi-tenancy
- Workflow Engine
- Router Provider
- Declarative Route
- Declarative Routes Collection
- Framework Vite Plugin
- Graphify Agent
- DAG Validation
- Non-blocking Delay
- Users Table
- pnpm Workspace
- API AppController
- API AppModule
- API AppService
- API PrismaModule
- API PrismaService
- Web App Root
- Web Error Boundary
- Web Layout
- Home Route
- Home Meta
- React Router Logo Dark
- React Router Logo Light
- Worker AppController
- Worker AppModule
- Worker AppService

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `compilerOptions` - 15 edges
3. `scripts` - 13 edges
4. `jest` - 8 edges
5. `exclude` - 5 edges
6. `scripts` - 5 edges
7. `include` - 5 edges
8. `exclude` - 5 edges
9. `step_logs Table` - 5 edges
10. `lib` - 4 edges

## Surprising Connections (you probably didn't know these)
- `React Router Web Client` --conceptually_related_to--> `React Router Modes`  [INFERRED]
  src/web/README.md → .agents/skills/react-router/SKILL.md
- `State Persistence in Database` --conceptually_related_to--> `PostgreSQL Service`  [INFERRED]
  docs/architecture-decision.md → compose.yml
- `NestJS API Server` --conceptually_related_to--> `PostgreSQL Service`  [INFERRED]
  src/api/README.md → compose.yml
- `Real-Time SSE Updates` --conceptually_related_to--> `Redis Service`  [INFERRED]
  docs/architecture-decision.md → compose.yml
- `Separate Job Queues` --conceptually_related_to--> `Redis Service`  [INFERRED]
  docs/architecture-decision.md → compose.yml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **React Router Routing Modes** — _agents_skills_react_router_skill_framework_mode, _agents_skills_react_router_skill_data_mode, _agents_skills_react_router_skill_declarative_mode, _agents_skills_react_router_skill_rsc_mode [EXTRACTED 1.00]
- **FlowForge Execution Architecture** — src_api_readme_nestjs_api_server, src_worker_readme_nestjs_worker_service, compose_redis, compose_postgres [INFERRED 0.95]
- **FlowForge Workflow Node Types** — docs_business_logic_http_call_node, docs_business_logic_delay_node, docs_business_logic_data_transform_node, docs_business_logic_conditional_branch_node [EXTRACTED 1.00]

## Communities (47 total, 30 thin omitted)

### Community 0 - "ESLint Configuration"
Cohesion: 0.04
Nodes (47): eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest, @nestjs/cli (+39 more)

### Community 1 - "Web TypeScript Configuration"
Cohesion: 0.08
Nodes (25): **/*, **/.client/**/*, DOM, DOM.Iterable, ES2022, .react-router/types/**/*, **/.server/**/*, vite/client (+17 more)

### Community 2 - "Worker TypeScript Configuration"
Cohesion: 0.08
Nodes (24): jest, compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+16 more)

### Community 3 - "Web Package Dependencies"
Cohesion: 0.09
Nodes (21): isbot, react, react-dom, react-router, @react-router/node, @react-router/serve, dependencies, isbot (+13 more)

### Community 4 - "Worker Package Dependencies"
Cohesion: 0.11
Nodes (17): @nestjs/common, @nestjs/core, @nestjs/platform-express, reflect-metadata, rxjs, author, dependencies, @nestjs/common (+9 more)

### Community 5 - "Web Dev Dependencies"
Cohesion: 0.12
Nodes (17): @react-router/dev, devDependencies, @react-router/dev, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom (+9 more)

### Community 6 - "Worker Jest Configuration"
Cohesion: 0.15
Nodes (13): js, json, **/*.(t|j)s, ts, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions (+5 more)

### Community 7 - "Worker Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 8 - "Root Package Configuration"
Cohesion: 0.18
Nodes (10): author, description, keywords, license, main, name, packageManager, scripts (+2 more)

### Community 9 - "API Build Configuration"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 10 - "Worker Build Configuration"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 11 - "Architecture & Infrastructure"
Cohesion: 0.29
Nodes (7): PostgreSQL Service, Redis Service, Real-Time SSE Updates, Separate Job Queues, State Persistence in Database, NestJS API Server, NestJS Worker Service

### Community 12 - "Business Logic & Data"
Cohesion: 0.29
Nodes (7): Per-Node Execution Model, CONDITIONAL_BRANCH Node, DATA_TRANSFORM Node, DELAY Node, HTTP_CALL Node, step_logs Table, workflow_runs Table

### Community 13 - "API Nest CLI Configuration"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 14 - "Worker Nest CLI Configuration"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 15 - "OpenCode Plugin"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 16 - "React Router Modes"
Cohesion: 0.67
Nodes (3): React Router Modes, React Flow Frontend Editor, React Router Web Client

## Knowledge Gaps
- **193 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `version`, `description` (+188 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `ESLint Configuration` to `Worker Package Dependencies`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `scripts` connect `Worker Scripts` to `Worker Package Dependencies`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `jest` connect `Worker Jest Configuration` to `Worker Package Dependencies`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _193 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ESLint Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `Web TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.08307692307692308 - nodes in this community are weakly interconnected._
- **Should `Worker TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._