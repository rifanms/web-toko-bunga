## **PROPOSAL PENAWARAN WEBSITE** 

## **SISTEM WEBSITE TOKO BUNGA / FLORIST** 

**Diajukan oleh: Rifan Muhamad Supriatna 0838 2909 2027 rifanmuchtarsupriatna@gmail.com** 

**Ditujukan kepada: Amora Craft House** 

## **BAB I** 

## **1.1. PENDAHULUAN** 

Di era digital saat ini, perkembangan teknologi informasi telah menjadi salah satu faktor penting dalam mendukung pertumbuhan dan efisiensi operasional sebuah usaha. Tidak hanya perusahaan besar, usaha skala kecil dan menengah seperti toko bunga juga mulai membutuhkan sistem digital yang mampu membantu proses bisnis agar lebih tertata, cepat, dan profesional. Pengelolaan usaha yang masih dilakukan secara manual sering kali menimbulkan berbagai kendala, seperti pencatatan pesanan yang kurang rapi, kesulitan memantau penjualan, keterlambatan dalam proses pelayanan, serta terbatasnya akses pemilik usaha dalam melihat perkembangan bisnis secara real time. 

Sebagai salah satu jenis usaha yang bergerak di bidang produk kreatif dan pelayanan pelanggan, toko bunga memiliki kebutuhan operasional yang cukup dinamis. Proses pengelolaan produk, pencatatan pesanan pelanggan, pemantauan pembayaran, pengaturan status pesanan, hingga pelaporan penjualan merupakan bagian penting yang perlu dikelola secara baik agar kegiatan usaha berjalan lebih efektif. 

Berdasarkan kebutuhan tersebut, kami menawarkan jasa pembuatan Sistem Website Toko Bunga yang dirancang untuk membantu digitalisasi proses operasional usaha secara lebih terstruktur. Sistem ini tidak hanya berfungsi sebagai media pengelolaan data dan pemantauan pesanan, tetapi juga dapat dikembangkan menjadi sarana pengawasan usaha melalui dashboard admin dan dashboard owner. Dengan adanya sistem ini, proses administrasi dan pengelolaan bisnis diharapkan menjadi lebih efisien, data lebih tertata, serta pengambilan keputusan usaha dapat dilakukan dengan lebih cepat berdasarkan informasi yang tersedia pada sistem. 

Proposal ini disusun sebagai bentuk penawaran kerja sama dalam pengembangan website toko bunga yang dapat disesuaikan dengan kebutuhan dan skala usaha klien. Kami menyediakan beberapa pilihan paket pengembangan, mulai dari paket standar, paket premium, hingga skema tahunan, sehingga klien dapat memilih solusi yang paling sesuai dengan kebutuhan operasional dan anggaran yang dimiliki. 

Melalui proposal ini, kami berharap dapat memberikan solusi digital yang tidak hanya membantu pengelolaan usaha sehari-hari, tetapi juga mendukung peningkatan kualitas layanan, efisiensi kerja, dan citra profesional usaha di mata pelanggan. 

## **1.2. TUJUAN PEMBUATAN WEBSITE** 

Adapun tujuan dari pembuatan sistem website ini adalah sebagai berikut: 

1. Mempermudah pengelolaan produk bunga dan kategori produk. 

2. Mempermudah pencatatan dan pengelolaan pesanan pelanggan. 

3. Menyediakan dashboard penjualan dan ringkasan data operasional. 

4. Membantu pemilik usaha memantau perkembangan bisnis melalui panel owner. 

5. Meningkatkan profesionalitas usaha melalui sistem digital yang rapi dan modern. 

6. Menyediakan sistem yang dapat dikembangkan sesuai kebutuhan usaha ke depannya. 

## **1.3. RUANG LINGKUP SISTEM** 

Sistem website toko bunga yang ditawarkan mencakup pengembangan website berbasis web dengan fitur operasional dan administrasi, antara lain: 

- Dashboard admin 

- Pengelolaan data pesanan 

- Pengelolaan data produk 

- Pengelolaan kategori produk 

- Dashboard ringkasan penjualan 

- Panel owner / pemilik usaha 

- Laporan penjualan 

- Absensi karyawan 

- Pengembangan tampilan sesuai kebutuhan paket 

- Pengembangan tambahan sesuai ruang lingkup yang disepakati 

Fitur detail dapat berbeda menyesuaikan paket yang dipilih. 

## **BAB II** 

## **2.1. SPESIFIKASI TEKNIS SISTEM** 

Sistem website toko bunga ini dibangun menggunakan teknologi modern yang telah teruji, dengan rincian sebagai berikut: 

**1. Frontend (Antarmuka Pengguna)** 

- **Website Pelanggan:** HTML5, CSS3, JavaScript (Vanilla ES2022+) — tanpa framework berat agar halaman ringan dan cepat dimuat bahkan pada koneksi 3G 
- **Dashboard Admin & Owner:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3 — antarmuka responsif, modern, dan bebas lag 
- **Fitur Tambahan:** Animasi CSS 3D, efek flip card produk, Google Fonts (Dancing Script, Cormorant Garamond, DM Sans), Canvas API untuk watermark foto absensi 

**2. Backend (Logika Sistem)** 

- **Platform:** Supabase (Backend-as-a-Service berbasis open-source) — tidak memerlukan server backend terpisah 
- **Authentication:** Supabase Auth dengan JWT (JSON Web Token) — login aman dengan refresh token otomatis 
- **API:** PostgREST (REST API otomatis dari skema database) — tidak perlu menulis API manual 
- **Realtime:** Supabase Realtime berbasis WebSocket — perubahan data (pesanan masuk, status absensi) langsung terlihat tanpa refresh 
- **File Storage:** Supabase Storage (S3-compatible) — penyimpanan foto absensi karyawan dan foto produk di cloud 

**3. Database** 

- **DBMS:** PostgreSQL 15 — database relasional enterprise-grade yang digunakan oleh ribuan perusahaan global 
- **Provider:** Supabase Cloud, berjalan di infrastruktur AWS Asia Pasifik (ap-northeast-2, Seoul) — latensi optimal untuk pengguna di Indonesia 
- **Keamanan Database:** Row Level Security (RLS) aktif di semua tabel, CHECK Constraints untuk validasi data, Triggers untuk pembaruan otomatis, tabel Audit Log bersifat immutable (tidak dapat diubah atau dihapus oleh siapapun) 
- **Tabel Utama:** products, orders, order_items, attendance, audit_logs, admin_roles, payment_methods 

**4. Hosting** 

- **Platform:** Vercel — hosting modern dengan CDN global (100+ titik distribusi di seluruh dunia) 
- **SSL/HTTPS:** Aktif otomatis di seluruh platform tanpa biaya tambahan 
- **Uptime:** Dijamin 99,99% berdasarkan SLA Vercel 
- **Kapasitas Awal (Free Tier):** Bandwidth 100 GB/bulan, storage cukup untuk operasional skala UKM 
- **Biaya Operasional:** Rp 350.000/bulan mencakup hosting Vercel dan database Supabase 
- **Upgrade tersedia** jika bisnis berkembang dan membutuhkan kapasitas lebih besar 

**5. Domain** 

- **Saat ini:** Subdomain gratis dari Vercel (contoh: `amoracrafthouse.vercel.app`) 
- **Rekomendasi domain custom:** 
  - `amoracrafthouse.com` — estimasi Rp 150.000–200.000/tahun 
  - `amoracrafthouse.id` — estimasi Rp 200.000–300.000/tahun (branding lokal) 
- **Registrar yang direkomendasikan:** Niagahoster (Indonesia, support lokal) atau Namecheap (internasional, harga kompetitif) 
- **Koneksi domain ke sistem:** Proses mudah melalui Vercel Dashboard, SSL aktif otomatis dalam ±5 menit setelah domain terhubung 

---

## **2.2. PILIHAN PAKET PENAWARAN** 

## **1) PAKET STANDAR** 

Paket ini cocok untuk usaha toko bunga yang membutuhkan sistem website operasional dengan fitur utama untuk membantu pengelolaan penjualan dan administrasi dasar. 

## **Fitur yang termasuk:** 

- Dashboard admin 

- Manajemen pesanan 

- Manajemen produk 

- Manajemen kategori produk 

- Ringkasan data penjualan sederhana 

- Tampilan website/admin dengan penyesuaian dasar 

- Pengujian sistem sebelum serah terima 

- Bantuan instalasi / implementasi awal 

## **Ketentuan Paket Standar:** 

- Pengembangan berdasarkan kebutuhan dasar operasional toko bunga 

- Penyesuaian tampilan bersifat standar 

- Tidak termasuk penambahan fitur besar di luar ruang lingkup awal 

- Revisi minor mengikuti kesepakatan selama masa pengerjaan 

## **2) PAKET PREMIUM** 

Paket ini cocok untuk usaha yang menginginkan sistem website yang lebih lengkap, tampilan lebih eksklusif, dan pengembangan yang lebih menyesuaikan kebutuhan bisnis. 

## **Fitur yang termasuk:** 

- Seluruh fitur pada Paket Standar 

- Dashboard owner / pemilik usaha 

- Analitik / laporan yang lebih lengkap 

- Penyesuaian desain, warna, dan identitas visual sesuai brand usaha 

- Pengembangan fitur tambahan sesuai kebutuhan yang disepakati di awal proyek 

- Penyesuaian alur kerja sistem agar lebih sesuai dengan operasional usaha 

- Prioritas dalam proses pengembangan dibanding paket standar 

## **Ketentuan Paket Premium:** 

- Penambahan fitur mengikuti daftar kebutuhan yang disepakati di awal pengerjaan 

- Request penambahan besar di luar kesepakatan awal dapat dikenakan biaya tambahan 

- Cocok untuk usaha yang membutuhkan sistem lebih fleksibel, eksklusif, dan siap dikembangkan 

## **3) PAKET TAHUNAN / BERLANGGANAN** 

Paket ini ditujukan bagi klien yang ingin menggunakan sistem website dengan skema berlangganan tahunan tanpa harus membeli sistem secara putus. 

## **Fasilitas Paket Tahunan:** 

- Hak penggunaan sistem website selama 1 tahun 

- Dashboard admin dan fitur utama operasional 

- Bantuan pemeliharaan teknis dasar selama masa aktif 

- Penanganan bug/error teknis pada sistem 

- Penyesuaian minor jika diperlukan dan masih dalam ruang lingkup sistem yang tersedia 

## **Ketentuan Paket Tahunan:** 

- Biaya dibayarkan per tahun 

- Hak penggunaan sistem berlaku selama masa langganan aktif 

- Pengembangan fitur baru di luar sistem utama dapat dikenakan biaya tambahan 

- Apabila masa langganan berakhir, penggunaan sistem mengikuti ketentuan kerja sama yang berlaku 

## **4) BIAYA HOSTING** 

## Biaya hosting **ditanggung oleh pihak klien** dengan rincian sebagai berikut: 

- **Hosting: Rp 350.000 / bulan** 

Catatan: 

- Hosting digunakan untuk kebutuhan penyimpanan file website, database, dan publikasi website secara online. 

- Jika diperlukan domain, SSL, email bisnis, atau kapasitas hosting lebih besar, maka biayanya akan disesuaikan dengan kebutuhan klien. 

## **BAB III** 

## **3.1. FRONT END (DEPAN)** 

Berikut adalah halaman dan fitur yang tersedia pada sisi depan (antarmuka pengguna/pelanggan): 

| **Halaman / Fitur** | **Keterangan** |
|---------------------|----------------|
| Beranda | Halaman utama yang menampilkan koleksi bunga unggulan, marquee promo, fitur layanan, dan tombol aksi utama |
| Profil Perusahaan | Sejarah Amora Craft House, visi, misi, dan informasi perusahaan lengkap dengan foto |
| Produk / Layanan | Katalog produk bunga dengan efek 3D flip card — foto depan dan foto detail, filter kategori (Bridal, Events, Gifting, Luxury, Subscription) |
| Galeri | Foto produk dan dokumentasi rangkaian bunga ditampilkan pada setiap card produk |
| Kontak | Formulir kontak yang terhubung langsung ke WhatsApp toko, beserta informasi alamat dan nomor telepon |
| Lacak Pesanan | Pelanggan dapat mengecek status pesanan menggunakan nomor order atau nomor HP secara mandiri |
| Keranjang Belanja | Pengelolaan item belanja dengan fitur tambah, kurang, hapus item, dan checkout terintegrasi |
| Checkout & Pembayaran | Formulir pemesanan lengkap dengan pilihan metode pembayaran (Transfer Bank, GoPay, DANA, OVO, COD) dan panduan pembayaran otomatis |

&nbsp;

## **3.2. BACK END (BELAKANG)** 

Berikut adalah halaman dan fitur yang tersedia pada sisi belakang (pengelolaan sistem): 

| **Halaman / Fitur** | **Keterangan** |
|---------------------|----------------|
| Admin Panel (Login) | Halaman login dengan autentikasi JWT — admin dan owner memiliki tampilan dashboard berbeda sesuai hak akses |
| Manage Pesanan | Pengelolaan seluruh pesanan masuk: update status, filter tanggal, pencarian, export CSV |
| Manage Produk | Tambah, edit, hapus produk dengan upload foto langsung ke cloud storage |
| Manage Absensi | Sistem absensi karyawan berbasis foto selfie real-time dengan watermark timestamp anti-kecurangan |
| Dashboard Analitik | Grafik line chart pendapatan harian, pesanan harian, dan tren penjualan per produk |
| Panel Owner | Dashboard khusus pemilik: monitor pesanan live, pengawasan keuangan, audit log, deteksi kecurangan otomatis |
| Manage User & Role | Pengelolaan akun admin dan owner dengan sistem role-based access control |
| Audit Log | Pencatatan setiap tindakan admin secara otomatis — permanen dan tidak dapat dimanipulasi |
| Logout | Sesi berakhir dengan aman, token dibersihkan otomatis |

&nbsp;

## **BAB IV** 

## **4.1. SPESIFIKASI TEKNIS** 

**1. Frontend**

- **Website Pelanggan:** HTML5, CSS3, JavaScript (Vanilla ES2022+) — ringan, cepat, tanpa framework berat
- **Dashboard Admin & Owner:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3
- **Fitur Tambahan:** CSS 3D Transform (flip card), Canvas API (watermark absensi), Google Fonts, Lucide Icons

**2. Backend**

- **Platform:** Supabase (Backend-as-a-Service) — tidak memerlukan server backend terpisah
- **Authentication:** Supabase Auth dengan JWT — login aman, refresh token otomatis
- **API:** PostgREST (REST API otomatis dari skema database)
- **Realtime:** WebSocket via Supabase Realtime — update data instan tanpa refresh
- **Storage:** Supabase Storage (S3-compatible) — penyimpanan foto absensi dan produk di cloud

**3. Database**

- **DBMS:** PostgreSQL 15 — database relasional enterprise-grade
- **Provider:** Supabase Cloud (AWS ap-northeast-2, Seoul) — latensi optimal untuk Indonesia
- **Keamanan:** Row Level Security (RLS), CHECK Constraints, Immutable Audit Log
- **Tabel Utama:** `products`, `orders`, `order_items`, `attendance`, `audit_logs`, `admin_roles`, `payment_methods`

**4. Hosting**

- **Platform:** Vercel — CDN global, HTTPS otomatis, uptime 99,99%
- **Database:** Supabase Cloud — managed PostgreSQL dengan backup otomatis
- **Biaya Operasional:** Rp 350.000/bulan (sudah termasuk hosting dan database)

**5. Domain**

- **Saat ini:** Subdomain gratis Vercel
- **Rekomendasi custom domain:** `amoracrafthouse.com` atau `amoracrafthouse.id`
- **Estimasi harga domain:** Rp 150.000–300.000/tahun (tergantung ekstensi)
- **Registrar rekomendasi:** Niagahoster (Indonesia) atau Namecheap (internasional)
- **SSL:** Aktif otomatis dalam ±5 menit setelah domain terhubung

&nbsp;

## **BAB V** 

## **5.1. KETENTUAN PENGEMBANGAN** 

- 1) Sistem akan dikembangkan berdasarkan paket yang dipilih oleh klien. 

- 2) Fitur di luar ruang lingkup paket akan dibicarakan dan dihitung sebagai pengembangan tambahan. 

- 3) Penyesuaian desain, alur kerja, dan fitur tambahan akan menyesuaikan hasil diskusi awal dengan klien. 

- 4) Hosting dan kebutuhan teknis pihak ketiga menjadi tanggungan klien, kecuali disepakati lain. 

- 5) Proses pengerjaan akan dimulai setelah kesepakatan kerja sama dan pembayaran awal diterima. 

- 6) Estimasi waktu pengerjaan akan disesuaikan dengan tingkat kompleksitas sistem dan paket yang dipilih. 

## **BAB VI** 

## **6.1. SKEMA PEMBAYARAN** 

Skema pembayaran dapat menggunakan ketentuan berikut: 

## **Untuk Paket Standar / Premium:** 

- **50%** pembayaran di awal sebagai tanda jadi dan dimulainya proses pengerjaan 

- **50%** pelunasan setelah sistem selesai / sebelum serah terima final 

## **Untuk Paket Tahunan:** 

- Pembayaran dilakukan **1 tahun di muka** 

## **KEUNGGULAN SISTEM YANG DITAWARKAN** 

Beberapa keunggulan sistem website yang kami tawarkan antara lain: 

- Membantu operasional toko bunga menjadi lebih tertata 

- Mempermudah pengelolaan pesanan dan produk 

- Memiliki dashboard pemantauan penjualan 

- Dapat dikembangkan sesuai kebutuhan usaha 

- Tampilan modern dan profesional 

- Mempermudah owner memantau performa usaha 

- Memberikan nilai tambah terhadap citra bisnis di mata pelanggan 

## **PENUTUP** 

Demikian proposal penawaran jasa pembuatan Sistem Website Toko Bunga / Florist ini kami sampaikan sebagai bentuk penawaran kerja sama dalam pengembangan sistem digital yang diharapkan dapat membantu proses operasional usaha menjadi lebih tertata, efektif, dan profesional. Besar harapan kami agar solusi yang kami tawarkan ini dapat menjadi salah satu langkah yang bermanfaat dalam mendukung pengelolaan usaha, mulai dari pengelolaan produk, pesanan, penjualan, hingga pemantauan aktivitas bisnis melalui dashboard yang terintegrasi. 

Kami memahami bahwa setiap usaha memiliki kebutuhan, alur kerja, serta target pengembangan yang berbeda-beda. Oleh karena itu, sistem yang kami tawarkan dirancang agar dapat disesuaikan dengan kebutuhan operasional usaha, baik untuk skala pengelolaan dasar maupun untuk kebutuhan pengembangan yang lebih lengkap dan eksklusif. Dengan adanya website dan sistem administrasi yang tertata, diharapkan proses pelayanan kepada pelanggan dapat berjalan lebih cepat, data usaha lebih mudah dikelola, serta pemilik usaha dapat memperoleh informasi yang dibutuhkan untuk mengambil keputusan secara lebih tepat. 

Melalui proposal ini, kami juga ingin menyampaikan komitmen kami untuk memberikan hasil pengembangan yang tidak hanya berfokus pada tampilan, tetapi juga pada fungsi, kenyamanan penggunaan, serta manfaat nyata bagi kegiatan usaha sehari-hari. Kami terbuka untuk berdiskusi lebih lanjut terkait kebutuhan fitur, penyesuaian alur sistem, maupun hal-hal teknis lainnya agar sistem yang dibangun benar-benar sesuai dengan kebutuhan dan karakter usaha yang dijalankan. 

Besar harapan kami untuk dapat menjalin kerja sama yang baik dalam pengembangan sistem website toko bunga ini. Semoga penawaran yang kami sampaikan dapat menjadi pertimbangan dan memberikan gambaran yang jelas mengenai solusi yang dapat kami berikan. Atas perhatian, waktu, dan kesempatan yang telah diberikan, kami mengucapkan terima kasih. 

Hormat kami, 

## **Rifan Muhamad Supriatna** 

**0838 2909 2027** 

## **rifanmuchtarsupriatna@gmail.com** 

