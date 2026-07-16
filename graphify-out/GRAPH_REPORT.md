# Graph Report - .  (2026-07-16)

## Corpus Check
- Corpus is ~14,383 words - fits in a single context window. You may not need a graph.

## Summary
- 289 nodes · 237 edges · 58 communities (17 shown, 41 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- ESLint & Dev Tooling
- Web TypeScript Config
- Worker TypeScript Config
- React Router Web Deps
- NestJS API Deps
- Web Dev Tooling
- Jest Testing Config
- API NPM Scripts
- Package Metadata
- API Build Config
- Worker Build Config
- Infrastructure Architecture
- Workflow Engine
- API Nest CLI Config
- Worker Nest CLI Config
- OpenCode Config
- React Router Client
- Data Mode Routing
- Declarative Mode Routing
- Framework Mode Routing
- RSC Mode Routing
- Multi-Tenancy
- Workflows Table
- Auth DTOs
- RouterProvider
- Route Component
- Routes Component
- Vite Plugin
- Graphify
- DAG Validation
- Non-Blocking Delay
- Users Table
- PNPM Workspace
- API AppModule
- AuthModule
- AuthController
- LoginInputDto
- RegisterInputDto
- JwtAuthGuard
- AuthRepository
- UserSessionWithUser
- OnboardingRepository
- AuthService
- OnboardingService
- JwtStrategy
- DurationUtils
- PrismaModule
- PrismaService
- Web App Root
- ErrorBoundary
- Layout
- Home Route
- Meta Component
- Dark Logo
- Light Logo
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

## Communities (58 total, 41 thin omitted)

### Community 0 - "ESLint & Dev Tooling"
Cohesion: 0.04
Nodes (47): eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest, @nestjs/cli (+39 more)

### Community 1 - "Web TypeScript Config"
Cohesion: 0.08
Nodes (25): **/*, **/.client/**/*, DOM, DOM.Iterable, ES2022, .react-router/types/**/*, **/.server/**/*, vite/client (+17 more)

### Community 2 - "Worker TypeScript Config"
Cohesion: 0.08
Nodes (24): jest, compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+16 more)

### Community 3 - "React Router Web Deps"
Cohesion: 0.09
Nodes (21): isbot, react, react-dom, react-router, @react-router/node, @react-router/serve, dependencies, isbot (+13 more)

### Community 4 - "NestJS API Deps"
Cohesion: 0.11
Nodes (17): @nestjs/common, @nestjs/core, @nestjs/platform-express, reflect-metadata, rxjs, author, dependencies, @nestjs/common (+9 more)

### Community 5 - "Web Dev Tooling"
Cohesion: 0.12
Nodes (17): @react-router/dev, devDependencies, @react-router/dev, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom (+9 more)

### Community 6 - "Jest Testing Config"
Cohesion: 0.15
Nodes (13): js, json, **/*.(t|j)s, ts, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions (+5 more)

### Community 7 - "API NPM Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 8 - "Package Metadata"
Cohesion: 0.18
Nodes (10): author, description, keywords, license, main, name, packageManager, scripts (+2 more)

### Community 9 - "API Build Config"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 10 - "Worker Build Config"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 11 - "Infrastructure Architecture"
Cohesion: 0.29
Nodes (7): PostgreSQL Service, Redis Service, Real-Time SSE Updates, Separate Job Queues, State Persistence in Database, NestJS API Server, NestJS Worker Service

### Community 12 - "Workflow Engine"
Cohesion: 0.29
Nodes (7): Per-Node Execution Model, CONDITIONAL_BRANCH Node, DATA_TRANSFORM Node, DELAY Node, HTTP_CALL Node, step_logs Table, workflow_runs Table

### Community 13 - "API Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 14 - "Worker Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 15 - "OpenCode Config"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 16 - "React Router Client"
Cohesion: 0.67
Nodes (3): React Router Modes, React Flow Frontend Editor, React Router Web Client

## Knowledge Gaps
- **205 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `version`, `description` (+200 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `ESLint & Dev Tooling` to `NestJS API Deps`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `scripts` connect `API NPM Scripts` to `NestJS API Deps`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `jest` connect `Jest Testing Config` to `NestJS API Deps`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _205 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ESLint & Dev Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `Web TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.08307692307692308 - nodes in this community are weakly interconnected._
- **Should `Worker TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._