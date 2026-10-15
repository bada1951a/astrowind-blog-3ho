---
title: "Categorizzare testi in Google Sheets con Gemini API e Apps Script"
description: "Guida pratica per automatizzare la classificazione di migliaia di righe in Google Sheets usando Gemini API e Apps Script senza software complessi."
publishDate: 2026-10-15T16:00:00.000Z
image: "https://picsum.photos/seed/tech470/1200/630"
category: "Productivity"
tags: ["AI Tools", "Workflow", "Automation", "Office Tips"]
theme: "Matte Black stealth"
---


Erano le 16:45 di un martedì pomeriggio nel nostro ufficio in zona Porta Nuova a Milano. Mancavano esattamente quarantacinque minuti alla riunione di allineamento con i soci per la revisione del budget trimestrale, e sulla mia scrivania digitale c'era un file Excel con quattromila righe di feedback dei clienti da categorizzare. Categorie disordinate, descrizioni in slang milanese misto a inglese aziendale, e una scadenza implacabile. Aprire il foglio e iniziare a taggare a mano significava passare la notte in bianco. Avevo bisogno di un'automazione rapida, senza installare plugin a pagamento o software di terze parti che la nostra divisione IT avrebbe bloccato all'istante.

La soluzione? Sfruttare la combinazione tra Google Sheets, Google Apps Script e la potenza di Gemini API per fare il lavoro sporco in meno di sessanta secondi. 

![AI Productivity & Workflow Automation](https://picsum.photos/seed/office970/1000/550)

---

### Perche le soluzioni tradizionali falliscono: Analisi del blocco

Prima di arrivare alla configurazione pulita, ho dovuto sbattere la testa contro tre problemi classici che mandano in tilt questo tipo di integrazione:

1. **Timeout di esecuzione dello Script:** Google Apps Script interrompe le funzioni che superano i 6 minuti. Se provi a inviare quattromila righe in un'unica chiamata massiccia, il sistema va in errore (*Exceeded maximum execution time*).
2. **Gestione errata delle quote API:** Inviare richieste a raffica senza un intervallo (*rate limiting*) fa scattare il blocco 429 di Google Cloud, lasciando il foglio a meta.
3. **Prompt non strutturati:** Senza istruzioni rigide, Gemini restituisce risposte discorsive invece di una singola parola chiave, rompendo qualsiasi formula o filtro successivo nel foglio.

---

### Guida Passo-Passo: Come configurare Gemini API in Google Sheets

Ecco il metodo esatto che ho usato per salvare la riunione e che oggi uso regolarmente per qualsiasi mole di dati testuali.

#### Fase 1: Ottenere la chiave API di Gemini
1. Vai su **Google AI Studio** (aistudio.google.com) e accedi con il tuo account Google.
2. Clicca su **Get API key** e creane una nuova all'interno di un progetto Google Cloud.
3. Copia la stringa alfanumerica e conservala al sicuro.

#### Fase 2: Inserire lo script in Google Sheets
1. Apri il tuo Google Sheet con i dati da categorizzare.
2. Dal menu in alto, seleziona **Estensioni > Apps Script**.
3. Cancella tutto il codice preesistente e incolla questo script ottimizzato per gestire le chiamate in modo sicuro:

```javascript
const API_KEY = "INSERISCI_QUI_LA_TUA_CHIAVE_API";
const MODEL_NAME = "gemini-1.5-flash"; // Veloce ed efficiente per testi di volume

function categorizzaTesto(testo) {
  if (!testo) return "";
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={API_KEY}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: `Analizza il seguente feedback e assegna una sola categoria tra queste: [Commerciale, Supporto Tecnico, Amministrazione, Altro]. Rispondi SOLO con il nome della categoria, senza punteggiatura o testo aggiuntivo: "${testo}"`
      }]
    }]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.candidates && result.candidates[0].content) {
      return result.candidates[0].content.parts[0].text.trim();
    } else {
      return "Errore Risposta";
    }
  } catch (error) {
    return "Errore API";
  }
}
```

4. Salva il progetto (icona del dischetto o `Ctrl + S`).

#### Fase 3: Usare la formula personalizzata nel foglio
Torna sul tuo Google Sheet. Ora puoi trattare Gemini come una normale funzione di calcolo. 

Supponendo che il testo del cliente si trovi nella colonna `A` (a partire dalla riga 2), vai nella cella `B2` e digita:

```text
=categorizzaTesto(A2)
```

Trascina la formula verso il basso per tutte le righe necessarie. Vedrai le celle popolarsi in tempo reale con le categorie pulite e pronte per essere filtrate o analizzate con le tabelle pivot.

---

<div style="border-left: 4px solid #ffffff; padding: 12px 16px; margin: 20px 0; background-color: rgba(255,255,255,0.05); border-radius: 4px; color: #111827;">
<strong>Consiglio dell'Esperto sulla Privacy:</strong><br>
<span style="color: #111827;">Quando lavori con dati aziendali sensibili o informazioni personali dei clienti (GDPR), assicurati di utilizzare API aziendali o verifica i termini di servizio di Google AI Studio riguardo al non utilizzo dei dati per l'addestramento dei modelli. Se tratti dati critici, valuta l'uso di Vertex AI su Google Cloud Platform.</span>
</div>

---

### Domande Frequenti (FAQ)

**1. Posso elaborare migliaia di righe in una sola volta senza bloccare il foglio?**
Per grandi moli di dati (oltre le 500 righe), è consigliabile scrivere una funzione personalizzata in Apps Script che cicla i dati in blocco anziché usare la formula direttamente in ogni singola cella, così da evitare di superare i limiti temporanei delle chiamate API.

**2. Cosa devo fare se la funzione restituisce "Errore API"?**
Nel 99% dei casi si tratta di un errore nella chiave API copiata male o di un credito esaurito sul progetto Google Cloud. Verifica di aver abilitato correttamente la fatturazione o di rientrare nei limiti del piano gratuito di Google AI Studio.

**3. Posso cambiare le categorie a piacimento?**
Certamente. Ti basta modificare il testo del prompt direttamente all'interno della variabile nel codice Apps Script, inserendo l'elenco delle categorie specifiche di cui hai bisogno per il tuo progetto.
