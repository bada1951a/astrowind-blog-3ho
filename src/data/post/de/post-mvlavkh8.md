---
title: "Excel-Chaos im Frankfurter Finanzdistrikt: Adressen und Telefonnummern mit ChatGPT trennen"
description: "Wie Sie Datenchaos aus 12 Auslands-Excel-Dateien mit ChatGPT und intelligenten Formeln in Minuten bereinigen. Ein praktischer Workflow-Leitfaden."
publishDate: 2026-10-24T03:15:00.000Z
image: 'https://picsum.photos/seed/work-mvlaw72m-3-c/1200/675.jpg'
category: 'automation'
tags: ["Office Tips", "Excel Automation", "ChatGPT", "Workflow", "Data Cleaning"]
theme: "Mint Fresh Engineering"
---


Es war kurz vor zehn Uhr morgens an einem grauen Dienstag im Frankfurter Bankenviertel, als der Vorstandbericht für das Quartal auf dem Tisch landen sollte. Unser Team hatte gerade die Aufgabe übernommen, die Berichte von zwölf verschiedenen Auslandsniederlassungen zusammenzuführen. Doch schon beim Öffnen der ersten Dateien traf uns der Schlag: Jede Niederlassung hatte ein komplett anderes Datenformat verwendet. In einigen Tabellen standen Straße, Hausnummer, PLZ und Ort in einer einzigen Zelle, während Telefonnummern mal mit Ländervorwahl, mal mit Bindestrichen oder komplett ohne Leerzeichen erfasst waren. Zu allem Überfluss waren die Schriften in den Excel-Tabellen unterschiedlich skaliert und die Datumsangaben reichten von US-Format bis hin zu kryptischen Textstrings, die Excel partout nicht als Datum erkennen wollte. Ein manuelles Auseinanderklamüsern von Tausenden Zeilen schien unmöglich und hätte uns Stunden gekostet.

An diesem Punkt half kein langes Jammern mehr. Statt mich in stupides Copy-Paste-Chaos zu stürzen, beschloss ich, die Sache systematisch anzugehen und ChatGPT als intelligenten Assistenten einzuspannen, um die Adress- und Telefonspalten sauber in strukturierte Einheiten zu zerlegen.

![How to Auto-Split Address and Phone Number Columns in Excel with ChatGPT Assistance AI Automation Guide](https://picsum.photos/seed/work-mvlaw72m-3-b/1000/550.jpg)

### Warum das Datenchaos jedes Mal aufs Neue entsteht

Bevor wir zu den konkreten Schritten kommen, lohnt sich ein kurzer Blick auf die Ursachen dieses allgegenwärtigen Büro-Dramas:

Erstens fehlen in globalen Teams oft verbindliche Templates. Wenn Mitarbeiter in London, New York und Singapur ihre eigenen Excel-Gewohnheiten pflegen, entstehen unweigerlich inkonsistente Textwüsten.

Zweitens unterschätzen viele Anwender die Tücken von verketteten Textfeldern. Wenn Adressen in einer einzigen Spalte (z. B. "Mainzer Landstr. 10, 60329 Frankfurt am Main") erfasst werden, kann Excel von Haus aus ohne komplexe Textformeln oder Power Query keine saubere Trennung vornehmen.

Drittens führt der Import von CSV- oder Excel-Dateien aus unterschiedlichen Sprachversionen regelmäßig zu Kodierungsfehlern. Sonderzeichen wie Umlaute verwandeln sich in unleserliche Zeichensätze, und Telefonnummern springen oft in wissenschaftliche Notationen oder verlieren führende Nullen.

### Schritt-für-Schritt-Lösung zur automatischen Datentrennung

Um diesen gordischen Knoten zu zerschneiden, nutzen wir eine Kombination aus ChatGPT als Formel-Generator und Excels integrierten Text-in-Spalten-Funktionen oder modernen Flash-Fill-Werkzeugen.

<div style="border-left: 4px solid #059669; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
Praxis-Tipp: Bevor Sie Daten an ChatGPT übergeben, anonymisieren Sie sensible Kundendaten oder Firmeninterna vollständig. Nutzen Sie Beispieldaten wie Testdatensätze, um den Datenschutz (GDPR) zu wahren.
</div>

#### Schritt 1: Den passenden ChatGPT-Prompt für komplexe Trennungen erstellen
Öffnen Sie ChatGPT und füttern Sie die KI mit einem präzisen Beispiel der unsauberen Spalte. Ein bewährter Prompt sieht so aus:

```text
Ich habe eine Excel-Spalte mit unstrukturierten Adressen, zum Beispiel: "Goethestr. 45, 80336 München, Deutschland". 
Schreibe mir präzise Excel-Formeln für Microsoft 365, mit denen ich die Straße, die Postleitzahl und die Stadt in drei separate Spalten aufteilen kann.
```

ChatGPT liefert Ihnen blitzschnell moderne Formeln, die auf Funktionen wie TEXTTEILEN (TEXTSPLIT) oder TEIL (MID) basieren. Für die Trennung von Straßennamen und PLZ bei deutschen Adressen eignet sich oft der folgende Ansatz:

```excel
=TEIL(A2; 1; FINDEN(","; A2) - 1)
```

#### Schritt 2: Telefonnummern bereinigen und standardisieren
Auch bei Telefonnummern herrscht oft Wildwuchs. Manche beginnen mit "+49", andere mit "0049" oder haben Leerzeichen mitten im Block. Nutzen Sie ChatGPT, um eine passende Reguläre Ausdrucksformel (Regex) oder eine intelligente Excel-Flash-Fill-Strategie zu generieren. 

Wenn Sie die Blitzvorschau (Flash Fill) in Excel nutzen möchten:
1. Schreiben Sie in Spalte B neben die erste unsaubere Telefonnummer (z. B. "+49 (0) 69 123456") manuell das gewünschte Zielformat (z. B. "+49 69 123456").

2. Markieren Sie die Zelle und drücken Sie die Tastenkombination Strg + E.

3. Excel erkennt das Muster und füllt die gesamte Spalte automatisch im Bruchteil einer Sekunde aus.

#### Schritt 3: Power Query für die Massenverarbeitung nutzen
Da Sie 12 verschiedene Dateien zusammenführen müssen, ist manuelles Kopieren keine Option. Nutzen Sie stattdessen Power Query, um alle Dateien in einem Ordner gebündelt zu bereinigen:
1. Gehen Sie auf den Reiter "Daten" und wählen Sie "Daten abrufen" > "Aus Datei" > "Aus Ordner".

2. Wählen Sie den Ordner aus, in dem die 12 bereinigten Excel-Dateien liegen.

3. Klicken Sie auf "Daten kombinieren" (Combine Data). Power Query wendet nun denselben Transformationsschritt auf alle Tabellen an, korrigiert automatisch unsaubere Datumsformate über die Spaltentyp-Änderung und führt die Daten in einer einzigen, sauberen Master-Tabelle zusammen.

### Wichtige Hinweise für den Ernstfall

Achten Sie beim Zusammenführen internationaler Dateien immer darauf, dass die Textcodierung auf UTF-8 eingestellt ist, damit Umlaute und Sonderzeichen nicht verloren gehen. Machen Sie vor jeder Massenänderung über Power Query oder Makros immer eine Sicherheitskopie des Originalordners. Sollte ein Transformationsschritt fehlschlagen, können Sie so problemlos auf den Ursprungszustand zurückgreifen.

### Häufig gestellte Fragen (FAQ)

Q1. Was mache ich, wenn Excel die mit ChatGPT generierte Formel mit einem #WERT!-Fehler quittiert?

A1. Das liegt meist daran, dass das Trennzeichen (z. B. ein Komma oder ein Punkt) in der jeweiligen Zelle fehlt oder das verwendete Excel-Format eine englische Funktionsbezeichnung statt der deutschen verlangt. Prüfen Sie, ob Sie TEXTSPLIT oder TEXTTEILEN verwenden, je nachdem, welche Spracheinstellung Ihr Excel hat.

Q2. Kann ChatGPT die 12 Excel-Dateien direkt bearbeiten, ohne dass ich Formeln kopieren muss?

A2. Wenn Sie die kostenpflichtige Version mit erweiterten Datenanalyse-Funktionen nutzen, können Sie kleine CSV-Dateien direkt hochladen und von ChatGPT ein Python-Skript generieren lassen, das die Dateien auf Ihrem Rechner bereinigt. Für sensible Unternehmensdaten im Finanzsektor empfiehlt sich jedoch das manuelle Einfügen von Formeln oder die Nutzung von lokalen Power-Query-Routinen.

Q3. Wie verhindere ich, dass Excel beim Import von Telefonnummern die führende Null verschluckt?

A3. Formatieren Sie die Zielspalte in Excel vor dem Einfügen oder Importieren unbedingt als "Text" (nicht als Standard oder Zahl). Andernfalls interpretiert Excel die führende Null in internationalen Vorwahlen als mathematisches Format und löscht sie automatisch heraus.
