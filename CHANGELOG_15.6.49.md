# v15.6.49 — Game Baru iPhone Batal / Mulai

- Memperbaiki error JavaScript pada `closeNew()`: pemanggilan `closeIOSNewGameVoiceFallback()` yang sudah tidak didefinisikan dihapus.
- Tombol Batal kini menutup dialog setelah menghentikan sesi voice.
- Tombol Mulai menggunakan `newGame()` yang sama dan kini dapat menuntaskan `closeNew()` tanpa error setelah menyimpan permainan.
- Versi tampilan dan service worker cache diperbarui.
- Tidak ada perubahan pada peraturan skor, Supabase, Live Sharing, atau alur voice lainnya.
- Belum diuji langsung pada iPhone Safari.
