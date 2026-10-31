# Sekeping.my V21 — Dashboard Tetamu Klasik

Versi ini dikemas kini daripada fail `sekeping.my-main 3.zip` yang dimuat naik. Semua fail berada di folder **root** (tiada subfolder dalam ZIP), dan seluruh sistem sedia ada dikekalkan.

## Penambahbaikan tetamu

- Foto pengantin ditampilkan besar di bahagian atas, dengan nama pasangan, tarikh dan tempat majlis pada bahagian bawah foto.
- Foto asal pengurus kekal jelas. Latar belakang kabur di belakang gambar telah dimatikan pada muka tetamu. Kesan kabus halus hanya berada di bahagian bawah gambar untuk menyerlahkan tulisan.
- Tajuk **Abadikan Kenangan** diperbesarkan, betul-betul di tengah dengan ayat **Ambil beberapa keping gambar untuk kami.** tepat di bawahnya.
- Ruang nama tetamu di tengah, dan butang kamera **Jadilah Lensa Kami**. Baki foto sebenar dipaparkan pada butang.
- Tiada corak daun; susunan galeri, suara, ucapan dan Salam Kaut dalam grid 2 × 2 dikekalkan. Pilihan tidak aktif tidak ditunjukkan.
- Ukuran untuk telefon rendah (tinggi viewport sekitar 568–700 px) dipadatkan agar tetamu lebih mudah melihat semuanya tanpa scroll. Dalam peranti lebih kecil, zoom sistem besar atau apabila papan kekunci terbuka, scroll dibenarkan demi kebolehcapaian.

## Fail dan cara upload

Upload isi ZIP ini ke **root repositori GitHub Pages**, termasuk `index.html` dan semua fail JS/CSS lain. `index.html` memanggil `app.js?v=21.0` untuk mengelak cache lama.

Fail CSS V15 yang tidak pernah diimport telah dikeluarkan. Tiada fail Firebase Rules, logik kamera, storan, audio atau dashboard pengurus diubah.

## Semakan

- Sintaks JavaScript diperiksa dengan Node.js.
- Susunan komponen dan pautan fail diperiksa.
- Ujian langsung Safari iPhone dan Firebase produksi tidak dapat dibuat dalam persekitaran ini. Selepas upload, buka halaman demo dan majlis sebenar untuk mengesahkan foto daripada tetapan pengurus, kemas kini galeri serta sambungan media.
