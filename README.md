# Sekeping.my V15 — Single-Screen Guest Dashboard

Versi V15 berdasarkan **Sekeping.my V14** yang disemak sebelum ini, khusus untuk menyusun semula *dashboard tetamu* pada telefon supaya fungsi utama muat pada satu skrin dengan gaya klasik Sekeping: **ivory, sage green, antique gold, tipografi editorial**.

## Reka bentuk baharu

- **Satu skrin:** identiti Sekeping + tukar bahasa, gambar pengantin, nama pasangan, tarikh dan lokasi, ruangan nama, baki foto, kamera, Galeri, Suara, Ucapan dan Salam Kaut.
- **Gambar pengantin sebenar:** menggunakan tetapan gambar, zoom dan posisi foto yang pengurus simpan; tiada gambar contoh dimasukkan ke dalam website produksi.
- **Butang ringkas dan seragam:** tiga pilihan kenangan sebaris serta Salam Kaut berasingan. Kamera jelas sebagai tindakan utama.
- **Reka bentuk responsif:** ruang foto menggunakan baki ketinggian skrin; butang penting tetap kelihatan dalam viewport yang telah diuji.
- **Penyesuaian kandungan:** fungsi dimatikan oleh pengurus (pesanan suara, ucapan, hadiah) tidak muncul, sementara kamera mengikut had foto tetamu.
- **Fungsi sedia ada dikekalkan:** perakam kaset retro, kamera dengan filter, galeri, ucapan, Salam Kaut, muat turun foto sendiri, dashboard pengurus dan PDF QR A5, Firebase.
- **Tidak mengubah Firebase Rules atau data majlis.**

## Cara pasang di GitHub Pages

### Jika website masih pada V14

1. Buka ZIP **`Sekeping-my-V15-Kemaskini-Sahaja.zip`**.
2. Gantikan `index.html`, `app.js` dan `README.md` di root GitHub Pages, dan tambah `v15-guest.css` di root.
3. Pastikan `v14-guest.css`, `guest-v4.css`, `retro-recorder.js`, `retro-recorder.css` dan semua fail V14 yang lain masih ada.
4. Commit dan tunggu GitHub Pages selesai menerbitkan fail, kemudian refresh laman pada iPhone.

### Jika pasang baru

Extract **`Sekeping-my-V15-Single-Screen-Lengkap.zip`** dan letak semua fail di root repositori GitHub Pages, **tanpa subfolder**.

## Had reka bentuk & hasil ujian

- Ujian Chromium simulasi pada viewport 320×568, 360×640, 375×667, 390×650, 390×750, 390×844, 430×740, 430×932, 820×1180 dan 1280×850: tiada horizontal overflow, tiada vertical scroll pada viewport utama untuk kandungan contoh biasa.
- Ujian butang BM/EN, kamera, galeri, Pesanan Suara, Ucapan & Doa dan Salam Kaut lulus tanpa ralat JavaScript.
- Paparan foto pengantin dalam gambar pratonton menggunakan **foto contoh yang diekstrak daripada tangkap layar pengguna semata-mata untuk ujian**; foto itu **tidak dimasukkan dalam ZIP website**.
- Halaman fungsi seperti Galeri dan Pesanan Suara mungkin mempunyai scroll apabila terdapat banyak kandungan; permintaan satu skrin digunakan pada **dashboard tetamu utama**.
- Jika tetamu menaip dan papan kekunci dibuka, halaman boleh berubah saiz mengikut Safari. Pada viewport terlalu rendah (contohnya landscape atau zoom), scroll dibenarkan sebagai fallback supaya kawalan tidak terpotong.
- Teks nama atau lokasi yang sangat panjang dan tetapan pembesaran browser yang luar biasa boleh memerlukan ruang tambahan; keadaan demikian tidak boleh dijamin satu skrin pada semua peranti.
- Belum menguji langsung Firebase produksi dan Safari iPhone fizikal; buat ujian di URL GitHub Pages selepas publish.

## Fail

**Website**: `index.html`, `app.js`, `data.js`, `styles.css`, `guest-v4.css`, `qr-studio.css`, `v14-guest.css`, `v15-guest.css`, `qr-templates.js`, `qrcode.js`, `pdf.js`, `camera-effects.js`, `archive-export.js`, `zip-export.js`, `retro-recorder.css`, `retro-recorder.js`, `favicon.svg`.

**Tetapan Firebase**: `database.rules.json`, `storage.rules`.

**Dokumentasi**: `README.md`, `NOTA-PASANG-V13.txt`, `FAIL-TIDAK-DIGUNAKAN.txt`.
