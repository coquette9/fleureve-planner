# RELEASE — 22 November 2026

- Form Edit Task memulihkan offset, acuan, dan waktu yang tersimpan. Pengguna dapat mengganti atau menghapus aturan yang dipilih serta mengelola beberapa aturan tanpa menduplikasi alarm.
- Prayer Corner memilih wilayah berdasarkan ID. Enam tautan SIHAT diperiksa terhadap judul resmi wilayah. Header SAMEORIGIN pada widget membuat Fleureve memakai tautan tab resmi yang membawa wilayah aktif.
- Sumber waktu internal memerlukan lokasi, zona waktu, dan tanggal yang cocok. CSV kini mendukung file, validasi tanggal/jam, preview, dan penggantian atomik setelah konfirmasi. Jadwal dari lokasi lain tidak dipakai sebagai cadangan.
- Alarm dan countdown memakai waktu internal yang sama. Snooze lama dibatalkan bila lokasi, waktu, atau pengaturan tidak berlaku. Ekspor .ics menyertakan waktu internal valid beserta zona waktu lokasi.
- Tombol Add pada Today’s Little Plans mengisi tanggal hari ini. Pratinjau Prayer di Personal Home menyebut sumber yang dipakai untuk countdown.
- IndexedDB 6 dan backup format 4 dipertahankan. Cache PWA diperbarui untuk RELEASE. CSS, lima tema, dan aset V9d dipertahankan.

# Final Functional Fix — baseline V9d

- Menambahkan tipe General Checklist dan Shopping List, tanggal/catatan per daftar, serta urutan item yang tersimpan. Migrasi membiarkan daftar lama tetap sebagai daftar belanja.
- Menambahkan ID milestone dan pengaturan reminder melalui dialog proyek yang memakai penyimpanan dan alarm V9d.
- Reminder relatif dihitung ulang ketika tanggal acuan berubah dan dinonaktifkan saat tanggalnya kosong. Penghapusan tugas, milestone, atau proyek membersihkan pengingat terkait dalam transaksi yang sama. Reminder tetap dan snooze mempertahankan waktu masing-masing selama tanggal acuan tidak berubah.
- Mempertahankan format backup JSON 4, IndexedDB 6, dan aset desain V9d. Cache PWA memperoleh versi baru agar file aplikasi termuat setelah pembaruan.

# v6 Work & Calendar

- Proyek mendukung fase opsional, pengelompokan tugas, dan progres per fase. Nama fase bisa diubah tanpa memutus tautan tugas. Milestone dapat diisi secara terpisah.
- Work Today menampilkan proyek aktif, progres, tugas belum selesai, dan tenggat terdekat.
- Work Calendar bulanan menampilkan agenda kerja, tanggal mulai, tenggat, dan milestone, dengan Timeline sebagai tab tersendiri.
- Palet utama menjadi cream, dusty rose, dan muted matcha. Formulir lebih lapang dan navigasi bawah menampilkan seluruh tab pada layar HP.
- IndexedDB v5 dan backup JSON format 4 tetap kompatibel. Service worker memakai cache v9 dengan cakupan per alamat aplikasi.

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


## Penyempurnaan daftar belanja dan wishlist (v5)
- Personal Space kini mendukung banyak daftar bernama (Makeup, Bodycare, Belanja Bulanan, dll.) untuk Shopping maupun Dream Basket; setiap daftar punya ikon.
- Menambahkan tombol **+ Add** yang jelas dan dapat ditekan pada iPhone; tekan Enter juga tetap didukung.
- Perbaikan handler formulir memakai `form.elements.namedItem('t')` serta pesan error jika penyimpanan gagal.
- Database IndexedDB menjadi v5 dengan store `listGroups`; seluruh item lama tanpa `listId` ditampilkan dalam Everyday Basket / My Dreams, tidak dihapus.
- Hapus daftar memindahkan item ke daftar default, bukan menghapusnya; hapus hanya pada list non-default dan minta konfirmasi.
- Backup JSON (format 4) memuat store baru, tetap mendukung backup format sebelumnya untuk dipulihkan.

## v7 — Coquette Dashboard
- New Work Home (desktop collage: hanging tags, calendar with task titles, projects, focus, phase progress, agenda, deadlines, quick actions) and Personal Home (iPhone widgets: calendar with stickers, plans, routine icons, mood, wins, prayer preview, reminders, note, quick actions).
- All colors, ribbons and frames come from the active theme's CSS variables. Old Today/Home views are kept in code (workTodayOld, homeOld).
- No database changes. Cache bumped to v7.

## v8 — Visual refinement
- Local SVG ornaments per theme (natural bow, flower cluster, paper clip; strawberry / cherry / lavender sprig / wax seal / macaron motif), stacked-paper and scalloped panels, ruled note paper.
- Personal Home: tighter cells, compact mood row, routines full width. Nav verified fixed at bottom. Cache v8. No data changes.

## v9 (partial)
- Routines: create once, tap icon in the calendar's day panel to record/undo on any date (one log per routine per date, deterministic id), Show on Calendar option.
- Calendar: Month/Year toggle for Work and Personal (same data, no new store).
- Lists renamed Daily Lists / My Dream List, progress bar and Reset checklist (confirm, items kept), Home buttons open each directly. Cache v9.
- NOT done in v9: unified reminder redesign, per-prayer alarm toggles, Province>Kabupaten picker, selective .ics export, official Kemenag schedule (no public API).

## v9b
- Prayer: one source selector (imported CSV > local calculation) used by times, countdown and alarms; CSV import with validation, preview/confirm, replace confirmation, store `prayerSchedules` (DB v6, in backup); official SIHAT widget (iframe, user-pasted widget link validated against sihat.kemenag.go.id; not stored offline); per-prayer alarm toggles; honest source labels.
- Reminders: due reminders use a themed dialog (Dismiss, Snooze 5/10/15/30/custom) instead of prompt().
- Fix: Show on Calendar = No stays No when editing a routine.
- NOT done: Province>Kabupaten picker (no verified region-code list, codes are not guessed), Personal task reminder field, selective .ics export/prayer .ics, Daily List ordering/notes/dates, internal-page visual refinement.

## v9c
- Prayer: Provinsi > Kabupaten/Kota picker (searchable) from prodhokter/dataset-wilayah-indonesia (38 provinces, 514 regencies, bundled in wilayah.js, offline). Region identity = Kepmendagri code; widget URL built from it; imports and local calculation are keyed to the same region. Time zone derived from province (WIB/WITA/WIT). No coordinates in the dataset: regions show "no times" until you add coordinates, use GPS/Saved Location, or import CSV; nothing is estimated and Jakarta is never used as a silent fallback. CSV template no longer contains sample times.
- NOT done: Personal task reminder field, Work reminders by start/milestone, selective .ics and prayer .ics, Daily List dates/notes/ordering, internal-page visual redesign.

## v9d
- Fixes: widget URL is now stored per location (manual link no longer leaks across regions); alarm key includes region + source (not just coordinates); backup meta format 4 / dbVersion 6 / appVersion and restore version check updated; "Fleureve Prayer Times" heading separates the internal times from the SIHAT widget.
- Reminders (Work + Personal): optional reminder date/time on every task, plus "remind me H-30..H-0 before deadline / start date / planned date" (one reminder per base+offset, no duplicates). Deleting a task deletes its reminders.
- .ics export dialog: choose dated items, reminders (VALARM) and, in Personal, prayer times (range, prayers, alarm) with VTIMEZONE (WIB/WITA/WIT); unique UIDs.
- Visual: every internal page has its own stationery layout (planner paper, project journal tabs, dotted timeline grid, ribbon accomplishment tags, petal calendar cells, dotted-tape lists, diary routines, tilted mood journal, arched sage Prayer cards). Uses theme variables + existing SVG ornaments.
- NOT done: Daily List date/note/manual ordering/shopping-only fields; milestone-linked reminders; reminders do not follow task date changes automatically.
