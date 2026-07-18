# Business Logic

## 1. Konsep Dasar

FlowForge adalah platform otomatisasi tugas: pengguna merangkai beberapa task terpisah menjadi satu alur (*workflow*) yang berjalan sendiri, tanpa perlu dijalankan manual satu-satu setiap kali.

Tiga hal yang mendasari cara kerja aplikasi ini:

- **Multi-tenancy** — satu aplikasi disewa banyak perusahaan (tenant) sekaligus. Data dan workflow antar-tenant terpisah total, tidak saling terlihat.
- **Workflow berbentuk DAG** — setiap rangkaian tugas digambarkan sebagai graf terarah tanpa siklus (*Directed Acyclic Graph*). Artinya alur boleh bercabang, tapi tidak boleh ada jalur yang berputar balik ke node yang sudah dilewati.
- **Monitoring penuh** — setiap eksekusi workflow tercatat: waktu mulai, waktu selesai, status tiap langkah (sukses/gagal), dan alasan kegagalan jika ada.

---

## 2. Pemicu (Trigger)

Workflow bisa mulai berjalan lewat dua jalur:

| Trigger | Cara Kerja |
| --- | --- |
| **Manual** | Pengguna klik “Jalankan Sekarang” dari daftar workflow. |
| **Terjadwal** | Pengguna set jadwal (contoh: “tiap Senin jam 8 pagi” atau “tiap 10 menit”), sistem menjalankan otomatis sesuai jadwal. |

---

## 3. Node

Setiap workflow tersusun dari node-node berikut. Semua node non-percabangan hanya punya **satu jalur keluar**; node percabangan wajib punya **dua**.

### `HTTP_CALL` — Ambil/Kirim Data

Menghubungi alamat eksternal untuk mengambil (GET) atau mengirim (POST) data.

- **Input:** URL tujuan, metode (Ambil/Kirim), headers, payload (jika Kirim).
- **Output:** teks respons + kode status (200 = sukses, 504 = timeout, dst).

**Retry:** Jika node gagal, sistem retry otomatis maksimal 3 kali dengan jeda antar-percobaan (exponential backoff: 1s, 2s, 4s). Setelah 3 kali gagal, workflow dihentikan.

---

### `DELAY` — Jeda Waktu

Menahan eksekusi sebelum lanjut ke node berikutnya.

- **Input:** durasi jeda dalam detik (1 - 86400 detik / 24 jam).
- **Output:** tidak ada — hanya efek tunda.

**Catatan teknis:** Delay tidak memblok worker. Sistem menggunakan job scheduling: node berikutnya dijadwalkan otomatis setelah waktu delay berlalu, worker bebas memproses job lain.

---

### `DATA_TRANSFORM` — Transformasi Data

Mengubah atau menggabungkan data dari node sebelumnya menggunakan operasi siap pakai (tanpa menulis kode bebas).

**Dua Mode:**

#### Mode Sederhana

Operasi predefinisi tanpa perlu schema:
- **Teks:** Gabung, Ambil substring, Huruf besar, Huruf kecil, Hapus spasi
- **Matematika:** Tambah, Kurang, Kali, Bagi, Modulo

**Contoh:**

```
Gabung:    ${http-1.body} + " - Status: " + ${http-1.status}
Tambah:    ${http-1.price} + ${http-1.tax}
Huruf besar: ${http-1.message}
```

#### Mode Lanjut

Tulis ekspresi untuk logika kompleks (tanpa menulis kode, tanpa loop).

**Operator yang didukung:**
- **Matematika:** `+`, `-`, `*`, `/`, `%`
- **Perbandingan:** `==`, `!=`, `<`, `>`, `<=`, `>=`
- **Logika:** `&&`, `||`, `!`
- **Kondisional:** `condition ? nilai_true : nilai_false`
- **Akses object:** `${http-1.data.users}`

**Contoh:**

```
${http-1.status} == 200 && ${http-1.data.user_type} == "premium"
  ? "Alert: Pengguna premium aktif"
  : "Pemrosesan standar"
```

**Input References:** Referensi output node sebelumnya menggunakan `${nodeId.field}` syntax.

**Cara Menggunakan:**

1. **Jalankan workflow sekali** (klik “Jalankan Sekarang”)
    - Lihat hasil HTTP_CALL di step log
    - Pahami struktur data response yang sebenarnya
2. **Buka step log** untuk melihat response lengkap:
    
    ```json
    {
      "status": 200,
      "data": {
        "users": 150,
        "plan": "premium",
        "email": "admin@company.com"
      }
    }
    ```
    
3. **Baru desain DATA_TRANSFORM** berdasarkan struktur real:
    
    ```
    ${data.users} > 100 ? "Alert: Banyak pengguna aktif" : "Normal"
    ```
    
4. **Jalankan lagi** untuk test transformasi baru

**Security:** Hanya operasi predefinisi (Mode Sederhana) atau ekspresi (Mode Lanjut) yang diizinkan. Tidak ada eksekusi kode bebas, tidak ada loop, tidak ada akses file system.

**Output:** String, angka, atau boolean (hasil transformasi data).

---

### `CONDITIONAL_BRANCH` — Percabangan Logika

Menentukan arah workflow berikutnya berdasarkan hasil node sebelumnya.

**Operator pembanding:**

| Operator | Untuk | Contoh |
| --- | --- | --- |
| `EQUALS` | nilai persis sama | Status HTTP = 200? |
| `NOT_EQUALS` | nilai tidak sama | Status HTTP ≠ 200? |
| `GREATER_THAN` | angka | Waktu tunggu > 5 detik? |
| `CONTAINS` | substring teks | Isi pesan mengandung “Error”? |

**Jalur keluar (wajib dua-duanya digambar):**

- **If True →** lanjut ke node X.
- **If False →** lanjut ke node Y.

**Catatan:** Hanya satu jalur yang dieksekusi berdasarkan hasil evaluasi kondisi. Node di jalur yang tidak terpilih tidak dijalankan.

**Contoh penerapan:**

```
1. Node 1 (HTTP_CALL) — cek status server
   Output: {status: 200, message: "OK"}

2. Node 2 (CONDITIONAL_BRANCH) — cek apakah Status == 200
   True → Node 3 (DATA_TRANSFORM): buat laporan "Server Aman"
   False → Node 4 (HTTP_CALL): kirim alert ke Discord
```

---

## 4. Alur Kerja End-to-End

### Fase 1 — Membuat Workflow

1. Pengguna (misal dari Tenant A) login dan membuat workflow baru, contoh: “Pengecekan Server Otomatis”.
2. Pengguna menyusun node dari pilihan yang tersedia (HTTP_CALL, DELAY, CONDITIONAL_BRANCH, DATA_TRANSFORM).
3. Node-node disambung dengan panah arah menggunakan visual editor (React Flow).
4. Saat pengguna klik **Simpan**, sistem memvalidasi:
    - Struktur adalah DAG murni (tidak ada siklus)
    - Semua node konfigurasi valid
    - Conditional branch punya 2 jalur output
5. Jika valid, workflow tersimpan sebagai **Versi 1** dengan timestamp.

---

### Fase 2 — Trigger & Antrean

**Manual Trigger:**
- Pengguna klik “Jalankan Sekarang”
- Sistem membuat workflow_run baru (status: pending)
- Enqueue job node pertama ke execution queue

**Scheduled Trigger:**
- Pengguna set jadwal cron (contoh: “0 8 * * MON” = Senin jam 8 pagi)
- Sistem scheduler memantau trigger
- Saat waktu tiba, membuat workflow_run baru
- Enqueue job node pertama ke execution queue

**Note:** Workflow tidak langsung dijalankan, masuk ke antrean dulu — supaya eksekusi tertib meski banyak workflow berjalan bersamaan.

---

### Fase 3 — Eksekusi Step-by-Step & Monitoring Live

Worker mengambil job dari execution queue, lalu menjalankan node satu per satu sesuai arah panah:

**Node sukses:**
- Status di dashboard berubah hijau
- Hasil output disimpan ke step_logs
- Worker enqueue job node berikutnya

**Node gagal (HTTP_CALL saja):**
- Sistem retry otomatis (maksimal 3 kali)
- Jika 3 kali tetap gagal, workflow dihentikan
- Alasan error dicatat di step_logs
- Status di dashboard berubah merah

**Node dengan cabang (CONDITIONAL_BRANCH):**
- Evaluasi kondisi terhadap output node sebelumnya
- Tentukan jalur (True atau False)
- Hanya node di jalur terpilih yang dieksekusi
- Node di jalur lain diabaikan

**Real-Time Monitoring:**
- Dashboard menampilkan progress live via SSE (Server-Sent Events)
- User melihat step mana yang sedang berjalan, sudah selesai, atau gagal
- Step log menampilkan output lengkap (request, response, error messages)

Setelah semua node selesai (atau workflow dihentikan karena gagal), sistem mencatat total durasi eksekusi di workflow_run.

---

### Fase 4 — Viewing Results & Refining Workflow

**Step Logs Dashboard:**
Pengguna dapat melihat hasil eksekusi tiap step:
- Node mana yang dijalankan, kapan, durasi berapa lama
- Input yang dikirim ke node
- Output yang dihasilkan node
- Error messages jika ada

**Contoh step log untuk HTTP_CALL:**

```json
{
  "stepId": "http-1",
  "type": "HTTP_CALL",
  "status": "success",
  "input": {
    "url": "https://api.example.com/users",
    "method": "GET"
  },
  "output": {
    "status": 200,
    "data": {
      "users": 150,
      "plan": "premium",
      "email": "admin@company.com"
    }
  },
  "executedAt": "2024-01-15T08:00:00Z",
  "durationMs": 245
}
```

**Refining DATA_TRANSFORM:**
1. Pengguna lihat output HTTP_CALL di step log
2. Pahami struktur data yang sebenarnya
3. Desain atau update DATA_TRANSFORM node
4. Jalankan workflow lagi untuk test
5. Lihat hasil transformasi di step log

**Analisis Kegagalan Otomatis (Future):**
Jika ada node yang gagal total:
1. Sistem mengirim log error ke asisten AI internal
2. Asisten AI menerjemahkannya jadi penjelasan bahasa manusia
3. Penjelasan ditampilkan di dashboard untuk memandu pengguna

---

## 5. Workflow Version & Rollback

Setiap kali pengguna klik “Simpan” setelah edit, sistem membuat versi baru:
- Versi 1: Workflow awal
- Versi 2: Setelah edit pertama
- Versi 3: Setelah edit kedua
- dst.

Pengguna dapat **rollback ke versi lama** sebelum menjalankan workflow baru. Riwayat run lama tetap menggunakan versi yang mereka jalankan (immutable record).

---

## 6. Execution State & Timeouts

**State Machine Workflow Run:**

```
pending → running → success
              ↓
            failed
```

**Global Timeout:**
Default: 30 menit per workflow run. Jika execution melampaui timeout:
- Stop semua steps yang sedang berjalan
- Mark workflow_run sebagai failed
- Log: “Workflow exceeded 30-minute timeout”
- User dapat override timeout per workflow jika diperlukan

---

## 7. Security & Multi-Tenancy

**Data Isolation:**
- Setiap tenant (organization) punya data terpisah
- Pengguna dari Org A tidak bisa lihat/edit workflow dari Org B
- Enforced di database level (tenant_id foreign key)

**Input Validation:**
- Workflow definition divalidasi saat save (no cycles, valid nodes)
- HTTP_CALL URL divalidasi (prevent injection attacks)
- DATA_TRANSFORM expressions divalidasi (prevent code injection)

**Secrets Management:**
- API keys atau credentials tidak disimpan di workflow definition
- Disimpan terpisah di secrets table (encrypted)
- Hanya didekripsi saat step execution, tidak pernah di-log

---

## 8. Limitations & Considerations

**MVP Scope:**
- Triggers: Manual + Scheduled (Webhook akan ditambah di fase berikutnya)
- No parallel step execution (steps run sequentially)
- No custom node types
- DATA_TRANSFORM tidak punya autocomplete (gunakan step logs untuk lihat struktur data)

**Side Effects:**
- Jika HTTP_CALL punya side effect (buat DB record, kirim email), pastikan idempotent
- Manual trigger menjalankan full workflow, termasuk side effects
- Dokumentasikan dengan jelas setiap external API call