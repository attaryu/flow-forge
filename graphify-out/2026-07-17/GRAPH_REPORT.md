# Graph Report - flow-forge  (2026-07-17)

## Corpus Check
- 143 files · ~41,010 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1328 nodes · 1971 edges · 121 communities (83 shown, 38 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `94154697`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- shadcn CLI
- scripts
- devDependencies
- Chat and Messaging UI
- dependencies
- scripts
- Route Module
- compilerOptions
- compilerOptions
- FlowForge System Architecture
- compilerOptions
- auth.controller.ts
- AuthService
- README.md
- app.module.ts
- PrismaProvider
- workflows.controller.ts
- AuthController
- auth.module.ts
- package.json
- devDependencies
- exclude
- exclude
- Component Composition Rules
- Flow Forge branding logo
- nest-cli.json
- nest-cli.json
- seed.ts
- Icon Rules
- opencode.json
- OnboardingRepository
- graphify.js
- welcome.tsx
- prisma
- eslint-config-prettier
- @eslint/js
- eslint-plugin-prettier
- globals
- jest
- @nestjs/cli
- @nestjs/schematics
- @nestjs/testing
- prettier
- source-map-support
- ts-jest
- ts-loader
- ts-node
- tsconfig-paths
- @types/bcryptjs
- @types/cookie-parser
- @types/express
- @types/jest
- @types/node
- @types/passport-jwt
- @types/pg
- @types/supertest
- Mode Migration
- dependencies
- eslint.config.mjs
- prisma.config.ts
- cn
- settings.tsx
- components.json
- Tools
- Core Decisions
- Business Logic
- Registry Authoring and Addresses
- React Server Components (RSC)
- Tables
- Framework Mode
- Component Composition
- routes.ts
- Data Mode (Data Routers)
- Data Mode
- public-layout.tsx
- shadcn Skill
- SKILL.md
- Commands
- Base vs Radix
- Chat & Messaging
- react-router.config.ts
- vite.config.ts
- eslint.config.mjs
- Styling Rules
- Declarative Mode
- Customization & Theming
- Forms & Inputs
- Critical Rules
- Theming and Customization
- Forms and Inputs Rules
- Base vs Radix API Differences
- RegisterInputDto
- React Router
- `add` — Add components
- shadcn CLI Reference
- Customizing Components
- Icons
- collapsible.tsx
- Framework Mode (Full-Stack)
- graphify-update.py
- app-sidebar.tsx
- node-config-panel.tsx
- organizations.controller.ts
- settings.tsx
- package.json
- JwtStrategy
- class-variance-authority
- lucide-react
- react-dom
- react-router

## God Nodes (most connected - your core abstractions)
1. `cn()` - 103 edges
2. `compilerOptions` - 23 edges
3. `compilerOptions` - 22 edges
4. `PrismaProvider` - 17 edges
5. `UserResponseDto` - 16 edges
6. `AuthService` - 16 edges
7. `compilerOptions` - 15 edges
8. `scripts` - 13 edges
9. `scripts` - 13 edges
10. `Framework Mode` - 13 edges

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
- **RSC Variants** — _agents_skills_react_router_references_rsc_rsc_framework_mode, _agents_skills_react_router_references_rsc_rsc_data_mode, _agents_skills_react_router_references_rsc_client_server_boundary, _agents_skills_react_router_references_rsc_data_loading [EXTRACTED 1.00]
- **Route Module Exports** — _agents_skills_react_router_references_framework_mode_route_module, _agents_skills_react_router_references_framework_mode_loader, _agents_skills_react_router_references_framework_mode_action, _agents_skills_react_router_references_framework_mode_clientloader, _agents_skills_react_router_references_framework_mode_clientaction, _agents_skills_react_router_references_framework_mode_errorboundary, _agents_skills_react_router_references_framework_mode_hydratefallback, _agents_skills_react_router_references_framework_mode_middleware [EXTRACTED 1.00]
- **flowforge_system_architecture** — docs_architecture_decision_frontend, docs_architecture_decision_api_server, docs_architecture_decision_worker_service, docs_architecture_decision_data_layer [EXTRACTED 1.00]
- **core_design_principles** — docs_architecture_decision_multi_tenancy, docs_architecture_decision_per_node_execution, docs_architecture_decision_separate_queues, docs_architecture_decision_state_in_db, docs_architecture_decision_realtime_updates [EXTRACTED 1.00]
- **workflow_execution_pipeline** — docs_business_logic_workflow_lifecycle, docs_architecture_decision_bullmq, docs_architecture_decision_per_node_execution, docs_architecture_decision_realtime_updates, docs_database_schema_workflow_runs [INFERRED 0.85]

## Communities (121 total, 38 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.07
Nodes (29): Delete, Param, Patch, Body, Controller, Get, HttpCode, Post (+21 more)

### Community 1 - "shadcn CLI"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 2 - "scripts"
Cohesion: 0.06
Nodes (43): Compile and run the project, Deployment, Description, License, NestJS, Node.js, pnpm, Project setup (+35 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (43): author, dependencies, @nestjs/common, @nestjs/core, @nestjs/platform-express, reflect-metadata, rxjs, description (+35 more)

### Community 4 - "Chat and Messaging UI"
Cohesion: 0.09
Nodes (39): react, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+31 more)

### Community 5 - "dependencies"
Cohesion: 0.15
Nodes (13): Built-in variants first, className for layout only, Contents, No manual dark: color overrides, No manual z-index on overlay components, No raw color values for status/state indicators, No space-x-* / space-y-*, Prefer size-* over w-* h-* when equal (+5 more)

### Community 6 - "scripts"
Cohesion: 0.13
Nodes (14): Card(), CardContent(), Input(), Label(), userQueryOption, Login(), clientAction(), Register() (+6 more)

### Community 7 - "Route Module"
Cohesion: 0.06
Nodes (35): bcryptjs, class-transformer, class-validator, cookie-parser, @nestjs/config, @nestjs/jwt, @nestjs/passport, passport (+27 more)

### Community 8 - "compilerOptions"
Cohesion: 0.06
Nodes (34): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+26 more)

### Community 9 - "compilerOptions"
Cohesion: 0.15
Nodes (12): CurrentUser, JwtAuthGuard, Injectable, OrganizationsController, Controller, Get, UseGuards, OrganizationResponseDto (+4 more)

### Community 10 - "FlowForge System Architecture"
Cohesion: 0.09
Nodes (25): graphify, PostgreSQL 15, Redis 8.8, NestJS API Server, BullMQ Queue + Worker, PostgreSQL + Redis Data Layer, FlowForge System Architecture, React + React Flow Frontend (+17 more)

### Community 11 - "compilerOptions"
Cohesion: 0.08
Nodes (25): **/*, **/.client/**/*, DOM, DOM.Iterable, ES2022, .react-router/types/**/*, **/.server/**/*, vite/client (+17 more)

### Community 12 - "auth.controller.ts"
Cohesion: 0.08
Nodes (25): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+17 more)

### Community 13 - "AuthService"
Cohesion: 0.08
Nodes (24): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+16 more)

### Community 14 - "README.md"
Cohesion: 0.15
Nodes (15): CardAction(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), Skeleton(), ActivityItem, DashboardData (+7 more)

### Community 15 - "app.module.ts"
Cohesion: 0.16
Nodes (14): Badge(), badgeVariants, Button(), buttonVariants, Dialog(), DialogClose(), DialogContent(), DialogDescription() (+6 more)

### Community 16 - "PrismaProvider"
Cohesion: 0.25
Nodes (9): Attachment Component, Bubble Component, Chat and Messaging UI, Marker Component, Message Component, MessageScroller Component, MessageScroller Hooks, shimmer and scroll-fade Utilities (+1 more)

### Community 17 - "workflows.controller.ts"
Cohesion: 0.09
Nodes (25): clientLoader(), ConditionalBranchNode(), ConditionalBranchNodeData, DataTransformNode(), DataTransformNodeData, DelayNode(), DelayNodeData, HttpCallNode() (+17 more)

### Community 18 - "AuthController"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 19 - "auth.module.ts"
Cohesion: 0.10
Nodes (20): Configuring Registries, Setup, `shadcn:get_add_command_for_items`, `shadcn:get_audit_checklist`, `shadcn:get_item_examples_from_registries`, `shadcn:get_project_registries`, `shadcn:list_items_in_registries`, shadcn MCP Server (+12 more)

### Community 20 - "package.json"
Cohesion: 0.25
Nodes (8): AuthResponseDto, LoginInputDto, IsEmail, IsNotEmpty, IsString, UserResponseDto, TokenPayload, JwtPayload

### Community 21 - "devDependencies"
Cohesion: 0.10
Nodes (19): 10. State Persistence — Database (Not Job Tree), 11. Real-Time Updates — SSE with Redis Pub/Sub, 12. Multi-Tenancy in Execution, 1. Multi-Tenancy — Database Level Isolation, 2. Execution Model — 1 Job Per Node (Not Entire Workflow), 3. Separate Job Queues — Trigger vs Execution, 4. Frontend Editor — React Flow (xyflow), 5. DAG Validation — graphology-dag (+11 more)

### Community 22 - "exclude"
Cohesion: 0.10
Nodes (19): 1. Konsep Dasar, 2. Pemicu (Trigger), 3. Node, 4. Alur Kerja End-to-End, 5. Workflow Version & Rollback, 6. Execution State & Timeouts, 7. Security & Multi-Tenancy, 8. Limitations & Considerations (+11 more)

### Community 23 - "exclude"
Cohesion: 0.10
Nodes (10): AuthRepository, Injectable, AuthService, Injectable, OnboardingService, Injectable, JwtStrategy, Injectable (+2 more)

### Community 24 - "Component Composition Rules"
Cohesion: 0.09
Nodes (29): AppSidebarProps, SidebarUser, Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+21 more)

### Community 25 - "Flow Forge branding logo"
Cohesion: 0.11
Nodes (19): `add` — Add components, `apply` — Apply a preset to an existing project, `build` — Build a custom registry, Commands, Contents, `diff` — Check for updates, `docs` — Get component documentation URLs, Dry-Run Mode (+11 more)

### Community 26 - "nest-cli.json"
Cohesion: 0.12
Nodes (17): class-variance-authority, isbot, lucide-react, react-dom, react-router, @react-router/serve, dependencies, class-variance-authority (+9 more)

### Community 27 - "nest-cli.json"
Cohesion: 0.12
Nodes (17): @react-router/dev, devDependencies, @react-router/dev, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom (+9 more)

### Community 28 - "seed.ts"
Cohesion: 0.21
Nodes (8): AppController, Controller, Get, AppModule, Module, AppService, Injectable, bootstrap()

### Community 29 - "Icon Rules"
Cohesion: 0.12
Nodes (15): 10. Step Logs, 1. Users, 2. Organizations (Tenants), 3. Roles, 4. Organization Members, 5. User Sessions, 6. Workflows, 7. Workflow Versions (+7 more)

### Community 30 - "opencode.json"
Cohesion: 0.24
Nodes (3): UserSessionWithUser, PrismaProvider, Injectable

### Community 31 - "OnboardingRepository"
Cohesion: 0.16
Nodes (12): Global, AppModule, Module, AuthModule, Module, OrganizationsModule, Module, Module (+4 more)

### Community 32 - "graphify.js"
Cohesion: 0.13
Nodes (14): RSC Data Loading, RSC Data Mode, RSC Framework Mode, ServerComponent, RSC Data Mode, RSC Framework Mode, Client/Server Boundaries, Data Loading in RSC (+6 more)

### Community 33 - "welcome.tsx"
Cohesion: 0.20
Nodes (12): SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger() (+4 more)

### Community 34 - "prisma"
Cohesion: 0.15
Nodes (12): Data and Mutations, Forms, Fetchers, and Pending UI, Framework Mode, Framework Shape, Layout and Root Route Rules, Metadata, Middleware, Sessions, and Auth, Read the Local Docs by Mode (+4 more)

### Community 35 - "eslint-config-prettier"
Cohesion: 0.15
Nodes (13): Avatar always needs AvatarFallback, Button has no isPending or isLoading prop, Callouts use Alert, Card structure, Choosing between overlay components, Component Composition, Contents, Dialog, Sheet, and Drawer always need a Title (+5 more)

### Community 36 - "@eslint/js"
Cohesion: 0.24
Nodes (9): Req, Res, AuthController, Body, Controller, Get, HttpCode, Post (+1 more)

### Community 37 - "eslint-plugin-prettier"
Cohesion: 0.17
Nodes (17): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants, WorkflowEditor(), WorkflowEditorInner(), WorkflowEditorProps (+9 more)

### Community 38 - "globals"
Cohesion: 0.20
Nodes (11): Data Mode (Data Routers), Data Router, RouterProvider, Data Mode SSR, Framework Mode (Full-Stack), Generated Route Type Safety, Rendering Strategy, Data Mode (+3 more)

### Community 39 - "jest"
Cohesion: 0.18
Nodes (10): Declarative Router, Declarative Mode Boundary, Declarative Mode, Declarative Router Shape, Mode Boundary, Navigation, Read the Local Docs by Mode, Routing (+2 more)

### Community 40 - "@nestjs/cli"
Cohesion: 0.18
Nodes (11): Component Selection, shadcn Regular Logo, shadcn Small Logo, OpenAI Agent Interface, shadcn Principles, Project Context Fields, CLI Quick Reference, shadcn Skill (+3 more)

### Community 41 - "@nestjs/schematics"
Cohesion: 0.18
Nodes (10): author, description, keywords, license, main, name, packageManager, scripts (+2 more)

### Community 42 - "@nestjs/testing"
Cohesion: 0.20
Nodes (9): Data and Mutations, Data Mode, Data Router Shape, Forms, Fetchers, and Pending UI, Navigation and URL State, Read the Local Docs by Mode, Route Objects and Routing, RSC Data (+1 more)

### Community 43 - "prettier"
Cohesion: 0.20
Nodes (10): Component Docs, Examples, and Usage, Current Project Context, Detailed References, Key Fields, Key Patterns, Principles, Quick Reference, shadcn/ui (+2 more)

### Community 44 - "source-map-support"
Cohesion: 0.22
Nodes (9): className for Layout Only, cn() Utility Rule, No Manual Dark Override Rule, gap-* Spacing Rule, Semantic Colors Rule, size-* Property Rule, Styling Rules, truncate Utility Rule (+1 more)

### Community 46 - "ts-jest"
Cohesion: 0.22
Nodes (9): Address Schemes, Build and Verify, Include, Item Definitions, Mental Model, Registry Authoring and Addresses, Registry Dependencies, Root `registry.json` (+1 more)

### Community 47 - "ts-loader"
Cohesion: 0.22
Nodes (9): Accordion, Base vs Radix, Button / trigger as non-button element (base only), Composition: asChild (radix) vs render (base), Contents, Select, Select — multiple selection and object values (base only), Slider (+1 more)

### Community 48 - "ts-node"
Cohesion: 0.22
Nodes (9): Attachments use Attachment, Chat & Messaging, Contents, Escape hatch: the scroller hooks, Message rows use Message, Message surfaces use Bubble, Scrollable threads use MessageScroller, Streaming, anchoring, and jump-to-latest are built in (+1 more)

### Community 49 - "tsconfig-paths"
Cohesion: 0.22
Nodes (9): apply Command, shadcn CLI, docs Command, info Command, init Command, Preset System, search Command, Project Templates (+1 more)

### Community 50 - "@types/bcryptjs"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, @eslint/eslintrc, typescript, typescript-eslint, eslint, @eslint/eslintrc, typescript (+1 more)

### Community 51 - "@types/cookie-parser"
Cohesion: 0.25
Nodes (8): Border Radius, Changing the Theme, Checking for Updates, Color Variables, Contents, Customization & Theming, Dark Mode, How It Works

### Community 52 - "@types/express"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, start, typecheck, type

### Community 53 - "@types/jest"
Cohesion: 0.36
Nodes (8): Action, clientAction, clientLoader, ErrorBoundary, HydrateFallback, Loader, Middleware Pipeline, Route Module

### Community 54 - "@types/node"
Cohesion: 0.25
Nodes (8): GitHub Registries, Registry Address Schemes, build Command, Built Registry, Registry Build and Verify, Registry Include Mechanism, registry.json Schema, Source Registry

### Community 55 - "@types/passport-jwt"
Cohesion: 0.25
Nodes (8): Buttons inside inputs use InputGroup + InputGroupAddon, Contents, Field validation and disabled states, FieldSet + FieldLegend for grouping related fields, Forms & Inputs, Forms use FieldGroup + Field, InputGroup requires InputGroupInput/InputGroupTextarea, Option sets (2–7 choices) use ToggleGroup

### Community 56 - "@types/pg"
Cohesion: 0.25
Nodes (8): Chat & Messaging → [chat.md](./rules/chat.md), CLI, Component Structure → [composition.md](./rules/composition.md), Critical Rules, Forms & Inputs → [forms.md](./rules/forms.md), Icons → [icons.md](./rules/icons.md), Styling & Tailwind → [styling.md](./rules/styling.md), Use Components, Not Custom Markup → [composition.md](./rules/composition.md)

### Community 57 - "@types/supertest"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 58 - "Mode Migration"
Cohesion: 0.22
Nodes (10): AppSidebar(), Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator() (+2 more)

### Community 59 - "dependencies"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 60 - "eslint.config.mjs"
Cohesion: 0.29
Nodes (7): AvatarFallback Rule, Button Loading Pattern, Card Composition, Component Composition Rules, Item Group Rule, Overlay Components, TabsStructure Rule

### Community 61 - "prisma.config.ts"
Cohesion: 0.57
Nodes (7): Dark theme logo variant with white text on dark background, Flow Forge branding logo, FLOW FORGE wordmark text in custom typeface, Light theme logo variant with dark text on light background, Pinwheel/flow icon made of four circles in infinite-loop pattern with red connecting paths, Flow Forge logo (dark theme), Flow Forge logo (light theme)

### Community 62 - "cn"
Cohesion: 0.29
Nodes (7): Adding Custom Colors, Color CSS Variables, Component Customization Approaches, CSS Variable Chain, Dark Mode Setup, OKLCH Color Format, Theming and Customization

### Community 63 - "settings.tsx"
Cohesion: 0.18
Nodes (8): MinLength, RegisterInputDto, IsEmail, IsNotEmpty, IsOptional, IsString, OnboardingRepository, Injectable

### Community 64 - "components.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 65 - "Tools"
Cohesion: 0.29
Nodes (7): FieldGroup and Field, FieldSet and FieldLegend, Field Validation States, Forms and Inputs Rules, InputGroup Component, ToggleGroup for Options, ToggleGroup API Differences

### Community 66 - "Core Decisions"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 67 - "Business Logic"
Cohesion: 0.40
Nodes (4): Mode Migration Doc Index, React Router, Skill References, Use Installed Docs as Source of Truth

### Community 68 - "Registry Authoring and Addresses"
Cohesion: 0.40
Nodes (4): Icons, Icons in Button use data-icon attribute, No sizing classes on icons inside components, Pass icons as component objects, not string keys

### Community 69 - "React Server Components (RSC)"
Cohesion: 0.40
Nodes (3): adapter, pool, prisma

### Community 70 - "Tables"
Cohesion: 0.50
Nodes (4): data-icon Attribute Rule, Icon Object Passing, Icon Rules, Icon Sizing Rule

### Community 71 - "Framework Mode"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 72 - "Component Composition"
Cohesion: 0.33
Nodes (6): Accordion API Differences, asChild vs render Composition, Base vs Radix API Differences, nativeButton Prop, Select API Differences, Slider API Differences

### Community 76 - "Data Mode"
Cohesion: 0.40
Nodes (5): 1. Built-in variants, 2. Tailwind classes via `className`, 3. Add a new variant, 4. Wrapper components, Customizing Components

## Knowledge Gaps
- **586 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `version`, `description` (+581 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **38 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Chat and Messaging UI` to `welcome.tsx`, `eslint-plugin-prettier`, `scripts`, `README.md`, `app.module.ts`, `Component Composition Rules`, `Mode Migration`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `react` connect `Chat and Messaging UI` to `Component Composition Rules`, `workflows.controller.ts`, `nest-cli.json`, `eslint-plugin-prettier`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `dependencies` connect `nest-cli.json` to `Chat and Messaging UI`, `public-layout.tsx`, `package.json`, `shadcn Skill`, `JwtStrategy`, `Commands`, `Base vs Radix`, `Chat & Messaging`, `@types/express`, `vite.config.ts`, `lucide-react`, `react-router.config.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _586 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07138535995160314 - nodes in this community are weakly interconnected._
- **Should `shadcn CLI` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05893719806763285 - nodes in this community are weakly interconnected._