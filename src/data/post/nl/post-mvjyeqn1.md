---
title: "Slim uren berekenen in Excel met AI: Nooit meer chaos door versies"
description: "Ontdek hoe je uren en overwerk automatisch berekent in Excel met AI en verlos jezelf van eindeloze 'kopie' bestanden in de cloud."
publishDate: 2026-10-23T03:40:00.000Z
image: 'https://picsum.photos/seed/work-mvjygx9s-8-c/1200/675.jpg'
category: 'automation'
tags: ["Excel", "AI Tools", "Productiviteit", "Workflow"]
theme: "Midnight Navy Royal"
---

## 1. Noodsituatie en knelpunt op de werkvloer

Het is vrijdagmiddag om vijf uur in het hart van het Zuidas zakendistrict in Amsterdam. Terwijl de regen tegen de glazen gevels van de toren tikt, sta ik klaar om de maandelijkse urenregistratie en overwerkvergoedingen voor het team goed te keuren. Maar dan slaat de paniek toe. Door een flinke synchronisatiefout in onze cloudopslag is het urenbestand door ieders gelijktijdige bewerkingen eindeloos opgesplitst in bestanden met namen als Uren_Project_definitief_kopie(1).xlsx,Uren_Project_definitief_kopie(2)_conflict.xlsx en een verdwaalde versie uit het vorig uur. De formules voor de urenberekening verwijzen naar ontbrekende tabbladen en de overuren knallen uit de bocht met foutmeldingen. Het weekend dreigt opnieuw te verdwijnen in een handmatige puzzel.

<div style="border-left: 4px solid #1d4ed8; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Noodsituatie Logboek (Zuidas - 17:15 uur):</strong> Cloud-versieconflict gedetecteerd. 14 teamleden hebben tegelijk gewerkt in dubbele versies. Handmatig samenvoegen kost minstens 3 uur en leidt gegarandeerd tot loonfouten. AI-formule correctie ingeschakeld om de data direct te redden.
</div>

![How to Calculate Working Hours and Overtime Automatically in Excel Using Simple AI Formulas AI Automation Guide](https://picsum.photos/seed/work-mvjygx9s-8-b/1000/550.jpg)

## Waarom loopt de urenregistratie in Excel altijd spaak?

Voordat we naar de oplossing kijken, moeten we begrijpen waarom dit zo vaak misgaat in een drukke kantooromgeving:

1. Versnippering door Cloud-conflicten: Wanneer collega's offline werken en tegelijk online komen, maakt de cloud uit zelfbescherming kopieën aan. Hierdoor verlies je de centrale bron van waarheid voor je gewerkte uren.

2. Complexe Tijdnotaties: Excel ziet tijd vaak als tekst of decimale getallen in plaats van echte tijdseenheden. Als je simpelweg `Eindtijd - Starttijd` doet zonder de juiste opmaak, klopt de overwerkberekening aan het eind van de week van geen kant.

3. Handmatige Overwerkformules: Regels zoals "alles boven de 40 uur per week telt als 150% en weekendwerk als 200%" worden vaak in ingewikkelde, geneste `ALS`-functies gegoten die niemand meer kan ontcijferen als er een fout optreedt.

## De Oplossing: Automatische uren- en overwerkformules met AI

In plaats van handmatig cellen te vergelijken, gebruiken we een slimme AI-prompt om direct de juiste, robuuste Excel-formules te genereren die bestand zijn tegen slordige invoer en tijdnotatie-fouten.

### Stap 1: De juiste AI-prompt opstellen

Open je AI-assistent (zoals ChatGPT of Copilot) en geef een kraakheldere opdracht waarin je de celposities aangeeft. Kopieer en gebruik de volgende geteste prompt:

```text
Schrijf een robuuste Excel-formule in het Nederlands voor cel C2. 
In cel A2 staat de starttijd (bijv. 09:00) en in cel B2 staat de eindtijd (bijv. 17:30). 
Houd rekening met een onbetaalde pauze van 30 minuten als de gewerkte tijd langer is dan 6 uur. 
Zorg ervoor dat de uitkomst wordt weergegeven in decimalen (bijv. 8,5 uur) en voorkom fouten als cellen leeg zijn.
```

### Stap 2: De formule toepassen in Excel

De AI geeft je een formule terug die gebruik maakt van de `ALS`- en `REST`-functies om tijden correct van elkaar af te trekken. Plak deze formule in je opgeschoonde Excel-bestand:

```excel
=ALS(OF(A2=""; B2=""); 0; (B2 - A2 - ALS((B2 - A2) > 1/4; 1/24; 0)) * 24)
```

* Hoe het werkt: `B2 - A2` berekent het verschil. De ingebouwde controle trekt automatisch 30 minuten (wat overeenkomt met `1/24` deel van een dag) af als de dienst langer duurt dan 6 uur. Vermenigvuldiging met `24` zet het geheel direct om naar decimale uren die je kunt gebruiken voor je salarisadministratie.

### Stap 3: Overwerk automatisch berekenen

Voor het berekenen van overwerk boven de 40 uur per week (uitgaande van een totaaloverzicht in cel [D2]), gebruik je deze eenvoudige formule:

```excel
=ALS(D2>40; D2-40; 0)
```

Hiermee scheid je direct de reguliere uren van de overuren, zonder dat je bang hoeft te zijn voor handmatige optelfouten uit dubbele versies.

<div style="border-left: 4px solid #1d4ed8; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Pro-tip voor Back-ups:</strong> Voordat je een AI-formule loslaat op een beschadigd of samengevoegd bestand, ga je naar [<strong>Bestand > Info</strong>] en controleer je de versiegeschiedenis. Herstel altijd eerst de meest complete versie naar je lokale schijf om verdere synchronisatieconflicten te voorkomen.
</div>

## Veelgestelde Vragen (FAQ)

**Q1.** Wat moet ik doen als Excel de berekende uren weergeeft als vreemde datums zoals 02-01-1900?

**A1.** Dit komt doordat de celeigenschappen nog op 'Datum' staan in plaats van 'Standaard' of 'Getal'. Selecteer de betreffende kolommen, klik met je rechtermuisknop, kies [Celeigenschappen] en zet de opmaak op [Getal] met twee decimalen.

**Q2.** Hoe voorkom ik dat er in de toekomst weer 'kopie' bestanden ontstaan in onze cloudmap?

**A2.** Maak gebruik van de co-authoring functie binnen de online versie van het rekenblad in plaats van het lokaal te openen en te uploaden. Als er toch versies ontstaan, gebruik dan de optie [Gegevens > Gegevens ophalen] via [Power Query] om de tabellen geautomatiseerd samen te voegen op basis van unieke medewerkers-ID's.

**Q3.** Kan deze AI-formule ook overweg met nachtdiensten die doorlopen na middernacht?

**A3.** Ja, maar dan moet je de formule iets aanpassen omdat de eindtijd dan kleiner is dan de starttijd. Vraag de AI specifiek om een nachtdienst-formule door de toevoeging: "De eindtijd kan op de volgende dag vallen." De AI gebruikt dan de `REST`-functie om dit feilloos op te lossen.
