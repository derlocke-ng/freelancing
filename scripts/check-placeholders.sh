#!/usr/bin/env bash
# Listet alle noch offenen Platzhalter der Website auf (Adresse, E-Mail, Telefon, Steuerangaben …).
# Vor dem Livegang ausführen: ./scripts/check-placeholders.sh
set -euo pipefail
cd "$(dirname "$0")/.."

pattern='class="ph"|example\.com|\+49 000|490000000000'

if grep -nE "$pattern" -- *.html; then
  count=$(grep -hcE "$pattern" -- *.html | awk '{ s += $1 } END { print s }')
  echo
  echo "Noch $count Zeile(n) mit Platzhaltern – siehe README.md, Abschnitt „Vor dem Livegang“." >&2
  exit 1
fi
echo "Keine Platzhalter mehr gefunden."
