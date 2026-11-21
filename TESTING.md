# Checklist pengujian Fleureve Planner ♡

**Jangan masukkan data kantor/ibadah yang penting sebelum pengujian dengan data dummy.** Uji di alamat Pages yang akan benar-benar dipakai (domain dan path yang sama).

## Keamanan pembaruan
- [ ] Simpan ZIP lama (`Fleureve-Planner(4).zip`) di tempat lain.
- [ ] Export backup Work JSON & Personal JSON sebelum deploy update ke origin yang sama.
- [ ] Setelah update/reload, tugas proyek, riwayat, wishlist, lokasi dan checklist lama masih ada.
- [ ] Seluruh 5 tema dapat dipilih, aplikasi dapat ditutup dan dibuka tanpa kehilangan tema.

## Work
- [ ] Tambah tugas dan subtugas; edit judul, tanggal mulai, rencana dan deadline; selesai sesuai tanggal aktual.
- [ ] Reschedule Tomorrow/Backlog/tanggal manual mempertahankan catatan/subtugas.
- [ ] Buat proyek, fase dan milestone; lihat progres dan Timeline Week/Month/Custom.
- [ ] Pilih beberapa dependensi; coba siklus A→B→A (harus ditolak dengan pesan, dialog tetap aman).
- [ ] Paste catatan WhatsApp, preview/edit, impor beberapa tugas, cek deduplikasi.
- [ ] Pin, urutkan dan unpin My Focus Today, reload dan cek urutan.
- [ ] Tambah reminder dan snooze saat aplikasi berjalan. Jangan asumsikan reminder berjalan ketika tertutup.

## Personal
- [ ] Lengkapi Hair Mask pada hari tertentu, pastikan stiker di tanggal aktual bukan tanggal rekomendasi.
- [ ] Lewatkan hari rutinitas: tidak ada overdue merah/penumpukan.
- [ ] Log habit dan mood, beli barang wishlist, buat Little Win; cek tanggal stiker.
- [ ] Settings → Prayer, ganti Sorong, Waisai, Misool, Manokwari; waktunya berubah berdasarkan lokasi dan tanggal.
- [ ] Tambahkan Saved location dengan koordinat desimal negatif; reload.
- [ ] GPS: konfirmasi zona waktu, lalu cek lokasi/tanggal/hari perangkat.
- [ ] Centang shalat dan reload; ganti lokasi dan cek riwayat tidak hilang.
- [ ] Another Reflection, Save to Favorites, buka Favorites, reload, lalu hapus Favorites.
- [ ] Buka View Source ketika online; teks harus sama dengan sumber yang disebut.
- [ ] Uji in-app prayer reminder/snooze dengan waktu mendekati jadwal; cek perangkat mute, background & Safari iPhone.

## Restore (WAJIB DENGAN DATA CONTOH)
- [ ] Export Personal JSON, buka file dan lihat `dbVersion: 4` dan kategori `reflectionFavorites`.
- [ ] Import JSON: preview menunjukkan jumlah catatan yang benar.
- [ ] Merge file sama dua kali: tidak menduplikasi catatan ber-ID sama.
- [ ] Replace: perlu mengetik `REPLACE`; pembatalan tidak mengubah data.
- [ ] Ganti data dummy, lalu Replace memakai backup; semua store cocok.
- [ ] Import backup Work ketika Personal aktif: harus ditolak.
- [ ] Putus internet setelah pernah membuka aplikasi online: reload PWA, buka Prayer dan Reflections; konten lokal tetap muncul (link sumber daring tidak bisa dibuka).

## Hasil aktual
Isi hasil dan screenshot setelah kamu mencoba di iPhone/Windows. Saat ini **belum ditandai lulus** karena browser lingkungan penyusunan memblokir navigasi.
