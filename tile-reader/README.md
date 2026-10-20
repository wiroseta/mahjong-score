## Embedded game workflow — r17

The game camera icon opens a modal with the active player names, not a new tab. Choose the player, take a photo, review the inferred Kong count and supported combinations, then use the result to populate only that player's draft. Score preview updates through the existing calculation engine. Recording still requires Catat Hasil Tangan. Winner, Hu/Zi Mo, discarder, other players and saved history are not changed by a photo.

The parent binds results to the selected player, account, full game snapshot and current form. Frame origin, sender window, session and read ID must all match. Changing player (including identical display names), game state, or account invalidates a pending reading. Unrecognized faces and invalid/ambiguous Kong counts cannot apply. Only combination suggestions shared by every valid tile grouping are applied; manual combinations are retained if none can be established. Nonwinner photographs must contain only exposed groups and declared concealed Kongs, confirmed by the user. Petapa/exposure history and unsupported or ambiguous Joker-dependent combinations remain manual.

Standalone reader use remains available for recognition and administrator correction examples. It cannot address a game form without the embedded game context. The existing administrator Gemini pilot remains under Setting in the hamburger menu.

# Pembaca Foto Mahjong — r14

Ordinary readers take/select a photo and receive a score suggestion in the game modal. Tile cards and detection details are shown only to administrators. Correction selectors, review checkboxes and JSON export are inside the administrator panel only. Existing Mahjong Score login is reused; the current administrator role is checked through Auth getUser and database writes are protected by RLS using the existing current-user admin helper. No credentials are added to the reader.

Administrator workflow on a phone: open Perbaikan pembacaan, correct tile labels and review boxes/coverage, then Simpan contoh perbaikan. Saved descriptors are drafts until Aktifkan is pressed. Nonaktifkan reverses their use. Only signed-in users can read active references; unauthenticated readers retain the base local model. Original photos, names, account IDs and original-image hashes are not stored in the examples table. Tile descriptors and labels are shared with signed-in readers on activation.

This is conservative nearest-example assistance, not ONNX model retraining or program source rewriting. A 24x24 grayscale descriptor is normalized for light/contrast; a match requires cosine similarity >=0.985 and a 0.06 margin against other labels. Ambiguous examples leave model output unchanged. The original model label remains separately visible to administrators. This does not fix missed detections, prove a legal hand or calculate a score.

The new schema is in supabase/photo_reader_examples.sql; access checks are in supabase/tests/photo_reader_examples_rls.sql. The additive schema has no anon grant and requires current server-verified administrator rights for writes. Live database role tests pass and roll back every test row. Administrator UI save/activation/deactivation were tested in an isolated browser fixture at phone width; these fixture tests are distinct from live database authorization tests.

Local preview fixtures in tmp/photo-reader-preview are deliberately excluded from release. Base runtime assets and model are unchanged. Sources and licenses remain in NOTICE.md. The base model and runtime assets are unchanged from r13.

Administrator dapat menekan **Tambah kotak tile** setelah membaca foto, lalu menarik kotak atau mengetuk dua sudut tile yang terlewat. Pilih label pada bagian Perbaikan pembacaan. Kotak manual tidak menebak jenis tile; hasil belum dapat digunakan sampai label valid dipilih. Label lain yang telah dikoreksi dipertahankan. Pemeriksaan bingkai dan kelengkapan harus diulang. Membaca ulang foto mengganti hasil manual dengan deteksi baru.


## Konsistensi pembacaan — v15.9 r6

Setiap pembacaan memperbarui referensi aktif (semua halaman, bukan hanya 600 contoh). Kegagalan jaringan dilaporkan ke ringkasan poin, tidak ditelan diam-diam. Foto yang sama mengikuti strategi area otomatis yang sama ketika dibaca ulang. Dua crop dibandingkan; hasil berbeda/kurang jelas diberi status perlu konfirmasi. Kamera langsung dapat mengambil tiga gambar lokal dan memerlukan dua susunan yang sama. Tidak ada pelatihan ulang ONNX atau jaminan akurasi 100%.

Simpan contoh perbaikan juga menyimpan SHA-256 berkas dan koreksi lengkap label/kotak/area. Tidak menyimpan foto, nama berkas, nama pemain, atau ID pemilik. Draf/aktivasi memakai hak administrator di server; anggota hanya dapat membaca koreksi aktif. Aktivasi contoh dan koreksi satu batch transaksional. Foto yang sama memakai koreksi aktif tersebut sebelum inferensi. Foto baru tetap memerlukan model dan validasi aturan. Perubahan konteks pemain/pemenang/angin tetap dihitung ulang oleh aplikasi induk; hasil poin tidak di-cache.

Schema tambahan: supabase/photo_reading_corrections.sql. RLS diverifikasi dengan fixture yang di-rollback. Antrean unggah foto otomatis tidak diaktifkan dalam r6. Lihat NOTICE.md untuk status izin model yang belum terselesaikan.

### r7 — hasil pembacaan dan validitas poin dipisahkan
Hasil seluruh foto menjadi acuan; pembesaran yang merusak klasifikasi tidak otomatis menggantikannya. Maksimal tiga alternatif label/confidence dikirim hanya ke aplikasi induk pada origin/sesi yang sama. Mesin aturan memeriksa alternatif menurut konteks permainan. Jika hanya hasil seluruh foto yang membentuk tangan valid, hasil itu dapat digunakan. Hasil poin yang berbeda antar alternatif atau kualitas rendah tetap memerlukan konfirmasi poin. Ini tidak menjamin kebenaran model dan tidak menambah unggahan foto. Contoh 17 tile Karakter yang dilaporkan pengguna menjadi fixture regresi dari hasil inferensi CPU aktual, bukan label yang disisipkan ke pengenal.
