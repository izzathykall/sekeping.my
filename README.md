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

---

## Sekeping.my V8 — Galeri Kenangan & Suara

Versi ini **dibina daripada Sekeping V7 yang telah diaudit**, bukan laman baru. Semua perubahan adalah kemas kini frontend dan penyimpanan demo; `database.rules.json` dan `storage.rules` V7 kekal digunakan.

### 1. Satu galeri untuk semuanya

Dua kad **Album Saya** dan **Galeri Tetamu** pada laman utama kini digantikan dengan satu kad **Galeri Kenangan**. Halaman itu mempunyai **empat tab**:

- **Semua Foto** — foto seluruh majlis, termasuk foto anda.
- **Foto Saya** — hanya foto yang berkaitan dengan identiti sesi tetamu ini; boleh muat turun setiap foto atau ZIP sendiri.
- **Suara** — dengar rakaman yang dihantar, dan gunakan butang Rakam suara untuk menghantar rakaman baharu.
- **Ucapan** — baca pesanan, dan gunakan butang Tulis ucapan untuk menghantar pesanan baharu.

Kawalan kegemaran dan penapis Dengan Ucapan masih tersedia pada tab foto. Gambar tetamu lain tidak mempunyai butang muat turun. Foto sendiri yang terlihat dalam tab Semua Foto masih boleh disimpan kerana milik identiti sesi yang sama. *Nota keselamatan:* gambar paparan dalam browser masih boleh disalin secara teknikal; sekatan UI bukan perlindungan sempurna.

### 2. Gambar pengantin pada banner galeri

Banner galeri kini menggunakan **foto pasangan sama yang dimuat naik melalui Dashboard → Reka bentuk**, dengan kedudukan dan zoom tersimpan. Dalam V7 imej asal telah dipanggil, tetapi `background:... !important` pada CSS menutupnya. V8 menggunakan elemen imej khusus, dilapisi gradien supaya tulisan kekal jelas. Jika tiada foto pengantin dimuat naik, akan ditunjukkan warna sage sebagai fallback.

### 3. Pemain suara yang lebih stabil

- Kawalan native Safari yang boleh menunjukkan kotak ralat besar telah digantikan dengan pemain tersuai Sekeping: Play/Jeda, bar kedudukan dan masa.
- Skrin dashboard dan tab Suara dalam Galeri menggunakan pemain yang sama.
- Rakaman baharu mengutamakan `audio/mp4;codecs=mp4a.40.2` / `audio/mp4` jika browser menyokongnya, kemudian WebM/Opus pada browser lain.
- URL Blob demo dicache supaya tidak sentiasa berubah semasa render UI.
- Rakaman kosong ditolak sebelum dihantar. Jika rakaman lama rosak atau codec lama tidak disokong browser, pemain menunjukkan mesej kecil bukannya ikon rosak besar. **Fail lama yang benar-benar tidak serasi masih perlu ditukar kepada M4A/AAC menggunakan alat pengurus/backend; app ini tidak boleh membaiki data audio rosak secara automatik.**

### 4. Arkib & Eksport

Penerangan `Kandungan satu ZIP: Gambar/ ... Suara/ ... Ucapan/ ... MAKLUMAT-MAJLIS.json` dibuang daripada dashboard. Butang muat turun ZIP pengurus dan kandungan sebenar fail ZIP tidak diubah.

### Pemasangan dan ujian

- Gunakan `Sekeping-my-V8-Lengkap-Tanpa-Subfolder.zip` bagi menggantikan seluruh root repo GitHub, atau ZIP kemas kini sahaja bagi menggantikan `app.js`, `data.js`, `styles.css`, `guest-v4.css` dan `README.md`.
- **Tiada subfolder** dalam ZIP pemasangan. Jangan padam fail lain yang disenaraikan sebagai wajib dalam README V7.
- Foto pengantin yang sudah tersimpan dalam Firebase akan terus digunakan, tidak perlu upload semula.
- Dalam browser automatik, saya uji upload foto pengantin, paparan banner galeri, empat tab, suara M4A yang berjaya dimainkan, ucapan, muat turun gambar sendiri/ZIP dan skrin pengurus pada telefon (390px), iPad (820px) dan desktop (1280px). Tiada ralat JavaScript atau horizontal overflow dalam ujian itu.
- **Ujian Safari iPhone dengan rakaman produksi lama dan Firebase live belum dilakukan.** Jika rakaman lama masih gagal, semak format fail/audio Storage dan migrasikan fail bermasalah ke M4A/AAC; audio baru diuji menggunakan M4A sebenar dalam browser Chromium.

---

## Sekeping.my V9 — Rakaman WAV, Framing Pintar, Kamera 4:3/16:9 & Lightbox

Versi ini dibina terus daripada **V8** dan mengekalkan tema krim/hijau gelap, dashboard pengurus, enam QR A5, galeri bersama, hak muat turun foto sendiri serta arkib ZIP untuk pengurus. **Tiada subfolder** dalam ZIP pemasangan GitHub Pages.

### Rakaman suara baharu

- Masalah rakaman Safari yang tidak dapat dimainkan atau terhasil sebagai fail kosong ditangani dengan kaedah rakaman **Web Audio PCM → WAV** secara terus apabila browser menyokongnya. Kualiti mono PCM 16-bit pada sample rate sebenar peranti; saiz sekitar 2.9 MB untuk 30 saat pada 48 kHz (lebih kecil pada sample rate rendah).
- Rakaman mesti melebihi kira-kira 1.4 saat sebelum butang berhenti dibenarkan. Kemajuan masa dipaparkan semasa rakaman. Selepas berhenti, rakaman boleh dimainkan dan disemak sebelum dihantar.
- Jika Web Audio tidak tersedia, sistem cuba `MediaRecorder` sebagai pelan sandaran. Format WAV menggunakan MIME `audio/wav` dan sambungan `.wav` untuk muat naik Firebase baharu.
- Pengurus majlis mempunyai pilihan **Gantikan audio** pada setiap rekod dalam **Dashboard → Suara & ucapan** untuk memilih WAV, M4A atau MP3 yang sah. Ia mengemas kini pautan rakaman tanpa menghilangkan nama pengirim/ucapan lain. Fail asal yang rosak tidak dipulihkan secara ajaib: gunakan fail audio sah yang masih anda miliki, atau minta rakaman semula. Untuk produksi, fail lama yang digantikan mungkin tetap wujud sebagai objek Storage yang belum dibersihkan.
- Rakaman lama yang formatnya tidak disokong atau benar-benar kosong masih tidak dapat dimainkan sebelum digantikan. Browser yang boleh memainkan audio tidak semestinya boleh membaiki metadata atau isi fail yang rosak.

### Foto pengantin landskap dalam bingkai potret

- Dashboard **Reka bentuk majlis** kini mempunyai dua pratonton serentak: bingkai **4:5 potret** dan **16:9 landskap**.
- **Penuhi bingkai** — foto memenuhi frame dengan `object-fit:cover`, bahagian luar akan dicrop (sesuai apabila subjek berada di tengah).
- **Papar keseluruhan** — seluruh foto kelihatan dengan `object-fit:contain`; ruang kosong menggunakan **latar kabur daripada foto sama**, bukan kawasan kosong hitam/putih. Ini disyorkan untuk gambar pasangan landskap.
- Kedudukan X/Y dan Zum boleh dilaraskan. Tetapan `coverFit` disimpan mengikut majlis dan dikongsi pada hero laman utama serta banner galeri.

### Kamera: nisbah gambar yang jelas

- Butang **Biasa/Lebar** yang dahulu mengubah orientasi secara tidak jelas digantikan nisbah tepat:
  - **3:4 (potret) / 4:3 (landskap)** — biasa, disyorkan untuk foto kumpulan, ruang lebih fleksibel.
  - **9:16 (potret) / 16:9 (landskap)** — lebih panoramik/sinematik tetapi crop lebih besar.
- Butang **Potret/Landskap** berasingan. Pemidang tilik sekarang ada bingkai yang berubah mengikut nisbah sebelum foto ditangkap. Gambar dieksport mengikut resolusi dan nisbah dipilih. 26 filter, Grain, Vignette, flash, kamera depan/belakang dan upload galeri kekal.

### Paparan gambar penuh galeri

- Tekan mana-mana gambar dalam **Galeri Kenangan → Semua Foto / Foto Saya** untuk membuka **lightbox skrin penuh** dengan imej lebih besar dan latar gelap.
- Butang tutup, gambar sebelumnya/seterusnya dan pintasan keyboard Escape/anak panah pada komputer.
- **Butang Simpan gambar saya** hanya ditunjukkan apabila foto milik sesi tetamu berkenaan. Foto tetamu lain boleh dilihat tetapi tiada butang muat turun.

### Perubahan fail

Untuk kemas kini daripada V8, ganti `app.js`, `camera-effects.js`, `data.js`, `styles.css`, `guest-v4.css`, dan `README.md` di root repositori. Fail lain kekal. **Tiada perubahan rules** yang diperlukan untuk V9 jika anda sudah menggunakan `storage.rules` dan `database.rules.json` V7/V8 yang disertakan. Untuk menggantikan audio produksi, log masuk pengurus sebenar dan pastikan peraturan upload Storage telah diterbitkan.

### Ujian setakat ini

- Ujian browser automatik pada lebar 390, 820, 1280 piksel: framing foto, mod contain/cover, gallery image lightbox, mod kamera biasa/lebar dan Potret/Landskap — lulus tanpa ralat JavaScript atau horizontal overflow.
- Rakaman PCM WAV sebenar daripada aliran WebAudio sintetik sepanjang 2.7 saat, play, simpan galeri dan upload gantian audio dalam mod demo — berjaya dimainkan tanpa ralat.
- **Had ujian:** belum diuji pada Safari iPhone fizikal atau Firebase live di repositori sebenar, dan tidak dapat menjamin pembaikan rakaman lama yang rosak. Sila uji rakaman 5–10 saat pada iPhone selepas upload ke GitHub sebelum acara sebenar.

---

## Sekeping V10 — Pembetulan masa pemain rakaman

**Masalah:** Selepas membuat rakaman (contohnya 00:05), pemain suara pada Safari/iPhone masih memaparkan `0:00 / 0:00` sehingga metadata audio siap, atau tidak memaparkan durasi langsung. Jam rakaman utama berfungsi tetapi pemain tidak mengambil durasi yang telah direkodkan.

**Pembetulan:**
- Pemain kini menerima `duration` daripada rekod Firebase / mod demo dan menunjukkan `0:00 / 0:05` walaupun `HTMLAudioElement.duration` belum tersedia, `NaN`, `Infinity` atau `0`.
- Pratonton selepas merakam menggunakan `state.recSeconds` yang sama dengan jam rakaman. Tempoh disimpan bersama rekod apabila suara dihantar.
- Untuk WAV baharu, jumlah sampel dalam header WAV boleh digunakan untuk mengesahkan tempoh apabila rakaman selesai.
- Selepas metadata audio berjaya dimuatkan, pemain bertukar kepada durasi audio sebenar dan mengemas kini bar kemajuan semasa dimainkan.
- Progress tidak lagi dipaksa kepada nilai palsu jika tempoh belum diketahui.
- Ujian browser automatik pada skrin 390px dan 820px: rakam → berhenti → durasi pada pratonton → mainkan → hantar → durasi di galeri, tanpa ralat JavaScript.

**Pemasangan:** Daripada versi V9, hanya **`app.js`** diperlukan untuk membaiki logik masa. `README.md` ikut disertakan sebagai dokumentasi. Kekalkan semua fail lain, struktur root tanpa subfolder.

**Perhatian:** Rakaman lama yang benar-benar kosong atau rosak mungkin masih gagal dimainkan dan perlu digantikan daripada dashboard. Pembetulan paparan masa tidak menghasilkan semula audio yang hilang. Safari iPhone fizikal dan Firebase live tidak diuji secara langsung dalam sesi ini.
