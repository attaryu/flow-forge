# Graph Report - .  (2026-07-16)

## Corpus Check
- Corpus is ~14,376 words - fits in a single context window. You may not need a graph.

## Summary
- 601 nodes · 733 edges · 60 communities (32 shown, 28 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.86)
- Token cost: 13,232 input · 5,795 output

## Community Hubs (Navigation)
- Auth Module DTOs & Validation
- ESLint & Dev Dependencies
- React Router Web Frontend
- NestJS Auth Dependencies
- Jest Root Config
- NestJS API Core
- React Router Modes
- Web TypeScript Config
- API TypeScript Config
- FlowForge System Architecture
- API TypeScript Config (src/api)
- NestJS App Modules
- Project Overview & READMEs
- AppController Hello World
- Auth Controller Endpoints
- Jest NestJS Config
- Package Metadata
- ESLint TypeScript Config
- API tsconfig.build
- Worker tsconfig.build
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 23 edges
2. `compilerOptions` - 22 edges
3. `AuthService` - 16 edges
4. `compilerOptions` - 15 edges
5. `scripts` - 13 edges
6. `scripts` - 13 edges
7. `AuthResponseDto` - 12 edges
8. `UserResponseDto` - 12 edges
9. `AuthRepository` - 12 edges
10. `AuthController` - 11 edges

## Surprising Connections (you probably didn't know these)
- `graphify` --conceptually_related_to--> `FlowForge System Architecture`  [INFERRED]
  AGENTS.md → docs/architecture-decision.md
- `PNPM Workspace` --conceptually_related_to--> `FlowForge System Architecture`  [INFERRED]
  pnpm-workspace.yaml → docs/architecture-decision.md
- `Framework Mode` --semantically_similar_to--> `Framework Mode (Full-Stack)`  [INFERRED] [semantically similar]
  .agents/skills/react-router/SKILL.md → .agents/skills/react-router/references/framework-mode.md
- `Data Mode` --semantically_similar_to--> `Data Mode (Data Routers)`  [INFERRED] [semantically similar]
  .agents/skills/react-router/SKILL.md → .agents/skills/react-router/references/data-mode.md
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  src/api/src/main.ts → src/api/src/app.module.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **React Router Modes** — _agents_skills_react_router_references_framework_mode_framework_mode, _agents_skills_react_router_references_data_mode_data_mode, _agents_skills_react_router_references_declarative_mode_declarative_mode [EXTRACTED 1.00]
- **RSC Variants** — _agents_skills_react_router_references_rsc_rsc_framework_mode, _agents_skills_react_router_references_rsc_rsc_data_mode, _agents_skills_react_router_references_rsc_client_server_boundary, _agents_skills_react_router_references_rsc_data_loading [EXTRACTED 1.00]
- **Route Module Exports** — _agents_skills_react_router_references_framework_mode_route_module, _agents_skills_react_router_references_framework_mode_loader, _agents_skills_react_router_references_framework_mode_action, _agents_skills_react_router_references_framework_mode_clientloader, _agents_skills_react_router_references_framework_mode_clientaction, _agents_skills_react_router_references_framework_mode_errorboundary, _agents_skills_react_router_references_framework_mode_hydratefallback, _agents_skills_react_router_references_framework_mode_middleware [EXTRACTED 1.00]
- **flowforge_system_architecture** — docs_architecture_decision_frontend, docs_architecture_decision_api_server, docs_architecture_decision_worker_service, docs_architecture_decision_data_layer [EXTRACTED 1.00]
- **core_design_principles** — docs_architecture_decision_multi_tenancy, docs_architecture_decision_per_node_execution, docs_architecture_decision_separate_queues, docs_architecture_decision_state_in_db, docs_architecture_decision_realtime_updates [EXTRACTED 1.00]
- **workflow_execution_pipeline** — docs_business_logic_workflow_lifecycle, docs_architecture_decision_bullmq, docs_architecture_decision_per_node_execution, docs_architecture_decision_realtime_updates, docs_database_schema_workflow_runs [INFERRED 0.85]

## Communities (60 total, 28 thin omitted)

### Community 0 - "Auth Module DTOs & Validation"
Cohesion: 0.07
Nodes (30): IsOptional, MinLength, CurrentUser, AuthResponseDto, LoginInputDto, IsEmail, IsNotEmpty, IsString (+22 more)

### Community 1 - "ESLint & Dev Dependencies"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 2 - "React Router Web Frontend"
Cohesion: 0.05
Nodes (38): isbot, react, react-dom, react-router, @react-router/dev, @react-router/node, @react-router/serve, dependencies (+30 more)

### Community 3 - "NestJS Auth Dependencies"
Cohesion: 0.06
Nodes (35): bcryptjs, class-transformer, class-validator, cookie-parser, @nestjs/config, @nestjs/jwt, @nestjs/passport, passport (+27 more)

### Community 4 - "Jest Root Config"
Cohesion: 0.06
Nodes (34): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+26 more)

### Community 5 - "NestJS API Core"
Cohesion: 0.06
Nodes (30): author, dependencies, @nestjs/common, @nestjs/core, @nestjs/platform-express, reflect-metadata, rxjs, description (+22 more)

### Community 6 - "React Router Modes"
Cohesion: 0.08
Nodes (29): Data Mode (Data Routers), Data Router, RouterProvider, Data Mode SSR, Declarative Mode (JSX), Declarative Router, Declarative Mode Boundary, Action (+21 more)

### Community 7 - "Web TypeScript Config"
Cohesion: 0.08
Nodes (25): **/*, **/.client/**/*, DOM, DOM.Iterable, ES2022, .react-router/types/**/*, **/.server/**/*, vite/client (+17 more)

### Community 8 - "API TypeScript Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+17 more)

### Community 9 - "FlowForge System Architecture"
Cohesion: 0.09
Nodes (25): graphify, PostgreSQL 15, Redis 8.8, NestJS API Server, BullMQ Queue + Worker, PostgreSQL + Redis Data Layer, FlowForge System Architecture, React + React Flow Frontend (+17 more)

### Community 10 - "API TypeScript Config (src/api)"
Cohesion: 0.08
Nodes (24): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+16 more)

### Community 11 - "NestJS App Modules"
Cohesion: 0.13
Nodes (10): Global, AppModule, Module, AuthModule, Module, bootstrap(), PrismaModule, Module (+2 more)

### Community 12 - "Project Overview & READMEs"
Cohesion: 0.22
Nodes (18): src/api/README.md, NestJS, Node.js, pnpm, TypeScript, src/web/README.md, Docker, Full-stack React Applications (+10 more)

### Community 13 - "AppController Hello World"
Cohesion: 0.21
Nodes (8): AppController, Controller, Get, AppModule, Module, AppService, Injectable, bootstrap()

### Community 14 - "Auth Controller Endpoints"
Cohesion: 0.24
Nodes (9): Body, HttpCode, Post, Req, Res, AuthController, Controller, Get (+1 more)

### Community 15 - "Jest NestJS Config"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+5 more)

### Community 16 - "Package Metadata"
Cohesion: 0.18
Nodes (10): author, description, keywords, license, main, name, packageManager, scripts (+2 more)

### Community 17 - "ESLint TypeScript Config"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, @eslint/eslintrc, typescript, typescript-eslint, eslint, @eslint/eslintrc, typescript (+1 more)

### Community 18 - "API tsconfig.build"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 19 - "Worker tsconfig.build"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 20 - "Community 20"
Cohesion: 0.57
Nodes (7): Dark theme logo variant with white text on dark background, Flow Forge branding logo, FLOW FORGE wordmark text in custom typeface, Light theme logo variant with dark text on light background, Pinwheel/flow icon made of four circles in infinite-loop pattern with red connecting paths, Flow Forge logo (dark theme), Flow Forge logo (light theme)

### Community 21 - "Community 21"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 24 - "Community 24"
Cohesion: 0.40
Nodes (3): adapter, pool, prisma

### Community 26 - "Community 26"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

## Knowledge Gaps
- **266 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `version`, `description` (+261 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `ESLint TypeScript Config` to `Jest Root Config`, `Community 28`, `Community 29`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`, `Community 37`, `Community 38`, `Community 39`, `Community 40`, `Community 41`, `Community 42`, `Community 43`, `Community 44`, `Community 45`, `Community 46`, `Community 47`, `Community 48`, `Community 49`, `Community 50`, `Community 51`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NestJS Auth Dependencies` to `Jest Root Config`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `ESLint & Dev Dependencies` to `NestJS API Core`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _266 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth Module DTOs & Validation` be split into smaller, more focused modules?**
  _Cohesion score 0.06526806526806526 - nodes in this community are weakly interconnected._
- **Should `ESLint & Dev Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `React Router Web Frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._