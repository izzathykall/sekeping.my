# Sekeping.my — laman majlis & dashboard tetamu

Pakej website statik yang boleh terus dipasang di GitHub Pages. Direka berasaskan aliran dan inspirasi halaman tetamu Kenang.my (bukan salinan kod/aset Kenang.my).

## Apa yang disediakan

- **Laman tetamu**: maklumat majlis, kamera (depan/belakang), filter Asli/Hangat/Filem Lama/Hitam Putih/Dreamy/Sejuk, potret/landskap, flash *skrin*, had gambar per tetamu, album, pesanan suara boleh dimainkan dan ucapan bertulis.
- **Dashboard pengurus sahaja**: daftar/log masuk e-mel, cipta banyak majlis, sunting maklumat majlis, muat naik foto pengantin dan laraskan zum/X/Y, terbit/draf, had gambar (1–20), durasi suara (5–90s), buka/tutup galeri/voice/ucapan, semak dan padam item dalam galeri, statistik, salin URL.
- **Jana QR A5 PDF**: PDF saiz 148 x 210 mm, poster bercorak botani, nama pengantin, tarikh, lokasi dan QR yang boleh diimbas. Tiada perkhidmatan luar diperlukan untuk menjana PDF.
- **Mod demo tanpa Firebase**: `?e=demo` (tetamu) dan `?view=dashboard&demo=1` (dashboard). Data disimpan dalam localStorage + IndexedDB pada peranti itu sahaja. **Mod demo tidak berkongsi data antara peranti**.
- Responsif desktop, tablet, iPhone dan Android. Ikon SVG dan animasi CSS; tiada emoji untuk navigasi.

## 1 — Terbitkan di GitHub Pages

1. Nyahzip pakej, dan muat naik **kandungan folder** ke akar repositori GitHub (pastikan `index.html` berada di root).
2. Pergi ke **Settings > Pages > Build and deployment**, pilih **Deploy from a branch**, cawangan **main** dan folder **/(root)**. Simpan.
3. Tunggu GitHub Pages terbitkan URL anda seperti `https://username.github.io/sekeping/`.
4. Uji `https://username.github.io/sekeping/?e=demo` untuk demo (akan gunakan local storage peranti tersebut).

> Website kamera dan mikrofon perlu **HTTPS** atau `http://localhost`; `file://` tidak mencukupi. GitHub Pages menggunakan HTTPS.

## 2 — Aktifkan Firebase sebenar

Konfigurasi Firebase daripada projek **sekeping-my** telah dimasukkan ke `data.js`, tetapi ini **tidak** mengaktifkan perkhidmatan Firebase secara automatik.

1. Buka https://console.firebase.google.com/ → projek `sekeping-my`.
2. Authentication → Sign-in method → **Enable Email/Password** **dan Anonymous**.
3. Authentication → Settings → Authorized domains → tambah domain hosting anda (`username.github.io` dan/atau domain sendiri).
4. Realtime Database → Rules → gantikan rules dengan kandungan `database.rules.json` → **Publish**.
5. Storage → Rules → gantikan rules dengan kandungan `storage.rules` → **Publish**. Pastikan Firebase Storage sudah diwujudkan dan billing memenuhi keperluan projek Firebase anda.
6. Buka `https://.../index.html?view=dashboard` → **Daftar** akaun pengurus → **Cipta majlis** → terbitkan → **QR & cetakan**.
7. Semak QR menghala kepada URL sebenar yang telah diterbitkan. Masukkan URL asas laman GitHub Pages di ruang **URL Asas Website** jika perlu.

## 3 — Cara pengguna menggunakan website

**Pengurus:** `?view=dashboard` → log masuk → cipta/edit majlis → tambah gambar pengantin → laraskan crop → simpan → tetapkan had foto → terbitkan → QR & cetakan → muat turun PDF A5.

**Tetamu:** scan QR → halaman `?e=<id>` → isi nama → buka kamera → ambil foto dan simpan → album, rakam dan main semula suara, hantar ucapan.

## Maklumat penting sebelum majlis sebenar

- **Had gambar adalah berdasarkan Firebase Anonymous UID**, bukan identiti fizikal. Tetamu boleh dapat UID baharu jika menukar peranti atau membersihkan data browser. Untuk penguatkuasaan ketat, gunakan sistem tiket jemputan atau fungsi backend Cloud Functions yang memeriksa token tetamu dan mengawal upload.
- Firebase Storage **masih menyimpan fail asal** apabila pengurus memadam metadata dari galeri. Sediakan proses penghapusan fail Storage melalui Cloud Functions atau pemadaman berkala oleh pengurus apabila digunakan dalam produksi.
- QR demo dan data demo tidak boleh dikongsi antara peranti. Data sebenar akan disimpan pada Firebase jika rules, Storage, Authentication dan internet berfungsi.
- Untuk acara umum, tambah **App Check**, kawalan muat naik, moderasi kandungan, dan mekanisme persetujuan gambar/voice/privacy sebelum meluas.
- Kamera belakang/depan bergantung sokongan browser. Flash dalam versi ini ialah **kilatan skrin**; ia bukan jaminan lampu LED fizikal pada semua telefon.
- Rakaman audio menggunakan MediaRecorder; fail audio mungkin berbeza format bergantung browser (contohnya `.m4a` / `.webm`). Browser pengguna perlu menyokong format untuk memainkannya.
- Jangan masukkan sebarang kunci akaun servis atau credential Firebase Admin dalam fail frontend. Konfigurasi Web Firebase bukan rahsia; **rules** menentukan keselamatan data.

## Struktur fail

```
index.html
styles.css
app.js
pdf.js
data.js
favicon.svg
qrcode.js
database.rules.json
storage.rules
README.md
```

## Debug

- `auth/operation-not-allowed` → aktifkan Email/Password dan Anonymous.
- `permission_denied` → semak Realtime Database Rules (bukan Firestore Rules).
- `storage/unauthorized` → semak Storage Rules, bucket, dan login Anonymous.
- Kamera/mikrofon tidak boleh buka → guna HTTPS, semak permission browser, cuba Safari/Chrome terkini.
- Pautan QR salah → ubah URL Asas Website selepas terbit di GitHub Pages.

© Sekeping — contoh prototaip dan asas sistem acara. Kod QR menggunakan adaptasi algoritma QR Code for JavaScript oleh Kazuhiko Arase (MIT); lihat `qrcode.js`.
