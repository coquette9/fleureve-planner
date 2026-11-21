# Fleureve Planner ♡ — Edisi finalisasi lokal (21 November 2026)

> **Local-only, offline-first. Tanpa akun, tanpa cloud-sync, tanpa CDN.**
> Proyek ini dilanjutkan dari **Fleureve-Planner(4).zip** milik pengguna, bukan dibuat ulang.

## Instalasi
1. Ekstrak ZIP. Unggah **isi folder aplikasi** ke root repo GitHub Pages (mis. `fleureve-planner`).
2. GitHub → Settings → Pages → Deploy from branch → `main` / root.
3. Buka URL Pages `https://USERNAME.github.io/fleureve-planner/` di Safari iPhone, kemudian Share → Add to Home Screen. Di Windows, gunakan Install dari Edge/Chrome.
4. **Buka online sekali dan tunggu caching selesai**, lalu coba tutup internet dan muat ulang. Jangan memakai `file://` untuk menguji PWA.
5. Ekspor backup JSON masing-masing Work/Personal di Settings sebelum dan sesudah pembaruan.

**Penting:** data tersimpan di IndexedDB berdasarkan *origin dan path aplikasi*. Jangan hapus data situs, uninstall aplikasi, atau mengganti origin tanpa mencadangkan data. GitHub Pages hanya meng-host kode publik, bukan data tugasmu.

## Ringkasan isi
- Work: quick-add, To-Do, subtugas, reschedule dengan riwayat, proyek, fase, milestone, Gantt/timeline, dependensi ganda dengan pencegahan siklus, manual pin fokus, impor multiline/WhatsApp, complete log, reminder ketika aktif.
- Personal: Sticker Calendar terintegrasi, shopping basket, wishlist, Gentle Routines, little wins, habit/mood, reminder.
- Prayer Corner: zona waktu berbasis lokasi, 13 titik bawaan termasuk Waisai dan *pusat Pulau Misool (perkiraan)*, lokasi tersimpan dengan koordinat pengguna, pilihan GPS + **konfirmasi zona waktu**, countdown, checklist/riwayat, reminder in-app + snooze. **Jadwal merupakan estimasi astronomis lokal yang belum tervalidasi terhadap jadwal resmi Kemenag**, bukan pengganti referensi resmi.
- Reflection: 8 kutipan pendek yang diperiksa terhadap sumber terkait (7 ayat pendek, 1 kutipan hadis sahih) dan disimpan lokal untuk offline; Today’s Reflection, Another Reflection, Favorites, tautan sumber.
- Lima tema coquette/vintage + Soft Sage Garden di Prayer Corner, **215 Daily Little Notes unik**.
- Backup per ruang, Merge/Replace dengan preview dan konfirmasi eksplisit, ekspor tugas dan reminder `.ics`, PWA offline-first.

## Cara mengamankan dan memulihkan data
- Work dan Personal **berada di database terpisah**. Backup kedua ruang secara terpisah.
- **Export JSON** menyimpan semua object store versi 4 (termasuk Favorites, pengingat, jadwal GPS pada `prefs`).
- **Import JSON**: pilih file dan pastikan ruang sama → pratinjau jumlah catatan tiap kategori → **Merge** untuk menggabungkan record berdasarkan ID dan `updatedAt`, atau **Replace** untuk mengganti keseluruhan data pada ruang tersebut. Untuk Replace, wajib ketik `REPLACE`.
- Import mendukung format backup versi sebelumnya selama ruang cocok, tetapi backup versi lebih baru tidak diimpor oleh aplikasi versi lama. Proses pemulihan memakai satu transaksi IndexedDB lintas-store agar tidak meninggalkan pemulihan separuh jalan.
- Sebelum mencoba Replace, simpan **backup lain** di luar aplikasi (mis. Files/iCloud Drive). Tidak ada backup otomatis.

## Jadwal shalat dan lokasi
- Waisai: titik kota dari OSM/Mapcarta (sekitar -0.42108, 130.82295). *Misool Island (approx.)*: pusat pulau dari GeoNames/Mapcarta (sekitar -1.86667, 130.16667). Untuk distrik/kampung tertentu (Lilinta, Fafanlap, dst.), tambahkan **Saved location** sesuai koordinat setempat. Waisai dan Misool jelas **tidak menggunakan jadwal yang identik**.
- Pilihan GPS **tidak lagi menganggap timezone perangkat pasti benar**. Aplikasi menawarkan nilai awal berdasarkan bujur secara kasar, tetapi pengguna diminta mengonfirmasi 7=WIB/8=WITA/9=WIT sebelum jadwal aktif. Ini bukan deteksi zona waktu administratif sempurna untuk setiap koordinat.
- Perhitungan offline: Subuh -20°, Isya -18°, Asar standar, penambahan 3 menit. **Belum dibuktikan identik** dengan metode atau jadwal resmi Kemenag untuk daerah/tempat/tanggal tertentu. Untuk ibadah, cek jadwal masjid/lokal/SIHAT: https://sihat.kemenag.go.id/jadwal-salat. Tautan membuka situs resmi saat ada internet; data resmi **tidak** otomatis diunduh atau disimpan sebagai kalender offline karena akses data mentah membutuhkan mekanisme berizin.
- Reminder hanya aktif bila aplikasi berjalan dan browser mengizinkan; timer/audio dapat dibekukan di iPhone, terutama saat app tidak di depan. **Jangan bergantung pada PWA sebagai satu-satunya alarm shalat.**

## Sumber kutipan agama (diperiksa 21-11-2026)
- Al-Qur'an Digital — Ditjen Bimas Islam Kemenag: https://simbi.kemenag.go.id/al-quran/asy-syarh ; https://simbi.kemenag.go.id/al-quran/ad-duha ; https://simbi.kemenag.go.id/al-quran/al-asr
- HaditsMU Universitas Muhammadiyah Yogyakarta: https://islammu.umy.ac.id/haditsmu/1/3705/ (kutipan pendek hadis Sahih Bukhari 3705 menurut penomoran katalog UMY).
- Koleksi tersedia offline sebagai **kutipan pendek** dengan rujukan dan nama penerbit, bukan generator kutipan. Beberapa terjemahan mungkin tunduk pada syarat hak cipta penerbit; periksa izin sebelum mendistribusikan ulang secara luas.

## Pengujian dan keterbatasan
- **Lulus:** pemeriksaan sintaks seluruh JavaScript (`node --check`), uji fungsi murni di Node untuk konversi lokasi/tanggal/jam, perbedaan jadwal Sorong-Waisai-Misool, kalender stiker, koleksi 215 catatan, kutipan dan sumber, struktur Prayer Corner.
- **Belum teruji penuh di sini:** instalasi PWA, migrasi dengan data asli, backup/restore pada Chromium, audio/snooze pada Safari iPhone, timezone lokasi GPS nyata, jadwal dibanding sumber resmi untuk berbagai daerah dan tanggal.
- Browser Chromium pada lingkungan penyusunan ini memiliki kebijakan pengelola yang **memblokir navigasi ke seluruh URL**, termasuk alamat lokal. Oleh karena itu pengujian UI end-to-end tidak bisa dijalankan dari sini; jangan menganggap hasil uji Node sebagai bukti seluruh tombol/fitur benar di iPhone/Windows. Gunakan daftar uji pada `TESTING.md` sebelum memasukkan data penting atau mengganti aplikasi aktif.

## Catatan pembaruan (migrasi)
- Kedua database IndexedDB (Work dan Personal) dinaikkan dari versi 3 ke versi 4 tanpa menghapus store lama. `reflectionFavorites` ditambahkan ke Personal dengan `onupgradeneeded`, dan seluruh object store lama dipertahankan.
- `sw.js` berganti versi cache agar file `reflections.js` ikut disimpan untuk offline. Cache browser lama mungkin memerlukan hard reload sekali pada update pertama.
- Aplikasi tidak melakukan sync antar perangkat. Future Work-only Sync **belum diimplementasikan** dan tetap memerlukan desain migrasi dan keamanan tersendiri.
