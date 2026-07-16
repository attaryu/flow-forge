# Graph Report - .  (2026-07-16)

## Corpus Check
- Corpus is ~32,897 words - fits in a single context window. You may not need a graph.

## Summary
- 707 nodes · 817 edges · 87 communities (37 shown, 50 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.86)
- Token cost: 42,162 input · 6,144 output

## Community Hubs (Navigation)
- Worker ESLint Config
- shadcn CLI & Registry
- Worker NestJS Dependencies
- React Router Dependencies
- shadcn Component API Differences
- API Auth Dependencies
- API Jest Config
- React Router Modes
- TypeScript DOM Types
- API TypeScript Config
- System Architecture
- Worker TypeScript Config
- Auth Validation & DTOs
- Auth Repository
- API Documentation
- Worker App Controller
- Auth Module Setup
- Auth Decorators & Responses
- Auth HTTP Handlers
- App Module Structure
- Worker Package Metadata
- Worker ESLint Dev Dependencies
- API Build Config
- Worker Build Config
- shadcn Component Composition Rules
- Flow Forge Branding Logos
- API Nest CLI Config
- Worker Nest CLI Config
- Database Seeding
- shadcn Icon Rules
- Graphify Plugin Config
- Onboarding Service
- Graphify Plugin Implementation
- Welcome Page
- Prisma Schema
- eslint-config-prettier
- ESLint JS Config
- eslint-plugin-prettier
- globals Package
- Jest Runner
- NestJS CLI Tool
- NestJS Schematics
- NestJS Testing
- Prettier Formatter
- source-map-support
- Supertest HTTP Testing
- ts-jest Transformer
- ts-loader
- ts-node Runtime
- tsconfig-paths
- bcryptjs Types
- cookie-parser Types
- Express Types
- Jest Types
- Node Types
- passport-jwt Types
- pg Types
- Supertest Types
- Mode Migration
- React Router Overview
- Sidebar User Component
- Dashboard clientLoader
- Dashboard clientAction
- Logout Placeholder
- Index clientLoader
- Settings clientLoader
- Home Page
- useMobile Hook
- App Root
- Login clientLoader
- Root Error Boundary
- Root Layout
- Register clientLoader
- Dashboard Layout
- Public Layout
- clearSession Utility
- getToken Utility
- getUser Utility
- setSession Utility
- User Type
- cn Utility

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
10. `shadcn Skill` - 12 edges

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
- **Critical Rules Group** — agents_skills_shadcon_styling_rules, agents_skills_shadcon_composition_rules, agents_skills_shadcon_forms_rules, agents_skills_shadcon_icon_rules, agents_skills_shadcon_chat_ui, agents_skills_shadcon_base_vs_radix [EXTRACTED 1.00]
- **CLI Commands Group** — agents_skills_shadcon_init_command, agents_skills_shadcon_apply_command, agents_skills_shadcon_add_command, agents_skills_shadcon_search_command, agents_skills_shadcon_view_command, agents_skills_shadcon_docs_command, agents_skills_shadcon_info_command, agents_skills_shadcon_build_command [EXTRACTED 1.00]
- **Base vs Radix API Differences** — agents_skills_shadcon_aschild_vs_render, agents_skills_shadcon_select_api_diffs, agents_skills_shadcon_togglegroup_api_diffs, agents_skills_shadcon_slider_api_diffs, agents_skills_shadcon_accordion_api_diffs [EXTRACTED 1.00]
- **React Router Modes** — _agents_skills_react_router_references_framework_mode_framework_mode, _agents_skills_react_router_references_data_mode_data_mode, _agents_skills_react_router_references_declarative_mode_declarative_mode [EXTRACTED 1.00]
- **RSC Variants** — _agents_skills_react_router_references_rsc_rsc_framework_mode, _agents_skills_react_router_references_rsc_rsc_data_mode, _agents_skills_react_router_references_rsc_client_server_boundary, _agents_skills_react_router_references_rsc_data_loading [EXTRACTED 1.00]
- **Route Module Exports** — _agents_skills_react_router_references_framework_mode_route_module, _agents_skills_react_router_references_framework_mode_loader, _agents_skills_react_router_references_framework_mode_action, _agents_skills_react_router_references_framework_mode_clientloader, _agents_skills_react_router_references_framework_mode_clientaction, _agents_skills_react_router_references_framework_mode_errorboundary, _agents_skills_react_router_references_framework_mode_hydratefallback, _agents_skills_react_router_references_framework_mode_middleware [EXTRACTED 1.00]
- **flowforge_system_architecture** — docs_architecture_decision_frontend, docs_architecture_decision_api_server, docs_architecture_decision_worker_service, docs_architecture_decision_data_layer [EXTRACTED 1.00]
- **core_design_principles** — docs_architecture_decision_multi_tenancy, docs_architecture_decision_per_node_execution, docs_architecture_decision_separate_queues, docs_architecture_decision_state_in_db, docs_architecture_decision_realtime_updates [EXTRACTED 1.00]
- **workflow_execution_pipeline** — docs_business_logic_workflow_lifecycle, docs_architecture_decision_bullmq, docs_architecture_decision_per_node_execution, docs_architecture_decision_realtime_updates, docs_database_schema_workflow_runs [INFERRED 0.85]

## Communities (87 total, 50 thin omitted)

### Community 0 - "Worker ESLint Config"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 1 - "shadcn CLI & Registry"
Cohesion: 0.05
Nodes (44): add Command, Registry Address Schemes, apply Command, build Command, Built Registry, shadcn CLI, Component Selection, Critical Rules (+36 more)

### Community 2 - "Worker NestJS Dependencies"
Cohesion: 0.05
Nodes (43): author, dependencies, @nestjs/common, @nestjs/core, @nestjs/platform-express, reflect-metadata, rxjs, description (+35 more)

### Community 3 - "React Router Dependencies"
Cohesion: 0.05
Nodes (38): isbot, react, react-dom, react-router, @react-router/dev, @react-router/node, @react-router/serve, dependencies (+30 more)

### Community 4 - "shadcn Component API Differences"
Cohesion: 0.05
Nodes (38): Accordion API Differences, asChild vs render Composition, Attachment Component, Base vs Radix API Differences, Bubble Component, Chat and Messaging UI, className for Layout Only, cn() Utility Rule (+30 more)

### Community 5 - "API Auth Dependencies"
Cohesion: 0.06
Nodes (35): bcryptjs, class-transformer, class-validator, cookie-parser, @nestjs/config, @nestjs/jwt, @nestjs/passport, passport (+27 more)

### Community 6 - "API Jest Config"
Cohesion: 0.06
Nodes (34): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+26 more)

### Community 7 - "React Router Modes"
Cohesion: 0.08
Nodes (29): Data Mode (Data Routers), Data Router, RouterProvider, Data Mode SSR, Declarative Mode (JSX), Declarative Router, Declarative Mode Boundary, Action (+21 more)

### Community 8 - "TypeScript DOM Types"
Cohesion: 0.08
Nodes (25): **/*, **/.client/**/*, DOM, DOM.Iterable, ES2022, .react-router/types/**/*, **/.server/**/*, vite/client (+17 more)

### Community 9 - "API TypeScript Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+17 more)

### Community 10 - "System Architecture"
Cohesion: 0.09
Nodes (25): graphify, PostgreSQL 15, Redis 8.8, NestJS API Server, BullMQ Queue + Worker, PostgreSQL + Redis Data Layer, FlowForge System Architecture, React + React Flow Frontend (+17 more)

### Community 11 - "Worker TypeScript Config"
Cohesion: 0.08
Nodes (24): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+16 more)

### Community 12 - "Auth Validation & DTOs"
Cohesion: 0.15
Nodes (14): IsOptional, MinLength, AuthResponseDto, LoginInputDto, IsEmail, IsNotEmpty, IsString, RegisterInputDto (+6 more)

### Community 13 - "Auth Repository"
Cohesion: 0.16
Nodes (6): AuthRepository, Injectable, AuthService, Injectable, DurationUtils, Injectable

### Community 14 - "API Documentation"
Cohesion: 0.22
Nodes (18): src/api/README.md, NestJS, Node.js, pnpm, TypeScript, src/web/README.md, Docker, Full-stack React Applications (+10 more)

### Community 15 - "Worker App Controller"
Cohesion: 0.21
Nodes (8): AppController, Controller, Get, AppModule, Module, AppService, Injectable, bootstrap()

### Community 16 - "Auth Module Setup"
Cohesion: 0.19
Nodes (5): UserSessionWithUser, OnboardingRepository, Injectable, PrismaProvider, Injectable

### Community 17 - "Auth Decorators & Responses"
Cohesion: 0.18
Nodes (7): Get, CurrentUser, UserResponseDto, JwtPayload, JwtStrategy, Injectable, UseGuards

### Community 18 - "Auth HTTP Handlers"
Cohesion: 0.33
Nodes (7): Body, HttpCode, Post, Req, Res, AuthController, Controller

### Community 19 - "App Module Structure"
Cohesion: 0.24
Nodes (8): Global, AppModule, Module, AuthModule, Module, bootstrap(), PrismaModule, Module

### Community 20 - "Worker Package Metadata"
Cohesion: 0.18
Nodes (10): author, description, keywords, license, main, name, packageManager, scripts (+2 more)

### Community 21 - "Worker ESLint Dev Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, @eslint/eslintrc, typescript, typescript-eslint, eslint, @eslint/eslintrc, typescript (+1 more)

### Community 22 - "API Build Config"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 23 - "Worker Build Config"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 24 - "shadcn Component Composition Rules"
Cohesion: 0.29
Nodes (7): AvatarFallback Rule, Button Loading Pattern, Card Composition, Component Composition Rules, Item Group Rule, Overlay Components, TabsStructure Rule

### Community 25 - "Flow Forge Branding Logos"
Cohesion: 0.57
Nodes (7): Dark theme logo variant with white text on dark background, Flow Forge branding logo, FLOW FORGE wordmark text in custom typeface, Light theme logo variant with dark text on light background, Pinwheel/flow icon made of four circles in infinite-loop pattern with red connecting paths, Flow Forge logo (dark theme), Flow Forge logo (light theme)

### Community 26 - "API Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 27 - "Worker Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 28 - "Database Seeding"
Cohesion: 0.40
Nodes (3): adapter, pool, prisma

### Community 29 - "shadcn Icon Rules"
Cohesion: 0.50
Nodes (4): data-icon Attribute Rule, Icon Object Passing, Icon Rules, Icon Sizing Rule

### Community 30 - "Graphify Plugin Config"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

## Knowledge Gaps
- **352 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `version`, `description` (+347 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Worker ESLint Dev Dependencies` to `API Jest Config`, `Prisma Schema`, `eslint-config-prettier`, `ESLint JS Config`, `eslint-plugin-prettier`, `globals Package`, `Jest Runner`, `NestJS CLI Tool`, `NestJS Schematics`, `NestJS Testing`, `Prettier Formatter`, `source-map-support`, `Supertest HTTP Testing`, `ts-jest Transformer`, `ts-loader`, `ts-node Runtime`, `tsconfig-paths`, `bcryptjs Types`, `cookie-parser Types`, `Express Types`, `Jest Types`, `Node Types`, `passport-jwt Types`, `pg Types`, `Supertest Types`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `dependencies` connect `API Auth Dependencies` to `API Jest Config`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Worker ESLint Config` to `Worker NestJS Dependencies`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _352 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Worker ESLint Config` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `shadcn CLI & Registry` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `Worker NestJS Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._