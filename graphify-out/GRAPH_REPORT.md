# Graph Report - C:/Users/mattar/Private/code/project/flow-forge  (2026-07-16)

## Corpus Check
- Corpus is ~11,549 words - fits in a single context window. You may not need a graph.

## Summary
- 432 nodes · 416 edges · 48 communities (30 shown, 18 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- ESLint Development Configurations
- ESLint Project Configurations
- TypeScript DOM Library Reference
- TypeScript NestJS Compiler Options
- TypeScript Web Compiler Options
- React Router Dependencies
- NestJS Common Dependencies
- NestJS Core Project Dependencies
- Tailwind & React Router Dev Dependencies
- NestJS App Controller & Spec
- NestJS App Module & Controller
- Jest Test Configurations (NestJS API)
- Web Package Build Scripts
- Jest Test Configurations (NestJS Worker)
- API Package Build Scripts
- Root Package Metadata
- TypeScript API Build Exclusions
- TypeScript Worker Build Exclusions
- FlowForge Infra & Data Services
- FlowForge Execution Node Types
- Nest CLI API Configurations
- Frontend Web Views
- Nest CLI Worker Configurations
- OpenCode Agent Configurations
- Frontend Architecture & Modes
- OpenCode Graphify Plugin
- React Router Data Routing
- React Router Declarative Routing
- React Router Framework Routing
- React Router RSC Routing
- Database Multi-Tenancy
- Workflow Database Models
- React Router Provider
- React Router Route component
- React Router Routes component
- React Router Vite Plugin
- Graphify Tooling
- Directed Acyclic Graph Validation
- BullMQ Execution Delay Handling
- Users Database Schema
- Dark Mode Assets
- Light Mode Assets

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `compilerOptions` - 22 edges
3. `compilerOptions` - 15 edges
4. `scripts` - 13 edges
5. `scripts` - 13 edges
6. `jest` - 8 edges
7. `jest` - 8 edges
8. `AppService` - 7 edges
9. `AppService` - 7 edges
10. `AppController` - 6 edges

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

## Communities (48 total, 18 thin omitted)

### Community 0 - "ESLint Development Configurations"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 1 - "ESLint Project Configurations"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 2 - "TypeScript DOM Library Reference"
Cohesion: 0.08
Nodes (25): **/*, **/.client/**/*, DOM, DOM.Iterable, ES2022, .react-router/types/**/*, **/.server/**/*, vite/client (+17 more)

### Community 3 - "TypeScript NestJS Compiler Options"
Cohesion: 0.08
Nodes (24): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+16 more)

### Community 4 - "TypeScript Web Compiler Options"
Cohesion: 0.08
Nodes (24): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+16 more)

### Community 5 - "React Router Dependencies"
Cohesion: 0.09
Nodes (21): isbot, react, react-dom, react-router, @react-router/node, @react-router/serve, dependencies, isbot (+13 more)

### Community 6 - "NestJS Common Dependencies"
Cohesion: 0.11
Nodes (17): author, dependencies, @nestjs/common, @nestjs/core, @nestjs/platform-express, reflect-metadata, rxjs, description (+9 more)

### Community 7 - "NestJS Core Project Dependencies"
Cohesion: 0.11
Nodes (17): author, dependencies, @nestjs/common, @nestjs/core, @nestjs/platform-express, reflect-metadata, rxjs, description (+9 more)

### Community 8 - "Tailwind & React Router Dev Dependencies"
Cohesion: 0.12
Nodes (17): @react-router/dev, devDependencies, @react-router/dev, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom (+9 more)

### Community 9 - "NestJS App Controller & Spec"
Cohesion: 0.20
Nodes (8): AppController, Controller, Get, AppModule, Module, AppService, Injectable, bootstrap()

### Community 10 - "NestJS App Module & Controller"
Cohesion: 0.20
Nodes (8): AppController, Controller, Get, AppModule, Module, AppService, Injectable, bootstrap()

### Community 11 - "Jest Test Configurations (NestJS API)"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+5 more)

### Community 12 - "Web Package Build Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 13 - "Jest Test Configurations (NestJS Worker)"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+5 more)

### Community 14 - "API Package Build Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 15 - "Root Package Metadata"
Cohesion: 0.18
Nodes (10): author, description, keywords, license, main, name, packageManager, scripts (+2 more)

### Community 16 - "TypeScript API Build Exclusions"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 17 - "TypeScript Worker Build Exclusions"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 18 - "FlowForge Infra & Data Services"
Cohesion: 0.29
Nodes (7): PostgreSQL Service, Redis Service, Real-Time SSE Updates, Separate Job Queues, State Persistence in Database, NestJS API Server, NestJS Worker Service

### Community 19 - "FlowForge Execution Node Types"
Cohesion: 0.29
Nodes (7): Per-Node Execution Model, CONDITIONAL_BRANCH Node, DATA_TRANSFORM Node, DELAY Node, HTTP_CALL Node, step_logs Table, workflow_runs Table

### Community 20 - "Nest CLI API Configurations"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 22 - "Nest CLI Worker Configurations"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 24 - "OpenCode Agent Configurations"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 25 - "Frontend Architecture & Modes"
Cohesion: 0.67
Nodes (3): React Router Modes, React Flow Frontend Editor, React Router Web Client

## Knowledge Gaps
- **257 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `version`, `description` (+252 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `ESLint Development Configurations` to `NestJS Common Dependencies`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `ESLint Project Configurations` to `NestJS Core Project Dependencies`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `scripts` connect `Web Package Build Scripts` to `NestJS Common Dependencies`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _257 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ESLint Development Configurations` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `ESLint Project Configurations` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `TypeScript DOM Library Reference` be split into smaller, more focused modules?**
  _Cohesion score 0.08307692307692308 - nodes in this community are weakly interconnected._