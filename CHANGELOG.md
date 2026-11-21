# Perubahan dari Fleureve-Planner(4).zip

- **Tidak mengulang aplikasi dari awal:** kode Work/Personal, Timeline, proyek, GPS, habit, mood, sticker calendar, reminder, lima tema, serta data store lama dipertahankan.
- **Prayer Corner:** menambahkan Waisai dan referensi Pulau Misool, keduanya dengan WIT dan koordinat acuan berbeda. Penggunaan GPS sekarang meminta konfirmasi offset WIB/WITA/WIT, tidak otomatis memakai timezone ponsel.
- **Prayer Log:** jam checklist dicatat menurut zona waktu lokasi aktif dan menyimpan timestamp UTC mentah.
- **Prayer Reminder:** Snooze mencatat identitas lokasi agar tidak terpicu untuk lokasi berbeda. Pengingat shalat yang sudah dicentang tidak diulang ketika waktunya tiba.
- **Today's Reflection:** kumpulan kutipan pendek statis, dengan sumber tertaut dan referensi jelas; tombol Next/Save/Unsave/Favorites dan penyimpanan offline di IndexedDB.
- **IndexedDB:** naik secara non-destruktif ke versi 4 dengan store baru `reflectionFavorites` di Personal; disertakan dalam backup.
- **Backup:** metadata mengacu pada skema yang benar (`format:3`, `dbVersion:4`); UI Restore memperlihatkan ringkasan per store, opsi Merge, Replace dengan konfirmasi, dan satu transaksi lintas-store agar tidak merestorasi separuh jalan.
- **Gentle Routines:** mencegah pencatatan ganda untuk rutinitas dan tanggal yang sama, termasuk duplikasi stiker dari log lama.
- **Daily Little Notes:** kini berisi 215 catatan unik gabungan (103 yang sudah ada di versi sebelumnya + tambahan baru). Tetap non-repetitif dalam jendela riwayat.
- **Tema:** kode HEX utama dan muted dikoreksi agar selaras dengan spesifikasi, terutama Lavender Lace Ballet.
- **PWA:** service worker memperbarui cache ke `fleureve-v7` dan mencakup `reflections.js` untuk offline.
- **Pemeriksaan terbatas:** sintaks JS lulus, dan unit-test murni Node untuk fungsi tanggal, lokasi, stiker, kutipan, notes lulus. UI browser end-to-end tidak teruji di lingkungan ini karena kebijakan Chromium melarang seluruh navigasi URL.

## Bukan kemampuan baru
- Tidak ada login/Google Sync, server/API token, atau pengiriman Work/Personal ke cloud.
- Jadwal shalat otomatis resmi Kemenag **belum tersedia**; yang ditampilkan adalah hitungan lokal tidak tervalidasi dengan tombol menuju situs SIHAT untuk pembanding manual.
- Alarm saat aplikasi tertutup **tidak dijamin**. Pengujian iPhone/Windows tetap dibutuhkan.
