# v15.8.1 — release verification

Date: 18 October 2026 (Asia/Jakarta).

The user authorized deployment to the existing GitHub Pages application and identified the current admin game as disposable test data. No SQL migration, Auth account change or Edge Function redeployment is part of this release.

## Changes

- Fan/Chicken Hand rules and False Chicken Hand penalty recording, correction and cancellation audit.
- Preserve hand counts, dealer/round and unrelated transactions when correcting False Chicken Hand.
- Fix PDF page-object allocation and the undefined combination-list reference; PDF uses all 22 combinations.
- Align main application version labels, diagnostics, manifest and PWA cache to v15.8.1. Cloud Trial remains at the prior baseline and is not part of this deployment.
- Cache only allowlisted same-origin public assets; bypass Supabase, non-GET, unknown paths and query-string requests. A failed HTTP response cannot overwrite a valid offline asset.
- GitHub Actions runs the complete Node regression and voice integration suite for application changes.

## Observed evidence

- 641 Node tests passed, 0 failed, 0 skipped.
- Main application inline JavaScript and service-worker syntax parsed successfully.
- Rules PDF: 2 A4 pages; combinations PDF: 5 A4 pages. Browser-generated files parsed strictly and all pages rendered/visually inspected in the preceding checkpoint.
- Authenticated local candidate adopted the existing test game from live Supabase.
- False Chicken Hand recording persisted at cloud revision 13 and survived a reload.
- Changing the offender persisted at revision 14, including the correction audit, and survived a reload.
- Cancelling the test penalty persisted at revision 15. The original scores and two original hand entries were restored; the cancellation audit was retained. Dealer and round remained unchanged.
- A write attempted from the displaced older admin browser session was rejected. Cloud revision remained 15 and no hand was added.
- Database/catalog checks were read-only; game changes were made only through the application UI on user-approved test data.

## Scope and remaining device checks

The two authenticated origins were Chrome on one Mac, not two physical devices. This proves the observed admin-session writer rejection, not all scorekeeper/multi-device permission scenarios. Real iPhone Safari, native share/save and installed-PWA upgrade/offline behavior require their own observed smoke results. Do not label an unexecuted device scenario PASS. User-authorized deployment and complete device certification are distinct statements.

## Rollback

Baseline v15.8 source commit: `13c13613c0176ad982df0c346a593a390b6bad69`.
Revert the release source changes and use a fresh cache revision when rolling back; never restore historical SQL drafts. Source rollback must not delete the Supabase game/audit ledger. The local pre-test backup was retained outside the public repository.

## Cloud Trial exclusion

Automatic approval review rejected the proposed Cloud Trial blob because its existing source is explicitly marked LOCAL TEST ONLY: DO NOT DEPLOY. The safer release excludes all Cloud Trial changes, retains its baseline files, and deploys only the main application tested live.

## User clarification and iPhone UI follow-up

Chicken Hand explicitly permits Pong and Chi (Chow); removed the misleading definition equating Chicken Hand with insufficient Fan. The 2-Fan Hu requirement remains a separate rule. Updated both the visible guide and its PDF. Physical iPhone PWA was observed on v15.8.1 with matching cloud scores; added standalone safe-area padding after observing status-bar overlap. Cache revision r2 distributes this correction.
