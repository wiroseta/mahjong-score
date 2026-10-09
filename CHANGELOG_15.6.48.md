# v15.6.48 — iPhone Safari tap / menu stabilization

- Moved CSS that had been appended **after `</html>`** into the document `<head>` so WebKit parses it consistently.
- Removed superseded v12.7 footer-menu override and consolidated the mobile footer controls and popup into one scoped rule set.
- Corrected stacking for an expanded top menu and ensured menu touch targets receive pointer events.
- Kept score, voice, user management, Live Sharing, Supabase, and game rules unchanged.
- Static inspection only: real iPhone Safari touch and visual regression tests are still required.
