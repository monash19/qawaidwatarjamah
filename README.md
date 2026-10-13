# Qawaid Studio versi gratis

Aplikasi pembelajaran Bahasa Arab berbasis Qawa'id wa Tarjamah. Berjalan sebagai web/PWA, dapat dipasang dari browser pada HP, tanpa API berbayar, tanpa langganan, tanpa database cloud, dan tanpa dependency npm.

**Mulai paling mudah:** instal Node.js LTS versi 22 atau lebih baru, ekstrak seluruh ZIP, buka terminal pada folder yang berisi `package.json`, lalu jalankan `npm start`. Buka **http://localhost:4173**. Tidak perlu `npm install`.

Untuk Windows, Anda juga dapat klik dua kali **MULAI_WINDOWS.bat** setelah Node.js terpasang. Biarkan jendela terminal tetap terbuka selama aplikasi digunakan. Jangan membuka `index.html` dengan klik ganda/file:// karena modul JavaScript dan service worker memerlukan server.

## Yang sudah dibuat

- Dashboard dan akurasi pertama per bidang nahwu, sharaf, dan tarjamah.
- 42 variasi kalimat: 18 dasar, 18 menengah, dan 6 lanjutan; lima mode latihan.
- Susun kata dengan tap-to-place, sehingga bisa dipakai di layar sentuh dan keyboard.
- I'rab: kedudukan, status, tanda; sharaf: akar dan wazan; koreksi spesifik per bidang.
- Pilihan terjemahan Arab–Indonesia dan Indonesia–Arab.
- Terjemahan bebas dengan pencocokan rujukan konservatif. Parafrasa yang belum dikenali mendapat “Perlu tinjauan” tanpa skor, bukan langsung salah.
- Penjelasan i'rab, sharaf, alur penerjemahan, serta pustaka 10 kaidah.
- Level Mubtadi, Mutawassit, Mutaqaddim; level awal lanjutan dapat diganti di Pengaturan.
- Harakat tampil/sembunyi, ukuran huruf Arab, mode terang/gelap, dan tata letak responsif.
- Riwayat/progres browser, ekspor dan impor cadangan JSON.
- Manifest PWA, service worker, ikon PNG lokal, dan cache aplikasi untuk offline.
- AI lokal opsional: saran terjemahan dan generator draf soal melalui Ollama. Draf perlu diperiksa pengajar; tidak otomatis dimasukkan ke bank.
- Tes otomatis dan server lokal yang hanya mendengarkan loopback.

## Apa yang dimaksud gratis

| Komponen | Jalur yang dipakai | Biaya layanan |
|---|---|---|
| Antarmuka dan kode | HTML, CSS, JavaScript; kode MIT | Tidak ada |
| Server pengembangan | Node.js di komputer sendiri | Tidak ada |
| Penyimpanan progres | localStorage browser | Tidak ada |
| Hosting web | GitHub Pages, repository public pada GitHub Free | Gratis, dalam batas layanan |
| Alamat website | Subdomain github.io | Gratis |
| Instalasi HP | PWA melalui browser yang mendukung | Tidak ada biaya toko aplikasi |
| AI opsional | Ollama + qwen2.5:7b lokal | Tidak ada tagihan API |

Anda tetap memakai komputer/HP, listrik, ruang penyimpanan dan internet sendiri. Model AI tidak disertakan dalam ZIP. Layanan hosting gratis tunduk pada kebijakan dan batas pemilik layanan; tidak ada janji kuota tanpa batas atau gratis selamanya. Domain .com/.id tidak diperlukan.

**Google Play tidak bisa disebut gratis sepenuhnya:** dokumentasi resmi yang diperiksa menyatakan pendaftaran akun developer dikenai US$25 sekali bayar. Karena itu paket ini menggunakan PWA yang dipasang dari browser sebagai jalur tanpa biaya layanan. Tidak ada AAB, akun Play Console, atau pembayaran yang dibuat otomatis.

## 1 Menjalankan di Windows

1. Unduh Node.js **LTS** dari https://nodejs.org. Pilih installer Windows dan gunakan pengaturan standar. Gunakan Node.js minimal 22.
2. Ekstrak ZIP. Jangan menjalankan aplikasi dari dalam tampilan arsip ZIP.
3. Buka folder **qawaid-gratis**. Pastikan terlihat `package.json`, `server.mjs`, folder `docs`, `tests`, dan `lib`.
4. Klik kanan dalam folder → **Open in Terminal**. PowerShell, CMD, atau Git Bash boleh digunakan.
5. Periksa Node:

```bash
node --version
```

6. Jalankan:

```bash
npm start
```

7. Buka browser pada **http://localhost:4173**. Jika localhost gagal pada pengaturan jaringan komputer, gunakan **http://127.0.0.1:4173**. Gunakan alamat yang sama secara konsisten karena progres browser terpisah menurut origin.
8. Coba Beranda → Susun kalimat → pilih kata → Periksa jawaban → baca pembahasan.
9. Menghentikan server: tekan **Ctrl+C** pada terminal.

Alternatif satu perintah tanpa npm:

```bash
node server.mjs
```

Jika PowerShell melarang `npm.ps1`, jalankan `node server.mjs` atau `npm.cmd start`; tidak perlu mengubah kebijakan keamanan PowerShell.

**Mac/Linux:** ekstrak, buka terminal pada folder proyek, jalankan `npm start`, lalu buka alamat yang sama.

## 2 Deploy gratis ke GitHub Pages tanpa terminal

Metode ini memakai **GitHub Free dan repository public**. Seluruh file kode pada repository akan terlihat publik, termasuk kunci latihan formatif. Jangan mengunggah data cadangan pribadi. Progres pengguna disimpan di browser masing-masing dan tidak masuk repository.

1. Buat akun gratis di https://github.com jika belum memiliki akun.
2. Klik **New repository**.
3. Nama repository: `qawaid-gratis`.
4. Pilih **Public**, centang **Add a README file**, lalu **Create repository**. README awal membantu membuat branch `main`.
5. Pada repository, pilih **Add file → Upload files**.
6. Seret **folder `docs`** dari proyek yang sudah diekstrak ke halaman upload. Pastikan GitHub menampilkan file pada jalur `docs/index.html`, `docs/app.js`, `docs/styles.css`, serta folder `docs/icons`. Jangan mengunggah ZIP sebagai satu file.
7. Klik **Commit changes** ke branch `main`.
8. Buka **Settings → Pages**.
9. Pada **Build and deployment**, pilih **Source: Deploy from a branch**.
10. Pilih branch **main**, folder **/docs**, kemudian **Save**.
11. Tunggu proses publikasi selesai. GitHub akan menampilkan URL, biasanya:

```text
https://NAMA-USERNAME.github.io/qawaid-gratis/
```

12. Buka URL tersebut. Gunakan URL yang tampil pada GitHub, bukan menyalin NAMA-USERNAME secara literal.
13. Bila opsi **Enforce HTTPS** tersedia, aktifkan. GitHub Pages menyediakan alamat HTTPS pada domain github.io.

Tidak ada perintah build di layanan hosting untuk jalur ini. Folder docs sudah merupakan aplikasi siap hosting. Semua asset menggunakan path relatif, sehingga alamat `/qawaid-gratis/` didukung.

Jika upload folder melalui browser tidak mempertahankan struktur, gunakan GitHub Desktop yang gratis untuk menyalin seluruh proyek ke repository, commit, lalu push. Tetap pilih `main /docs` sebagai sumber Pages.

**Alternatif lewat Git**, jika Anda sudah menggunakannya: buat repository kosong di GitHub, lalu dari folder proyek jalankan:

```bash
git init
git add .
git commit -m "Initial Qawaid Studio"
git branch -M main
git remote add origin https://github.com/NAMA-USERNAME/qawaid-gratis.git
git push -u origin main
```

Ganti NAMA-USERNAME dengan akun Anda, selesaikan autentikasi GitHub sesuai petunjuk, lalu atur Pages ke `main /docs`. Perintah di atas mengasumsikan repository remote kosong; jangan dipakai untuk menimpa repository lama yang berisi pekerjaan lain.

## 3 Memasang di HP dan menggunakan offline

1. Deploy ke URL HTTPS sesuai bagian sebelumnya.
2. Buka URL di Chrome Android. Tunggu aplikasi selesai dimuat dan notifikasi siap offline muncul.
3. Buka menu titik tiga → **Instal aplikasi** atau **Tambahkan ke layar utama**. Nama menu bergantung versi browser.
4. Atau buka **Pengaturan → Pasang PWA** dalam aplikasi. Bila prompt instalasi tidak tersedia, aplikasi memberi petunjuk menu browser.
5. Buka ikon Qawaid dari layar utama.
6. Untuk menguji offline, buka dan muat aplikasi sekali saat online, lalu aktifkan mode pesawat dan buka kembali.

PWA tetap membutuhkan browser/platform yang mendukung fitur terkait. Mode penyamaran, pembatasan penyimpanan, atau pembersihan data dapat menghilangkan cache dan progres. Ekspor backup secara berkala.

Pada iPhone/iPad gunakan Safari → Share → Add to Home Screen, bila didukung perangkat. Fitur inti tetap dapat diakses sebagai website walaupun instalasi tidak ditawarkan browser.

**Tidak perlu Google Play untuk memasang PWA di HP.** Localhost pada HP menunjuk HP itu sendiri, bukan laptop. Gunakan URL GitHub Pages untuk mengakses dari HP; server pengembangan sengaja tidak dibuka ke LAN/internet.

## 4 AI lokal tanpa API berbayar

AI ini opsional. Versi GitHub Pages tetap menjalankan seluruh latihan lokal, tetapi **tidak menjalankan Node.js/Ollama untuk pengunjung**. Membuat AI publik untuk semua pengguna memerlukan infrastruktur komputasi; paket ini tidak menjanjikan layanan komputasi publik gratis tanpa batas.

1. Instal Ollama dari https://ollama.com/download pada komputer sendiri.
2. Buka aplikasi Ollama. Pada Linux, ikuti panduan layanan Ollama; bila diperlukan jalankan `ollama serve` pada terminal terpisah. Jangan menjalankan serve lagi jika layanan sudah berjalan.
3. Unduh model:

```bash
ollama pull qwen2.5:7b
```

4. Model ini sekitar 4,7 GB pada tag yang didokumentasikan. RAM 16 GB dianjurkan untuk ruang yang lebih longgar; ini perkiraan kebutuhan praktis, bukan jaminan performa. Kecepatan bergantung perangkat dan aplikasi lain yang berjalan.
5. Jalankan aplikasi dari folder proyek:

```bash
npm start
```

6. Buka **http://localhost:4173/#ai**.
7. Pilih contoh rujukan, tulis terjemahan Indonesia, lalu klik **Minta saran AI lokal**.
8. Untuk soal baru, pilih tugas **Buat draf soal baru**. Hasil hanya ditampilkan sebagai draf dan perlu review pengajar.

Jika komputer terbatas, gunakan model lebih kecil. Kualitas analisis Arab mungkin turun dan tetap perlu diperiksa.

```bash
ollama pull qwen2.5:1.5b
```

PowerShell:

```powershell
$env:OLLAMA_MODEL="qwen2.5:1.5b"
node server.mjs
```

CMD:

```bat
set OLLAMA_MODEL=qwen2.5:1.5b
node server.mjs
```

Git Bash/macOS/Linux:

```bash
OLLAMA_MODEL=qwen2.5:1.5b node server.mjs
```

Implementasi hanya menerima model lokal `qwen2.5:7b` dan `qwen2.5:1.5b`; tidak ada API key, endpoint cloud, atau tagihan token. Kedua ukuran ini termasuk keluarga yang berlisensi Apache 2.0 menurut halaman model. Ollama dan model diinstal terpisah; periksa lisensi paket yang diunduh.

Endpoint Ollama tetap `http://127.0.0.1:11434/api/chat`. Jangan membuka port Ollama atau port server ke internet. Semua output AI dirender sebagai teks dan divalidasi bentuknya. Validasi JSON tidak membuktikan kebenaran ilmu bahasa. Saran AI tidak mengubah nilai/progres.

## 5 Memahami koreksi dan adaptasi

- **Susun kata:** dinilai menurut pola yang disebut pada instruksi. Urutan lain tidak disebut tidak gramatikal secara mutlak. Kata identik dibandingkan berdasarkan bentuk agar pertukaran ID tidak dihukum.
- **I'rab:** tiga bidang; setiap bidang mempunyai bobot sama. Dua benar menghasilkan 67/100 setelah pembulatan.
- **Sharaf:** akar dan wazan masing-masing 50 poin.
- **Pilihan terjemahan:** pilihan tepat 100, lainnya 0. Pembahasan menunjukkan rujukan dan alasan.
- **Terjemahan bebas:** normalisasi spasi/tanda baca; padanan yang disetujui diterima. Arah Indonesia ke Arab tidak mewajibkan harakat, tetapi hamzah dan huruf berbeda tetap dipertahankan. Variasi yang belum dikenali tidak diberi skor.
- **Akurasi:** hanya jawaban pertama yang memiliki skor. Mengulang setelah membaca kunci tidak menaikkan akurasi pertama.
- **Ulangi kesalahan:** memilih latihan i'rab yang sebelumnya belum sempurna, sesuai level aktif. Bila tidak ada, memilih soal baru. Pemilihan normal memprioritaskan soal yang belum dicoba.
- **Level:** dipilih pengguna. Versi ini belum memiliki tes penempatan terstandar atau kenaikan level otomatis; jangan menyebut persentase dashboard sebagai sertifikasi kompetensi.

Generator bawaan membentuk kombinasi dari pola dan kosakata yang ditentukan di `docs/data.js`, lalu memilih soal sesuai level. Ini **generator berbasis aturan, bukan LLM**. Jumlah variasinya terbatas dan transparan. Materi lanjutan saat ini mencakup hal, tamyiz, pasif, lam, lan, dan istitsna; belum seluruh nahwu/sharaf tingkat lanjut.

## 6 Struktur file dan cara mengedit

```text
qawaid-gratis/
  docs/
    index.html              Halaman awal
    styles.css              Desain responsif, RTL, tema
    app.js                  Interaksi dan navigasi
    data.js                 Kaidah, kosakata, pola, dan contoh
    engine.js               Penilaian, pemilihan soal, validasi backup
    sw.js                   Cache offline
    manifest.webmanifest    Identitas PWA
    icons/                  Ikon SVG dan PNG lokal
  lib/ai.mjs                Prompt, request Ollama, validasi hasil
  server.mjs                Server lokal dan jembatan AI
  scripts/build.mjs         Menyalin paket statis ke dist
  tests/                    Pengujian otomatis
  MULAI_WINDOWS.bat         Peluncur Windows
  package.json              Perintah tanpa dependency npm
  README.md                 Panduan ini
  LICENSE                   Lisensi kode MIT
```

Mengubah nama aplikasi: edit teks brand pada `docs/app.js`, title pada `docs/index.html`, serta name/short_name pada `docs/manifest.webmanifest`.

Mengubah warna: edit CSS variables pada bagian awal `docs/styles.css`. Font Arab memakai font sistem yang mendukung huruf Arab; tidak ada unduhan font pihak ketiga saat runtime. Tampilan huruf dapat berbeda antarperangkat. Anda dapat menambahkan font bebas berlisensi sesuai distribusi menggunakan @font-face lokal.

Menambah materi: tambahkan record pada `LESSONS`. Menambah kalimat: tambahkan record melalui `record(...)` di `docs/data.js`, lengkap dengan level, lesson ID, token, target terjemahan, variasi jawaban, distraktor, focus i'rab, dan morphology. Berikan ID unik dan jangan mengganti ID lama karena riwayat menggunakannya. Setiap entri membutuhkan distraktor sesuai konteks. Uji kunci bersama pengajar.

Setelah edit, jalankan:

```bash
npm test
npm run build
```

`npm run build` hanya membuat folder `dist`; tidak mengunduh dependency. Untuk GitHub Pages `main /docs`, unggah perubahan pada folder docs. Untuk static hosting lain, unggah **isi dist**.

**Pembaruan offline:** ubah string versi pada `docs/sw.js` (misalnya `v1.0.0` → `v1.0.1`) setiap kali asset/konten berubah. Upload semua perubahan bersamaan. Aplikasi memberi tahu pembaruan siap; tutup seluruh tab/PWA Qawaid lalu buka kembali agar versi baru aktif. Tidak memakai aktivasi paksa supaya pengguna tidak tercampur antara versi JavaScript lama dan baru.

## 7 Pemeriksaan setelah deploy

1. Buka URL HTTPS dan pastikan tidak ada 404 untuk `app.js`, `data.js`, ikon, atau manifest.
2. Coba kelima mode, kedua arah terjemahan, dan ketiga level.
3. Kirim satu jawaban salah lalu benar setelah retry; akurasi pertama harus tetap mencerminkan jawaban pertama.
4. Coba nama dengan karakter khusus; tampil sebagai teks, bukan HTML.
5. Ekspor progres, muat ulang, lalu impor backup dan pastikan riwayat kembali.
6. Uji teks Arab pada HP, keyboard, tombol Back, tema gelap, dan ukuran font besar.
7. Muat saat online, tunggu siap offline, tutup, lalu buka lagi tanpa koneksi.
8. Pastikan Studio AI menjelaskan batas localhost ketika dibuka di GitHub Pages.

Tes yang disertakan memeriksa grading, backup, sampling, integritas konten, file PWA, transport HTTP, pemeriksaan host/origin, serta kontrak AI dengan respons tiruan. Uji tampilan memakai DOM minimal hanya untuk mendeteksi error render, bukan browser sungguhan. **Model Ollama nyata, instalasi PWA di perangkat, dan deploy ke akun GitHub Anda belum dijalankan dari paket ini.**

## 8 Pemecahan masalah

| Masalah | Solusi |
|---|---|
| node tidak dikenali | Instal Node.js LTS, tutup terminal lama, buka kembali |
| npm.ps1 diblokir | Gunakan `node server.mjs` atau `npm.cmd start` |
| package.json tidak ditemukan | Terminal harus berada dalam folder qawaid-gratis |
| Port 4173 digunakan | Hentikan server lama, atau ubah PORT (contoh PowerShell: `$env:PORT="4174"`; lalu `node server.mjs`) |
| Halaman kosong dari file:// | Jalankan `npm start` dan buka localhost |
| GitHub Pages 404 | Pastikan `docs/index.html` ada pada branch main dan Pages memilih `/docs` |
| URL tidak sesuai | Gunakan URL pada Settings → Pages; nama user dan repo harus benar |
| Versi lama masih muncul | Naikkan versi sw.js, tunggu update, tutup semua tab lalu buka lagi |
| Progres localhost tidak ada di website | Domain/origin berbeda memiliki penyimpanan berbeda; pindahkan lewat ekspor/impor |
| Progres HP berbeda dari laptop | Tidak ada sinkronisasi cloud; gunakan backup JSON |
| Tombol instal tidak memunculkan prompt | Gunakan menu browser pada URL HTTPS; platform mungkin hanya mendukung shortcut |
| AI belum tersedia di GitHub | Normal; gunakan localhost dengan Node.js dan Ollama untuk AI |
| Ollama gagal terhubung | Pastikan aplikasi/layanan Ollama aktif dan model sudah diunduh |
| AI timeout | Coba model 1.5b atau tutup aplikasi berat; latihan biasa tidak memerlukan AI |
| Backup ditolak | Gunakan backup yang diekspor aplikasi versi ini, batas 3 MB dan 2.000 attempt |

## 9 Privasi dan batas penggunaan

Tidak ada analytics, iklan, pelacak, atau pemanggilan API berbayar pada kode aplikasi. Riwayat disimpan dalam localStorage yang dipisahkan menurut lokasi proyek. Backup JSON berisi nama panggilan dan jawaban latihan; simpan di tempat yang Anda percayai. Maksimal 2.000 percobaan terbaru disimpan; ekspor sebelum membersihkan data. Menghapus cache/browser storage menghapus data lokal, bukan menghapus file backup yang sudah diunduh.

Saat memakai GitHub Pages, GitHub tetap dapat mencatat data akses sesuai kebijakannya. Saat memakai AI lokal, teks jawaban dikirim ke layanan Ollama di komputer yang sama. Tidak ada sinkronisasi nilai antarpengguna, panel kelas, akun guru, atau otorisasi ujian. Kunci harus berada di client untuk latihan offline; jangan memakai aplikasi ini sebagai ujian berisiko tinggi.

## Referensi resmi dan biaya

Diperiksa pada 13 Oktober 2026; periksa kebijakan terbaru sebelum publikasi.

- Node.js: https://nodejs.org
- GitHub Pages dan ketersediaan GitHub Free: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Pengaturan source branch/folder: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Batas GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Biaya akun Google Play: https://support.google.com/googleplay/android-developer/answer/6112435
- Ollama: https://docs.ollama.com/quickstart
- Endpoint chat Ollama: https://docs.ollama.com/api/chat
- Model lokal, ukuran, dan lisensi: https://ollama.com/library/qwen2.5:7b

Kode aplikasi dilisensikan MIT. Lisensi model/perangkat lunak pihak ketiga tetap mengikuti masing-masing pemiliknya.
