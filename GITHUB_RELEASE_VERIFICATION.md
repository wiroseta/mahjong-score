# Pemeriksaan perbandingan dua ZIP (13 Oktober 2026)

Sumber A: mahjong-score-main(4).zip — baseline GitHub pengguna, aplikasi v15.7.13, berisi .github/workflows, .gitignore, .nojekyll; ZIP memiliki direktori mahjong-score-main bersarang duplikat.
Sumber B: Mahjong_Score_4P_PWA_v15.7.15_617PASS_6FAIL_STAGE17_CLOUD_ON_UNVERIFIED_CANDIDATE(2).zip — kode v15.7.15 dan modul sync baru, namun kehilangan file dotfiles/workflows. Cloud ON candidate sebelumnya 617 PASS / 6 FAIL.

Paket ini: kode kandidat v15.7.15 dipertahankan, empat file konfigurasi GitHub asli dipulihkan, Cloud Sync DISABLED demi mencegah penguncian skor sebelum uji Auth nyata. Tidak memasukkan folder mahjong-score-main bersarang.

PENTING: Bukan rilis transfer otomatis aktif. Jangan mengklaim perangkat baru otomatis memulihkan permainan sampai uji end-to-end lulus. Lima RPC telah dilaporkan terpasang oleh pengguna, tetapi belum diuji lewat dua sesi nyata. Pengujian Node tidak menjamin Safari atau Supabase.

GitHub Desktop Summary: v15.7.15 - Restore complete repo and keep score entry safe
GitHub Desktop Description: Merge latest app code with original GitHub workflows and dotfiles. Keep Cloud Sync OFF pending live Auth transfer verification. Preserve existing repository files when copying.
