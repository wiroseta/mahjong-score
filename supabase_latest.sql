-- MAHJONG SCORE v15.6.36 | CURRENT DATABASE UPGRADE ONLY
-- Jalankan SEKALI di Supabase SQL Editor, setelah schema AI Diagnostic v15.6.33 terpasang.
-- Hanya memberikan hak hapus per laporan kepada Administrator. Tidak menyentuh data skor.
-- Backup database sebelum menjalankan perubahan.

GRANT DELETE ON TABLE public.mahjong_ai_diagnostic_reports TO authenticated;
DROP POLICY IF EXISTS diag_report_admin_delete ON public.mahjong_ai_diagnostic_reports;
CREATE POLICY diag_report_admin_delete
 ON public.mahjong_ai_diagnostic_reports
 FOR DELETE TO authenticated
 USING (public.mahjong_diagnostic_is_admin());
