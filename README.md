# Maximilian Locke – IT Freelancer

Website und Portfolio für **Maximilian Locke – IT Freelancer**: Linux-Server, Netzwerke & VPN,
Automatisierung mit Bash und Python, Container, Webdesign, Icon-Design und betreutes Hosting.

Reines HTML, CSS und JavaScript – **kein Build-Schritt**, keine Frameworks, **keine Anfragen an
Drittanbieter** (Schriften lokal, keine Cookies, kein Tracking). Gebaut für **GitHub Pages**.

## Aufbau

```
index.html            Startseite: Leistungen, Hosting, Zusammenarbeit, Referenzen, Tech-Stack,
                      Arbeitsweise, Ablauf, Über mich, FAQ, Kontakt (Anfrage-Assistent)
projekte.html         Projektübersicht mit Filter (22 Projekte)
impressum.html        Impressum nach § 5 DDG
datenschutz.html      Datenschutzerklärung (DSGVO, TDDDG)
404.html              Fehlerseite für GitHub Pages
assets/css/style.css  das komplette Design (Farben als CSS-Variablen in :root)
assets/js/theme.js    setzt das gespeicherte Farbschema vor dem ersten Rendern
assets/js/main.js     Menü, Hell/Dunkel, Terminal-Animation, Projektfilter, Anfrage-Assistent
assets/fonts/         Geist & Geist Mono (SIL Open Font License 1.1)
assets/img/           Logo/Favicon, Social-Preview (og-image.png), Projektbilder, Kiwi-Icons
scripts/check-placeholders.sh   listet alle noch offenen Platzhalter auf
```

## Lokal ansehen

```bash
python3 -m http.server 8000
# → http://localhost:8000/
```

Die Fehlerseite (`404.html`) verweist per `<base href="/freelancing/">` auf das Projektverzeichnis
von GitHub Pages – lokal unter `localhost:8000` sieht sie daher ungestylt aus. Das ist normal.

## Veröffentlichen auf GitHub Pages

1. Den Stand in den Branch `main` übernehmen (Pull Request mergen).
2. Im Repository: **Settings → Pages → Build and deployment → Source: „Deploy from a branch“**,
   Branch **`main`**, Ordner **`/ (root)`**.
3. Nach ein bis zwei Minuten ist die Seite unter **https://derlocke-ng.github.io/freelancing/** erreichbar.

`.nojekyll` sorgt dafür, dass GitHub die Dateien unverändert ausliefert.

## Vor dem Livegang: Platzhalter ersetzen

Alle Platzhalter sind auf der Seite **gelb gestrichelt** markiert (`<span class="ph">…</span>`).
Nach dem Eintragen den Text ersetzen **und das umschließende `<span class="ph">` entfernen**.

```bash
./scripts/check-placeholders.sh     # zeigt Datei und Zeile jedes offenen Platzhalters
```

| Platzhalter | Wo | Hinweis |
|---|---|---|
| `[Straße Hausnummer]`, `[PLZ Ort]` | `impressum.html`, `datenschutz.html` | ladungsfähige Anschrift, kein Postfach |
| `kontakt@example.com` | `index.html` (Link, Formular `action` und `data-mailto`), `impressum.html`, `datenschutz.html` | |
| `+49 000 0000000` / `tel:+490000000000` | `index.html`, `impressum.html`, `datenschutz.html` | Telefon als zweiter schneller Kontaktweg |
| `[Ort]`, `[Region]` | `index.html` (Über mich, FAQ, Kontakt) | z. B. Stadt bzw. Umkreis für Vor-Ort-Termine |
| Umsatzsteuer-ID / Wirtschafts-ID | `impressum.html` | nur angeben, **falls vorhanden**, sonst Zeile löschen |
| Kleinunternehmerregelung (§ 19 UStG) | `impressum.html`, `index.html` (Zusammenarbeit, FAQ) | nur wenn zutreffend, sonst entfernen bzw. FAQ anpassen |
| E-Mail-Anbieter | `datenschutz.html`, Abschnitt 3 | Name, Anschrift, Sitzland; ggf. AV-Vertrag |
| Datenschutz-Aufsichtsbehörde | `datenschutz.html`, Abschnitt 10 | die Behörde Ihres Bundeslands |
| Foto | `index.html`, „Über mich“ | `assets/img/portrait.webp` ablegen, Anleitung steht als Kommentar im HTML |

E-Mail und Telefon lassen sich auf einen Schlag ersetzen (Werte anpassen):

```bash
sed -i 's/kontakt@example\.com/info@ihre-domain.de/g; s/+49 000 0000000/+49 30 1234567/g; s/+490000000000/+49301234567/g' *.html
```

Optional: Preise in „Zusammenarbeit“ (`index.html`) eintragen, Texte von „Sie“ auf „du“ umstellen,
weitere Projekte ergänzen (siehe unten).

## Eigene Domain

1. Datei `CNAME` mit der Domain anlegen (z. B. `www.ihre-domain.de`) und beim DNS-Anbieter einen
   CNAME auf `derlocke-ng.github.io` setzen.
2. Die absolute Adresse `https://derlocke-ng.github.io/freelancing/` durch die neue Domain ersetzen –
   sie steht in `canonical`, `og:url`, `og:image`, im JSON-LD, in `sitemap.xml` und `robots.txt`.
3. In `404.html` `<base href="/freelancing/">` auf `<base href="/">` ändern.

## Projekte ergänzen

In `projekte.html` einen `<article class="card project js-project …">`-Block kopieren und anpassen:

- `id` – Sprungziel, z. B. für Links von der Startseite (`projekte.html#mein-projekt`)
- `data-cat` – Filter-Kategorien, durch Leerzeichen getrennt:
  `server`, `network`, `container`, `automation`, `web`, `design`, `desktop`
- Bild: Screenshot als WebP (960 × 600 px) in `assets/img/projects/` – oder ein Icon wie bei den
  Kiwi-Projekten (`project-media--icon` plus Farbe `tile-…`)
- Status: `status--active` (Aktiv), `status--done` (Fertig), `status--wip` (In Entwicklung),
  `status--archive` (Abgelöst)

Die Zähler an den Filtern aktualisieren sich automatisch.

## Rechtliches

Impressum und Datenschutzerklärung sind sorgfältig erstellte **Vorlagen (Stand Oktober 2026)**, aber
keine Rechtsberatung. Vor dem Livegang mit den echten Angaben prüfen – etwa mit einem
Rechtstext-Generator oder einer Anwältin bzw. einem Anwalt. Zum aktuellen Stand:

- Das Impressum folgt § 5 DDG (Digitale-Dienste-Gesetz, ersetzt seit Mai 2024 das TMG).
- Der früher übliche Link zur EU-Online-Streitbeilegungsplattform entfällt: Die Plattform wurde am
  20. Juli 2025 eingestellt.
- Die Website setzt keine Cookies und bindet nichts von Drittanbietern ein – ein Cookie-Banner ist
  daher nicht nötig. Das Farbschema wird nur nach Klick auf den Schalter lokal gespeichert
  (§ 25 Abs. 2 Nr. 2 TDDDG).
- Für Hosting-Kunden werden außerhalb der Website ein **AV-Vertrag** (Art. 28 DSGVO) und sinnvollerweise
  **AGB** bzw. Leistungsbeschreibungen benötigt.

## Technik & Sicherheit

- Strenge Content-Security-Policy per `<meta>`-Tag: nur eigene Skripte, Stile, Bilder und Schriften.
- Kein Inline-JavaScript, keine externen Ressourcen; Formular erzeugt nur eine `mailto:`-E-Mail.
- Hell/Dunkel folgt der Systemeinstellung, umschaltbar; `prefers-reduced-motion` wird respektiert.
- Barrierearm: semantisches HTML, Skip-Link, sichtbarer Fokus, Kontraste nach WCAG AA.

## Lizenzen

Inhalte und Gestaltung © Maximilian Locke. Schriften: Geist und Geist Mono, SIL Open Font License 1.1
(`assets/fonts/OFL-*.txt`). Die Kiwi-Icons stammen aus [kiwi-icons](https://github.com/derlocke-ng/kiwi-icons).
