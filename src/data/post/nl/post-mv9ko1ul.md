---
title: "Van Chaos naar Categorie: Zo Koppel Je de Gemini API aan Google Sheets voor Bulk Tekstanalyse"
description: "Voorkom stress vlak voor een meeting. Leer stap voor stap hoe je Google Sheets via Apps Script koppelt aan de Gemini API om duizenden rijen tekst automatisch te categoriseren."
publishDate: 2026-10-15T18:30:00.000Z
image: "https://picsum.photos/seed/tech616/1200/630"
category: "Productivity"
tags: ["AI Tools", "Workflow", "Automation", "Office Tips"]
theme: "Matte Black stealth"
---


Het is kwart over vier op een regenachtige dinsdagmiddag in het Zuidas zakendistrict in Amsterdam. Om vijf uur start de cruciale directiemeeting waarin we de Q3 klantfeedback moeten presenteren. Mijn scherm knippert: een gigantische Google Sheet met ruim drieduizend supporttickets en klantreviews die nog handmatig gecategoriseerd moeten worden. Mijn collega schuift onrustig op zijn stoel: "Zijn we er al doorheen?" Handmatig kopiëren en plakken in ChatGPT of de webinterface van Gemini is geen optie meer; daar verspil ik minstens twee uur mee, en de kans op menselijke fouten is gigantisch. 

Dit was hét moment om Google Apps Script in te zetten en direct een automatische brug te slouwen tussen Google Sheets en de Gemini API.

![AI Productivity & Workflow Automation](https://picsum.photos/seed/office116/1000/550)

<div style="border-left: 4px solid #ffffff; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Het Probleم:</strong> Handmatig honderden regels tekst categoriseren kost uren en breekt je focus vlak voor een belangrijk overleg. De oplossing? Een eigen, snelle API-koppeling binnen Google Sheets zonder dure derde-partij tools.
</div>

---

### Waarom standaard oplossingen falen (De Root Causes)

Wanneer professionals proberen om bulk data te verwerken met AI, lopen ze bijna altijd tegen dezelfde drie muren aan:

1. **De limiet van de webinterface:** Je kunt maximaal een stuk of vijftig regels tegelijk in een chatvenster plakken voordat de context verloren gaat of de browser crasht.
2. **Complexe betaalde add-ons:** Veel marketeers installeren dure Google Sheets-add-ons die maandelijks geld kosten en onduidelijke privacyvoorwaarden hebben over je bedrijfsdata.
3. **Time-outs in Apps Script:** Als je duizenden rijen in één keer probeert weg te schrijven via een script, loopt Google tegen de maximale uitvoertijd van zes minuten aan.

---

### Stap-voor-stap: De Gemini API koppelen aan Google Sheets

Gelukkig hoeft het niet ingewikkeld te zijn. Met een handjevol regels JavaScript in Google Apps Script bouw je in minder dan tien minuten je eigen slimme categorisatiefunctie.

#### Stap 1: Haal je Gemini API-sleutel op
1. Ga naar Google AI Studio (aistudio.google.com) en log in met je Google-account.
2. Klik op **Get API key** en genereer een nieuwe sleutel. Bewaar deze goed; we hebben hem zo meteen nodig in ons script.

#### Stap 2: Open Apps Script in Google Sheets
1. Open je spreadsheet met de klantfeedback in Google Sheets.
2. Klik in het bovenste menu op **Extensies** en kies **Apps Script**.
3. Verwijder alle reeds aanwezig code in de editor.

#### Stap 3: Plak de aangepaste code
Plak het volgende script in de editor. Dit script definieert een eigen formule (`=GEMINI_CATEGORISEER(tekst)`) die je direct in je cellen kunt gebruiken.

```javascript
function GEMINI_CATEGORISEER(tekst) {
  if (!tekst) return "";
  
  // Vervang onderstaande string door jouw echte Gemini API key of haal deze op via Properties Service
  var apiKey = "JOUW_GEMINI_API_KEY_HIER";
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
  
  var prompt = "Categoriseer de volgende klantfeedback in precies één van deze categorieën: [Technisch, Facturatie, UX, Vraag, Overig]. Geef alleen de categorie naam terug zonder extra tekst: " + tekst;
  
  var payload = {
    "contents": [{
      "parts": [{
        "text": prompt
      }]
    }]
  };
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var result = JSON.parse(response.getContentText());
    
    if (result.candidates && result.candidates.length > 0) {
      return result.candidates[0].content.parts[0].text.trim();
    } else {
      return "Fout bij genereren";
    }
  } catch (error) {
    return "API Fout: " + error.toString();
  }
}
```

#### Stap 4: Opslaan en Toepassen
1. Klik op het diskette-icoon om het script op te slaan.
2. Ga terug naar je Google Sheet en typ in cel B2 de volgende formule:
   `=GEMINI_CATEGORISEER(A2)` (ervan uitgaande dat je ruwe tekst in kolom A staat).
3. Sleep de formule naar beneden om de hele lijst automatisch te laten categoriseren door Gemini.

<div style="border-left: 4px solid #ffffff; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Pro-Tip voor Grote Datasets:</strong> Heb je meer dan 500 rijen? Maak dan geen gebruik van een rechtstreekse celformule, maar schrijf een kleine iteratieve `for`-lus in Apps Script die regels in batches van 20 verwerkt met een korte `Utilities.sleep(1000)` pauze ertussen. Dit voorkomt dat je de API Rate Limits overschrijdt.
</div>

---

### Expert Waarschuwing & Data Privacy

Voordat je klakkeloos vertrouwelijke bedrijfsdata of privacygevoelige klantgegevens naar een externe API stuurt, is het cruciaal om rekening te houden met de volgende zaken:

* **Gegevensbeleid:** Controleer de privacyvoorwaarden van Google AI Studio. Standaard worden API-aanvragen in de gratis tier gebruikt voor modelverbetering. Verwerk je gevoelige persoonsgegevens (AVG/GDPR), stap dan over op een betaalde Google Cloud Vertex AI omgeving waar je data strikt privé blijft.
* **API Quota:** De gratis versie van de Gemini API hanteert limieten per minuut (RPM). Als je in één keer te veel rijen tegelijk aanspreekt, krijg je een `429 Too Many Requests` foutmelding. Bouw daarom altijd een kleine vertraging in je script in.

---

### Veelgestelde Vragen (FAQ)

**1. Wat moet ik doen als ik een #FOUT!-melding krijg in mijn cel?**
Controleer eerst of je API-sleutel correct tussen de aanhalingstekens in het script staat. Zie je een time-outmelding? Dan probeert Google te veel rijen tegelijk te verwerken. Deel je data op in kleinere batches van maximaal honderd rijen per keer.

**2. Kan ik meerdere categorieën of een samenvatting genereren in plaats van één woord?**
Jazeker. Je hoeft alleen de `prompt` variabele in het Apps Script aan te passen. Verander de instructie naar bijvoorbeeld: *"Geef een samenvatting in maximaal 5 woorden en geef de sentiment-score (Positief, Neutraal, Negatief)"*.

**3. Kost deze API-koppeling geld?**
Google biedt voor de Gemini Flash-modellen een royale gratis laag (free tier) aan voor ontwikkelaars. Voor dagelijks gebruik binnen kantooromgevingen voor duizenden rijen per maand blijf je hier doorgaans ruimschoots binnen, tenzij je miljoenen tokens per dag verbruikt.
