# v15.6.45 — Admin Live Sharing Control

- User Management: collapsible Live Sharing Aktif with count, table/owner and stop one/all.
- All admin actions verified server-side in existing mahjong-user-admin Edge Function.
- Score Keeper checks server active status every 10 seconds while visible and before publishing or opening sharing; inactive session is cleared locally, preventing silent reactivation.
- Does not change scores, game history or voice.

## Deployment
1. Upload updated PWA files to GitHub Pages.
2. **Redeploy** `supabase/functions/mahjong-user-admin/index.ts` in Supabase Edge Functions. Existing environment secrets remain unchanged.
3. No SQL changes required if `mahjong_live_games` exists with active, id, scorekeeper_id, updated_at and table_name.
4. Test admin stop-one and stop-all with two active Score Keeper devices and guest viewers.

## Caveats
- Realtime push for owner shutdown is not introduced; owner detects within ~10 seconds when visible.
- Existing Supabase policies determine whether owner can SELECT own live session. If SELECT is denied, owner polling cannot detect shutdown; review RLS before production use.
- Manual cross-device browser regression testing remains necessary.
