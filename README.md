# Sekeping.my V6 — Arkib khas pengurus majlis

Website acara statik untuk GitHub Pages. Semua fail laman web berada **di root repositori**, tanpa subfolder. Tema krim, hijau gelap, sage dan susun atur dashboard Sekeping V5 dikekalkan.

## Fungsi yang dikekalkan

**Tetamu:** halaman majlis, kamera 26 filter, grain/vignette ON/OFF, flash jika disokong, mod potret/landskap, muat naik gambar dari galeri, Album Saya, Album Tetamu, favourites (dalam browser), rakaman suara dan main semula, ucapan, serta Salam Kaut Digital.

**Pengurus:** log masuk/daftar akaun, cipta dan urus majlis, laraskan foto pengantin, tetapkan kuota gambar dan durasi suara, galeri/ucapan/suara, Salam Kaut, statistik, QR majlis A5 dengan enam corak dan warna yang boleh dipilih.

## Perubahan penting dalam V6

**Hanya pengurus mempunyai menu `Arkib & eksport` pada dashboard.** Menu ini memaparkan bilangan foto, suara dan ucapan serta butang **Muat turun arkib lengkap (.zip)**. Satu ZIP mengandungi:

```
Gambar/
  0001-Nama Tetamu.jpg
  ...
Suara/
  0001-Nama Tetamu.m4a / .webm / .ogg
  ...
Ucapan/
  semua-ucapan.csv
  semua-ucapan.txt
MAKLUMAT-MAJLIS.json
```

**Tetamu tidak mempunyai butang muat turun foto, album ZIP atau suara.** Mereka hanya boleh melihat album, mendengar audio dan membaca ucapan; tindakan menghantar gambar/ucapan/voice masih tersedia. Native audio player menggunakan `controlsList=nodownload` apabila disokong browser. Ikon muat turun di Album Saya digantikan ikon segar semula. Butang simpan QR Salam Kaut ialah untuk QR **pembayaran**, bukan untuk memuat turun media tetamu.

**Kawalan akses sebenar:** Panggilan mengeksport arkib menyemak akaun Firebase Authentication dan UID pengurus terhadap pemilik majlis. Bagi muat naik **baharu V6**, fail asal foto dan audio disimpan dalam laluan Storage `vault/{ownerUid}/...` yang hanya boleh dibaca akaun pengurus berdasarkan `storage.rules`. Tetamu menerima salinan foto resolusi lebih rendah untuk dipaparkan, manakala audio untuk main balik masih boleh didengar. Kod ZIP sentiasa mengambil fail asal bagi upload baharu, dan cuba mengambil fail lama dengan pautan Firebase yang sah bagi upload V1–V5.

**Batasan penting:** Apa-apa imej, audio atau teks yang boleh dilihat/didengar dalam browser masih berpotensi disalin melalui tangkap layar, rakaman bunyi atau alat pembangun. Website tidak boleh menjamin larangan muat turun **100%** bagi kandungan yang dipaparkan. Fail asal foto baharu boleh dikawal pada resolusi asal menggunakan Storage Rules, tetapi salinan paparan tetap boleh disimpan oleh pengguna yang mahir. Jangan mendakwa tetamu sama sekali mustahil menyalin apa yang dilihat. Untuk perlindungan lanjut, gunakan watermark, moderasi atau private delivery melalui backend.

**Foto/audio lama (sebelum V6)** telah disimpan menggunakan pautan Storage awam. Rules V6 masih membenarkan bacaan laluan lama supaya galeri lama tidak rosak; fail asal lama **belum menjadi peribadi**. Untuk mengunci fail lama, pemilik perlu memindah/menggantikan fail tersebut dan memadam objek lama melalui operasi Firebase admin/backend; menukar UI atau rules semata-mata tidak membatalkan token download sedia ada.

**Had arkib dalam browser:** maksimum 500 item media dan kira-kira 180 MB keseluruhan untuk mengelakkan penggunaan RAM berlebihan pada telefon/iPad. Jika majlis lebih besar, gunakan eksport melalui backend/cloud function. ZIP adalah fail arkib yang mengandungi folder kategori, tetapi **ZIP pemasangan GitHub Pages tetap rata tanpa subfolder**.

## Pemasangan di GitHub Pages (tanpa subfolder)

1. Nyahzip `Sekeping-my-V6-Lengkap-Tanpa-Subfolder.zip` dan upload **semua fail** ke root repositori. Pastikan `index.html`, `app.js`, `data.js`, `archive-export.js`, `zip-export.js` semuanya berada dalam direktori yang sama.
2. Settings → Pages → Deploy from a branch → `main` → `/(root)`.
3. Pastikan website dibuka melalui **HTTPS** sebelum mencuba kamera dan mikrofon.
4. Kemas kini Firebase: Authentication → aktifkan **Email/Password** dan **Anonymous**; tambah domain `username.github.io` di Authorized domains.
5. **Realtime Database → Rules**: terbitkan `database.rules.json` (bukan Firestore). **Storage → Rules**: terbitkan `storage.rules` V6. Lakukan sebagai sebahagian daripada rollout V6, bersama fail frontend baharu. Peraturan Storage V6 menolak upload melalui laluan versi lama.
6. Buka `?view=dashboard` dan log masuk akaun pengurus. Cipta/pilih majlis, semak media dan buka **Arkib & eksport** untuk muat turun ZIP. Tetamu masuk melalui pautan `?e=IDMAJLIS`.
7. Pastikan Storage bucket `sekeping-my.firebasestorage.app` wujud dan pengebilan Firebase memenuhi syarat penggunaan Storage projek anda.

> **CORS untuk eksport Storage dalam browser:** `getBytes` Firebase SDK memerlukan tetapan CORS bucket yang membenarkan origin website. Jika muat turun ZIP sebenar gagal dengan mesej CORS, tetapkan CORS untuk `https://username.github.io` pada Cloud Storage bucket melalui Google Cloud Shell/CLI dan cuba lagi. Uji dengan akaun pengurus sebenar sebelum hari majlis. Demo di bawah tidak memerlukan Firebase atau CORS.

## Mod demo

- Halaman tetamu: `?e=demo`
- Dashboard: `?view=dashboard&demo=1`
- Foto, audio, ucapan dan arkib semuanya disimpan/dihasilkan pada browser peranti tersebut melalui localStorage dan IndexedDB. Demo **tidak berkongsi data merentas peranti** dan **bukan sistem login yang selamat**.

## Struktur fail root

```
index.html
app.js
data.js
camera-effects.js
qr-templates.js
pdf.js
qrcode.js
zip-export.js
archive-export.js
styles.css
guest-v4.css
qr-studio.css
favicon.svg
database.rules.json
storage.rules
README.md
```

## Nota operasi

- QR A5 dalam dashboard masih mempunyai enam template: Minimal Cream, Sage Floral, Classic Arch, Premium Editorial, Soft Botanical dan Dark Elegant; semuanya boleh dijana kepada PDF sebenar bersaiz A5.
- Tetamu boleh muat naik foto dengan quota berdasarkan Firebase Anonymous UID. Ini **bukan** mekanisme anti-spam atau identity verification yang kebal; tambahkan App Check/Cloud Functions untuk sistem awam besar.
- V6 mengekalkan tingkah laku pemadaman metadata daripada dashboard seperti V5. Memadam rekod dalam Realtime Database tidak semestinya memadam fail asal dalam Storage. Gunakan proses admin/backend untuk pemadaman dan retention yang selamat.
- Eksport data tetamu mengandungi maklumat peribadi dan rakaman; simpan ZIP dengan selamat, dapatkan persetujuan yang sesuai dan padam salinan yang tidak diperlukan.

**Ujian setakat ini:** mod demo telah diuji menggunakan browser automatik pada lebar 390, 820 dan 1280 piksel; tetamu tidak mempunyai tindakan eksport; owner demo boleh menjana satu ZIP dengan foto, suara dan ucapan; fail ZIP dibaca semula tanpa ralat CRC. Integrasi dengan Firebase Storage rules pada akaun sebenar belum disahkan secara langsung dalam persekitaran ini.

---

## V11 — Gambar utama landskap & perakam suara klasik

Perubahan utama versi ini:

- **Gambar pengantin di halaman utama tetamu** ditukar kepada **bingkai landskap** yang lebih lebar dan elegan.
- Bahagian **Pesanan Suara** direka semula dengan gaya **lebih klasik, kemas dan premium**, masih mengekalkan fungsi rakam, hantar dan senarai rakaman.
- Susun atur baharu menggunakan kad rakaman utama dua lajur di desktop dan satu lajur di telefon.
- Koleksi rakaman tetamu turut diolah semula supaya lebih seragam dengan identiti Sekeping.

Fail yang diubah:
- `app.js`
- `guest-v4.css`

Tiada subfolder diperlukan untuk deploy GitHub Pages jika menggunakan ZIP pakej yang dijana.
