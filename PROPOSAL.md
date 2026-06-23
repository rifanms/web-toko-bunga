# PROPOSAL PENGAJUAN SISTEM INFORMASI TOKO BUNGA BERBASIS WEB
## Amora Craft House — Platform Digital Terintegrasi

---

## HALAMAN JUDUL

**Nama Proyek** : Sistem Informasi & E-Commerce Toko Bunga Berbasis Web  
**Nama Produk** : Amora Craft House Digital Platform  
**Jenis Proposal** : Pengajuan Sistem Informasi Bisnis  
**Tanggal** : Juni 2026  
**Versi** : 1.0  

---

## DAFTAR ISI

1. Latar Belakang
2. Tujuan Pengajuan
3. Deskripsi Sistem
4. Fitur Unggulan
5. Arsitektur & Teknologi
6. Keunggulan Kompetitif
7. Manfaat Bisnis
8. Spesifikasi Teknis
9. Keamanan Sistem
10. Demo & Link Akses
11. Penutup

---

## 1. LATAR BELAKANG

Di era digital yang terus berkembang, pelaku usaha di bidang florikultura (toko bunga) menghadapi tantangan besar dalam mengelola operasional bisnis secara efisien. Permasalahan yang umum dijumpai antara lain:

- **Manajemen pesanan yang tidak terorganisir** — Pesanan diterima melalui berbagai kanal (WhatsApp, telepon, langsung) tanpa sistem terpusat yang menyebabkan pesanan terlewat atau tertukar.
- **Kurangnya transparansi keuangan** — Pemilik usaha kesulitan memantau pendapatan harian, mingguan, maupun bulanan secara real-time.
- **Ketiadaan kontrol absensi** — Tidak ada sistem absensi yang andal dan sulit untuk memverifikasi kehadiran karyawan.
- **Risiko kecurangan internal** — Tanpa sistem audit yang baik, potensi manipulasi data pesanan dan keuangan oleh oknum karyawan sulit terdeteksi.
- **Keterbatasan jangkauan pasar** — Tanpa platform online, toko hanya mampu melayani pelanggan lokal yang datang langsung.

Berdasarkan permasalahan tersebut, diperlukan sebuah **sistem informasi terintegrasi** yang menggabungkan platform e-commerce untuk pelanggan dan dashboard manajemen untuk pengelola usaha.

---

## 2. TUJUAN PENGAJUAN

Proposal ini diajukan dengan tujuan:

1. Memperkenalkan solusi digital komprehensif yang telah dirancang khusus untuk kebutuhan toko bunga.
2. Menyajikan sistem yang **sudah selesai dikembangkan** dan siap digunakan (production-ready).
3. Menawarkan kerjasama implementasi dan lisensi penggunaan sistem kepada perusahaan.
4. Meningkatkan efisiensi operasional, transparansi bisnis, dan kepuasan pelanggan.

---

## 3. DESKRIPSI SISTEM

Sistem ini terdiri dari **tiga komponen utama** yang saling terintegrasi:

### 3.1 Website E-Commerce Pelanggan
Platform belanja online berbasis web yang dapat diakses dari smartphone maupun komputer tanpa perlu mengunduh aplikasi. Pelanggan dapat menjelajahi koleksi bunga, melakukan pemesanan, dan memantau status pesanan secara mandiri.

### 3.2 Dashboard Admin
Panel manajemen untuk staf dan admin toko yang mencakup pengelolaan pesanan, produk, absensi karyawan, dan laporan analitik bisnis.

### 3.3 Dashboard Owner/Pemilik
Panel eksklusif untuk pemilik usaha yang menampilkan pengawasan keuangan, monitoring aktivitas admin, deteksi kecurangan otomatis, dan laporan bisnis lengkap.

---

## 4. FITUR UNGGULAN

### 🛍️ Website E-Commerce Pelanggan
| Fitur | Deskripsi |
|-------|-----------|
| Katalog Produk Interaktif | Tampilan 3D flip card — foto depan & foto detail hover |
| Filter & Pencarian | Filter berdasarkan kategori (Bridal, Events, Gifting, Luxury, dll) |
| Keranjang Belanja | Keranjang dengan kuantitas +/-, tersimpan otomatis |
| Checkout Terintegrasi | Form pemesanan lengkap dengan pilihan metode pembayaran |
| Multi Pembayaran | Transfer Bank (BCA, Mandiri), GoPay, DANA, OVO, COD |
| Instruksi Pembayaran | Panduan pembayaran otomatis sesuai metode yang dipilih |
| Konfirmasi WhatsApp | Satu klik konfirmasi pesanan langsung ke WhatsApp toko |
| Lacak Pesanan | Pelanggan dapat cek status pesanan via nomor order atau HP |
| Responsif Mobile | Tampilan optimal di semua ukuran layar HP |
| Marquee Promo | Banner berjalan otomatis untuk informasi layanan |

### 📋 Dashboard Admin
| Fitur | Deskripsi |
|-------|-----------|
| Manajemen Pesanan | CRUD pesanan, update status, filter tanggal, export CSV |
| Notifikasi Real-time | Pop-up notifikasi otomatis saat ada pesanan baru masuk |
| Manajemen Produk | Tambah/edit/hapus produk, upload foto langsung ke cloud |
| Absensi Karyawan | Sistem absensi dengan foto selfie real-time + watermark timestamp |
| Anti-Kecurangan Absensi | Foto hanya bisa diambil dari kamera langsung (galeri diblokir) |
| Analitik Bisnis | Line chart pendapatan & pesanan harian, tren per produk |
| Audit Trail | Setiap tindakan admin tercatat otomatis dengan risk scoring |

### 👑 Dashboard Owner/Pemilik
| Fitur | Deskripsi |
|-------|-----------|
| Monitor Pesanan Live | Pantau semua pesanan masuk, status konfirmasi admin, alert keterlambatan |
| Pengawasan Keuangan | Grafik pendapatan, perbandingan periode, deteksi anomali keuangan |
| Audit Log Live | Feed real-time setiap aktivitas admin dengan skor risiko |
| Deteksi Fraud Otomatis | AI rule-based mendeteksi lompatan status, refund mencurigakan, aktivitas jam tidak wajar |
| Analitik Per Admin | Health score, jumlah tindakan mencurigakan, rata-rata risk score tiap admin |
| Monitor Absensi | Pantau kehadiran karyawan real-time, lihat foto absensi |
| Foto Absensi | Pemilik dapat melihat foto selfie absensi karyawan lengkap dengan watermark |

---

## 5. ARSITEKTUR & TEKNOLOGI

### Frontend (Antarmuka Pengguna)
- **Website Pelanggan** : HTML5, CSS3, Vanilla JavaScript — ringan, cepat, tanpa dependency besar
- **Dashboard Admin/Owner** : React 18 + TypeScript + Vite + Tailwind CSS

### Backend & Database
- **Database** : PostgreSQL (via Supabase) — database enterprise-grade dengan enkripsi
- **Authentication** : Supabase Auth — JWT-based, aman
- **Real-time** : Supabase Realtime (WebSocket) — update instan tanpa refresh
- **File Storage** : Supabase Storage — penyimpanan foto absensi & produk di cloud

### Deployment & Infrastruktur
- **Hosting** : Vercel (CDN global, uptime 99.99%)
- **Database Hosting** : Supabase Cloud (AWS ap-northeast-2)
- **SSL/HTTPS** : Otomatis, semua komunikasi terenkripsi
- **Version Control** : GitHub (backup kode otomatis)

### Diagram Arsitektur
```
Pelanggan → Website (Vercel CDN)
                    ↓
Admin/Owner → Dashboard (Vercel CDN)
                    ↓
            Supabase (PostgreSQL + Auth + Storage + Realtime)
                    ↓
            AWS Cloud Infrastructure
```

---

## 6. KEUNGGULAN KOMPETITIF

### Dibanding Solusi Manual (WhatsApp/Buku Catatan)
| Aspek | Manual | Sistem Ini |
|-------|--------|------------|
| Pencatatan Pesanan | Rawan salah/hilang | Otomatis, tersimpan permanen |
| Rekap Keuangan | Hitungan manual | Otomatis real-time |
| Absensi | Buku tanda tangan | Foto selfie + GPS + timestamp |
| Kecepatan Respon | Lambat | Notifikasi instan |
| Laporan Bisnis | Tidak ada | Dashboard lengkap |

### Dibanding Marketplace (Tokopedia/Shopee)
| Aspek | Marketplace | Sistem Ini |
|-------|------------|------------|
| Komisi | 2-15% per transaksi | Tidak ada |
| Branding | Terbatas | Penuh milik sendiri |
| Data Pelanggan | Dimiliki marketplace | Dimiliki toko sendiri |
| Kustomisasi | Sangat terbatas | Bebas sesuai kebutuhan |
| Kontrol Harga | Kompetisi ketat | Bebas |

---

## 7. MANFAAT BISNIS

### Efisiensi Operasional
- ⏱️ Hemat **2-4 jam/hari** untuk rekap pesanan dan laporan
- 📱 Konfirmasi pesanan dari mana saja via smartphone
- 🔄 Sinkronisasi data otomatis antara kasir, admin, dan pemilik

### Peningkatan Pendapatan
- 🌐 Jangkauan pelanggan lebih luas (online 24/7)
- 🛒 Keranjang belanja meningkatkan nilai rata-rata pesanan
- 📊 Analitik membantu identifikasi produk terlaris & waktu peak

### Keamanan & Kontrol
- 🔒 Setiap tindakan admin tercatat, tidak bisa dihapus
- 📸 Absensi dengan foto real-time, tidak bisa dimanipulasi
- 🚨 Alert otomatis jika ada aktivitas mencurigakan
- 👁️ Pemilik bisa pantau bisnis kapanpun dari mana saja

### Kepuasan Pelanggan
- ✅ Pelanggan bisa order kapan saja (24/7)
- 📍 Lacak pesanan sendiri tanpa perlu tanya ke toko
- 💬 Konfirmasi instan via WhatsApp
- 🎨 Tampilan premium meningkatkan kepercayaan pelanggan

---

## 8. SPESIFIKASI TEKNIS

### Persyaratan Minimum Pengguna
| Perangkat | Spesifikasi |
|-----------|-------------|
| Smartphone | Android 8+ / iOS 12+ dengan browser Chrome/Safari |
| Komputer Admin | Browser modern (Chrome, Firefox, Edge) |
| Koneksi Internet | Minimal 3G / WiFi |
| Kamera (Absensi) | Kamera depan smartphone (untuk selfie absensi) |

### Kapasitas Sistem
- **Produk** : Tidak terbatas
- **Pesanan** : Tidak terbatas (PostgreSQL enterprise)
- **Foto Absensi** : Penyimpanan cloud Supabase (1GB gratis)
- **User Admin** : Tidak terbatas
- **Concurrent Users** : 1.000+ pengguna bersamaan

### Uptime & Keandalan
- **SLA** : 99.9% uptime (Vercel + Supabase)
- **Backup** : Otomatis harian
- **Recovery** : Point-in-time recovery tersedia

---

## 9. KEAMANAN SISTEM

Sistem ini dibangun dengan standar keamanan enterprise:

1. **Enkripsi End-to-End** : Semua data dienkripsi dengan SSL/TLS 1.3
2. **Row Level Security (RLS)** : Setiap user hanya bisa akses data yang diizinkan
3. **JWT Authentication** : Token berbasis JSON Web Token dengan expiry otomatis
4. **Audit Trail Permanen** : Semua aksi admin tercatat, tidak bisa diedit/dihapus
5. **Anti-Fraud System** : Scoring otomatis untuk deteksi aktivitas mencurigakan
6. **Foto Anti-Kecurangan** : Absensi hanya dari kamera langsung + watermark timestamp
7. **Role-based Access** : Admin dan Owner memiliki hak akses berbeda
8. **Input Validation** : Semua input divalidasi untuk mencegah SQL injection dan XSS

---

## 10. DEMO & LINK AKSES

### Akses Langsung (Sudah Live)

| Platform | URL |
|----------|-----|
| 🌸 **Website Pelanggan** | https://web-toko-bunga-hz3qdajdn-rms190502.vercel.app |
| 🔐 **Dashboard Admin** | https://dashboard-admin-toko-bunga-i6tlfn5eu-rms190502.vercel.app |
| 🗄️ **Database (Supabase)** | https://supabase.com/dashboard/project/hqhljpplpwqxzldbfyny |

### Akun Demo
Akun demo dapat disediakan atas permintaan untuk keperluan evaluasi.

### Kode Sumber (GitHub)
| Repository | URL |
|------------|-----|
| Website Pelanggan | https://github.com/rifanms/web-toko-bunga |
| Dashboard Admin | https://github.com/rifanms/dashboard-admin-toko-bunga |

---

## 11. RINCIAN PAKET & INVESTASI

### Paket yang Ditawarkan

**Paket A — Lisensi Penggunaan**
- Hak penggunaan sistem selama 1 tahun
- Konfigurasi branding (nama toko, warna, logo)
- Training penggunaan untuk admin & owner
- Support teknis selama 3 bulan

**Paket B — Pengembangan Lanjutan**
- Semua fitur Paket A
- Kustomisasi fitur sesuai kebutuhan spesifik perusahaan
- Integrasi dengan sistem yang sudah ada
- Support teknis selama 12 bulan
- Pembaruan fitur berkala

*Rincian harga dapat didiskusikan lebih lanjut sesuai kebutuhan dan skala bisnis perusahaan.*

---

## 12. PENUTUP

Sistem informasi ini telah berhasil dikembangkan secara lengkap dan telah melewati proses pengujian menyeluruh. Seluruh fitur — mulai dari e-commerce pelanggan, manajemen pesanan, sistem absensi anti-kecurangan, hingga dashboard monitoring owner — telah berfungsi dengan baik dan siap digunakan.

Kami meyakini bahwa implementasi sistem ini akan memberikan nilai tambah yang signifikan bagi perusahaan, baik dari sisi efisiensi operasional, keamanan bisnis, maupun kepuasan pelanggan.

Kami terbuka untuk diskusi lebih lanjut, demonstrasi langsung, maupun penyesuaian sistem sesuai kebutuhan spesifik perusahaan Anda.

---

**Hormat kami,**

**Pengembang Sistem**  
Amora Craft House Digital Platform  
Email: rifanms@users.noreply.github.com  
GitHub: https://github.com/rifanms  

---

*Dokumen ini bersifat rahasia dan hanya diperuntukkan bagi pihak yang dituju.*  
*© 2026 Amora Craft House. Hak cipta dilindungi undang-undang.*
