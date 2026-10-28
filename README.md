# Sekeping — Website Kenangan Majlis

Website asal tersendiri, diinspirasikan oleh konsep kamera disposable dan QR galeri majlis. **Siap untuk GitHub Pages**, tanpa proses build. Semua fail berada terus dalam folder utama, tanpa subfolder.

## Identiti Sekeping

- **Nama:** Sekeping
- **Tagline:** *Setiap gambar, satu kenangan.*
- **Gaya:** minimal, romantik, timeless; elemen fotografi filem klasik.
- **Warna:** Forest `#344D40`, Sage `#A8B9A3`, Cream `#F7F3EC`, Soft Gold `#C9A86A`.
- **Fon:** Cormorant Garamond (judul/logo), Inter (paparan aplikasi).
- **Logo:** bingkai foto Sekeping (`logo.svg`). Ikon aplikasi disediakan pada 192 dan 512 px.
- **Domain yang dicadangkan:** `sekeping.my` (cadangan sahaja, **belum disemak atau dibeli**). Anda masih boleh guna URL GitHub Pages tanpa domain sendiri.

## 1. Cuba dahulu tanpa Firebase

1. Extract ZIP. Muat naik **semua fail dalam folder ini** ke root repository GitHub, termasuk `index.html`, `admin.html`, ``, ``, `` dan `config.js`.
2. Di GitHub, pilih **Settings → Pages → Deploy from a branch → main → / (root) → Save**.
3. Buka `https://USERNAME.github.io/NAMA-REPO/` dan `https://USERNAME.github.io/NAMA-REPO/admin.html`.
4. Website bermula dalam **MOD DEMO** kerana Firebase belum diisi. Klik **Buka dashboard demo**, ubah majlis atau cipta majlis baru, kemudian buka halaman tetamu.
5. Cuba kamera, filter, ambil gambar, upload galeri, moderasi, QR, ucapan, ZIP. Foto disimpan menggunakan IndexedDB *dalam browser/peranti semasa sahaja*. Ia **tidak berkongsi foto antara peranti**. Jangan gunakan mod demo untuk majlis sebenar!

**Perhatian QR:** Cipta majlis terlebih dahulu setelah website di-host pada URL akhir; kemudian download QR dari dashboard. QR yang dihasilkan daripada laman `file://` atau `localhost` tidak boleh digunakan oleh telefon tetamu.

### Domain sendiri (pilihan)

Jika anda sudah membeli domain seperti `sekeping.my`, boleh buka **Repository → Settings → Pages → Custom domain**, kemudian ikut rekod DNS yang GitHub tunjuk dan aktifkan **Enforce HTTPS** setelah sijil tersedia. Tambah domain itu juga pada **Firebase Authentication → Settings → Authorized domains**. **Jangan bina fail CNAME sehingga domain itu benar-benar milik anda.**

## 2. Hidupkan galeri live sebenar (Firebase)

Firebase ialah komponen cloud untuk menghubungkan telefon tetamu dan admin. GitHub Pages hanya meng-host fail statik.

1. Buka https://console.firebase.google.com/ dan cipta projek baru. Dalam Project Settings → Your apps → Web app, daftarkan aplikasi web dan dapatkan `firebaseConfig`.
2. **Authentication → Sign-in method**: aktifkan **Anonymous** (tetamu tanpa akaun) dan **Email/Password** (penganjur). Di **Authentication → Users**, gunakan **Add user** untuk cipta akaun admin sendiri. Jangan tambah fungsi daftar admin terbuka kepada tetamu.
3. **Firestore Database**: cipta database, kemudian pada **Rules**, **gantikan** kandungan dengan fail `firestore.rules` dalam ZIP ini dan **Publish**.
4. **Cloud Storage**: cipta bucket, pada **Rules**, gantikan kandungan dengan fail `storage.rules` dan **Publish**. Pastikan Storage bucket dalam `storageBucket` adalah tepat.
5. **PENTING (2026)**: Cloud Storage for Firebase memerlukan pelan **Blaze (pay as you go)** serta akaun billing, walaupun penggunaan tertentu boleh kekal percuma. Tetapkan billing budget/alert untuk mengelakkan kos tak dijangka. Semak https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024
6. Pada **Authentication → Settings → Authorized domains**, tambah domain GitHub Pages anda (`USERNAME.github.io`) atau domain custom. URL Firebase SDK memerlukan internet.
7. Isi medan `firebase` dalam `config.js` dengan nilai objek Web config dari Firebase Console:

```javascript
window.SEKEPING_CONFIG = {
  siteName: 'Sekeping',
  firebase: {
    apiKey: 'AIza...',
    authDomain: 'projek-anda.firebaseapp.com',
    projectId: 'projek-anda',
    storageBucket: 'projek-anda.firebasestorage.app',
    messagingSenderId: '...',
    appId: '1:...:web:...'
  }
};
```

8. Upload semula `config.js` ke GitHub Pages. Refresh website. Pergi `admin.html`, login menggunakan e-mel/password yang dibuat di Firebase Authentication, klik **+ Majlis baru**, kemudian download kod QR. Peranti yang scan QR kini berkongsi foto dalam galeri yang sama melalui Firebase.
9. Uji dari dua peranti: telefon A ambil gambar, telefon B masuk QR dan lihat gambar muncul; cuba `Moderasi gambar` dan `Kunci galeri`.

### Export ZIP dalam mod Firebase

`Muat turun ZIP` membaca fail dari Firebase Storage menggunakan Web SDK `getBlob()`. Sesetengah browser/bucket memerlukan tetapan CORS. Jika eksport gagal, salin `cors.example.json`, gantikan `USERNAME.github.io` dengan domain sebenar, kemudian jalankan melalui Google Cloud SDK yang mempunyai izin bucket:

```bash
gcloud storage buckets update gs://NAMA_BUCKET --cors-file=cors.json
```

`cors.json` ialah salinan yang diedit daripada `cors.example.json`. Export ZIP perlu membaca semua gambar ke memori browser; untuk majlis dengan ribuan foto, gunakan alat eksport backend/cloud agar tidak membebankan telefon.

## Ciri yang tersedia

- Kamera telefon melalui `getUserMedia` (perlu HTTPS dan izin browser), kamera depan/belakang, flash visual, 4 filter gambar, cop tarikh, pratonton serta retake.
- Alternatif upload gambar terus dari galeri telefon.
- Bilangan filem boleh ditetapkan per majlis (1–50) dengan pengiraan per akaun anonymous Firebase/browser.
- Album gallery realtime, lightbox, simpan imej, buku ucapan.
- Dashboard admin: pelbagai majlis, tukar tetapan, galeri live, moderasi approve/hide/delete, buku ucapan, CSV, ZIP dan cetak/PNG QR.
- Kod QR dihasilkan secara lokal tanpa bergantung pada QR service luaran, dengan quiet zone.
- Responsive untuk telefon, tablet dan desktop; PWA cache fail antaramuka (akses kamera dan Firebase tetap memerlukan rangkaian ketika live).

## Keselamatan & batasan penting

- **Had filem ialah kawalan di pihak browser, BUKAN had yang tidak boleh dipintas**. Pengguna boleh kosongkan data browser atau cipta sesi anonymous baharu; enforcement mutlak dan anti-spam perlukan backend, App Check dan quota peranti/pengguna.
- **Link majlis ialah unlisted URL, bukan privasi kriptografi.** Sesiapa yang mendapat QR/link boleh memasuki majlis. Galeri yang dibuka boleh dilihat oleh pengguna berpautan. Untuk galeri sulit, tambah sistem token/undangan server-side dan pengurusan akses.
- Firebase Rules dalam ZIP memberi kawalan admin/guest untuk dokumen dan foto. Namun URL muat turun Firebase Storage mungkin mengandungi token akses; **gambar yang telah dimuat turun, dikongsi, atau tokennya tersebar tidak boleh dijamin ditarik balik** oleh moderasi sahaja. Untuk privacy yang lebih ketat, gunakan backend proxy dengan signed URLs jangka pendek serta token revocation.
- **Jangan letakkan service account key/secret dalam `config.js`**. Web Firebase config bukan kata laluan, akses sebenar dikawal oleh Firebase Rules.
- `getDownloadURL` dan `getBlob` mungkin perlu tetapan CORS dan rules yang diterbitkan dengan betul.
- Moderasi gambar hanya mempengaruhi gambar baru selepas setting diaktifkan. Gambar lama yang approved tidak automatik berubah menjadi pending.
- Simpan salinan ZIP dan uji sebelum hari majlis; Firebase Storage boleh mengenakan caj mengikut penggunaan.
- Untuk elakkan spam upload, pertimbangkan Firebase App Check (reCAPTCHA Enterprise), rate limiting menggunakan Cloud Functions dan program antivirus/moderasi upload bagi majlis terbuka.
- Browser iPhone Safari lama atau izin kamera yang ditolak mungkin memerlukan tetamu memuat naik gambar dari galeri.

## Struktur fail — semua di root (tiada subfolder)

```
index.html             ← Halaman tetamu
admin.html             ← Dashboard penganjur
styles.css             ← Semua reka bentuk responsive
config.js              ← Isi Firebase Web config
app.js             ← UI kamera, galeri, admin, QR, ZIP
firebase-service.js← Firebase auth, Firestore, Storage
demo-service.js    ← Penyimpanan setempat IndexedDB
util.js            ← QR canvas / utilities
qr.js           ← QRCode JavaScript (MIT)
jszip.min.js     ← JSZip (MIT/GPLv3; license included)
firestore.rules         ← Rules database
storage.rules           ← Rules fail gambar
cors.example.json       ← Example CORS export ZIP
manifest.webmanifest    ← PWA
sw.js                   ← PWA shell cache
logo.svg         ← Logo SVG
icon-192.png / icon-512.png ← Ikon PWA
```

## Teknologi & credits

HTML/CSS/JavaScript, Firebase Web SDK CDN, QRCode for JavaScript oleh Kazuhiko Arase (MIT), JSZip oleh Stuart Knightley & contributors (MIT atau GPLv3), Google Fonts Cormorant Garamond dan Inter.

Reka bentuk dan identiti Sekeping adalah original; bukan salinan logo atau aset Kenang.my.

## Semakan sebelum majlis sebenar

1. Uji GitHub Pages pada iPhone dan Android dengan pautan HTTPS sebenar; benarkan akses kamera.
2. Di Firebase, uji dua peranti berasingan, pastikan galeri live, upload, moderasi dan kunci galeri berfungsi ikut polisi yang diingini.
3. Periksa bahawa admin hanya boleh log masuk dengan akaun penganjur dan tetamu tidak mendapat akses admin.
4. Uji penggunaan storage, bajet, serta muat turun sandaran semua gambar sebelum tamat majlis.
5. Selepas website di-host pada URL tetap, jana semula QR dan **scan QR menggunakan telefon lain** sebelum dicetak.
6. Untuk pratonton pautan media sosial, ubah `og:image` dalam `index.html` kepada URL HTTPS mutlak bagi `og-cover.png` selepas domain dimuktamadkan.

**Status pengujian:** Struktur HTML, rujukan fail dan sintaks JavaScript diperiksa dalam persekitaran pembangunan. Ujian penuh aplikasi pada browser telefon sebenar dan Firebase dengan akaun anda masih perlu dilakukan selepas konfigurasi.
