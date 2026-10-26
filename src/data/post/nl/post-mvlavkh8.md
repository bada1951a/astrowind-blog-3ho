---
title: "Adres en Telefoonnummer Opsplitsen in Excel met ChatGPT: Versieverschillen Opgelost"
description: "Los compatibiliteitsproblemen in Excel op als verschillende afdelingen elkaars formules niet begrijpen. Splits adressen en telefoonnummers met ChatGPT."
publishDate: 2026-10-24T03:40:00.000Z
image: 'https://picsum.photos/seed/work-mvlax2sf-8-c/1200/675.jpg'
category: 'automation'
tags: ["AI Tools", "Workflow", "Automation", "Office Tips"]
theme: "Dark Velvet Obsidian"
---

## 1. Noodsituatie en knelpunt op de werkvloer

Het was vrijdagochtend even over negenen in een kantoor aan de Gustav Mahlerlaan op de Zuidas in Amsterdam. Mijn kwartaalrapportage voor een grote financiële dienstverlener moest binnen twintig minuten naar de directie. Om de analyse waterdicht te maken, had ik een grote dataset ontvangen waarin volledige adresgegevens en telefoonnummers abusievelijk in één enkele kolom stonden gepropt. Zoals het hoort in een moderne workflow, had ik gisteren snel een geavanceerde formule gebouwd met de nieuwste dynamische array-functies zoals XLOOKUP en FILTER. Maar toen ik het bestand deelde met de risico-afdeling, sloeg de paniek toe: hun wat oudere versie van Microsoft Excel trok het niet en toonde overal de fatale foutmelding #WAARDE! of #NAAM?. Hun systemen liepen vast op functies die voor hen simpelweg onbekend waren.

<div style="border-left: 4px solid #a855f7; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
Pro-tip van de specialist: Als je samenwerkt met collega's die nog op oudere versies van Excel werken, vermijd dan modieuze dynamische array-formules als je weet dat de compatibiliteit in gevaar komt. Gebruik liever robuuste, achterwaarts compatibele methoden of laat AI een alternatief genereren dat op elke versie werkt.
</div>

![How to Auto-Split Address and Phone Number Columns in Excel with ChatGPT Assistance AI Automation Guide](https://picsum.photos/seed/work-mvlax2sf-8-b/1000/550.jpg)

Waarom liep dit nu precies spaak? Laten we even kijken naar de onderliggende oorzaken van dit soort Excel-rampspoed op de vroege ochtend.

Ten eerste is er het versieverschil binnen grote organisaties. Niet iedereen krijgt tegelijkertijd de nieuwste Office 365-update. Afdelingen zoals juridisch of finance draaien vaak op stabiele, streng beheerde versies die updates mijden om macro's en legacy-systeemkoppelingen niet te breken.

Ten tweede ontbreekt het vaak aan een gestandaardiseerde data-invoer. Klantgegevens komen binnen via webformulieren waar adres, huisnummer en telefoonnummer vrolijk achter elkaar in één cel worden geplakt, gescheiden door komma's of spaties die per invoer verschillen.

Ten derde vertrouwen we te blind op complexe formules in plaats van stabiele transformatietools. Wanneer zo'n formule breekt op een andere machine, sta je met lege handen omdat je de logica achter de formule zelf niet meer snel kunt aanpassen onder tijdsdruk.

Gelukkig hoef je niet handmatig duizenden rijen met adresgegevens en telefoonnummers te gaan kopiëren en plakken. Met de hulp van ChatGPT en een slimme, universele aanpak los je dit binnen enkele minuten op, ongeacht welke Excel-versie je collega gebruikt.

Stap 1: Vraag ChatGPT om een klassieke, compatibelietsvriendelijke formule
In plaats van moderne functies die alleen in de allerlaatste Excel-versies werken, vragen we ChatGPT om een formule op basis van klassieke functies zoals LINKS, RECHTS, VIND.SPEC en LENGTE. Open ChatGPT en voer de volgende prompt in:

```text
Ik werk in een oudere Excel-omgeving en kan geen dynamische array-functies gebruiken. Schrijf een robuuste, klassieke Excel-formule voor cel B2 waarin een adres en telefoonnummer (gescheiden door een komma) netjes worden opgesplitst. De formule moetcompatibel zijn met elke Excel-versie vanaf 2016.
```

Stap 2: Pas de gegenereerde formule toe via Tekst naar Kolommen of Flash Fill
Soms is een formule niet eens nodig en werkt een ingebouwde Excel-functie nog sneller en stabieler over alle versies heen. Ga in het lint naar Gegevens en kies voor Tekst naar Kolommen, of gebruik de magische sneltoets Flash Fill. Als je toch kiest voor de formule-methode, kopieer je de door ChatGPT geleverde formule en plak je deze in je werkblad.

Stap 3: Valideer en deel het veilige bestand
Test het bestand door het lokaal op te slaan en te openen in een compatibiliteitsmodus of stuur het direct door naar je collega. Omdat we nu basisfuncties hebben gebruikt in plaats van geavanceerde dynamische arrays, opent het bestand foutloos op ieders scherm.

<div style="border-left: 4px solid #a855f7; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
Belangrijke waarschuwing: Zorg ervoor dat je bij het uploaden van datasets naar ChatGPT alle gevoelige klantgegevens, zoals echte persoonsnamen en telefoonnummers, anonimiseert of vervangt door dummy-data om te voldoen aan de AVG-richtlijnen en het bedrijfsbeleid.
</div>
## 5. Veelgestelde Vragen (FAQ)

Q1. Wat kan ik doen als de formule van ChatGPT toch een foutmelding geeft in de oude Excel-versie?

A1. Vraag ChatGPT specifiek om de formule aan te passen voor jouw taalinstelling van Excel. Nederlandse versies van Excel vereisen namelijk puntkomma's (;) in plaats van komma's (,) als argumentenscheiding, en Nederlandse functienamen zoals LINKS() in plaats van LEFT().

Q2. Kan ik ChatGPT ook gebruiken om een VBA-macro te schrijven voor dit probleem?

A2. Zeker weten. Als je een bestand hebt met tienduizenden rijen, kun je ChatGPT vragen om een eenvoudige VBA-macro te schrijven die de opsplitsing in één keer uitvoert via een knop in je lint. Let er wel op dat je collega's dan het bestand opslaan als een macro-ingeschakeld werkblad (.xlsm).

Q3. Is het veiliger om Flash Fill te gebruiken in plaats van AI-formules?

A3. Flash Fill is fantastisch voor eenmalige, handmatige acties en werkt volledig binnen Excel zonder internetverbinding of data-sharing. AI-formules zijn echter handiger als je deze logica wilt automatiseren in een terugkerend maandelijks rapport.
