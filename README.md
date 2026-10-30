# Sekeping.my V12 — Modern Heritage Minimalism

Versi ini menaik taraf **website Sekeping.my V11 sedia ada** kepada reka bentuk klasik minimalis tanpa membina semula sistem data, kamera, audio atau halaman dashboard. Semua fail deployment berada **di root** ZIP, tanpa subfolder.

## Apa yang baharu

- **Identiti satu jenama:** Ivory `#F7F2E9`, espresso `#352D27`, antique gold `#B39A76`, olive `#858B79`; serif Playfair Display dan sans DM Sans. Logo ornamen, favicon dan gaya butang dipadankan.
- **Halaman utama:** susun atur editorial tipografi, foto filem abstrak daripada CSS (bukan gambar pengantin palsu), CTA untuk cipta majlis atau masuk demo.
- **Laman tetamu:** nama pengantin di tengah, tarikh & lokasi, foto pengantin pada **bingkai landskap 16:9**, ruang alu-aluan, borang nama, butang kamera dan pilihan galeri/suara/ucapan/salam kaut.
- **Foto pengantin sebenar:** guna foto yang pengurus muat naik. Tetapan crop, pan, zoom dan `Papar keseluruhan` (latar kabur) V11 kekal. Foto pengantin tidak diletakkan sebagai fail contoh yang palsu.
- **Perakam suara:** reka bentuk analog yang lebih hangat, pemasa digital, gelombang audio, butang dan bar kemajuan sedia ada dikekalkan.
- **Galeri, kamera, Salam Kaut, ucapan:** komponen, ikon dan kad menggunakan palet klasik yang sama; kamera kekal berlatarkan gelap supaya preview foto jelas. Tiada fungsi sengaja dibuang.
- **Dashboard pengurus:** navigation, kad statistik, borang, pengurusan majlis aktif, serta pratonton dan cetakan QR seragam.
- **Kad QR A5:** enam corak asal masih boleh dipilih; ton warna tema diselaraskan kepada gaya baharu, tema Classic Cream menjadi default **untuk majlis baharu yang belum mempunyai tetapan QR**. Majlis sedia ada mengekalkan pemilihan QR masing-masing.
- **Warna utama majlis:** pilihan warna tersuai kekal digunakan pada aksen tertentu (contohnya ampersand dan bingkai foto), tanpa mengubah identiti setiap komponen kepada warna bercampur. Warna hijau default versi lama dipaparkan sebagai gold warisan, tetapi pilihan tersuai selain default dikekalkan.
- **Responsif:** diuji dalam simulasi viewport 390px, 820px dan 1280px. Animasi dihormati mengikut `prefers-reduced-motion`.

## Cara guna pada GitHub Pages

1. Extract fail `Sekeping-my-V12-Klasik-Minimalis-Lengkap.zip`.
2. Muat naik **semua 17 fail ke root repositori GitHub Pages**. *Jangan* letak dalam subfolder dan jangan ubah nama `index.html`.
3. Alternatif: jika repo sudah menggunakan V11 lengkap, ZIP `Sekeping-my-V12-Kemaskini-Sahaja.zip` cukup untuk menggantikan fail yang diubah.
4. Selepas commit/deploy, buka semula website dan refresh penuh. Pastikan `index.html`, CSS dan JS dipaparkan versi terkini.
5. Dalam dashboard → Reka bentuk, muat naik gambar pasangan sebenar, pilih `Penuhi bingkai` atau `Papar keseluruhan`, laras zum dan posisi, kemudian simpan.
6. Uji pautan tetamu dan QR sebenar, rakaman suara dan foto terus pada iPhone, serta akses sebenar ke Firebase sebelum majlis.

`database.rules.json` dan `storage.rules` **tidak berubah** daripada V11. Penerbitan Rules yang sebelumnya telah disiapkan tidak perlu diulangi semata-mata untuk reka bentuk V12.

## Ujian setakat ini

- Lint sintaks semua JS (Node), percubaan paparan halaman utama, tetamu, dashboard, perakam suara, galeri dan QR dalam Chromium simulasi.
- Ujian aliran: foto → Foto Saya → lightbox → muat turun sendiri; ucapan; dashboard → QR A5/PDF; tetapan had foto; foto pengantin landskap; rakaman 2 saat → playback → hantar → tab Suara, pada 390px dan 820px.
- Tiada ralat JavaScript atau horizontal overflow dikesan pada viewport yang diuji.
- **Belum diuji secara langsung:** Safari iPhone sebenar, Firebase produksi, mikrofon/izin kamera fizikal, dan pautan QR GitHub Pages. Tidak boleh menjamin audio lama yang telah rosak akan dibaiki.

## Fail website dan konfigurasi

Fail web aktif: `index.html`, `app.js`, `data.js`, `styles.css`, `guest-v4.css`, `qr-studio.css`, `qr-templates.js`, `qrcode.js`, `pdf.js`, `camera-effects.js`, `archive-export.js`, `zip-export.js`, `favicon.svg`.

Fail tetapan Firebase (untuk diterbitkan di Firebase Console jika diperlukan): `database.rules.json`, `storage.rules`.

Fail rujukan (tidak diperlukan untuk runtime): `README.md`, `FAIL-TIDAK-DIGUNAKAN.txt`.

Kod dan fail zip tidak secara automatik mengemas kini laman GitHub awam; deploy perlu dibuat melalui repositori berkenaan.
