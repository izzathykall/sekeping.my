# Sekeping.my — laman majlis & dashboard tetamu

Pakej website statik yang boleh terus dipasang di GitHub Pages. Direka berasaskan aliran dan inspirasi halaman tetamu Kenang.my (bukan salinan kod/aset Kenang.my).

## Apa yang disediakan

- **Laman tetamu**: maklumat majlis, kamera (depan/belakang), 26 filter mengikut kategori (Asas, Filem, Sinematik, Warna dan Monokrom), suis Grain dan Vignette bebas, pelaras keamatan masing-masing, dan pratonton langsung, potret/landskap, flash lampu peranti jika disokong (atau kilatan skrin), ambil gambar atau naik dari galeri, efek juga disimpan pada JPG, had gambar per tetamu, album, pesanan suara boleh dimainkan dan ucapan bertulis.
- **Dashboard pengurus sahaja**: daftar/log masuk e-mel, cipta banyak majlis, sunting maklumat majlis, muat naik foto pengantin dan laraskan zum/X/Y, terbit/draf, had gambar (1–20), durasi suara (5–90s), buka/tutup galeri/voice/ucapan, semak dan padam item dalam galeri, statistik, salin URL.
- **Jana QR A5 PDF**: PDF saiz 148 x 210 mm, poster bercorak botani, nama pengantin, tarikh, lokasi dan QR yang boleh diimbas. Tiada perkhidmatan luar diperlukan untuk menjana PDF.
- **Mod demo tanpa Firebase**: `?e=demo` (tetamu) dan `?view=dashboard&demo=1` (dashboard). Data disimpan dalam localStorage + IndexedDB pada peranti itu sahaja. **Mod demo tidak berkongsi data antara peranti**.
- Responsif desktop, tablet, iPhone dan Android. Ikon SVG dan animasi CSS; tiada emoji untuk navigasi.

## 1 — Terbitkan di GitHub Pages

1. Nyahzip pakej. Semua fail sudah berada **terus di root ZIP**, tanpa sebarang subfolder. Upload semuanya ke root repositori GitHub (pastikan `index.html` berada di root).
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
- Kamera belakang/depan bergantung sokongan browser. Flash akan cuba menggunakan **lampu LED fizikal** apabila browser/peranti menyokongnya; jika tidak, efek kilatan skrin digunakan.
- Rakaman audio menggunakan MediaRecorder; fail audio mungkin berbeza format bergantung browser (contohnya `.m4a` / `.webm`). Browser pengguna perlu menyokong format untuk memainkannya.
- Jangan masukkan sebarang kunci akaun servis atau credential Firebase Admin dalam fail frontend. Konfigurasi Web Firebase bukan rahsia; **rules** menentukan keselamatan data.

## Struktur fail

```
index.html
styles.css
camera-effects.js
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

## Kamera Studio — kemas kini V3

- 26 filter berbeza: Asli, Lembut, Cerah, Bersih, Dreamy; Klasik 94, Kodak Gold, Fuji 400, Polaroid, Pudar 70s, Disposable; Cinema, Teal & Orange, Moody, Matte Film, Midnight; Sunset, Golden Hour, Rosy, Olive, Biru Sejuk, Pop Colour; B&W Klasik, Silver, Noir, Sepia.
- Pilih tab kategori atau skrol senarai gambar mini untuk memilih filter.
- Grain dan Vignette ialah **dua suis bebas**, setiap satunya ada slider keamatan (5–100%).
- Efek kelihatan dalam preview dan dibakar terus ke fail JPEG apabila ditangkap **atau** dimuat naik dari galeri. Mereka tidak sekadar lapisan CSS yang hilang selepas simpan.
- Filter dan tetapan Grain/Vignette diingati pada peranti yang sama melalui penyimpanan browser.
- Selepas gambar ditangkap, pilih Simpan Gambar atau Ambil Semula; untuk mengubah efek, ambil semula foto sebelum simpan.
- Mod demo mengekalkan foto hanya dalam storan setempat browser (IndexedDB). Untuk berkongsi antara peranti, aktifkan Firebase seperti panduan di atas.

## Sekeping V3 — aliran tetamu lengkap (referensi reka bentuk Kenang.my)

Versi ini menambah **fungsi lain yang telah diminta**, bukan kamera sahaja.

- **Laman tetamu**: hero gambar pasangan (muat naik sendiri melalui dashboard), nama dan tarikh pengantin, input nama tetamu, kuota baki keping filem, butang utama **Jadi Photographer Kami**, navigasi **Album Saya**, **Suara**, **Ucapan**, **Salam Kaut Digital**, dan **Album Tetamu Lain**. Paparan hero fallback menggunakan hiasan generik sekiranya belum ada gambar majlis.
- **Album Saya**: hanya gambar daripada tetamu semasa (berdasarkan anonymous UID). Kegemaran disimpan pada peranti sendiri. Muat turun gambar individu atau semua gambar sebagai ZIP.
- **Album Tetamu Lain**: galeri tersusun dengan tab **All / Guests / Wishes**, filter **All / Favourites / With a Wish**, pilihan nama tetamu dan butang muat turun. **With a Wish** mencari foto yang dimuat naik oleh tetamu yang juga telah meninggalkan ucapan. Statistik ialah data sebenar, tidak direka.
- **Suara**: rakam, pratonton, main semula, hantar rakaman dan dengar rakaman tetamu.
- **Ucapan**: isi nama, kirim doa dan baca ucapan tetamu; pengurus boleh memadam kandungan melalui dashboard.
- **Salam Kaut**: pengurus menetapkan nama penerima, bank, nombor akaun, status ON/OFF dan mengupload **imej QR pembayaran rasmi**. Tetamu boleh salin nombor akaun dan simpan QR yang diupload. Laman **tidak menjana QR DuitNow sah** daripada nombor akaun sahaja dan **tidak memproses bayaran**. Selagi pengurus belum tetapkan akaun/QR, tetamu akan melihat notis yang jelas, bukannya QR/akaun rekaan.
- **Dashboard pengurus**: bahagian baharu **Salam Kaut**, di samping semua tetapan terdahulu, galeri, voice, ucapan, QR majlis A5, acara, framing gambar pasangan dan statistik.
- **Kamera**: 26 filter + grain/vignette ON/OFF dengan kekuatan boleh laras, potret/landskap, kamera depan/belakang, flash bergantung browser, upload dari galeri.
- **Tanpa subfolder**: semua fail berada di root ZIP, termasuk `zip-export.js` dan `camera-effects.js`.

**Privasi:** Galeri tetamu yang diterbitkan boleh dilihat oleh sesiapa yang memiliki pautan/QR majlis. Aktifkan persetujuan tetamu dan pastikan anda mempunyai hak terhadap gambar yang dimuat naik. Favourites dikekalkan secara setempat dan bukan sync akaun. `Album Saya` bukan sistem identiti yang kebal kerana anonymous UID mungkin berubah apabila data browser dipadam. Cloud Functions/App Check/moderasi disarankan untuk kegunaan awam berskala besar.

**Penting:** QR pembayaran hanya diterima sebagai **imej yang diupload** oleh pengurus melalui papan pemuka, berasingan daripada QR **pautan majlis** yang dijana dalam PDF A5. Jangan tertukar kedua-dua QR ini.

## V4: identiti sama dengan dashboard pengurus

- Halaman tetamu direka semula supaya **selari dengan dashboard pengurus**, menggunakan latar krim dan putih, aksen hijau hutan, hijau sage, garis lembut, tipografi editorial, kad minimal dan ikon konsisten. Dashboard pengurus tidak dirombak atau ditukar tema.
- Halaman utama memaparkan foto pasangan, tarikh, lokasi, borang nama dan butang kamera, diikuti grid enam tindakan: Album Saya, Galeri Tetamu, Pesanan Suara, Ucapan & Doa, Salam Kaut dan Kamera Majlis. Fungsi asal masih dikekalkan.
- Subhalaman galeri, suara dan Salam Kaut mengikuti warna Sekeping yang sama. Kamera masih menggunakan pemidang tilik gelap yang sesuai untuk mengambil foto, dengan butang beraksen hijau.
- Pratonton QR di dashboard telah disusun semula dengan komposisi A5 sebenar, QR di tengah, tajuk dan nama di atas, arahan serta tempat di bawah dan *safe margins* supaya teks terakhir tidak dipotong. Kandungan PDF A5 dijana dengan susun atur selamat yang sepadan.
- Semua fail berada di akar ZIP, termasuk `guest-v4.css`. Upload kesemua fail ke root GitHub Pages — tiada subfolder.

## Sekeping V5 — sistem lebih kemas dan 6 corak QR A5

**Reka bentuk:** tema asas krim, putih, hijau hutan dan sage pada laman tetamu serta dashboard pengurus **dikekalkan**. Papan pemuka kini menyusun menu kepada kategori *Majlis*, *Kandungan Tetamu* dan *Penerbitan* (nav telefon kekal ringkas).

**QR Studio:** dari dashboard buka **QR & cetakan** dan pilih satu daripada enam template:

1. Minimal Cream — ringkas dan elegan.
2. Sage Floral — daun sage minimal (default).
3. Classic Arch — bingkai gerbang klasik.
4. Premium Editorial — komposisi editorial.
5. Soft Botanical — tekstur daun halus.
6. Dark Elegant — hijau gelap beraksen keemasan.

Setiap template menyokong **warna aksen tersuai**, **tagline**, serta tiga pilihan papar/sembunyi: tarikh, lokasi dan tagline. Tekan **Simpan corak** untuk menyimpan pilihan **bagi setiap majlis** ke Firebase atau ke mod demo setempat. **Set semula** membatalkan perubahan yang belum disimpan. Pratonton ialah hasil render daripada enjin kanvas yang **sama** digunakan untuk fail PDF — tidak ada dua reka bentuk bercanggah. Semasa menekan **Muat turun PDF**, tetapan yang sedang dipaparkan digunakan, termasuk tetapan belum disimpan; tekan Simpan corak jika mahu pilihan itu kekal bagi majlis seterusnya.

**Saiz A5 sebenar:** 148 × 210 mm (419.528 × 595.276 points) dengan margin selamat dan QR berzon putih yang tidak ditindih corak. Nama panjang akan dikecilkan atau dipendekkan dengan elipsis supaya tidak keluar dari kad. Lokasi panjang dibalut kepada maksimum dua baris. Pastikan anda membuat ujian imbas pada cetakan akhir sebelum majlis.

**Susun atur kod (semua di ROOT, tanpa subfolder):**

- `app.js`: aliran halaman tetamu/pengurus, event UI dan tindakan pengguna.
- `data.js`: mod demo IndexedDB/localStorage dan Firebase Authentication, Realtime Database, Storage.
- `camera-effects.js`: 26 penapis, Grain, Vignette, rendering kamera/gambar.
- `qr-templates.js`: palet, 6 corak, penggayaan dan rendering poster QR bersama.
- `pdf.js`: pembungkus PDF A5 dan fungsi eksport (menggunakan `qr-templates.js`).
- `zip-export.js`: arkib ZIP untuk album tetamu.
- `styles.css`: komponen UI umum dan dashboard.
- `guest-v4.css`: identiti dan layout tetamu sepadan dashboard.
- `qr-studio.css`: komponen editor corak khusus dashboard.
- `index.html`, `favicon.svg`, `database.rules.json`, `storage.rules`.

**Pembaikan termasuk:** perubahan maklumat majlis menyegarkan nama dalam pilihan majlis, navigasi tetamu kembali ke atas apabila bertukar halaman, menu dashboard berkumpulan, keutamaan QR disimpan per majlis, susun atur telefon/iPad/desktop, serta kawalan bacaan data suara/ucapan dalam *Realtime Database Rules* apabila ciri dimatikan. Perubahan rules hanya berkuat kuasa pada Firebase sebenar selepas anda menerbitkan semula `database.rules.json`.

**Had penting untuk produksi:** QR demo tidak berkongsi data antara peranti; kamera dan rakaman perlu kebenaran browser serta HTTPS. Had gambar berasaskan Firebase anonymous UID, **bukan identiti tetamu yang boleh disahkan**. Tanpa backend yang dipercayai, tetamu berkemahiran teknikal masih boleh mengelak kuota, menyalahgunakan upload atau mengirim spam. Gunakan Cloud Functions, App Check dan moderasi untuk acara sebenar yang ramai. Pemadaman gambar/voice melalui dashboard pada Firebase sebenar hanya memadam metadata Database; fail asal di Storage perlu dipadam menggunakan proses selamat oleh pengurus atau backend. Jangan anggap kandungan tersorok daripada UI sebagai data sulit jika fail Storage boleh dibaca dengan pautan yang diketahui. Jangan bergantung kepada security rules lama: terbitkan rules versi ini, kemudian audit semuanya sebelum pelancaran awam.

**Ujian V5:** enam template berjaya dieksport kepada PDF A5, kod QR keenam-enam template berjaya dibaca menggunakan decoder, pilihan template/warnanya kekal selepas navigasi, tiada horizontal overflow pada paparan 390px, 820px dan 1280px dalam ujian browser, dan aliran demo gambar, album, suara, ucapan dan Salam Kaut diuji. Sambungan Firebase production dan hardware kamera fizikal belum diuji dengan akaun/peranti sebenar dalam sesi ini.
