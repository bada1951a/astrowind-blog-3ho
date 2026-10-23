---
title: "Jak generować skomplikowane wyrażenia regularne i formuły czyszczenia danych w Google Sheets z ChatGPT"
description: "Ratunkowy poradnik biurowy: jak naprawić psujące się formuły w arkuszu tuż przed wysłaniem raportu do zarządu za pomocą ChatGPT."
publishDate: 2026-10-15T19:45:00.000Z
image: "https://picsum.photos/seed/tech145/900/600"
category: 'automation'
tags: ["Google Sheets", "ChatGPT", "Regex", "Automatyzacja", "Excel i Arkusze"]
theme: "Dark Velvet Obsidian"
---


Była dokładnie 16:45, a za piętnaście trzydziestu dyrektorów z warszawskiego centrum biznesowego miało otrzymać kwartalny raport sprzedażowy. Nagle w kluczowej kolumnie Google Sheets pojawił się błąd `#ARG!`, a dane z systemów CRM zaciągnęły się jako chaotyczna zupa tekstow

a: numery NIP, adresy e-mail i numery zamówień były sklejone w jeden ciąg znaków, oddzielone losowymi spacjami i ukośnikami. Próba napisania z głowy zagnieżdżonej formuły `REGEXREPLACE` połączonej z `SPLIT` i `ARRAYFORMULA` sprawiała, że arkusz całkowicie zamakał, a czas uciekał nieubłaganie.

W takich momentach człowiek czuje, jak zimny pot oblewa plecy, a perspektywna zarwania wieczoru staje się bolesną rzeczywistością. Zamiast jednak panicznie przekopywać fora internetowe w poszukiwaniu gotowych formuł, które i tak nie pasują do struktury moich kolumn, otworzyłem ChatGPT. W ciągu niecałych dwóch minut miałem szytą na miarę formułę regex, która uratowała sytuację. Poniżej pokazuję dokładnie krok po kroku, jak opanowałem ten proces, żebyś i Ty mógł wyjść z każdej arkuszowej opresji z tarczą.

<div style="border-left: 4px solid #a855f7; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Wskazówka eksperta (Dark Velvet Obsidian):</strong> Kiedy pracujesz pod presją czasu z ChatGPT, nigdy nie pisz ogólnych próśb typu "napisz formułę regex dla Google Sheets". Zamiast tego podaj dokładny kontekst: strukturę danych wejściowych, pożądany wynik oraz nazwy kolumn.
</div>

## Dlaczego standardowe czyszczenie danych w arkuszach tak często zawodzi?

Praca z danymi importowanymi z różnych zewnętrznych systemów rzadko bywa czysta. Oto trzy najczęstsze pułapki, przez które tracimy godziny na ręczną edycję:

1. Niespójne kodowanie i ukryte znaki: Kopiowanie danych ze stron WWW lub systemów starszego typu przenosi niewidoczne znaki końca linii oraz twarde spacje, których zwykłe narzędzie "Znajdź i zamień" nie widzi.

2. Złożona struktura wyrażeń regularnych (Regex): Składnia regex w Google Sheets (oparta na silniku RE2) różni się od tej znanej z Pythona czy standardowego Excela, co prowadzi do ciągłych błędów składniowych.

3. Ograniczenia funkcji wielopoziomowych: Próba wyciągnięcia np. samego kodu pocztowego z nazwy ulicy i miasta za pomocą dziesięciu zagnieżdżonych funkcji `MID`, `FIND` i `LEN` sprawia, że arkusz staje się nieczytelny i niemożliwy do późniejszej edycji przez inny zespół.

---

## Krok po kroku: Jak zepsuć mur barier i wygenerować idealną formułę z ChatGPT

Zamiast zgadywać argumenty funkcji, zastosuj ten sprawdzony proces, który zamienia sztuczną inteligencję w Twojego osobistego analityka danych.

### Krok 1: Przygotuj precyzyjny prompt kontekstowy
Otwórz ChatGPT i skopiuj poniższy szablon promptu, dostosowując go do swoich realiów:

> "Działam w Google Sheets. W kolumnie A mam surowe dane tekstowe w formacie: `[NazwaKlient] - [NIP: 1234567890] / (Wawa)`. 
> Chcę napisać jedną formułę opartą na `REGEXREPLACE` lub `REGEXEXTRACT`, która wyciągnie sam NIP (dokładnie 10 cyfr) do kolumny B. 
> Pamiętaj, że silnik regex w Google Sheets korzysta z RE2 i nie obsługuje zaawansowanych lookbehindów. Podaj gotową formułę z użyciem średników jako separatorów argumentów."

### Krok 2: Przetestuj i wklej formułę do arkusza
ChatGPT zwróci Ci gotową formułę. W moim przypadku była to formuła w stylu:
`=REGEXEXTRACT(A2; "NIP:\s*(\d{10})")`

Przejdź do Google Sheets, kliknij w odpowiednią komórkę, wklej formułę i naciśnij Enter. Jeśli chcesz, aby formuła automatycznie rozpychała się na całą kolumnę bez przeciągania, poproś ChatGPT o owinięcie jej w `MAP` lub `BYROW`, na przykład:
`=MAP(

A2:A100; LAMBDA(x; JEŻELI(x=""; ""; REGEXEXTRACT(x; "NIP:\s*(\d{10})"))))`

### Krok 3: Weryfikacja i obsługa błędów
Jeśli dane wejściowe mają różne formaty (np. raz jest napisane "NIP:", a raz "Nr NIP"), poproś AI o rozbudowanie wzorca regex o alternatywy:
> "Zmodyfikuj powyższą formułę, aby obsługiwała zarówno zapis `NIP:`, jak i `Nr NIP:` lub samą obecność 10 cyfr."
AI natychmiast wypluje bezpieczniejszą wersję z operatorem alternatywy `|`.

---

## Ważne ostrzeżenia dotyczące bezpieczeństwa danych

Przed wklejeniem danych do jakiegokolwiek narzędzia AI musisz pamiętać o kluczowych zasadach polityki bezpieczeństwa informacji:

* Anonimizacja danych: Nigdy nie przesyłaj do publicznych modeli AI prawdziwych danych osobowych (PII) klientów, poufnych zarobków czy kluczowych danych finansowych spółki. Zastąp je fikcyjnymi ciągami (np. `Jan Kowalski`, `NIP 0000000000`).
* Wersjonowanie arkusz

a: Zanim uruchomisz masowe formuły czyszczące oparte na AI, zrób kopię zapasową arkusza (Plik > Wersje > Nazwij bieżącą wersję). Uchroni Cię to przed przypadkowym nadpisaniem ważnych danych.

---

## Często zadawane pytania (FAQ)

### 1. Dlaczego Google Sheets wyrzuca błąd `#VALUE!` po wklejeniu formuły od ChatGPT?
Najczęstszą przyczyną są regionalne ustawienia językowe arkusza. Polskojęzyczna wersja Google Sheets wymaga średników (;) jako separatorów argumentów oraz polskich nazw funkcji (np. `JEŻELI` zamiast `IF`). Poinformuj o tym ChatGPT w prompcie: *"Użyj polskiej wersji językowej Google Sheets i średników jako separatorów"*.



![AI Productivity & Workflow Automation](https://picsum.photos/seed/office645/1000/550)

### 2. Czy ChatGPT poradzi sobie z dużymi arkuszami mającymi ponad 50 000 wierszy?
ChatGPT pisze samą formułę, którą wklejasz do arkusza – to silnik Google Sheets przetwarza dane, a nie AI. Niemniej jednak, nadużywanie ciężkich funkcji regex w połączeniu z `ARRAYFORMULA` na dziesiątkach tysięcy wierszy może spowolnić działanie pliku. W takich wypadkach lepiej podzielić dane lub wykonać czyszczenie jednorazowo i wkleić wartości (`Ctrl + Shift + V`).

### 3. Jak zmusić ChatGPT, żeby nie pisał kodu z bibliotekami Pythona, tylko czyste formuły do arkusza?
Warto wyraźnie zaznaczyć w instrukcji początkowej: *"Interesuje mnie wyłącznie formuła do wklejenia bezpośrednio do komórki Google Sheets. Nie używaj skryptów Apps Script ani Pythona"*. To natychmiast ukierunkuje model na odpowiednie tory.
