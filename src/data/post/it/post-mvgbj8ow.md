---
title: "Google Sheets: Come automatizzare l'invio settimanale di report PDF via Apps Script"
description: "Guida pratica per automatizzare l'invio di report PDF da Google Sheets a Milano. Risparmia ore di lavoro prima delle riunioni."
publishDate: 2026-10-20T16:00:00.000Z
image: 'https://picsum.photos/seed/work-mvgbksxd-6-c/1200/675.jpg'
category: 'automation'
tags: ["Google Sheets", "Apps Script", "Automazione", "Produttività"]
theme: "Deep Indigo System"
---

## 1. Emergenza improvvisa e blocco delle attività in ufficio

Erano le 17:30 di un giovedì caotico nel nostro ufficio a Milano, con la pioggia che batteva sui vetri di Corso Como e una scadenza imminente per il report di chiusura settimanale. Domani mattina alle 9:00 avevamo il sync cruciale con il cliente e, come al solito, mi ritrovavo intrappolato nella stessa identica routine: aprire il Google Sheets del monitoraggio KPI, filtrare manualmente i dati per area, esportare il foglio come PDF formattandolo alla buona, allegarlo a una nuova email su Gmail, scrivere il testo standard e premere "Invia" per cinque volte ad altrettanti manager. 

Il tutto mentre il mio caffè si raffreddava sulla scrivania e ricevevo notifiche su Slack da parte del reparto commerciale che chiedeva aggiornamenti sui numeri. "Devi assolutamente trovare un modo per smettere di fare il postino digitale ogni settimana", mi sono detto mentre correggevo l'ennesimo errore di formattazione nel PDF esportato. Quel blocco operativo mi è costato due ore di straordinario inutile. Quella stessa notte, ho deciso di scrivere uno script personalizzato in Google Apps Script per azzerare per sempre questa perdita di tempo.

![How to Write Custom Apps Script to Email Weekly PDF Reports from Google Sheets AI Automation Guide](https://picsum.photos/seed/work-mvgbksxd-6-b/1000/550.jpg)

<div style="border-left: 4px solid #4338ca; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Il focus del sistema.</strong> Oggi ti mostrerò esattamente come ho configurato una pipeline di automazione nativa in Google Sheets che converte un determinato intervallo di fogli in un report PDF pulito e lo spedisce automaticamente via email ogni venerdì sera, senza che tu debba muovere un dito.


</div>

## Perché l'invio manuale dei report fallisce (e le 3 cause radice)

Prima di scrivere anche solo una riga di codice, analizziamo perché il metodo tradizionale basato sul "copia-incolla ed esporta" fa perdere così tanto tempo e genera errori critici:

1. Distrazione e fattore umano: Modificare manualmente i filtri del foglio di calcolo prima dell'esportazione porta spesso a dimenticare una colonna chiave o a inviare dati parziali al management.

2. Problemi di formattazione del PDF: Quando esporti un intero foglio Google in PDF tramite interfaccia grafica, le interruzioni di pagina saltano costantemente, tagliando tabelle importanti a metà e creando documenti illeggibili per i clienti.

3. Mancanza di schedulazione affidabile: Affidarsi alla memoria umana per l'invio puntuale del venerdì significa inevitabilmente dimenticarsene almeno una volta al mese, specialmente sotto pressione o quando si è in trasferta.

---

## Guida passo-passo: Configurazione dell'Apps Script

Mettiamoci all'opera.

Non serve essere programmatori senior: segui questi passaggi direttamente all'interno del tuo Google Sheets.

### Passo 1: Aprire l'editor di script
Nel tuo file Google Sheets, vai sulla barra dei menu in alto e seleziona Estensioni > Apps Script. Si aprirà una nuova scheda nel browser con un editor di codice pulito.

### Passo 2: Incollare il codice di automazione
Cancella qualsiasi riga presente nell'editor e incolla questo blocco di codice ottimizzato. Questo script individua il foglio desiderato, imposta i parametri di esportazione PDF puliti (senza griglie, in formato orizzontale) e lo spedisce via Gmail.

```javascript
function inviaReportSettimanalePDF() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("ReportKPI"); // Sostituisci con il nome esatto del tuo foglio
  
  if (!sheet) {
    Logger.log("Foglio non trovato!");
    return;
  }
  
  var sheetId = sheet.getSheetId();
  var url = ss.getUrl().replace(/edit$/, '');
  
  // Parametri per esportare il foglio in PDF formattato correttamente
  var urlExport = url + 'export?';
  var exportOptions = {
    exportFormat: 'pdf',
    format: 'pdf',
    size: 'A4',
    portrait: 'false', // false = Orizzontale (Landscape), ottimo per tabelle larghe
    fitw: 'true',      // Adatta alla larghezza della pagina
    gridlines: 'false',
    printtitle: 'false',
    sheetnames: 'false',
    fzr: 'false',
    gid: sheetId
  };
  
  var payload = [];
  for (var key in exportOptions) {
    payload.push(key + '=' + exportOptions[key]);
  }
  
  var exportUrl = urlExport + payload.join('&');
  
  // Autenticazione e download del PDF tramite token OAuth
  var response = UrlFetchApp.fetch(exportUrl, {
    headers: {
      'Authorization': 'Bearer ' +  ScriptApp.getOAuthToken(),
      'MuteHttpExceptions': true
    }
  });
  
  var blob = response.getBlob().setName("Report_Settimanale_" + Utilities.formatDate(new Date(), "Europe/Rome", "yyyy-MM-dd") + ".pdf");
  
  // Dettagli dell'email
  var destinatario = "direzione@tuodominio.it"; // Inserisci l'email del destinatario
  var oggetto = "Report Settimanale Automatico - " + Utilities.formatDate(new Date(), "Europe/Rome", "dd/MM/yyyy");
  var corpo = "Buongiorno,\n\nIn allegato trovi il report settimanale aggiornato generato automaticamente da Google Sheets.\n\nCordiali saluti,\nOffice Automation System";
  
  GmailApp.sendEmail(destinatario, oggetto, corpo, {
    attachments: [blob],
    name: "Assistente Reportistica"
  });
}
```

### Passo 3: Impostare la schedulazione automatica (Trigger)
Ora che lo script è pronto, dobbiamo fare in modo che si attivi da solo ogni settimana.

1. Nell'editor di Apps Script, clicca sull'icona a forma di orologio (Attivatori) nella barra laterale sinistra.

2. Clicca sul pulsante in basso a destra Aggiungi attivatore.

3. Nella finestra che si apre, seleziona la funzione `inviaReportSettimanalePDF`.

4. Scegli il tipo di attivatore basato sul tempo: Seleziona timer basato sul tempo.

5. Scegli la frequenza.

Timer settimanale, indicando il giorno (es. Venerdì) e la fascia oraria desiderata (es. dalle 17:00 alle 18:00).

6. Clicca su Salva e autorizza l'accesso al tuo account Google quando richiesto.

<div style="border-left: 4px solid #4338ca; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Consiglio di sicurezza.</strong> La prima volta che esegui lo script, Google ti avviserà che l'app non è verificata.



Clicca su "Avanzate" e poi su "Vai a Untitled project (non sicuro)" — è perfettamente sicuro poiché il codice gira interamente sul tuo account personale ed è stato scritto da te.
</div>

---

## Domande Frequenti (FAQ)

<strong>Q.</strong> Posso inviare il PDF a più destinatari contemporaneamente?

A. Certamente. Puoi inserire più indirizzi email separati da una virgola nella variabile `destinatario`, ad esempio: `"manager1@azienda.it, manager2@azienda.it"`. In alternativa, puoi creare un piccolo intervallo nel foglio Google (es. la cella A1 di un foglio di configurazione) da cui lo script legge dinamicamente la lista delle email.





2. Cosa succede se il mio foglio di calcolo ha formule pesanti che impiegano tempo a calcolare?
Google Sheets calcola le formule in tempo reale prima dell'esecuzione dello script, ma se hai molte importazioni di dati esterne (tramite IMPORTXML o IMPORTRANGE), potresti riscontrare ritardi. Ti consiglio di aggiungere una riga di pausa all'inizio della funzione usando `Utilities.sleep(3000);` per dare il tempo al foglio di aggiornare tutti i valori prima di generare il PDF.

3. Posso cambiare l'orientamento del PDF da orizzontale a verticale?
Sì, è semplicissimo. All'interno dell'oggetto `exportOptions` nel codice, ti basta modificare il parametro `portrait: 'false'` in `portrait: 'true'`. Ricorda però che se il tuo report ha molte colonne affiancate, l'orientamento verticale potrebbe rimpicciolire troppo il testo.
