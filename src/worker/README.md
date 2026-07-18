# FlowForge Worker Service

Worker Service untuk FlowForge yang dibangun dengan NestJS. Service ini bertanggung jawab untuk mengeksekusi langkah-langkah (*steps*) dalam workflow secara berurutan (*step-by-step DAG execution*) menggunakan antrean BullMQ dan mempublikasikan status eksekusi secara real-time.

## Arsitektur Eksekusi & Queue

Worker menggunakan dua antrean BullMQ terpisah untuk menjamin keandalan sistem:

1. **`triggerQueue`** (diambil oleh `TriggerProcessor`):
   - Menangani trigger terjadwal (cron).
   - Saat terpicu, ia akan membuat record `workflow_run` baru di database dan memasukkan node pertama ke `executionQueue`.
   
2. **`executionQueue`** (diambil oleh `ExecutionProcessor`):
   - Mengeksekusi node workflow satu per satu.
   - Menggunakan format Job ID `${runId}:${nodeId}` untuk mencegah eksekusi ganda pada langkah yang sama (idempotensi).
   - Setelah sebuah node sukses dieksekusi, processor akan mencari node berikutnya dari definisi DAG dan memasukkannya kembali ke queue.

## Node Handlers

Setiap jenis node didelegasikan ke class handler khusus di bawah `src/execution/handlers/`:

- **`HTTP_CALL`** (`HttpCallHandler`):
  - Melakukan external HTTP call (GET/POST) menggunakan Axios.
  - Mendukung retry otomatis hingga 3 kali dengan exponential backoff jika terjadi kegagalan koneksi/status non-2xx.
- **`DELAY`** (`DelayHandler`):
  - Menggunakan opsi `delay` bawaan BullMQ (non-blocking). Worker tidak memblok thread dengan `sleep()`, melainkan menjadwalkan job langkah berikutnya di Redis agar aktif setelah durasi delay terlewati.
- **`DATA_TRANSFORM`** (`DataTransformHandler`):
  - Mengevaluasi ekspresi transformasi data menggunakan library `jexl` (tanpa eksekusi kode bebas untuk alasan keamanan).
  - Mendukung referensi output dari node sebelumnya dengan sintaks `${nodeId.field}`.
- **`CONDITIONAL_BRANCH`** (`ConditionalBranchHandler`):
  - Mengevaluasi percabangan logika (EQUALS, NOT_EQUALS, GREATER_THAN, CONTAINS).
  - Menentukan jalur keluar yang akan ditempuh (True/False handle) dan memasukkan target node yang sesuai ke queue.

## Monitoring Real-Time

Setiap perubahan status eksekusi node dipublikasikan oleh `StepLoggerService` ke Redis Pub/Sub dengan channel format `workflow-run:${runId}`. API Server akan mendengarkan channel ini dan meneruskannya ke dashboard frontend via Server-Sent Events (SSE).

## Setup & Run

### Environment Variables
Buat file `.env` di direktori ini (atau pastikan variabel terdefinisi di environment) untuk menghubungkan ke PostgreSQL dan Redis:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flowforge?schema=public"
REDIS_URL="redis://localhost:6379"
```

### Commands

```bash
# Menjalankan worker dalam mode development (dengan watch mode)
pnpm start:dev

# Build untuk production
pnpm build

# Menjalankan worker hasil build production
pnpm start:prod

# Menjalankan test suite (Jest)
pnpm test
```
