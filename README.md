# Sekeping.my V7 — Wedding Studio (GitHub Pages, root sahaja)

Versi ini dijana berdasarkan ZIP `sekeping.my-main.zip` yang pengguna upload, **bukan membina semula daripada kod demo yang berbeza**. Tema dashboard krim, putih, hijau gelap dan sage dikekalkan. Semua fail deployment terletak pada root; tiada subfolder dalam ZIP website.

## Perubahan penting

### Majlis aktif sekali sahaja
- Dashboard menunjukkan nama **Majlis Aktif** pada bahagian atas setiap halaman.
- Di **Senarai majlis**, tekan **Jadikan aktif & urus**. Pilihan disimpan dalam localStorage **mengikut UID pengurus**, jadi tidak perlu pilih lagi di Maklumat, Reka Bentuk, Galeri, Suara & Ucapan, Salam Kaut, Arkib, QR dan Tetapan.
- Tekan **Tukar majlis** pada bahagian atas untuk kembali ke Senarai majlis.
- Apabila majlis aktif dipadam, sistem bertukar kepada majlis lain yang masih ada, atau memaparkan borang majlis baharu.

### Padam majlis
- Tersedia di **Senarai majlis** dan **Maklumat majlis**.
- Popup meminta anda menaip **Nama Pengantin Perempuan & Nama Pengantin Lelaki** yang tepat. Tanpa pengesahan, butang tidak aktif.
- Dalam mod Firebase, tindakan ini membuang **rekod majlis serta data fotos/suara/ucapan/usage dalam Realtime Database dan pautan pemilikan di `owners/UID/events/ID`** secara kemas kini multipath. Untuk mengaktifkannya, terbitkan `database.rules.json` versi V7 dahulu.
- **PENTING:** ini **bukan** pembersihan lengkap Firebase Storage. Objek imej/voice asal serta salinan paparannya mungkin masih ada. Lakukan pembersihan Storage melalui Firebase Console atau backend/admin terasing apabila benar-benar ingin menghapuskan semua fail. Jangan padam majlis sebelum mengeksport ZIP jika anda memerlukan arkibnya.
- Mod demo turut memadam media setempat daripada IndexedDB apabila boleh.

### Hak muat turun
| Tetamu | Pengurus |
|---|---|
| Boleh muat turun foto **dalam Album Saya** satu persatu | Boleh muat turun satu ZIP semua gambar, suara dan ucapan |
| Boleh muat turun **Album Saya sebagai ZIP** | Boleh lihat dan padam rekod dari dashboard |
| Tidak mempunyai kawalan muat turun dalam **Galeri Tetamu Lain** | Boleh urus semua kandungan majlis aktif |
| Suara dan ucapan boleh didengar/dibaca, tiada butang muat turun | Semua voice/ucapan termasuk dalam ZIP arkib |

Fail asal foto V6/V7 disimpan di `events/{eventId}/vault/{ownerUid}/photos/{guestUid}/...`. `storage.rules` V7 membenarkan **hanya pengurus** atau **UID tetamu yang memuat naik foto itu** membaca fail asal. Fail rakaman suara asal kekal hanya boleh diakses pengurus. Fail gambar paparan resolusi kecil dan audio yang distrim dalam browser masih boleh disalin oleh pengguna mahir melalui alat browser, rakaman skrin atau kaedah lain; website tidak boleh menjamin larangan muat turun 100%.

Bagi **fail media versi lama**, pautan Storage lama boleh kekal awam. Rules dan UI V7 tidak menghapuskan token lama atau memigrasikan media secara automatik. Jika mahu kawalan menyeluruh, migrasikan fail lama secara selamat terlebih dahulu.

### Borang iPad
Medan tarikh dan masa kini berada **dalam baris berasingan** apabila ruang dashboard sempit (iPad/tablet), mengelakkan kedua-dua kotak Safari bertindih. Desktop lebar menggunakan dua lajur; telefon satu lajur.

### QR Studio: enam tema klasik yang ditambah baik
- Classic Cream
- Sage Floral
- Royal Arch
- Editorial Classic
- Botanical Elegance
- Dark Heritage

Setiap templat mempunyai ornamen sendiri (bingkai heritage, botani, rosette, gerbang/medallion). Senarai template dalam dashboard kini menggunakan **thumbnail daripada poster sebenar**. Pengurus boleh pilih warna aksen, tagline, tarikh dan lokasi. Pratonton dan PDF A5 menggunakan enjin kanvas yang sama. PDF mempunyai margin selamat, QR di atas blok putih dan tidak ditindih corak. Saiz sebenar **148 × 210 mm**. Imbas cetakan ujian sebelum majlis sebenar.

## Cara pemasangan

1. Extract ZIP bersih dan upload **semua fail secara terus ke root** repo GitHub. Contohnya `index.html` mesti di root, **bukan dalam folder**.
2. Buang fail lama yang tidak digunakan dalam repo mengikut `FAIL-TIDAK-DIGUNAKAN.txt`. Upload fail baharu **tidak memadam fail lama secara automatik**.
3. Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/(root)`.
4. Firebase Console projek `sekeping-my` → Realtime Database → Rules → **Publish** kandungan `database.rules.json` V7.
5. Firebase Storage → Rules → **Publish** kandungan `storage.rules` V7 agar tetamu boleh membaca fail foto asal milik sendiri. Pastikan Authentication Email/Password dan Anonymous telah diaktifkan.
6. Uji `?view=dashboard&demo=1` dan `?e=demo` tanpa Firebase. Untuk data sebenar, dashboard `?view=dashboard` dan QR majlis `?e=ID`.
7. Eksport ZIP arkib sebelum memadam majlis atau menukar konfigurasi live.

## Fail diperlukan (root)

`index.html`, `app.js`, `data.js`, `styles.css`, `guest-v4.css`, `qr-studio.css`, `qr-templates.js`, `qrcode.js`, `pdf.js`, `camera-effects.js`, `archive-export.js`, `zip-export.js`, `favicon.svg`, `database.rules.json`, `storage.rules`, `README.md`. Sertakan `FAIL-TIDAK-DIGUNAKAN.txt` untuk rujukan audit (bukan diperlukan pada runtime).

## Fail lama yang tidak digunakan
Rujuk `FAIL-TIDAK-DIGUNAKAN.txt` untuk senarai tepat 16 fail yang dibuang daripada pakej bersih. Fail tersebut datang daripada **satu implementasi `admin.html` berasingan** atau ciri PWA/Firestore lama yang tidak dipanggil oleh `index.html` utama. Untuk sistem ini, **jangan buang `qrcode.js` atau `database.rules.json`** — kedua-duanya masih digunakan.

## Nota sebelum penggunaan produksi
- `getBytes` Firebase Storage untuk foto asli dan eksport ZIP memerlukan polisi **CORS** bucket yang membenarkan domain GitHub Pages anda. Sahkan dengan browser/iPhone sebenar.
- Kuota foto masih berasaskan anonymous UID, bukan pengesahan identiti fizikal. Gunakan backend/App Check bagi acara ramai orang.
- Penghapusan metadata dari dashboard tidak semestinya memadam objek Storage. Pembersihan sepenuhnya dan kawalan permohonan hapus data memerlukan backend berkeizinan.
- Rakaman suara yang dipaparkan kepada browser secara teknikal boleh disalin walaupun butang download disembunyikan.
- Demo IndexedDB/localStorage hanya setempat, tidak menyegerakkan data antara peranti.
- Domain GitHub Pages, Firebase Rules sebenar dan peranti iOS/Safari produksi tidak boleh disahkan menggunakan akaun live dalam ujian tempatan ini.

## Ujian lokal V7
Browser automatik pada 390px, 820px dan 1280px: tiada ralat JavaScript; muat turun gambar sendiri dan ZIP Album Saya berjaya; tiada butang muat turun pada album tetamu lain; majlis aktif kekal selepas dashboard dibuka semula; pengesahan delete dan pemadaman majlis demo berjaya; input tarikh/masa iPad tidak bertindih. Keenam-enam kod QR berjaya dinyahkod dan PDF bersaiz A5 sebenar. Ujian ini bukan pengganti ujian Firebase live.
