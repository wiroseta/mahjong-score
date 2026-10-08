# v15.6.46 — User Management password-manager overlay mitigation

- Added `data-lpignore` and `data-1p-ignore` to User Management controls and generated user rows, to request that password-manager extensions skip them.
- Added `autocomplete=off` for new username and `autocomplete=new-password` for initial PIN, without changing login fields.
- Explicitly marked generated user-management action buttons `type=button`.
- No scoring, authentication, user data, SQL, or Edge Function changes.
- Extension behavior varies: LastPass may still inject icons despite these hints.
- Requires Safari/LastPass manual validation.
