# Fleureve Planner ♡ — RELEASE

Paket ini melanjutkan Fleureve-Planner-FINAL.zip. Fleureve menyimpan Work Space dan Personal Space secara terpisah di browser. Keduanya dapat dipakai offline setelah aset pertama kali dimuat. Akun dan layanan sinkronisasi tidak diperlukan.

## Meninjau dan memasang

1. Ekstrak ZIP. Untuk uji coba, jalankan folder tersebut melalui localhost HTTP atau HTTPS. Buka aplikasi sekali saat online agar service worker bisa menyimpan aset.
2. Dari versi yang sedang dipakai, buka **Settings → Export JSON backup** di Work dan Personal. Simpan kedua file di luar browser.
3. Setelah ditinjau, tempatkan file aplikasi pada alamat Planner yang sama. Tutup lalu buka kembali hingga aplikasi memakai versi baru. Pengujian perangkat tersedia di TESTING.md.
4. Di iPhone, buka alamat HTTPS melalui Safari lalu pilih Share → Add to Home Screen. Pemasangan ini perlu diuji di perangkat Anda.

IndexedDB tetap **versi 6**, backup JSON tetap **format 4**, dan nama cache RELEASE diakhiri dengan **v9d-release-verification**. Restore **Merge** mempertahankan data tambahan dan memilih versi yang lebih baru untuk ID yang sama. **Replace** mengganti isi ruang aktif dan meminta konfirmasi REPLACE. Backup Personal mencakup prayerSchedules. Bila berpindah origin, browser, atau perangkat, pulihkan kedua ruang secara terpisah dari backup.

## Reminder

- **Edit Task** memuat semua pengingat relatif yang sudah tersimpan, berikut acuan tanggal, hari sebelum, dan jam. Pilih **Add another relative reminder** untuk menambah aturan lain. Pilih **none** pada suatu aturan lalu simpan untuk menghapus aturan tersebut. Kombinasi acuan dan offset yang sama hanya dapat dipakai sekali.
- Reminder relatif mengikuti deadline, start date, atau planned date yang dipilih. Mengosongkan tanggal acuan menonaktifkan reminder tersebut hingga tanggal tersedia. Reminder tetap memakai tanggal/jam yang ditetapkan, dan Snooze berlaku tanpa menggeser resep jadwalnya. Perubahan jadwal relatif yang efektif menggantikan waktu bunyi sebelumnya.
- **Work → Projects → Set reminder** menawarkan Hari H, H-1, H-3, H-7, No Reminder, atau tanggal dan waktu khusus. Perubahan tanggal pada milestone yang sama memperbarui reminder relatif. Penghapusan task atau milestone turut membersihkan reminder yang terhubung.
- **Personal → Lists** memakai General Checklist atau Shopping List, dengan tanggal dan catatan opsional. Urutan item tersimpan. Reset checklist mengosongkan centang sambil mempertahankan item dan urutannya.

## Prayer Corner

1. Di panel **Official Live Schedule — Kemenag SIHAT**, pilih Provinsi lalu Kabupaten/Kota. Wilayah aktif tersimpan setelah reload.
2. Untuk enam wilayah terverifikasi, pilih **Open official schedule … on SIHAT**. Tautan langsung membawa Anda ke jadwal resmi wilayah aktif. Uji 22 November 2026 mendapati header SAMEORIGIN pada keenam URL, sehingga halaman Planner yang berbeda origin memakai tab resmi SIHAT. Dokumen widget: https://sihat.kemenag.go.id/widget.
3. Bila pemetaan otomatis belum diverifikasi, pilih wilayah pada halaman widget resmi SIHAT, salin URL widget, dan simpan pada kolom URL untuk wilayah tersebut. Tautan tersimpan per lokasi. Pastikan nama wilayah pada halaman resmi cocok dengan pilihan di Fleureve.
4. **Fleureve Prayer Times** memakai CSV yang cocok dengan lokasi, zona waktu, dan tanggal. Jika tidak ada, Fleureve hanya menghitung jadwal lokal untuk koordinat valid. Kabupaten/kota tanpa koordinat atau CSV menampilkan status jadwal belum tersedia. Perhitungan lokal tidak tervalidasi sebagai jadwal resmi. Jam di widget online tidak dimasukkan ke countdown, alarm, atau cache offline.
5. **Import schedule (CSV)** menerima file CSV atau teks yang ditempel. Template menggunakan Date,Subuh,Zuhur,Asar,Magrib,Isya dengan format YYYY-MM-DD dan HH:MM. Tinjau lokasi, zona waktu, tanggal, dan bulan yang akan diganti sebelum menyimpan. Sumber selalu diberi label **Imported Schedule — User Provided**. Hapus jadwal impor dari panel waktu internal untuk kembali ke sumber yang tersedia.
6. Alarm mengikuti waktu internal aktif dan sakelar masing-masing shalat. Snooze dari lokasi atau jadwal yang sudah berubah dibatalkan. Suara bergantung pada pengaturan browser; PWA memerlukan aplikasi tetap berjalan dan tidak menjamin alarm saat perangkat terkunci atau aplikasi tertutup.
7. **Settings → Export dated tasks (.ics)** mendukung pilihan shalat, 7/14/30 hari, zona waktu lokasi, dan alarm opsional. Hanya tanggal yang memiliki jadwal internal valid masuk ke file. Impor file itu ke kalender perangkat secara manual; perubahan di Fleureve tidak memperbarui kalender perangkat.

Lihat TESTING.md untuk hasil terbaru, batasan, dan tangkapan layar di folder qa-screenshots.
