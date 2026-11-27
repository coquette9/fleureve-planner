# TESTING — Fleureve Planner RELEASE

Pengujian tanggal 22 November 2026 menggunakan Chromium 158 dari Chrome for Testing, localhost HTTP, dan profil terpisah dengan data contoh. Browser menjalankan HTML/CSS, DOM, formulir, dialog, IndexedDB, localStorage, service worker, Cache Storage, dan unduhan. Viewport desktop 1366×900 serta emulasi mobile 390×844. V9d hanya dipakai sebagai pembanding visual.

## PASS

| Area | Yang diuji |
| --- | --- |
| Work | Proyek, fase, milestone, tugas, edit tanggal, progress dan Done, Month/Year dan Timeline. Tugas dan milestone terkait dihapus melalui dialog. |
| Reminder | Edit Task memuat H-3, acuan serta jam. Simpan tanpa perubahan mempertahankan jadwal. H-7 menggantikan H-3. Perubahan acuan, pengingat tambahan, reload, pengingat tetap, tanggal kosong, Tomorrow/Backlog, serta alarm yang ikut dibersihkan lulus. H-3 milestone ikut bergeser setelah tanggalnya diubah. |
| Personal | Tambah task melalui Today’s Little Plans, General Checklist dan Shopping List, tanggal/catatan, ↑/↓, Reset, harga/toko, Dream List dan Purchased sticker, Routine sticker dan undo setelah reload, Mood, Habit, serta Little Win. |
| Prayer | Provinsi/kabupaten/kota, UTC+7/+8/+9, persistensi wilayah, pemetaan manual per lokasi, unduhan template, penolakan CSV invalid, preview serta pembatalan/persetujuan Replace, impor file/teks, isolasi dua wilayah, reload, penghapusan dan fallback lokal. Sakelar alarm per shalat serta checklist Isya bertahan setelah reload. Alarm Magrib dipicu dari jadwal impor dengan jam uji. Snooze dibatalkan saat wilayah berubah, dan Dismiss menutup alarm tanpa memicunya ulang. Dismiss pengingat umum juga diuji. |
| .ics | Unduhan Prayer sukses. Agenda yang dipilih memakai zona Asia/Jayapura, waktu yang diimpor, UID unik, dan VALARM lima menit sebelumnya. |
| Backup dan PWA | Unduhan Work/Personal, dua Merge, Replace, backup format lama, store prayerSchedules, offline reload, penulisan offline pada kedua ruang, reconnect, dan persistensi lulus. Upgrade FINAL → RELEASE pada origin sama mempertahankan data dan mengganti cache lama. |
| Visual | Kelima tema diperiksa pada 14 halaman di ukuran desktop/mobile yang sesuai. Tidak ditemukan overflow horizontal tingkat halaman atau exception JavaScript utama dalam skenario QA. CSS, ikon, aset, dan palet identik dengan V9d. |

## Verifikasi SIHAT

| Wilayah | Kode widget | Zona |
| --- | --- | --- |
| Kota Sorong | 9671 | WIT |
| Kabupaten Sorong | 9601 | WIT |
| Kabupaten Raja Ampat | 9603 | WIT |
| Kabupaten Manokwari | 9202 | WIT |
| Kota Makassar | 7371 | WITA |
| Kota Administrasi Jakarta Pusat | 3171 | WIB |

Keenam URL widget resmi mengembalikan HTTP 200 dengan judul lokasi yang cocok. Tautan yang dihasilkan Fleureve diperiksa dan halaman resminya dibuka langsung di Chromium. Panduan resmi: https://sihat.kemenag.go.id/widget.

## FAIL — batas layanan eksternal

Keenam respons SIHAT mengirim **X-Frame-Options: SAMEORIGIN**. Pengujian iframe lintas-origin menghasilkan area kosong meski HTTP 200. RELEASE memakai tautan langsung pada panel yang sama agar wilayah aktif terbuka di situs resmi. Fleureve tidak membaca iframe atau memakai waktu resmi tersebut untuk alarm.

## NOT TESTED

- Safari/iPhone fisik dan pemasangan PWA di iPhone/Windows.
- Bunyi yang benar-benar terdengar, alarm saat perangkat terkunci/aplikasi tertutup, dan penerimaan alarm oleh kalender perangkat setelah impor .ics.
- Kecocokan seluruh 514 pemetaan SIHAT. Enam wilayah di atas memiliki pemetaan otomatis terverifikasi; wilayah lain dapat menyimpan URL manual.
- Akurasi astronomis perhitungan lokal dibanding jadwal resmi dan kebenaran isi CSV pengguna.

## Tangkapan layar

Folder qa-screenshots berisi pembanding Home Work/Personal V9d dan RELEASE dengan data kosong, tampilan RELEASE terisi, form reminder, Daily Lists, Prayer Corner, serta halaman SIHAT Kota Sorong yang terbuka langsung. Data uji bukan data pribadi. Tanggal/jam pada tangkapan layar merupakan snapshot, bukan jadwal untuk dipakai kembali.

## Uji singkat di perangkat sendiri

1. Ekspor JSON dari kedua ruang. Gunakan origin pengujian dan data contoh untuk Merge/Replace.
2. Buat task H-3, ubah deadline dan cek **Settings → Reminders**. Set reminder milestone dan ulangi. Tambah dua item Daily Lists, ubah urutan, reload, lalu Reset.
3. Pilih Kota Sorong lalu Kabupaten Sorong dan buka tautan resmi masing-masing. Pastikan nama wilayah benar. Uji CSV dan cek sumber yang tertulis sebelum mengandalkan countdown.
4. Buka versi HTTPS di Safari, muat online sekali, uji mode pesawat, lalu sambungkan kembali. Uji alarm saat aplikasi terbuka dan impor .ics pada kalender perangkat jika ingin memakainya.

## Auto-sort completed items (Chromium emulation, 390x844 and 1366x900)
PASS (General Checklist and Shopping List, 3 items each): check first -> bottom; second -> below first; uncheck -> back among open items; manual ↑ then check works together; completed arrows disabled; order persists after reload; progress 33%; Reset unchecks all and keeps items.
PASS: Today's Little Plans (3 plans); Work project list (3 tasks); backup contains doneAt, Merge restore keeps order; Done page unchanged; no JS errors.
Design: style.css, icons and layouts byte-identical to the previous RELEASE. Not tested: Safari iPhone/Windows, Replace-restore, 5-theme visual re-check.

# Final update tests (Chromium emulation; iPhone 390x844, desktop 1366x900) — 35 checks PASS, 0 JS errors
Plans: ✓ + strike-through + filled checkbox, order, uncheck, reload.
Legacy list (4 items without position, ids not in creation order): ↑ and ↓ swap only the chosen pair, order persists after reload, check/uncheck/Reset keep manual order and all 4 items.
Routines: create 5, edit name/icon/interval keeps history, Show on Calendar No/Yes hides/shows icon, log today + past date from Calendar with no duplicates, tap again undoes with confirmation, Last done / Next correct, View History, Delete cancel and confirm, Home widget unchanged and still logging once, backup contains routines/logs/positions, Merge restore creates no duplicates, no horizontal overflow in 5 themes (mobile) and desktop, 5 cards visible on iPhone without scrolling, ⋯ target 44x44.
Not tested: Safari iPhone / Windows devices, Replace-restore, visual inspection of all 5 theme screenshots by eye (only Strawberry reviewed).
