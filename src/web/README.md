# FlowForge Frontend (Web)

Aplikasi frontend FlowForge yang menyediakan *interface* visual untuk menyusun workflow dan dashboard untuk monitoring eksekusinya secara live.

## Tech Stack

- **Framework**: [React Router v8](https://reactrouter.com) (Framework Mode)
- **Visual Builder**: [React Flow (xyflow)](https://reactflow.dev)
- **State & Data Fetching**: [TanStack React Query](https://tanstack.com/query)
- **HTTP Client**: [Ky](https://github.com/sindresorhus/ky)
- **UI & Styling**: [shadcn/ui](https://ui.shadcn.com), [Base UI](https://base-ui.com), TailwindCSS v4, [Lucide React](https://lucide.dev)
- **Form Management**: React Hook Form
- **DAG Layout Engine**: [elkjs](https://github.com/kieler/elkjs)

## Struktur Folder & Fitur Utama

- **`app/routes.ts`**: Mendefinisikan rute-rute aplikasi (auth, dashboard, workflows).
- **`app/features/`**:
  - **`auth/`**: Login, registrasi, layout autentikasi publik, dan pengelolaan token session.
  - **`organizations/`**: Switcher organisasi (`OrgSwitcher`) untuk mendukung *multi-tenancy*.
  - **`dashboard/`**: Menampilkan statistik eksekusi dan daftar run terbaru.
  - **`workflows/`**:
    - **`components/WorkflowEditor.tsx`**: Interface visual (React Flow) untuk membuat, mengedit, dan memvalidasi workflow DAG.
    - **`components/LiveExecutionPanel.tsx` & `RunDetailDrawer.tsx`**: Panel monitoring live dengan update status step/node secara real-time via Server-Sent Events (SSE).
- **`app/hooks/`**: Custom hooks seperti `useWorkflowRunSSE` untuk integrasi streaming update dari backend.

## Integrasi dengan @flow-forge/shared-validation

Frontend mengimpor fungsi validasi dan tipe data dari `@flow-forge/shared-validation` untuk memastikan workflow tidak memiliki siklus (DAG validation via `graphology-dag`) sebelum dikirim ke API Server.

## Setup & Run

### Environment Variables
Pastikan backend API Server sudah berjalan. Konfigurasi proxy atau target API default biasanya diarahkan ke `http://localhost:3000`.

### Commands

```bash
# Menjalankan server development (Vite + HMR)
pnpm dev

# Melakukan typecheck dengan TypeScript & React Router typegen
pnpm typecheck

# Build aplikasi untuk production
pnpm build

# Menjalankan production build secara local
pnpm start

# Menjalankan test suite (Vitest)
pnpm test
```
