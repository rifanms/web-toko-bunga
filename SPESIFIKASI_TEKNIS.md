# SPESIFIKASI TEKNIS
## Platform Digital Amora Craft House

---

**Nama Proyek** : Amora Craft House — Sistem Informasi Toko Bunga Terintegrasi  
**Pengembang** : Rifan Muhamad Supriatna  
**Tanggal Dokumen** : Juni 2026  
**Versi** : 1.0

---

## 1. FRONTEND

### 1.1 Website E-Commerce Pelanggan

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| Markup | **HTML5** | Struktur halaman semantik, accessibility compliant |
| Styling | **CSS3** | Custom properties (CSS Variables), Flexbox, CSS Grid, animasi native |
| Logic | **Vanilla JavaScript (ES2022+)** | Tidak menggunakan framework — ringan dan cepat |
| Font | **Google Fonts** | Dancing Script (logo), Cormorant Garamond (judul), DM Sans (body) |
| Animasi | **CSS Keyframes + JS RAF** | Marquee, 3D flip card, float animation |
| Icons | **Emoji Native** | Tidak ada dependency icon library |
| Realtime | **Supabase JS SDK v2** | WebSocket untuk update produk real-time |
| Efek Produk | **CSS 3D Transform** | Perspektif flip card dengan dua sisi foto |

**Fitur Teknis Utama:**
- Responsive design (mobile-first) dengan breakpoint 680px dan 980px
- Cart persisten menggunakan `localStorage`
- Lazy loading gambar produk
- Rate limiting client-side untuk form order
- XSS protection via fungsi `escHtml()` custom
- Content Security Policy via meta tag

---

### 1.2 Dashboard Admin & Owner

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| Framework | **React 18** | Component-based UI dengan hooks |
| Bahasa | **TypeScript 5** | Type-safe, mengurangi runtime error |
| Build Tool | **Vite 5** | HMR cepat, bundle optimal |
| Styling | **Tailwind CSS 3** | Utility-first, dark theme |
| Icons | **Lucide React** | Consistent icon set |
| State | **React Hooks** | useState, useEffect, useCallback, useRef |
| Realtime | **Supabase Realtime** | WebSocket subscription untuk pesanan & audit log |
| Chart | **SVG Custom** | Line chart buatan sendiri, tidak ada dependency chart library |
| Kamera | **MediaDevices API** | getUserMedia() — akses kamera langsung browser |
| Canvas | **HTML5 Canvas API** | Render watermark pada foto absensi |

**Fitur Teknis Utama:**
- Role-based rendering (Admin vs Owner tampilan berbeda)
- Realtime notification pesanan baru
- Foto absensi dengan watermark anti-kecurangan
- Audit trail immutable
- Fraud detection dengan risk scoring

---

## 2. BACKEND

Sistem ini menggunakan arsitektur **Backend-as-a-Service (BaaS)** — tidak ada server backend custom yang perlu dikelola.

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| BaaS Provider | **Supabase** | Platform open-source berbasis PostgreSQL |
| Authentication | **Supabase Auth** | JWT-based, auto refresh token, session management |
| REST API | **PostgREST** | Auto-generated REST API dari skema database |
| Realtime | **Supabase Realtime** | Built on top of Phoenix Channels (Elixir) |
| Edge Functions | **Deno (opsional)** | Untuk logika server-side jika diperlukan |
| File Storage | **Supabase Storage** | S3-compatible object storage |
| Row Level Security | **PostgreSQL RLS** | Kebijakan akses data di level database |

**Keuntungan Arsitektur BaaS:**
- Tidak perlu manage server
- Auto scaling
- Built-in security layer
- Biaya operasional rendah

---

## 3. DATABASE

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| DBMS | **PostgreSQL 15** | Database relasional enterprise-grade |
| Provider | **Supabase Cloud** | Managed PostgreSQL di AWS |
| Region | **ap-northeast-2** | AWS Seoul — latency optimal untuk Indonesia |
| ORM | **PostgREST / Supabase JS** | Query builder via SDK |

### Skema Tabel

| Tabel | Fungsi | Baris Estimasi |
|-------|--------|----------------|
| `products` | Data produk toko | ~50-500 |
| `payment_methods` | Metode pembayaran | ~5-10 |
| `orders` | Pesanan pelanggan | Tidak terbatas |
| `order_items` | Detail item per pesanan | Tidak terbatas |
| `attendance` | Data absensi karyawan | ~365 x jumlah karyawan/tahun |
| `audit_logs` | Log setiap aktivitas admin | Tidak terbatas (immutable) |
| `admin_roles` | Hak akses pengguna (admin/owner) | ~5-20 |

### Fitur Database
- **Row Level Security (RLS)** aktif di semua tabel
- **CHECK Constraints** untuk validasi data di level DB
- **Triggers** untuk auto-update `updated_at`
- **Publication** untuk Supabase Realtime
- **Indexes** untuk query cepat pada kolom yang sering difilter
- Tabel `audit_logs` di-REVOKE UPDATE/DELETE — data tidak bisa dimanipulasi

---

## 4. HOSTING

| Komponen | Provider | Keterangan |
|----------|----------|------------|
| **Website Pelanggan** | **Vercel** | Static hosting dengan CDN global |
| **Dashboard Admin/Owner** | **Vercel** | SPA hosting dengan edge network |
| **Database** | **Supabase Cloud (AWS)** | Managed PostgreSQL |
| **File Storage** | **Supabase Storage** | Foto absensi & produk |
| **CDN** | **Vercel Edge Network** | 100+ PoP worldwide |

### Spesifikasi Hosting Vercel (Free Tier)
| Fitur | Nilai |
|-------|-------|
| Bandwidth | 100 GB/bulan |
| Deployments | Tidak terbatas |
| HTTPS | Otomatis (Let's Encrypt) |
| Uptime SLA | 99.99% |
| Build Time | 6.000 menit/bulan |
| Serverless Functions | 100 GB-jam/bulan |

### Spesifikasi Supabase (Free Tier)
| Fitur | Nilai |
|-------|-------|
| Database Size | 500 MB |
| File Storage | 1 GB |
| Bandwidth | 5 GB/bulan |
| Monthly Active Users | 50.000 |
| Realtime Connections | 200 concurrent |

*Untuk skala bisnis yang lebih besar, upgrade ke paket berbayar tersedia mulai $25/bulan.*

---

## 5. DOMAIN

### Status Saat Ini
Saat ini menggunakan subdomain gratis dari Vercel:

| Platform | URL |
|----------|-----|
| Website Pelanggan | `web-toko-bunga-[hash]-rms190502.vercel.app` |
| Dashboard Admin | `dashboard-admin-toko-bunga-[hash]-rms190502.vercel.app` |

### Rekomendasi Domain Custom

Untuk tampilan profesional, disarankan menggunakan domain custom:

| Opsi Domain | Estimasi Harga/Tahun | Rekomendasi |
|-------------|---------------------|-------------|
| `amoracrafthouse.com` | Rp 150.000 - 200.000 | ⭐ Direkomendasikan |
| `amoracrafthouse.id` | Rp 200.000 - 300.000 | Untuk branding lokal |
| `amora-flowers.com` | Rp 150.000 - 200.000 | Alternatif |

**Registrar Domain Rekomendasi:**
- **Niagahoster** (Indonesia) — support bahasa Indonesia
- **Namecheap** (Internasional) — harga kompetitif
- **Cloudflare Registrar** — at-cost pricing + free DDoS protection

### Cara Menghubungkan Domain ke Vercel
1. Beli domain di registrar pilihan
2. Buka Vercel Dashboard → Project Settings → Domains
3. Tambahkan domain custom
4. Update DNS Record di registrar:
   ```
   Type: CNAME
   Name: www (atau @)
   Value: cname.vercel-dns.com
   ```
5. SSL/HTTPS otomatis aktif dalam ~5 menit

---

## 6. RINGKASAN STACK TEKNOLOGI

```
┌─────────────────────────────────────────────────────────┐
│                     KLIEN (Browser)                      │
│  Web Pelanggan          │    Dashboard Admin/Owner        │
│  HTML + CSS + JS        │    React + TypeScript + Vite   │
│  Vanilla / No Framework │    Tailwind CSS                 │
└──────────────┬──────────┴──────────────┬────────────────┘
               │                          │
               ▼                          ▼
┌─────────────────────────────────────────────────────────┐
│                    VERCEL CDN / EDGE                     │
│              Static Hosting + SSL + HTTP/2               │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE PLATFORM                     │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Auth (JWT) │  │  REST API    │  │   Realtime    │  │
│  │  Sessions   │  │  PostgREST   │  │   WebSocket   │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │         PostgreSQL 15 (AWS ap-northeast-2)       │    │
│  │  Row Level Security │ Triggers │ Constraints     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Supabase Storage (S3)               │    │
│  │      Foto Absensi │ Foto Produk                  │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 7. KEAMANAN TEKNIS

| Layer | Implementasi |
|-------|-------------|
| Transport | HTTPS/TLS 1.3 (otomatis Vercel) |
| Authentication | JWT dengan refresh token otomatis |
| Authorization | Role-based (admin/owner) + RLS PostgreSQL |
| Input Validation | Client-side (JS) + Server-side (DB constraints) |
| XSS Prevention | `escHtml()` + Content Security Policy headers |
| CSRF | Same-origin policy + JWT stateless |
| Rate Limiting | Client-side rate limiter per endpoint |
| Audit | Immutable audit log — REVOKE UPDATE/DELETE |
| Storage | Bucket policy RLS untuk foto |
| Headers | X-Frame-Options, X-XSS-Protection, HSTS, Referrer-Policy |

---

*Dokumen ini dibuat sebagai referensi teknis resmi untuk proyek Amora Craft House Digital Platform.*  
*© 2026 Rifan Muhamad Supriatna. Semua hak dilindungi.*
