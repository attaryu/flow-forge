# Graph Report - .  (2026-07-18)

## Corpus Check
- 22 files · ~54,234 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1625 nodes · 2478 edges · 146 communities (107 shown, 39 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 45 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Auth Module
- Root ESLint Config
- Web UI Dependencies
- API Server Dependencies
- NestJS Decorators
- shadcn UI Components
- Package Configs
- Form & Input Components
- Sidebar Navigation
- Web Dev Dependencies
- Workflow DTOs
- Runs Repository
- System Architecture Docs
- TypeScript DOM Types
- API TypeScript Config
- App Sidebar & Dropdown
- Auth Controller
- Alert & Avatar Components
- Worker TypeScript Config
- Card & Skeleton Components
- Node Handlers
- CJS Build Config
- ESM Build Config
- shadcn Components Config
- Workflow Hooks & Page
- Architecture Decisions
- Business Logic Docs
- Execution Node Types
- Organizations Controller
- Worker App Controller
- Worker Dependencies
- API App Module
- Shared Validation Types
- Dashboard Home & Runs
- Execution Module
- Shared Validation Package
- Database Schema Docs
- React Router RSC Mode
- Dashboard Stats
- Runs Controller
- Execution Processor
- React Router Framework
- shadcn Composition Rules
- Workflow Validation
- Breadcrumb Components
- Jest Config (Web)
- API Build Scripts
- shadcn CLI Commands
- shadcn Styling Rules
- Org Switcher
- Trigger Module
- React Router Data Mode
- React Router Declarative
- shadcn Skill Overview
- shadcn CLI Reference
- Worker Package Config
- React Router Data Docs
- shadcn Project Context
- Sheet Components
- shadcn Registry System
- Base vs Radix
- Chat Components Rules
- Chat UI Components
- Tailwind Styling Rules
- API Dev Dependencies
- Workflow Editor
- Worker Services
- React Router Route Module
- shadcn Theming
- shadcn MCP Tools
- Registry Building
- Forms & Inputs Rules
- shadcn Critical Rules
- shadcn MCP Server
- API Build Config
- Worker Build Config
- Color Customization
- Component Composition
- Form Structure Rules
- Flow Forge Logos
- Web Package Config
- Component API Differences
- API Nest CLI Config
- Worker Nest CLI Config
- Context Service
- Scheduler Service
- React Router Skill
- shadcn Presets
- Component Customization
- shadcn MCP Setup
- Icon Rules
- Prisma Seed
- Icon Usage Rules
- OpenCode Plugin Config
- Graphify Plugin
- Multi-tenancy Pattern
- Welcome Page
- eslint-config-prettier
- @eslint/eslintrc
- @eslint/js
- eslint-plugin-prettier
- globals
- jest
- lodash
- @nestjs/cli
- @nestjs/schematics
- @nestjs/testing
- prettier
- prisma
- source-map-support
- ts-loader
- ts-node
- tsconfig-paths
- @types/cookie-parser
- @types/express
- @types/jest
- @types/node
- @types/passport-jwt
- @types/pg
- @types/supertest
- typescript
- typescript-eslint
- Auth Documentation
- Workflow Editor Schema
- bullmq
- ioredis
- @nestjs/common
- rxjs
- Mode Migration
- Dual Format Build
- Workflow Types
- Dashboard Module Docs
- Injectable Decorator

## God Nodes (most connected - your core abstractions)
1. `cn()` - 103 edges
2. `compilerOptions` - 23 edges
3. `compilerOptions` - 22 edges
4. `PrismaProvider` - 21 edges
5. `UserResponseDto` - 18 edges
6. `AuthService` - 16 edges
7. `CurrentOrgId` - 15 edges
8. `Roles()` - 15 edges
9. `getToken()` - 15 edges
10. `compilerOptions` - 15 edges

## Surprising Connections (you probably didn't know these)
- `graphify` --conceptually_related_to--> `FlowForge System Architecture`  [INFERRED]
  AGENTS.md → docs/architecture-decision.md
- `PNPM Workspace` --conceptually_related_to--> `FlowForge System Architecture`  [INFERRED]
  pnpm-workspace.yaml → docs/architecture-decision.md
- `Worker Service (NestJS+BullMQ)` --implements--> `FlowForge Platform`  [INFERRED]
  src/worker/README.md → README.md
- `Framework Mode` --semantically_similar_to--> `Framework Mode (Full-Stack)`  [INFERRED] [semantically similar]
  .agents/skills/react-router/SKILL.md → .agents/skills/react-router/references/framework-mode.md
- `Data Mode` --semantically_similar_to--> `Data Mode (Data Routers)`  [INFERRED] [semantically similar]
  .agents/skills/react-router/SKILL.md → .agents/skills/react-router/references/data-mode.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **DAG Execution Handlers** — src_worker_readme_httpcallhandler, src_worker_readme_delayhandler, src_worker_readme_datatransformhandler, src_worker_readme_conditionalbranchhandler [EXTRACTED 1.00]
- **Real-time SSE Pipeline** — src_worker_readme_steploggerservice, src_api_readme_runs_module, src_api_readme_sse_streaming, src_web_readme_useworkflowrunsse, src_web_readme_liveexecutionpanel [INFERRED 0.85]
- **DAG Validation Flow** — packages_shared_validation_readme_validateworkflow, packages_shared_validation_readme_cycle_detection, src_api_readme_workflows_module, src_web_readme_workfloweditor [INFERRED 0.85]
- **Critical Rules Group** — agents_skills_shadcon_styling_rules, agents_skills_shadcon_composition_rules, agents_skills_shadcon_forms_rules, agents_skills_shadcon_icon_rules, agents_skills_shadcon_chat_ui, agents_skills_shadcon_base_vs_radix [EXTRACTED 1.00]
- **CLI Commands Group** — agents_skills_shadcon_init_command, agents_skills_shadcon_apply_command, agents_skills_shadcon_add_command, agents_skills_shadcon_search_command, agents_skills_shadcon_view_command, agents_skills_shadcon_docs_command, agents_skills_shadcon_info_command, agents_skills_shadcon_build_command [EXTRACTED 1.00]
- **Base vs Radix API Differences** — agents_skills_shadcon_aschild_vs_render, agents_skills_shadcon_select_api_diffs, agents_skills_shadcon_togglegroup_api_diffs, agents_skills_shadcon_slider_api_diffs, agents_skills_shadcon_accordion_api_diffs [EXTRACTED 1.00]
- **RSC Variants** — _agents_skills_react_router_references_rsc_rsc_framework_mode, _agents_skills_react_router_references_rsc_rsc_data_mode, _agents_skills_react_router_references_rsc_client_server_boundary, _agents_skills_react_router_references_rsc_data_loading [EXTRACTED 1.00]
- **Route Module Exports** — _agents_skills_react_router_references_framework_mode_route_module, _agents_skills_react_router_references_framework_mode_loader, _agents_skills_react_router_references_framework_mode_action, _agents_skills_react_router_references_framework_mode_clientloader, _agents_skills_react_router_references_framework_mode_clientaction, _agents_skills_react_router_references_framework_mode_errorboundary, _agents_skills_react_router_references_framework_mode_hydratefallback, _agents_skills_react_router_references_framework_mode_middleware [EXTRACTED 1.00]
- **flowforge_system_architecture** — docs_architecture_decision_frontend, docs_architecture_decision_api_server, docs_architecture_decision_worker_service, docs_architecture_decision_data_layer [EXTRACTED 1.00]
- **core_design_principles** — docs_architecture_decision_multi_tenancy, docs_architecture_decision_per_node_execution, docs_architecture_decision_separate_queues, docs_architecture_decision_state_in_db, docs_architecture_decision_realtime_updates [EXTRACTED 1.00]
- **workflow_execution_pipeline** — docs_business_logic_workflow_lifecycle, docs_architecture_decision_bullmq, docs_architecture_decision_per_node_execution, docs_architecture_decision_realtime_updates, docs_database_schema_workflow_runs [INFERRED 0.85]

## Communities (146 total, 39 thin omitted)

### Community 0 - "Auth Module"
Cohesion: 0.06
Nodes (33): MinLength, Req, Res, AuthController, Body, Controller, HttpCode, Post (+25 more)

### Community 1 - "Root ESLint Config"
Cohesion: 0.04
Nodes (47): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+39 more)

### Community 2 - "Web UI Dependencies"
Cohesion: 0.04
Nodes (45): @base-ui/react, class-variance-authority, clsx, elkjs, @fontsource-variable/geist, isbot, ky, lucide-react (+37 more)

### Community 3 - "API Server Dependencies"
Cohesion: 0.05
Nodes (43): bcryptjs, bullmq, class-transformer, class-validator, cookie-parser, ioredis, @nestjs/bullmq, @nestjs/common (+35 more)

### Community 4 - "NestJS Decorators"
Cohesion: 0.08
Nodes (20): Injectable, Patch, Body, Controller, Delete, Get, HttpCode, Param (+12 more)

### Community 5 - "shadcn UI Components"
Cohesion: 0.13
Nodes (25): Badge(), badgeVariants, Button(), buttonVariants, Dialog(), DialogClose(), DialogContent(), DialogDescription() (+17 more)

### Community 6 - "Package Configs"
Cohesion: 0.06
Nodes (34): js, json, **/*.(t|j)s, ts, author, description, jest, collectCoverageFrom (+26 more)

### Community 7 - "Form & Input Components"
Cohesion: 0.12
Nodes (15): Input(), Label(), Toaster(), ToasterProps, userQueryOption, Login(), clientAction(), Register() (+7 more)

### Community 8 - "Sidebar Navigation"
Cohesion: 0.09
Nodes (27): react, Sidebar(), SidebarContext, SidebarContextProps, SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarGroupLabel() (+19 more)

### Community 9 - "Web Dev Dependencies"
Cohesion: 0.07
Nodes (29): @react-router/dev, devDependencies, @react-router/dev, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom (+21 more)

### Community 10 - "Workflow DTOs"
Cohesion: 0.09
Nodes (13): CreateWorkflowDto, IsNotEmpty, IsObject, IsOptional, IsString, IsObject, IsOptional, IsString (+5 more)

### Community 11 - "Runs Repository"
Cohesion: 0.11
Nodes (11): RunsRepository, Injectable, RunsService, Injectable, InjectQueue, SseService, Injectable, RedisModule (+3 more)

### Community 12 - "System Architecture Docs"
Cohesion: 0.09
Nodes (25): graphify, PostgreSQL 15, Redis 8.8, NestJS API Server, BullMQ Queue + Worker, PostgreSQL + Redis Data Layer, FlowForge System Architecture, React + React Flow Frontend (+17 more)

### Community 13 - "TypeScript DOM Types"
Cohesion: 0.08
Nodes (25): **/*, **/.client/**/*, DOM, DOM.Iterable, ES2022, .react-router/types/**/*, **/.server/**/*, vite/client (+17 more)

### Community 14 - "API TypeScript Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+17 more)

### Community 15 - "App Sidebar & Dropdown"
Cohesion: 0.13
Nodes (20): AppSidebar(), AppSidebarProps, SidebarUser, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+12 more)

### Community 16 - "Auth Controller"
Cohesion: 0.19
Nodes (11): Get, UseGuards, CurrentUser, UserResponseDto, JwtAuthGuard, Injectable, Post, CurrentOrgId (+3 more)

### Community 17 - "Alert & Avatar Components"
Cohesion: 0.15
Nodes (22): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants, Avatar(), AvatarBadge(), AvatarFallback() (+14 more)

### Community 18 - "Worker TypeScript Config"
Cohesion: 0.08
Nodes (24): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+16 more)

### Community 19 - "Card & Skeleton Components"
Cohesion: 0.14
Nodes (19): Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), Skeleton(), DashboardStats (+11 more)

### Community 20 - "Node Handlers"
Cohesion: 0.19
Nodes (9): ConditionalBranchHandler, Injectable, DataTransformHandler, Injectable, DelayHandler, Injectable, HttpCallHandler, Injectable (+1 more)

### Community 21 - "CJS Build Config"
Cohesion: 0.09
Nodes (22): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+14 more)

### Community 22 - "ESM Build Config"
Cohesion: 0.09
Nodes (22): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+14 more)

### Community 23 - "shadcn Components Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 24 - "Workflow Hooks & Page"
Cohesion: 0.13
Nodes (17): useCreateWorkflow(), useDeleteWorkflow(), useUpdateWorkflow(), workflowQueryOption(), workflowsQueryOption, WorkflowsPage(), ConditionalConfig, CreateWorkflowInput (+9 more)

### Community 25 - "Architecture Decisions"
Cohesion: 0.10
Nodes (19): 10. State Persistence — Database (Not Job Tree), 11. Real-Time Updates — SSE with Redis Pub/Sub, 12. Multi-Tenancy in Execution, 1. Multi-Tenancy — Database Level Isolation, 2. Execution Model — 1 Job Per Node (Not Entire Workflow), 3. Separate Job Queues — Trigger vs Execution, 4. Frontend Editor — React Flow (xyflow), 5. DAG Validation — graphology-dag (+11 more)

### Community 26 - "Business Logic Docs"
Cohesion: 0.10
Nodes (19): 1. Konsep Dasar, 2. Pemicu (Trigger), 3. Node, 4. Alur Kerja End-to-End, 5. Workflow Version & Rollback, 6. Execution State & Timeouts, 7. Security & Multi-Tenancy, 8. Limitations & Considerations (+11 more)

### Community 27 - "Execution Node Types"
Cohesion: 0.10
Nodes (20): CONDITIONAL_BRANCH Node Type, DATA_TRANSFORM Node Type, DELAY Node Type, HTTP_CALL Node Type, Runs Module, SSE Real-time Streaming, LiveExecutionPanel, useWorkflowRunSSE Hook (+12 more)

### Community 28 - "Organizations Controller"
Cohesion: 0.18
Nodes (9): OrganizationsController, Controller, Get, UseGuards, OrganizationResponseDto, OrganizationsRepository, Injectable, OrganizationsService (+1 more)

### Community 29 - "Worker App Controller"
Cohesion: 0.16
Nodes (8): AppController, Controller, Get, AppModule, Module, AppService, Injectable, bootstrap()

### Community 30 - "Worker Dependencies"
Cohesion: 0.11
Nodes (19): axios, jexl, dependencies, axios, class-validator, jexl, @nestjs/bullmq, @nestjs/config (+11 more)

### Community 31 - "API App Module"
Cohesion: 0.13
Nodes (14): Global, AppModule, Module, AuthModule, Module, DashboardModule, Module, OrganizationsModule (+6 more)

### Community 32 - "Shared Validation Types"
Cohesion: 0.22
Nodes (14): ConditionalConfig, DataTransformConfig, DbEdge, DelayConfig, HttpCallConfig, NodeType, WorkflowDefinition, WorkflowInput (+6 more)

### Community 33 - "Dashboard Home & Runs"
Cohesion: 0.16
Nodes (13): clientLoader(), RunTriggerButton(), RunTriggerButtonProps, runDetailQueryOption(), useWorkflowRunSSE(), StepLog, TriggerRunResponse, useTriggerWorkflowRun() (+5 more)

### Community 34 - "Execution Module"
Cohesion: 0.21
Nodes (5): DatabaseProvider, Injectable, RedisProvider, Injectable, ExecutionJobPayload

### Community 35 - "Shared Validation Package"
Cohesion: 0.12
Nodes (16): description, devDependencies, typescript, vitest, exports, typescript, vitest, main (+8 more)

### Community 36 - "Database Schema Docs"
Cohesion: 0.12
Nodes (15): 10. Step Logs, 1. Users, 2. Organizations (Tenants), 3. Roles, 4. Organization Members, 5. User Sessions, 6. Workflows, 7. Workflow Versions (+7 more)

### Community 37 - "React Router RSC Mode"
Cohesion: 0.13
Nodes (14): Client/Server Boundary, RSC Data Loading, RSC Data Mode, RSC Framework Mode, ServerComponent, RSC Data Mode, RSC Framework Mode, Data Loading in RSC (+6 more)

### Community 38 - "Dashboard Stats"
Cohesion: 0.21
Nodes (9): DashboardController, Controller, Get, UseGuards, DashboardStatsDto, RecentRunDto, RunsByDayDto, DashboardService (+1 more)

### Community 39 - "Runs Controller"
Cohesion: 0.18
Nodes (8): RunsController, Controller, Delete, Get, HttpCode, Param, UseGuards, Sse

### Community 40 - "Execution Processor"
Cohesion: 0.23
Nodes (5): ExecutionProcessor, Injectable, Processor, RunManagerService, Injectable

### Community 41 - "React Router Framework"
Cohesion: 0.15
Nodes (12): Data and Mutations, Forms, Fetchers, and Pending UI, Framework Mode, Framework Shape, Layout and Root Route Rules, Metadata, Middleware, Sessions, and Auth, Read the Local Docs by Mode (+4 more)

### Community 42 - "shadcn Composition Rules"
Cohesion: 0.15
Nodes (13): Avatar always needs AvatarFallback, Button has no isPending or isLoading prop, Callouts use Alert, Card structure, Choosing between overlay components, Component Composition, Contents, Dialog, Sheet, and Drawer always need a Title (+5 more)

### Community 43 - "Workflow Validation"
Cohesion: 0.22
Nodes (13): Unit Test CI Pipeline, Cycle Detection (DAG Validation), shared-validation Package, validateWorkflow Function, DAG-based Workflow Automation, FlowForge Platform, Multi-tenancy, Real-time Monitoring (+5 more)

### Community 44 - "Breadcrumb Components"
Cohesion: 0.24
Nodes (9): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Separator() (+1 more)

### Community 45 - "Jest Config (Web)"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+5 more)

### Community 46 - "API Build Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 47 - "shadcn CLI Commands"
Cohesion: 0.17
Nodes (12): `add` — Add components, `apply` — Apply a preset to an existing project, `build` — Build a custom registry, Commands, `diff` — Check for updates, `docs` — Get component documentation URLs, Dry-Run Mode, `info` — Project information (+4 more)

### Community 48 - "shadcn Styling Rules"
Cohesion: 0.17
Nodes (12): Built-in variants first, Contents, No manual dark: color overrides, No manual z-index on overlay components, No raw color values for status/state indicators, No space-x-* / space-y-*, Prefer size-* over w-* h-* when equal, Prefer truncate shorthand (+4 more)

### Community 49 - "Org Switcher"
Cohesion: 0.29
Nodes (7): OrgSwitcher(), organizationsQueryOption, useActiveOrg(), Organization, DashboardLayout(), getActiveOrgId(), setActiveOrgId()

### Community 50 - "Trigger Module"
Cohesion: 0.18
Nodes (8): ExecutionModule, Module, TriggerModule, Module, TriggerProcessor, Injectable, InjectQueue, Processor

### Community 51 - "React Router Data Mode"
Cohesion: 0.20
Nodes (11): Data Mode (Data Routers), Data Router, RouterProvider, Data Mode SSR, Framework Mode (Full-Stack), Generated Route Type Safety, Rendering Strategy, Data Mode (+3 more)

### Community 52 - "React Router Declarative"
Cohesion: 0.18
Nodes (10): Declarative Router, Declarative Mode Boundary, Declarative Mode, Declarative Router Shape, Mode Boundary, Navigation, Read the Local Docs by Mode, Routing (+2 more)

### Community 53 - "shadcn Skill Overview"
Cohesion: 0.18
Nodes (11): Component Selection, shadcn Regular Logo, shadcn Small Logo, OpenAI Agent Interface, shadcn Principles, Project Context Fields, CLI Quick Reference, shadcn Skill (+3 more)

### Community 54 - "shadcn CLI Reference"
Cohesion: 0.18
Nodes (11): add Command, apply Command, shadcn CLI, docs Command, info Command, init Command, Preset System, search Command (+3 more)

### Community 55 - "Worker Package Config"
Cohesion: 0.18
Nodes (10): author, description, keywords, license, main, name, packageManager, scripts (+2 more)

### Community 56 - "React Router Data Docs"
Cohesion: 0.20
Nodes (9): Data and Mutations, Data Mode, Data Router Shape, Forms, Fetchers, and Pending UI, Navigation and URL State, Read the Local Docs by Mode, Route Objects and Routing, RSC Data (+1 more)

### Community 57 - "shadcn Project Context"
Cohesion: 0.20
Nodes (10): Component Docs, Examples, and Usage, Current Project Context, Detailed References, Key Fields, Key Patterns, Principles, Quick Reference, shadcn/ui (+2 more)

### Community 58 - "Sheet Components"
Cohesion: 0.20
Nodes (6): SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 60 - "shadcn Registry System"
Cohesion: 0.22
Nodes (9): Address Schemes, Build and Verify, Include, Item Definitions, Mental Model, Registry Authoring and Addresses, Registry Dependencies, Root `registry.json` (+1 more)

### Community 61 - "Base vs Radix"
Cohesion: 0.22
Nodes (9): Accordion, Base vs Radix, Button / trigger as non-button element (base only), Composition: asChild (radix) vs render (base), Contents, Select, Select — multiple selection and object values (base only), Slider (+1 more)

### Community 62 - "Chat Components Rules"
Cohesion: 0.22
Nodes (9): Attachments use Attachment, Chat & Messaging, Contents, Escape hatch: the scroller hooks, Message rows use Message, Message surfaces use Bubble, Scrollable threads use MessageScroller, Streaming, anchoring, and jump-to-latest are built in (+1 more)

### Community 63 - "Chat UI Components"
Cohesion: 0.25
Nodes (9): Attachment Component, Bubble Component, Chat and Messaging UI, Marker Component, Message Component, MessageScroller Component, MessageScroller Hooks, shimmer and scroll-fade Utilities (+1 more)

### Community 64 - "Tailwind Styling Rules"
Cohesion: 0.22
Nodes (9): className for Layout Only, cn() Utility Rule, No Manual Dark Override Rule, gap-* Spacing Rule, Semantic Colors Rule, size-* Property Rule, Styling Rules, truncate Utility Rule (+1 more)

### Community 65 - "API Dev Dependencies"
Cohesion: 0.22
Nodes (9): eslint, devDependencies, eslint, supertest, ts-jest, @types/bcryptjs, supertest, ts-jest (+1 more)

### Community 66 - "Workflow Editor"
Cohesion: 0.22
Nodes (6): NODE_COLORS, NODE_TYPE_LABELS, WorkflowEditor(), WorkflowEditorProps, WorkflowVisualization(), WorkflowVisualizationProps

### Community 67 - "Worker Services"
Cohesion: 0.22
Nodes (5): InjectQueue, NodeExecutorService, Injectable, StepLoggerService, Injectable

### Community 68 - "React Router Route Module"
Cohesion: 0.36
Nodes (8): Action, clientAction, clientLoader, ErrorBoundary, HydrateFallback, Loader, Middleware Pipeline, Route Module

### Community 69 - "shadcn Theming"
Cohesion: 0.25
Nodes (8): Border Radius, Changing the Theme, Checking for Updates, Color Variables, Contents, Customization & Theming, Dark Mode, How It Works

### Community 70 - "shadcn MCP Tools"
Cohesion: 0.25
Nodes (8): `shadcn:get_add_command_for_items`, `shadcn:get_audit_checklist`, `shadcn:get_item_examples_from_registries`, `shadcn:get_project_registries`, `shadcn:list_items_in_registries`, `shadcn:search_items_in_registries`, `shadcn:view_items_in_registries`, Tools

### Community 71 - "Registry Building"
Cohesion: 0.25
Nodes (8): GitHub Registries, Registry Address Schemes, build Command, Built Registry, Registry Build and Verify, Registry Include Mechanism, registry.json Schema, Source Registry

### Community 72 - "Forms & Inputs Rules"
Cohesion: 0.25
Nodes (8): Buttons inside inputs use InputGroup + InputGroupAddon, Contents, Field validation and disabled states, FieldSet + FieldLegend for grouping related fields, Forms & Inputs, Forms use FieldGroup + Field, InputGroup requires InputGroupInput/InputGroupTextarea, Option sets (2–7 choices) use ToggleGroup

### Community 73 - "shadcn Critical Rules"
Cohesion: 0.25
Nodes (8): Chat & Messaging → [chat.md](./rules/chat.md), CLI, Component Structure → [composition.md](./rules/composition.md), Critical Rules, Forms & Inputs → [forms.md](./rules/forms.md), Icons → [icons.md](./rules/icons.md), Styling & Tailwind → [styling.md](./rules/styling.md), Use Components, Not Custom Markup → [composition.md](./rules/composition.md)

### Community 74 - "shadcn MCP Server"
Cohesion: 0.25
Nodes (8): MCP: get_add_command_for_items, MCP: get_audit_checklist, MCP: get_item_examples_from_registries, MCP: get_project_registries, MCP: list_items_in_registries, MCP: search_items_in_registries, MCP Tools, MCP: view_items_in_registries

### Community 75 - "API Build Config"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 76 - "Worker Build Config"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 77 - "Color Customization"
Cohesion: 0.29
Nodes (7): Adding Custom Colors, Color CSS Variables, Component Customization Approaches, CSS Variable Chain, Dark Mode Setup, OKLCH Color Format, Theming and Customization

### Community 78 - "Component Composition"
Cohesion: 0.29
Nodes (7): AvatarFallback Rule, Button Loading Pattern, Card Composition, Component Composition Rules, Item Group Rule, Overlay Components, TabsStructure Rule

### Community 79 - "Form Structure Rules"
Cohesion: 0.29
Nodes (7): FieldGroup and Field, FieldSet and FieldLegend, Field Validation States, Forms and Inputs Rules, InputGroup Component, ToggleGroup for Options, ToggleGroup API Differences

### Community 80 - "Flow Forge Logos"
Cohesion: 0.57
Nodes (7): Dark theme logo variant with white text on dark background, Flow Forge branding logo, FLOW FORGE wordmark text in custom typeface, Light theme logo variant with dark text on light background, Pinwheel/flow icon made of four circles in infinite-loop pattern with red connecting paths, Flow Forge logo (dark theme), Flow Forge logo (light theme)

### Community 81 - "Web Package Config"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 82 - "Component API Differences"
Cohesion: 0.33
Nodes (6): Accordion API Differences, asChild vs render Composition, Base vs Radix API Differences, nativeButton Prop, Select API Differences, Slider API Differences

### Community 83 - "API Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 84 - "Worker Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 86 - "Scheduler Service"
Cohesion: 0.40
Nodes (3): SchedulerService, Injectable, InjectQueue

### Community 87 - "React Router Skill"
Cohesion: 0.40
Nodes (4): Mode Migration Doc Index, React Router, Skill References, Use Installed Docs as Source of Truth

### Community 88 - "shadcn Presets"
Cohesion: 0.40
Nodes (5): Contents, Presets, shadcn CLI Reference, Switching Presets, Templates

### Community 89 - "Component Customization"
Cohesion: 0.40
Nodes (5): 1. Built-in variants, 2. Tailwind classes via `className`, 3. Add a new variant, 4. Wrapper components, Customizing Components

### Community 90 - "shadcn MCP Setup"
Cohesion: 0.40
Nodes (4): Configuring Registries, Setup, shadcn MCP Server, MCP Registry Configuration

### Community 91 - "Icon Rules"
Cohesion: 0.40
Nodes (4): Icons, Icons in Button use data-icon attribute, No sizing classes on icons inside components, Pass icons as component objects, not string keys

### Community 92 - "Prisma Seed"
Cohesion: 0.40
Nodes (3): adapter, pool, prisma

### Community 93 - "Icon Usage Rules"
Cohesion: 0.50
Nodes (4): data-icon Attribute Rule, Icon Object Passing, Icon Rules, Icon Sizing Rule

### Community 94 - "OpenCode Plugin Config"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 97 - "Multi-tenancy Pattern"
Cohesion: 0.67
Nodes (3): Database-level Multi-tenancy, Organizations Module, OrgSwitcher Component

## Knowledge Gaps
- **655 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `version`, `description` (+650 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Web UI Dependencies` to `Sidebar Navigation`, `Web Dev Dependencies`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `react` connect `Sidebar Navigation` to `Workflow Editor`, `Web UI Dependencies`, `shadcn UI Components`, `Org Switcher`, `Workflow Hooks & Page`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `cn()` connect `Alert & Avatar Components` to `shadcn UI Components`, `Form & Input Components`, `Sidebar Navigation`, `Breadcrumb Components`, `App Sidebar & Dropdown`, `Card & Skeleton Components`, `Sheet Components`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _655 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth Module` be split into smaller, more focused modules?**
  _Cohesion score 0.06116700201207243 - nodes in this community are weakly interconnected._
- **Should `Root ESLint Config` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `Web UI Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._