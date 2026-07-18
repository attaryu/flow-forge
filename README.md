# FlowForge

Platform otomasi workflow berbasis DAG (Directed Acyclic Graph). Pengguna merangkai node-node tugas menjadi satu alur yang berjalan otomatis — dengan monitoring real-time dan dukungan multi-tenancy.

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
│               React + React Flow (web)                  │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP / SSE
┌───────────────────────▼─────────────────────────────────┐
│                   API Server (api)                      │
│        NestJS · REST · JWT Auth · Prisma ORM            │
└──────────┬────────────────────────────┬─────────────────┘
           │ BullMQ Jobs                │ Redis Pub/Sub
┌──────────▼──────────┐    ┌────────────▼────────────────┐
│   Worker (worker)   │    │         Redis 8              │
│  NestJS · BullMQ    │    │   Queue + SSE Pub/Sub        │
│  DAG Executor       │    └─────────────────────────────┘
└──────────┬──────────┘
           │ SQL
┌──────────▼──────────┐
│    PostgreSQL 15     │
│  Workflow state +    │
│  step logs          │
└─────────────────────┘
```

## Struktur Monorepo

```
flow-forge/
├── src/
│   ├── api/           # REST API Server (NestJS)
│   ├── web/           # Frontend (React Router v8 + React Flow)
│   └── worker/        # DAG Executor (NestJS + BullMQ)
├── packages/
│   └── shared-validation/   # Shared types & validasi workflow
├── docs/
│   ├── architecture-decision.md   # Keputusan arsitektur & alasan teknis
│   ├── business-logic.md          # Logika bisnis & alur kerja end-to-end
│   └── database-schema.md         # Skema database & relasi tabel
├── compose.yml        # Docker Compose (PostgreSQL + Redis)
└── pnpm-workspace.yaml
```

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10
- **Docker** (untuk PostgreSQL & Redis via Compose)

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Jalankan infrastructure (PostgreSQL + Redis)

```bash
docker compose up -d
```

### 3. Setup database (migrasi + seed)

```bash
cd src/api
pnpm prisma migrate dev
pnpm prisma db seed
```

### 4. Build shared package

```bash
cd packages/shared-validation
pnpm build
```

### 5. Jalankan semua service (mode development)

Di terminal terpisah, jalankan masing-masing:

```bash
# Terminal 1 — API Server (port 3000)
cd src/api && pnpm start:dev

# Terminal 2 — Worker
cd src/worker && pnpm start:dev

# Terminal 3 — Web (port 5173)
cd src/web && pnpm dev
```

Aplikasi tersedia di `http://localhost:5173`.

## Node Types

Setiap workflow terdiri dari kombinasi node berikut:

| Node | Deskripsi |
|---|---|
| `HTTP_CALL` | Kirim HTTP request ke URL eksternal (GET/POST) |
| `DELAY` | Tunda eksekusi (non-blocking, via job delay) |
| `DATA_TRANSFORM` | Transformasi data dengan ekspresi atau operasi siap pakai |
| `CONDITIONAL_BRANCH` | Cabangkan alur berdasarkan kondisi (true/false) |

## Dokumentasi Lebih Lanjut

| Dokumen | Isi |
|---|---|
| [Architecture Decisions](docs/architecture-decision.md) | Alasan teknis setiap keputusan desain sistem |
| [Business Logic](docs/business-logic.md) | Konsep dasar, alur kerja end-to-end, trigger, dan node |
| [Database Schema](docs/database-schema.md) | Skema tabel, relasi, dan query multi-tenancy |

## Sub-project

| Sub-project | README |
|---|---|
| `src/api` — REST API Server | [README](src/api/README.md) |
| `src/web` — Frontend | [README](src/web/README.md) |
| `src/worker` — DAG Executor | [README](src/worker/README.md) |
| `packages/shared-validation` — Shared Package | [README](packages/shared-validation/README.md) |
