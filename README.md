# Sekeping.my V15 — Still & Simple

**Dashboard tetamu profesional, klasik minimalis dan mesra iPhone.** Versi ini bermula daripada ZIP `sekeping.my-main 2.zip` yang dimuat naik. Identiti Sekeping (ivory, sage green, emas antik, tipografi serif) dikekalkan, tanpa meniru reka bentuk Kenang.my.

## Perubahan V15

- Susun atur satu skrin untuk telefon biasa: header kecil → foto pengantin & maklumat majlis → borang nama & butang kamera → empat fungsi dalam grid 2 × 2. Tiada fungsi kamera pendua atau banner panjang.
- Foto pengantin berasal **terus daripada tetapan pengurus** (menghormati `coverFit`, `coverX`, `coverY` dan `coverZoom`). Tiada foto contoh dimasukkan dalam website.
- Nama dan lokasi majlis dipaparkan dengan hierarki visual yang lebih jelas. Maklumat alu-aluan dipendekkan pada skrin kecil supaya pilihan utama sentiasa nampak.
- Kamera sebagai satu-satunya tindakan utama; galeri, rakaman suara, ucapan dan Salam Kaut disusun berasingan dalam kad ringkas. Fungsi yang ditutup oleh pengurus tidak dipaparkan.
- Baki foto menunjukkan data sebenar kuota pengguna (`state.used`/`photoLimit`). Input nama mengekalkan cara penyimpanan asal.
- Pilihan Bahasa Melayu / English masih berfungsi. Kad, butang dan label menyokong navigasi menggunakan papan kekunci.
- **Perubahan terhad kepada dashboard utama tetamu**: `guestHome()` dalam `app.js` dan gaya `v15-guest.css`. Tiada perubahan logik Firebase, kamera, galeri, QR, suara atau dashboard pengurus. Perakam kaset retro V13 kekal.

## Cara pasang

**ZIP lengkap**: Extract semua fail dan upload ke **root** GitHub Pages, sebaris dengan `index.html`. Jangan buat subfolder.

**ZIP kemas kini**: Jika repositori menggunakan versi fail yang sama dengan `sekeping.my-main 2.zip`, gantikan hanya `app.js`, `index.html`, `README.md` dan tambah fail `v15-guest.css` di root.

`index.html` menambah `<link rel="stylesheet" href="v15-guest.css?v=15.0" />` selepas stylesheet lain dan menggunakan `app.js?v=15.0` untuk membantu cache refresh. **Tidak perlu ubah Firebase Rules.**

Setelah deploy, buka pautan tetamu sebenar pada iPhone, refresh browser, dan cuba kamera, audio, ucapan dan hadiah. Pastikan tiada fail lama yang tertinggal dalam cache.

## Ujian dan had

- Ujian Chromium simulasi pada 320 × 568, 360 × 650, 375 × 667, 390 × 650, 390 × 720, 390 × 844, 430 × 850, 768 × 1024 dan 1280 × 800 menunjukkan **tiada horizontal overflow / vertical overflow pada skrin dashboard** dengan nama dan kandungan contoh.
- Semakan interaksi pada 390 × 720: BM/English, nama tetamu → kamera, galeri, perakam kaset suara, borang ucapan, Salam Kaut — semua boleh dibuka, tiada ralat JavaScript.
- Ukuran skrin/toolbar Safari berbeza antara iPhone, tetapan kebolehaksesan dan Zoom. Jika tulisan sangat besar, nama pasangan terlalu panjang atau ruang browser sangat pendek (contohnya papan kekunci sedang dibuka), scroll mungkin berlaku **untuk mengelakkan kandungan dipotong**. Hanya halaman **dashboard utama tetamu** disasar menjadi satu skrin; halaman kamera, galeri dan perakam suara dibenarkan scroll apabila perlu.
- Ujian belum dilakukan pada Safari iPhone sebenar atau Firebase produksi. Fail ini bukan kemas kini automatik ke website awam; publish GitHub Pages perlu dibuat pada repositori.

**Nota visual:** imej preview PNG yang disediakan berasingan menggunakan foto yang kelihatan dalam screenshot pengguna untuk menggambarkan susunan. PNG tersebut **tidak dibundel** dalam website; foto majlis sebenar diterima melalui Firebase seperti sebelum ini.


## V21 — Kamera skrin penuh (31 Oktober 2026)

- Tekan **Jadilah Lensa Kami**: paparan kamera terus dibuka, tanpa halaman perantaraan atau scroll.
- Paparan menepati ruang browser (Safari toolbar kekal dikawal oleh iOS).
- Filter dibuka sebagai panel terapung melalui nama filter atau ikon tetapan.
- Kawalan Lebar / Biasa, flash, tukar kamera, tangkap dan muat naik galeri kekal.
- Kamera belakang dipilih secara lalai, dan browser meminta kebenaran kamera pada penggunaan pertama.
- Muat naik dan kamera fizikal memerlukan browser yang menyokong fungsi berkenaan; kamera web memerlukan HTTPS atau localhost.
- Fail asal V20 tidak diubah; versi ini dikeluarkan secara ZIP baharu.
