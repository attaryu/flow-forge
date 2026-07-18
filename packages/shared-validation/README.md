# @flow-forge/shared-validation

Shared library untuk tipe data TypeScript dan logika validasi workflow definition. Library ini digunakan bersama oleh service backend (`api`) dan frontend (`web`).

## Fitur Utama

1. **Definisi Tipe Data (Types)**:
   - Skema dan interface untuk berbagai jenis Node (`NodeType`, `HttpCallConfig`, `DelayConfig`, `DataTransformConfig`, `ConditionalConfig`).
   - Interface data struktur graf (`WorkflowNode`, `DbEdge`, `WorkflowDefinition`, `WorkflowInput`).

2. **Validasi Workflow (`validateWorkflow`)**:
   - Memastikan workflow valid sebelum disimpan atau dieksekusi.
   - Deteksi siklus (cycle detection) untuk memastikan graf bertipe DAG (Directed Acyclic Graph) menggunakan library `graphology` & `graphology-dag`.
   - Validasi konfigurasi setiap node (misalnya, memastikan URL HTTP_CALL valid, durasi DELAY valid, dan CONDITIONAL_BRANCH memiliki dua jalur keluar/edges dengan handle true & false).

## Setup & Build

Shared library ini dibangun dalam dual-format output: **CommonJS (CJS)** untuk backend (`api` & `worker`) dan **ES Modules (ESM)** untuk frontend (`web`).

```bash
# Melakukan instalasi dependency
pnpm install

# Build library (output tersimpan di folder dist/)
pnpm build

# Menjalankan unit tests (Vitest)
pnpm test
```
