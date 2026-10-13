#!/usr/bin/env bash
# Read-only verification of a local PostgreSQL custom-format backup.
# Does not contact Supabase or restore into any database.
set -euo pipefail
if [ "$#" -ne 1 ]; then echo "Usage: $0 /path/to/backup.dump" >&2; exit 2; fi
backup="$1"
if [ ! -f "$backup" ]; then echo "Missing backup: $backup" >&2; exit 2; fi
if command -v pg_restore >/dev/null 2>&1; then restore=pg_restore
elif command -v brew >/dev/null 2>&1 && [ -x "$(brew --prefix libpq)/bin/pg_restore" ]; then restore="$(brew --prefix libpq)/bin/pg_restore"
else echo 'pg_restore not found' >&2; exit 2; fi
listing=$(mktemp)
trap 'rm -f "$listing"' EXIT
"$restore" --list "$backup" > "$listing"
"$restore" --file=/dev/null "$backup"
for item in mahjong_device_sessions mahjong_game_states mahjong_session_audit mahjong_sync_conflicts mahjong_live_games mahjong_voice_diagnostics; do
 if ! grep -Eq "TABLE DATA public ${item}([[:space:]]|$)" "$listing"; then echo "MISSING TABLE DATA: $item" >&2; exit 1; fi
done
for item in mahjong_sync_peek mahjong_sync_generate_token mahjong_sync_valid_game; do
 if ! grep -Eq "FUNCTION public ${item}\(" "$listing"; then echo "MISSING FUNCTION: $item" >&2; exit 1; fi
done
echo 'BACKUP READ/CONTENT/MAHJONG INVENTORY PASS (not a restore test)'
