---
title: "Excel e ChatGPT: Come Dividere Indirizzi e Numeri di Telefono in Un Click"
description: "Guida pratica per uffici a Milano: come recuperare dati persi e separare automaticamente indirizzi e numeri in Excel con l'aiuto dell'intelligenza artificiale."
publishDate: 2026-10-24T03:30:00.000Z
image: 'https://picsum.photos/seed/work-mvlawpo4-6-c/1200/675.jpg'
category: 'automation'
tags: ["AI Tools", "Workflow", "Automation", "Office Tips"]
theme: "Solarized Amber Warm"
---

## 1. Emergenza improvvisa e blocco delle attività in ufficio

Erano le nove di sera in un ufficio silenzioso vicino a Porta Nuova a Milano. Fuori la nebbia autunnale copriva i grattacieli, mentre dentro fissavo lo schermo con un nodo allo stomaco. Dopo due ore passate a ripulire un enorme file anagrafico per il report trimestrale, avevo finalmente completato una complessa tabella pivot e diverse macro VBA per suddividere un elenco di clienti che univa indirizzi e numeri di telefono nella stessa colonna. Mancava solo un ultimo controllo. Nel momento esatto in cui ho spostato il cursore verso l'alto per cliccare sul pulsante di salvataggio, Excel si è bloccato all'improvviso, mostrando la temuta schermata bianca. Nessun recupero automatico, due ore di lavoro andate in frantumi a causa di un crash di sistema, e la scadenza per la direzione fissata per la mattina seguente alle nove.

Questo genere di emergenza notturna capita più spesso di quanto si pensi quando si gestiscono dati disordinati ereditati da vecchi gestionali o esportati male in formato CSV. Le funzioni tradizionali come Testo in Colonne falliscono miseramente quando gli indirizzi hanno lunghezze diverse e i prefissi telefonici sono inseriti senza uno standard fisso. Invece di rifare tutto manualmente o rischiare un altro blocco con macro scritte di fretta, la soluzione più intelligente consiste nell'abbinare le potenzialità di ChatGPT alla flessibilità di Excel, automatizzando il processo in pochi minuti.

![How to Auto-Split Address and Phone Number Columns in Excel with ChatGPT Assistance AI Automation Guide](https://picsum.photos/seed/work-mvlawpo4-6-b/1000/550.jpg)

Analizziamo prima i tre motivi principali per cui la manipolazione di questi dati fallisce nei nostri uffici:

Primo, la variabilità strutturale. Negli indirizzi italiani, la combinazione di via, numero civico, CAP e città non rispetta mai una spaziatura uniforme. A volte c'è una virgola, a volte uno spazio, e spesso il numero di telefono si trova in fondo senza un separatore netto.

Secondo, l'affidabilità limitata delle funzioni stringa standard. Usare formule nidificate come STRINGA.ESTRAI, TROVA o LUNGHEZZA richiede un lavoro di sartoria matematica estenuante per ogni singola riga, diventando impossibile da gestire su database aziendali di medie dimensioni.

Terzo, la gestione del fattore tempo e stress. Lavorare sotto pressione dopo l'orario di chiusura aumenta esponenzialmente la probabilità di commettere errori di distrazione, portando a cancellazioni accidentali o a un uso errato dei componenti aggiuntivi di Office.

Per risolvere definitivamente questo problema e completare il lavoro in tempo record, seguiamo questo metodo strutturato passo dopo passo.

<div style="border-left: 4px solid #d97706; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
Nota pratica per la configurazione: Assicurati di avere una versione aggiornata di Microsoft 365 o di poter accedere a ChatGPT direttamente dal browser per generare le formule di pulizia.
</div>

Passo 1: Preparare il prompt mirato per ChatGPT.
Invece di chiedere una macro VBA complessa che potrebbe causare nuovi crash, chiediamo a ChatGPT di generare una formula Excel intelligente basata sulle funzioni moderne come DIVISIONE.TESTO (TEXTSPLIT) o su una combinazione di formule sicure. Copia e incolla questo prompt nel chat box:

```text
Ho una colonna in Excel (colonna A) che contiene un indirizzo completo seguito da un numero di telefono, ad esempio: "Via Roma 15, 20121 Milano - 021234567". Dammi una formula Excel pronta all'uso per estrarre l'indirizzo nella colonna B e il numero di telefono nella colonna C, considerando che il separatore tra i due dati è un trattino o uno spazio alla fine.
```

Passo 2: Applicare la formula nel foglio di lavoro.
ChatGPT ti restituirà una formula pulita. Se utilizzi una versione recente di Excel con le funzioni dinamiche, potresti ricevere una formula simile a questa:

```excel
=STRINGA.ESTRAI(A2; 1; TROVA("-"; A2) - 2)
```

Per il numero di telefono, la formula complementare individuerà la parte successiva al separatore:

```excel
=STRINGA.ESTRAI(A2; TROVA("-"; A2) + 2; LUNGHEZZA(A2))
```

Incolla queste formule nelle celle di destinazione e trascinale verso il basso per l'intero database.

Passo 3: Consolidare i dati e salvare in sicurezza.
Una volta che le formule hanno estratto correttamente i dati, seleziona le colonne risultanti, premi Copia, e usa l'opzione "Incolla valori" (Menu Home > Incolla > Incolla valori). Questo trasformerà le formule in dati statici, azzerando il rischio di errori di riferimento e alleggerendo notevolmente il file prima di procedere al salvataggio definitivo.

<div style="border-left: 4px solid #d97706; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
Consiglio di sicurezza: Quando lavori su file aziendali sensibili contenenti dati di clienti reali, evita di inserire informazioni personali identificabili nei prompt pubblici di ChatGPT. Utilizza sempre dati di prova anonimi (es. "Indirizzo 1, Citta - 0000000") per testare le formule prima di applicarle al file originale.
</div>

Domande Frequenti (FAQ)

Q1. Cosa faccio se alcune righe non contengono il numero di telefono e la formula restituisce un errore?

A1. Puoi racchiudere la formula all'interno della funzione SE.ERRORE di Excel, impostando un valore vuoto o la dicitura "Dato mancante" nel caso in cui il separatore cercato non venga trovato nella riga specifica.

Q2. Posso usare questo metodo anche se non ho l'ultima versione di Microsoft 365?

A2. Assolutamente sì. Chiedi esplicitamente a ChatGPT di utilizzare funzioni compatibili con le versioni precedenti di Excel, come STRINGA.ESTRAI e TROVA, evitando le funzioni dinamiche avanzate.

Q3. È sicuro utilizzare ChatGPT per scrivere script o formule per il lavoro d'ufficio?

A3. Sì, purché si tratti di formule standard o brevi macro. È sempre buona norma testare il codice su una copia di backup del file e non sull'originale, specialmente quando si lavora in tarda serata sotto pressione.
