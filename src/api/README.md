# FlowForge API Server

API Server untuk FlowForge yang dibangun dengan NestJS. Berperan mengelola *authentication*, *multi-tenancy*, definisi *workflow*, riwayat *workflow runs*, dan *dashboard statistics*.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com)
- **ORM**: [Prisma](https://www.prisma.io)
- **Database**: PostgreSQL (Client adapter: `@prisma/adapter-pg`)
- **Queue/PubSub**: [BullMQ](https://bullmq.io) & Redis
- **Auth**: Passport-JWT & Bcryptjs

## Fitur & Modul Utama

1. **`auth`**:
   - Registrasi user baru & login.
   - Autentikasi berbasis token JWT (disimpan dalam HTTP-only cookie atau header).
   - Pengelolaan session user (`user_sessions`).
   - Guard untuk proteksi endpoint (`JwtAuthGuard`).

2. **`organizations`**:
   - Konsep Tenant: Setiap user terhubung dengan organisasi.
   - Pemisahan data antar tenant (*multi-tenancy*) di level database.

3. **`workflows`**:
   - CRUD definisi workflow (`workflows`).
   - Setiap modifikasi workflow menyimpan riwayat versi (`workflow_versions`).
   - Pengaturan trigger (manual atau terjadwal via cron).
   - Validasi struktur graf (DAG) menggunakan `@flow-forge/shared-validation`.

4. **`runs`**:
   - Eksekusi workflow manual.
   - Riwayat eksekusi (`workflow_runs` & `step_logs`).
   - Stream event eksekusi real-time via SSE (Server-Sent Events) terintegrasi dengan Redis Pub/Sub.

5. **`dashboard`**:
   - Menyediakan statistik agregat (jumlah run sukses, gagal, durasi rata-rata) untuk tenant bersangkutan.

## Database (Prisma)

Skema database didefinisikan pada file `prisma/schema.prisma`.

### Perintah Database yang Sering Digunakan:

```bash
# Melakukan migrasi schema ke database local
pnpm prisma migrate dev

# Menjalankan database seed (membuat default roles, mock users, dll)
pnpm prisma db seed

# Membuka Prisma Studio (GUI database viewer)
pnpm prisma studio
```

## Setup & Run

### Environment Variables
Buat file `.env` di direktori ini (copy dari `.env.example` jika ada) dan sesuaikan nilainya:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flowforge?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="ganti-dengan-secret-key-yang-aman"
```

### Commands

```bash
# Mode development (dengan watch mode)
pnpm start:dev

# Build untuk production
pnpm build

# Mode production
pnpm start:prod

# Menjalankan test suite (Jest)
pnpm test
pnpm test:watch
pnpm test:cov
```
