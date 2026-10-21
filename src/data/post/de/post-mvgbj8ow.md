---
title: "Google Sheets per Apps Script automatisieren: Woechentliche PDF-Berichte fehlerfrei versenden"
description: "Schluss mit manuellem Stress im Frankfurter Finanzdistrikt: So automatisieren Sie Ihre woechentlichen PDF-Reports aus Google Tabellen."
publishDate: 2026-10-20T12:15:00.000Z
image: 'https://picsum.photos/seed/work-mvgbk1h1-3-c/1200/675.jpg'
category: 'automation'
tags: ["Google Apps Script", "Google Sheets", "Automatisierung", "Office Tipps", "Produktivitaet"]
theme: "Cobalt Enterprise Lab"
---


Es war Freitag, Punkt 16:45 Uhr im Frankfurter Finanzdistrikt. In zwanzig Minuten sollte das monatliche Vorstandstreffen beginnen, und auf meinem Schreibtisch herrschte das pure Chaos. Die Zahlen für den Quartalsabschluss waren zwar in der Google Tabelle aktuell, aber ich musste sie noch manuell als PDF exportieren, den Dateinamen anpassen, das Outlook-Fenster öffnen und den Bericht an fünf verschiedene Bereichsleiter im zehnten Stock mailen. Natürlich ist genau in diesem Moment Excel beziehungsweise Google Sheets beim Export hängen geblieben, das Layout der PDF zerschoss sich, und die Panik stieg. Wieder einmal wertvolle Minuten vergeudet für rein mechanische Copy-Paste-Arbeit, während die echten Analysen liegen blieben.

Genug ist genug. An diesem Abend habe ich mich hingesetzt und ein sauberes, wiederverwendbares Google Apps Script geschrieben, das mir diese Arbeit seitdem jeden Freitag komplett abnimmt. Heute zeige ich Ihnen genau diesen Workflow, damit Sie nie wieder vor dem Vorstand ins Schwitzen kommen.

![How to Write Custom Apps Script to Email Weekly PDF Reports from Google Sheets AI Automation Guide](https://picsum.photos/seed/work-mvgbk1h1-3-b/1000/550.jpg)

<div style="border-left: 4px solid #1e40af; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Enterprise-Tipp:</strong> Mit diesem Skript sparen Sie pro Woche durchschnittlich 45 Minuten manuelle Export- und E-Mail-Arbeit. Bei einem Team von 10 Controllern sind das über 350 eingesparte Stunden im Jahr.
</div>

## Die 3 Hauptursachen, warum der manuelle PDF-Versand scheitert

Bevor wir in den Code springen, schauen wir uns an, warum der herkömmliche Weg so fehleranfällig ist:

1. Formatierungschaos beim Export: Wenn man unvorbereitete Google Tabellen direkt als PDF exportiert, ignoriert das System oft die definierten Druckbereiche. Spalten werden abgeschnitten, und wichtige Kennzahlen landen auf Seite zwei.
2. Falsche Dateinamen und Versionen: Werden Berichte wöchentlich manuell umbenannt (z.B. *Bericht_final_v2_FINAL.pdf*), führt das unweigerlich zu Verwirrung im Postfach der Geschäftsführung.
3. Faktor Mensch: Freitagnachmittag ist man müde. Da vergisst man schnell mal einen Empfänger im CC oder hängt versehentlich die falsche Vorwochen-Datei an.

---

## Schritt-für-Schritt-Anleitung: So bauen Sie Ihren automatischen PDF-Reporter

Wir lösen das Problem über den integrierten Skript-Editor von Google Workspace. Keine Angst, Sie müssen kein Profi-Entwickler sein – kopieren Sie einfach den folgenden Code und passen Sie die E-Mail-Adresse an.

### Schritt 1: Den Skript-Editor öffnen
Öffnen Sie Ihre Google Tabelle, die den Monatsabschluss enthält. Klicken Sie oben im Menü auf Erweiterungen und wählen Sie Apps Script.

### Schritt 2: Den Code einfügen
Löschen Sie den eventuell vorhandenen Beispielcode und fügen Sie dieses Skript ein:

```javascript
function sendWeeklyReportPDF() {
  // 1. Aktive Tabelle und Arbeitsblatt definieren
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dashboard");
  var spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  
  // 2. Export-Optionen für sauberes PDF-Layout festlegen
  var exportUrl = "https://docs.google.com/spreadsheets/d/" + spreadsheetId + "/export?" +
    "exportFormat=pdf&" +
    "format=pdf&" +
    "size=A4&" +
    "portrait=true&" +
    "fitw=true&" +
    "gridlines=false&" +
    "printtitle=false&" +
    "sheetnames=false&" +
    "gid=" + sheet.getSheetId();
    
  // 3. PDF über die Google API generieren
  var response = UrlFetchApp.fetch(exportUrl, {
    headers: {
      "Authorization": "Bearer " + ScriptApp.getOAuthToken(),
      "MuteHttpExceptions": true
    }
  });
  
  var blob = response.getBlob().setName("Monatsabschluss_Vorstand_" + Utilities.formatDate(new Date(), "Europe/Berlin", "yyyy-MM-dd") + ".pdf");
  
  // 4. E-Mail mit PDF-Anhang versenden
  var recipient = "vorstand@ihre-unternehmensdomain.de";
  var subject = "Automatisierter Finanzbericht: KW " + Utilities.formatDate(new Date(), "Europe/Berlin", "w");
  var body = "Guten Tag,\n\nanbei erhalten Sie den aktuellen, automatisierten Finanzbericht als PDF.\n\nMit freundlichen Grüßen\nIhr Finanz-Team";
  
  GmailApp.sendEmail(recipient, subject, body, {
    attachments: [blob],
    name: "Automated Reporting Bot"
  });
}
```

### Schritt 3: Den Trigger (Zeitplan) einrichten
Damit das Skript nun jeden Freitag vollautomatisch läuft, ohne dass Sie einen Finger rühren müssen:
1. Klicken Sie im linken Menü des Apps Script Editors auf das Uhren-Symbol (Trigger).
2. Unten rechts auf Trigger hinzufügen klicken.
3. Wählen Sie die Funktion `sendWeeklyReportPDF` aus.
4. Wählen Sie als Ereignisquelle Zeitgesteuert und stellen Sie ein wöchentliches Intervall (z.B. Freitags zwischen 15:00 und 16:00 Uhr) ein.

<div style="border-left: 4px solid #1e40af; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Wichtiger Sicherheitshinweis:</strong> Beim ersten Ausführen fragt Google nach Berechtigungen ("Berechtigungen prüfen"). Das ist völlig normal, da das Skript auf Ihre Tabelle zugreifen und in Ihrem Namen E-Mails versenden muss. Klicken Sie auf Ihr Konto, dann auf "Erweitert" und "Zu Untitled project (unsicher) wechseln" (oder den von Ihnen vergebenen Projektnamen), um den Zugriff zu erlauben.
</div>

---

## Häufig gestellte Fragen (FAQ)

### Kann ich mehrere Empfänger gleichzeitig in das Skript einbinden?
Ja, absolut. Sie können die Variable `recipient` einfach als Array definieren oder durch Kommata trennen, zum Beispiel: `var recipient = "vorstand@firma.de, controlling@firma.de";`. Alternativ nutzen Sie die CC- oder BCC-Option in den erweiterten Parametern von `GmailApp.sendEmail`.

### Wie verhindere ich, dass das PDF unvollständig exportiert wird?
Im Code nutzen wir den Parameter `fitw=true` (Fit to width). Das zwingt Google Sheets dazu, die gesamte Tabellenbreite auf eine DIN-A4-Seite einzupassen. Achten Sie zusätzlich darauf, dass Ihr Arbeitsblatt im Bereich "Drucken" richtig formatiert ist.

### Lässt sich der Dateiname dynamisch mit dem aktuellen Datum versehen?
Genau das macht das Skript im obigen Code bereits. Über `Utilities.formatDate(...)` wird im Dateinamen automatisch das aktuelle Datum im Format `YYYY-MM-DD` angehängt. So hat der Vorstand im Postfach immer sofort die neueste Version parat.
