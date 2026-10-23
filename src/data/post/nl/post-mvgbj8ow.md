---
title: "Nooit meer handmatig PDF's mailen: Google Sheets automatiseren met Apps Script"
description: "Los acute spreadsheet-stress op de Zuidas op. Leer in 3 stappen hoe je automatisch wekelijkse PDF-rapporten vanuit Google Sheets e-mailt."
publishDate: 2026-10-20T18:30:00.000Z
image: 'https://picsum.photos/seed/work-mvgblbqu-8-c/1200/675.jpg'
category: 'automation'
tags: ["Google Sheets", "Apps Script", "Automatisering", "Productiviteit"]
theme: "Forest Emerald Bio"
---


Het is vrijdagmiddag 16:45 uur in een kantoor aan de Amsterdamse Zuidas. Over precies een kwartier begint de cruciale directiemeeting, en mijn manager vraagt append of ik het wekelijkse KPI-rapport nog even als PDF naar het voltallige managementteam kan sturen. Normaal gesproken betekent dit: handmatig tabbladen exporteren, opslaan op de server, een nieuwe e-mail openen, de juiste bijlage zoeken en op verzenden drukken. Maar ja hoor: het Excel-bestand gaf weer een opmaakfout en de helft van de grafieken verschoof. Zweet breekt me uit. Dit moet slimmer kunnen.

Als productiviteitsspecialist ben ik inmiddels wel klaar met dit soort handmatige repetitieve handelingen. Het werd tijd voor een permanente, waterdichte oplossing: een stukje Google Apps Script dat dit volledig geautomatiseerd regelt, inclusief een gelikte PDF-export en een automatische verzending naar de juiste inboxen. 

![How to Write Custom Apps Script to Email Weekly PDF Reports from Google Sheets AI Automation Guide](https://picsum.photos/seed/work-mvgblbqu-8-b/1000/550.jpg)

Hier is precies hoe je dit inricht, zodat jij voortaan om vijf uur de laptop dichtklapt.

<div style="border-left: 4px solid #10b981; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Tijdsbesparing Indicator:</strong> Door wekelijkse rapportages te automatiseren via Apps Script bespaar je gemiddeld 48 minuten per week aan export-, opmaak- en verzendhandelingen. Dat is ruim 38 uur per jaar!
</div>

---

### Waarom handmatige rapportages gedoemd zijn te mislukken

Voordat we de code induiken, even een korte analyse van waarom dit proces misgaat in de praktijk:
1. Menselijke factor en vergeetachtigheid: Vrijdagmiddagdrukte zorgt ervoor dat je de deadline mist of halverwege wordt afgeleid.

2. Opmaakverschillen: Verschillende schermformaten en printers gooien de PDF-layout in de war als je het handmatig exporteert via *Bestand > Downloaden > PDF*.

3. Versiebeheer chaos: Oudste versies van rapporten die per ongeluk worden gemaild omdat bestandsnamen niet uniform zijn.

---

### In 3 stappen naar je geautomatiseerde e-mailrapportage

Je hebt geen geavanceerde programmeerachtergrond nodig. Volg simpelweg onderstaande stappen in je Google Sheets-omgeving.

#### Stap 1: Open de Apps Script Editor
Open je Google Spreadsheet met het wekelijkse rapport. Klik in het bovenste menu op Extensies en kies vervolgens voor Apps Script. Er opent een nieuw tabblad met een lege code-editor.

#### Stap 2: Plak het geoptimaliseerde script
Verwijder eventuele aanwezige voorbeeldcode en plak onderstaand script in de editor. Dit script converteert automatisch een specifiek tabblad naar een PDF en eist dat het via Gmail wordt verzonden.

```javascript
function sendWeeklyReportPDF() {
  // 1. Definieer de variabelen
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Dashboard"); // Pas aan naar jouw tabbladnaam
  var emailTo = "management@jouwbedrijf.nl"; // Pas aan naar het juiste e-mailadres
  var subject = "Wekelijks KPI Rapport - " + Utilities.formatDate(new Date(), "Europe/Amsterdam", "dd-MM-yyyy");
  var body = "Beste team,\n\nIn de bijlage vinden jullie het automatische wekelijkse KPI-rapport van Google Sheets.\n\nMet vriendelijke groet,\nAutomatisering Bot";

  // 2. Stel de PDF-exportopties in (zorgt voor een strakke A4-weergave)
  var url = spreadsheet.getUrl().replace(/edit$/, '');
  var exportUrl = url + 'export?';
  
  var exportOptions = {
    exportFormat: 'pdf',
    format: 'pdf',
    size: 'a4',
    portrait: 'false', // true voor staand, false voor liggend
    fitw: 'true',
    sheetnames: 'false',
    printtitle: 'false',
    gridlines: 'false',
    fzr: 'false',
    gid: sheet.getSheetId()
  };

  var payload = [];
  for (var key in exportOptions) {
    payload.push(key + '=' + encodeURIComponent(exportOptions[key]));
  }
  
  var authToken = ScriptApp.getOAuthToken();
  var response = UrlFetchApp.fetch(exportUrl + payload.join('&'), {
    headers: {
      'Authorization': 'Bearer ' +  authToken
    }
  });
  
  var blob = response.getBlob().setName(sheet.getName() + " - " + Utilities.formatDate(new Date(), "Europe/Amsterdam", "yyyy-MM-dd") + ".pdf");

  // 3. Verstuur de e-mail met bijlage via GmailApp
  GmailApp.sendEmail(emailTo, subject, body, {
    attachments: [blob],
    name: "Automated Reporting Tool"
  });
}
```

Klik op het floppy-icoontje (Opslaan) boven in de balk om het script op te slaan.

#### Stap 3: Installeer de automatische trigger (Wekelijks schema)
Nu de code klaar staat, zorgen we dat deze elke week automatisch draait:
1. Klik aan de linkerkant in het Apps Script menu op het klok-icoontje (Triggers).

2. Klik rechtsonder op de knop Trigger toevoegen.

3. Kies bij functie: `sendWeeklyReportPDF`.

4. Kies bij gebeurtenisbron: Op tijd gebaseerd.

5. Selecteer tijdsinterval: Wekelijks tijdschema en kies bijvoorbeeld elke maandag ochtend om 08:00 uur.

6. Klik op Opslaan. Google vraagt nu om eenmalig toestemming (machtigingen verlenen) om je Gmail en Spreadsheet te mogen koppelen.

<div style="border-left: 4px solid #10b981; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Belangrijke tip:</strong> Voer de functie de eerste keer handmatig uit door op de 'Uitvoeren' (Play) knop te klikken in de Apps Script editor. Zo controleer je direct of de e-mail correct aankomt en de machtigingen goed zijn ingesteld.
</div>

---

### Expert Waarschuwing: Veiligheid en Bereik

Houd rekening met de volgende praktische richtlijnen bij het automatiseren van bedrijfskritische processen:
* API Limieten: Google heeft dagelijkse limieten voor het verzenden van e-mails via scripts (voor normale Gmail-accounts is dit doorgaans 100 per dag, voor Google Workspace accounts 1.500 per dag). Meer dan genoeg voor wekelijkse rapporten, maar houd er rekening mee bij grote distributielijsten.
* Geheime Dat

a: Zorg ervoor dat tabbladen die gevoelige financiële of HR-data bevatten goed zijn afgeschermd met tabblad-beveiliging, zodat het script nooit per ongeluk ongeautoriseerde gegevens meeneemt in de export.

---

### Veelgestelde Vragen (FAQ)

1. Kan ik het rapport naar meerdere ontvangers tegelijk sturen?
Ja zeker. Je kunt in de variabele `emailTo` meerdere e-mailadressen scheiden met een komma, bijvoorbeeld: `"manager@bedrijf.nl, directeur@bedrijf.nl"`. Wil je een grotere distributielijst beheren? Maak dan in Google Contacten een e-mailgroep aan en vul dat groepsadres in.

2. Wat gebeurt er als de structuur van mijn spreadsheet verandert?
Het script exporteert het tabblad op basis van de `SheetId`. Zolang je het specifieke tabblad niet verwijdert, blijft de koppeling werken. Verander je de naam van het tabblad? Pas dan simpelweg de regel `getSheetByName("Dashboard")` in de code aan naar de nieuwe naam.

3. Waarom krijg ik een foutmelding over autorisatie bij de eerste uitvoering?
Google beveiligt scripts streng. Omdat het script jouw persoonlijke Gmail gebruikt om namens jou een e-mail te sturen, moet je eenmalig op 'Geavanceerd' klikken en doorklikken naar 'Naam van je project (onveilig)' om de benodigde rechten toe te kennen. Dit is een standaard beveiligingsprocedure van Google voor zelfgeschreven scripts.
