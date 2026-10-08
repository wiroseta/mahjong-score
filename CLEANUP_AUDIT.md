# v15.6.44 — CSS usage audit and regression

Baseline: v15.6.43.

- Parsed 29 CSS style blocks, 897 qualified rules and 433 distinct selector strings.
- Scanned static HTML, inline JavaScript and local JavaScript for selector references.
- Removed eight provably unreferenced CSS rules (nine class references; one rule contains two).
- Retained nine duplicate selector/declaration combinations because cascade context could affect behavior.
- Retained historic CSS overrides where responsive cascade could be meaningful.
- No score, voice, Supabase, or game algorithms changed.
- Chromium browser navigation was attempted on desktop, iPhone SE and Samsung A17 emulation, but this runtime returned ERR_BLOCKED_BY_ADMINISTRATOR for both file and localhost URLs. Visual regression tests could not run; do not treat this build as visually verified.
- Physical iPhone/Android, microphone, Supabase, and interaction regression remain outstanding.

Removed CSS selectors:
- `.mobileScore`
- `.guide-note`
- `.mjtile.dragon-red`
- `.mjtile.dragon-green`
- `.mjtile.dragon-white .whitebox`
- `.rules-close`
- `.live-view-card`
- `.live-link-detail`
