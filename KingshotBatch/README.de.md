# KINGSHOT – Sammeleinlösungen: Anleitung

Version 1.2.0. Eine lokale Erweiterung für Chrome / Microsoft Edge unter Windows. Verfügbar auf Deutsch, Englisch und Traditionellem Chinesisch. Für die normale Nutzung sind weder Python noch Node.js oder ein Server nötig. Dies ist ein unabhängiges Tool und kein offizielles KINGSHOT-Produkt.

## Installation

1. Entpacke KingshotBatch.zip und behalte den gesamten Ordner KingshotBatch.
2. Gib in Chrome chrome://extensions in die Adressleiste ein. Verwende in Edge edge://extensions.
3. Aktiviere den Entwicklermodus und klicke auf Entpackte Erweiterung laden.
4. Wähle den Ordner mit manifest.json. Wähle nicht die ZIP-Datei oder app.html.
5. Öffne das Erweiterungsmenü des Browsers und klicke auf KINGSHOT. Du kannst die Erweiterung für einen schnelleren Zugriff anheften.

Beim direkten Öffnen von app.html erscheint nur die Installationsanleitung. Für die eigentliche Nutzung muss die Erweiterung geladen sein. Falls deine Organisation Erweiterungen sperrt, beachte ihre Verwaltungsvorgaben.

## Aktualisieren, ohne Daten zu verlieren

Klicke zuerst auf Daten sichern. Überschreibe mit den entpackten neuen Dateien **denselben Ordner**, den du ursprünglich geladen hast. Öffne die Erweiterungsseite des Browsers, klicke bei KINGSHOT auf Neu laden und öffne den Tool-Tab erneut. **Entferne die Erweiterung nicht, um sie neu zu installieren.** Nur mit derselben Erweiterung und demselben Browserprofil bleiben Charaktere und Verlauf erhalten.

Beim Aktualisieren von einer Version vor 1.1.0 kann der Browser den Zugriff auf kingshotoptimizer.com für die Codeliste anfordern. Charakterdaten werden nicht an diese Quellwebsite gesendet.

## Sprache und Hilfe

Wähle oben rechts Deutsch, English oder 繁體中文. Die Auswahl wird lokal gespeichert und beim nächsten Öffnen wieder verwendet. Charaktere, Codes, Einlöseverlauf und laufende Stapel werden dadurch nicht verändert. Datumsangaben verwenden das Format der ausgewählten Sprache. Anleitung öffnet die passende, auch offline lesbare Anleitung.

Die Sprache des Tools ist unabhängig von der **offiziellen Einlösewebsite**. Der aktuelle Formularadapter benötigt dort Traditionelles Chinesisch (繁體中文). Die Auswahl Deutsch oder Englisch im Tool ändert die offizielle Website nicht. Originalantworten der Website und technische Browserdetails können in ihrer ursprünglichen Sprache bleiben; Statusanzeigen und Tool-Meldungen sind übersetzt.

## Codes einlösen

1. Klicke auf Charakter hinzufügen. Trage die Spieler-ID und das Königreich ein. Ein Charaktername ist optional. Über den Avatar im Spiel erreichst du das Statthalterprofil mit diesen Angaben.
2. Wähle die gewünschten Charaktere aus.
3. Warte auf die aktuelle Codeliste oder klicke auf Liste aktualisieren. Alternativ kannst du einen einzelnen Code manuell eingeben. Beachte die Groß- und Kleinschreibung.
4. Wähle eine Wartezeit: 10, 15, 30, 60, 120 oder 300 Sekunden. Voreingestellt sind 30 Sekunden.
5. Klicke auf Ungenutzte aktive Codes einlösen oder für das manuelle Eingabefeld auf Eingegebenen Code einlösen.
6. Verfolge die Ergebnisse unter Einlösefortschritt und Verlauf. Lass den Browser geöffnet. Bearbeite während der Ausführung nicht den offiziellen Einlöse-Tab des Tools.

Die Wartezeit beginnt nach Abschluss eines Eintrags. Lade- und Antwortzeiten kommen hinzu. Browserpausen, Drosselung oder der Ruhezustand des Computers können die Ausführung verzögern. Das Tool weckt den Computer nicht auf.

## Automatische Codeliste und gespeicherter Verlauf

Die Erweiterung liest [Kingshot Optimizer](https://kingshotoptimizer.com/gift-codes/) beim Öffnen und anschließend stündlich. Dazu öffnet sie kurz einen Hintergrund-Tab und schließt ihn danach. Die Aktualisierung lädt nur Codes; **die Einlösung startest du über die Stapel-Schaltfläche**.

Es wird ausschließlich der nach dem Laden angezeigte Bereich Active codes verwendet, sortiert nach dem Hinzufügungsdatum. Der statische Seiteninhalt kann veraltet sein. Im Verlauf geladener Codes bleiben jeder geladene Code, der erste Ladezeitpunkt, das letzte Auftreten und der Status auch nach einem Neustart gespeichert.

- Codes unter Expired codes sind ausgeschlossen. Früher geladene Codes, die nicht mehr in der aktiven Liste stehen, bleiben im Verlauf, werden aber ausgeschlossen.
- Die Nutzung wird pro Spieler-ID + Königreich + Geschenkcode gespeichert. Ein vom Hauptcharakter verwendeter Code kann weiterhin für einen anderen Charakter ungenutzt sein.
- Codes, die alle ausgewählten Charaktere bereits verwendet haben, werden ausgeschlossen. Bereits abgeschlossene Kombinationen aus Charakter und Code werden übersprungen und protokolliert.
- Meldet die offizielle Website einen Code als abgelaufen, werden dessen verbleibende Charaktere übersprungen. Auch spätere Stapel schließen ihn aus.
- Schlägt die Quellenaktualisierung fehl, bleiben frühere Daten erhalten. Die Schaltfläche für aktuelle Codes ist bis zur erfolgreichen Aktualisierung deaktiviert. Die Quellenliste garantiert nicht, dass die offizielle Website jeden Code akzeptiert.

## Ergebnisse, Überspringen und Stoppen

Nur eine eindeutige neue Erfolgsmeldung zählt als Erfolg. Der dauerhafte Hinweis der Website zum Versand der Belohnungen ist keine Erfolgsmeldung.

Antworten wie bereits eingelöst / bereits abgeholt / bereits verwendet werden automatisch protokolliert und übersprungen. Verifizierungsaufgaben, Ratenbegrenzungen, unbekannte Antworten, Zeitüberschreitungen und unterbrochene Versuche werden als **Ergebnis unklar · Übersprungen** gespeichert. Danach geht es mit dem nächsten Eintrag weiter. **Es gibt keine manuelle Ergebnisbestätigung.** Verifizierungsaufgaben werden nicht automatisch gelöst.

Ein unklares Ergebnis bedeutet weder Erfolg noch Misserfolg; die Anfrage könnte bereits gesendet worden sein. Solche Versuche werden auch in späteren Stapeln nicht automatisch erneut gesendet. Die ursprünglichen Aufzeichnungen bleiben verfügbar.

Stapel stoppen verhindert den Start weiterer Einträge. Bereits gesendete Anfragen lassen sich nicht zurücknehmen. Bei einer laufenden Anfrage wird zunächst deren Ergebnis gespeichert. Nach einem Browser- oder Hintergrundneustart wird ein möglicherweise bereits gesendeter Eintrag übersprungen; noch nicht gesendete Einträge können fortgesetzt werden. Alte pausierte Stapel werden auf dieses Verhalten umgestellt.

## Daten, Sicherung und Import

Charaktere, geladene Codes, Fortschritt und Einlöseverlauf werden in chrome.storage.local dieses Browserprofils gespeichert. Auch die Sprache wird lokal gespeichert. Spieler-ID, Königreich und Geschenkcode werden nur an das [offizielle Einlösezentrum](https://ks-giftcode.centurygame.com/) gesendet. Ein Spielpasswort wird nicht benötigt. Es gibt keinen privaten Server und keinen Übersetzungsdienst.

Daten sichern lädt eine JSON-Datei mit Charakteren, Codeaufzeichnungen und Einlöseverlauf herunter. Charaktere importieren **führt nur Charakterlisten zusammen**: Vorhandene Kombinationen aus ID und Königreich bleiben erhalten. Verlauf und nicht abgeschlossene Stapel werden nicht wiederhergestellt. Die Verlaufstabelle zeigt die letzten 200 Einträge; die Sicherung enthält den vollständigen Verlauf.

Beim Entfernen der Erweiterung, Löschen ihres Speichers oder Wechseln des Browserprofils können Aufzeichnungen verloren gehen. Der reine Charakterimport in ein neues Profil stellt den bisherigen Verlauf für automatisches Überspringen nicht wieder her. Behalte beim Aktualisieren die ursprüngliche Erweiterungsinstallation.

Beispiel für eine Importdatei – ersetze die Beispieldaten:

```json
[{"name":"Hauptcharakter","id":"123456789","kingdom":"123","enabled":true}]
```

## Fehlerbehebung und Grenzen

- Ein file://-, origin-null- oder CORS-Fehler in einer älteren Version bedeutet, dass app.html direkt geöffnet wurde. Lade stattdessen die Erweiterung. Deaktiviere keine Browsersicherheitsfunktionen.
- Ist die Quelle nicht lesbar, prüfe ihre Seite und aktualisiere später erneut. Die Website könnte geändert worden sein oder eine Verifizierung verlangen.
- Wird das offizielle Formular nicht gefunden, stelle die Website auf 繁體中文. Nach einer Umgestaltung der Website muss eventuell adapter.js aktualisiert werden.
- Lade nach dem Ersetzen der Dateien die Erweiterung neu und öffne ihren Tool-Tab erneut, damit keine alte Oberfläche weiterverwendet wird.

Die Erweiterung benötigt lokalen Speicher, Zeitplanung und Skriptzugriff auf die beiden angegebenen Websites. Lokale Simulationen und Oberflächenprüfungen wurden durchgeführt. **Die tatsächliche Zustellung mit einem echten Charakter und gültigen Code sowie ein vollständiger End-to-End-Test der installierten Erweiterung sind noch nicht verifiziert.** Probiere zuerst einen Charakter aus und prüfe dessen Postfach im Spiel.

## Entwicklerdateien

app.html / app.js / style.css bilden die Oberfläche. languages.js enthält lokale Übersetzungen. core.js prüft Daten und verwaltet Aufzeichnungen, background.js führt die Warteschlange aus, adapter.js bedient das offizielle Formular und source.js liest und filtert die Codes. Der Ordner _locales übersetzt den Eintrag in der Erweiterungsliste des Browsers.

Mit Node.js können Entwickler im Ordner `node --test tests/*.mjs` ausführen. Die Tests verwenden lokale Beispieldaten und senden keine echten Einlösungen.

## Problem melden

[ximoc001@gmail.com](mailto:ximoc001@gmail.com)
